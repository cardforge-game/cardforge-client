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
    heal: new Howl({
        src: "/sounds/heal.webm",
        volume: 1.1,
    }),
    changeCard: new Howl({
        src: "/sounds/changeCard.ogg",
    }),
    placeCard: new Howl({
        src: "/sounds/placeCard.ogg",
    }),
    turn: new Howl({
        src: "/sounds/turn.webm",
        volume: 0.1,
    }),
    attackScene: new Howl({
        src: "/sounds/woosh.webm",
        rate:0.9,
    }),
    uiHover: new Howl({
        src: "/sounds/hover.webm",
        volume:0.05
    }),
    random: new Howl({
        src: "/sounds/random.webm",
        volume:0.5
    }),
    click: new Howl({
        src: "/sounds/click.webm",
        volume:0.04
    }),
    selectCard: new Howl({
        src: "/sounds/selectcard.webm",
        volume:0.5
    }),
    start: new Howl({
        src: "/sounds/start.webm",
    }),
    expand: new Howl({
        src: "/sounds/expand.webm",
        volume:0.5
    }),
    cardSwipe: new Howl({
        src: "/sounds/cardSwipe.webm",
        volume:0.5,
        rate:1.5
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
//(window as any).ss = audio;
export default audio;
