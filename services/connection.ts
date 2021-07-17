import Vue from "vue";
import { Client as ColyseusClient, Room } from "colyseus.js";
import Swal from "sweetalert2";
import { formPathFromPhase } from "~/services/utilities";

const ROOM_NAME = "standard";

const client = new ColyseusClient(process.env.SERVER_ENDPOINT);

let timerInterval = -1;

const connection = new Vue({
    data() {
        return {
            room: undefined as Room<IRoom> | undefined,
            eventRegistered: false,
            unsynced: {
                library: [] as ICard[],
                leaderboard: {} as Record<string, number>,
                pointMetrics: [],
                lastAttack: undefined as IAttackBroadcast | undefined,
                disconnnected:undefined as string | undefined
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

            // Listen for results:
            this.room?.onMessage("leaderboardUpdate", (update) => {
                this.unsynced.leaderboard = update.leaderboard;
                this.unsynced.pointMetrics = update.pointMetrics;
            });

            // Listen for timer resets:
            this.room?.onMessage("resetClock", (count: number) => {
                this.time = count;
                clearInterval(timerInterval);
                timerInterval = window.setInterval(
                    () => (this.time -= 1000),
                    1000
                );
            });

            // Game Over Alert:
            this.room?.onMessage("gameOver", (r) => {
                const winnerName = Object.entries(r)
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .map(([k]) => k)[0];
                Swal.fire({
                    title: "Game Over!",
                    text: `The winner is ${winnerName}`,
                    timer: 10000,
                    icon: "success",
                });
            });

            //Disconnnected from server
            this.room?.onMessage("disconnect", (r)=>{
                this.unsynced.disconnnected = r
                this.room?.leave();
            })
        },
        resetGameState() {
            try {
                this.room?.removeAllListeners();
                this.room?.leave();
                this.eventRegistered = false;
                this.room = undefined;
                this.unsynced.disconnnected = undefined;
            } catch (error) {}
        },
    },
});

export default connection;

// @ts-ignore
process.env.NODE_ENV === "development" && (window._connection = connection);
