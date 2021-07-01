import Vue from "vue";
import { Client as ColyseusClient, Room } from "colyseus.js";
import Swal from "sweetalert2";

import audio from "~/services/audio";
import { formPathFromPhase } from "~/services/utilities";

const ROOM_NAME = "standard";

const client = new ColyseusClient(process.env.SERVER_ENDPOINT);

let timerInterval = -1;

const connection = new Vue({
    data() {
        return {
            room: undefined as Room<IRoom> | undefined,
            eventRegistered: false,
            results: {} as Record<string, number>,
            unsynced: {
                library: [] as ICard[],
                uploadCredentials: null as Record<string,string> | null,
            },
            state: {
                phase: "WAITING",
            } as IRoom,
            temp: {
                username: "",
                host: false,
            },
            time: -1,
            redirect: undefined as ((path: string) => void) | undefined,
        };
    },

    computed: {
        phase(): PhaseT {
            return this.state.phase;
        },
        currentPlayer(): IPlayer | undefined {
            return (
                this.state.players &&
                this.room &&
                this.state.players[this.room.sessionId]
            );
        },
    },
    watch: {
        phase(newPhase: PhaseT, oldPhase: PhaseT) {
            if (newPhase !== oldPhase) {
                this.redirect?.(formPathFromPhase(newPhase, this.room?.id));
            }
        },
    },

    methods: {
        async createRoom(username: string) {
            try {
                this.room = await client.create<IRoom>(ROOM_NAME, {
                    name: username,
                });

                this.initEvents();

                return {
                    success: true,
                };
            } catch (error) {
                return {
                    success: false,
                    error,
                };
            }
        },

        async joinRoom(username: string, roomId: string) {
            try {
                this.room = await client.joinById<IRoom>(roomId, {
                    name: username,
                });
                this.initEvents();
                return { success: true };
            } catch (error) {
                return { success: false, error };
            }
        },

        initEvents() {
            // Reset events:
            this.room?.removeAllListeners();
            this.eventRegistered = false;

            // Listen for state changes and update in Vue:
            this.room?.onStateChange((newState) => {
                this.state = JSON.parse(JSON.stringify(newState));
            });

            // Update card library when received:
            this.room?.onMessage("library", (lib: ICard[]) => {
                this.unsynced.library = lib;
            });

            // Show the profit alert:
            this.room?.onMessage("profits", async (profit: number) => {
                await Swal.fire({
                    title: "Profit!",
                    text: `You made $${profit} from players who bought your card!`,
                    toast: true,
                    position: "top-end",
                });
            });

            // Handle errors:
            this.room?.onMessage("error", async (error: string) => {
                await Swal.fire("Error", error, "error");

                if (error.toLowerCase().includes("name already in use")) {
                    this.redirect?.("/");
                }
            });

            // Play sound when attacked:
            this.room?.onMessage(
                "attacked",
                (_attackData: IAttackBroadcast) => {
                    audio.damage.play();
                    // Effects / Animations
                }
            );

            // Listen for results:
            this.room?.onMessage(
                "results",
                (results: Record<string, number>) => {
                    this.results = results;
                }
            );

            // Listen for timer resets:
            this.room?.onMessage("resetClock", (count: number) => {
                this.time = count;
                clearInterval(timerInterval);
                timerInterval = window.setInterval(
                    () => (this.time -= 1000),
                    1000
                );
            });

            // Update the uploadCredentials for card uploads when received: 
            this.room?.onMessage("requestUploadCredentials", (creds: Record<string, string>) => {
                this.unsynced.uploadCredentials = creds;
            });
        },
        resetGameState() {
            try {
                this.room?.removeAllListeners();
                this.room?.leave();
                this.eventRegistered = false;
                this.room = undefined;
            } catch (error) {}
        },
    },
});

export default connection;

// @ts-ignore
process.env.NODE_ENV === "development" && (window._connection = connection);
