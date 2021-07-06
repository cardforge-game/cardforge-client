import { Howl } from "howler";

interface ISoundState {
    [key: number]: Howl;
    play(): number;
}

const audio = {
    buy: new Howl({
        src: "/sounds/buy.wav",
        volume: 1.6,
    }),
    damage: new Howl({
        src: "/sounds/damage.wav",
        volume: 0.9,
    }),
    changeCard: new Howl({
        src: "/sounds/changeCard.ogg",
    }),
    placeCard: new Howl({
        src: "/sounds/placeCard.ogg",
    }),
    hover: {
        0: new Howl({
            src: "/sounds/hover0.ogg",
        }),
        1: new Howl({
            src: "/sounds/hover1.ogg",
        }),
        2: new Howl({
            src: "/sounds/hover2.ogg",
        }),
        3: new Howl({
            src: "/sounds/hover3.ogg",
        }),
        play() {
            const randomIndex = Math.floor(Math.random() * 4);
            const audio = this[randomIndex] as any;
            return audio.play();
        },
    } as ISoundState,
};
(window as any).ss = audio
export default audio;