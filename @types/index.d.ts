declare type PhaseT =
    | "WAITING"
    | "CREATING"
    | "BUYING"
    | "FIGHTING"
    | "RESULTS";

declare interface IAttack {
    name: string;
    damage?: number;
    heal?: number;
    desc: string;
}

declare interface IPreviewCard {
    name: string;
    health: number;
    imgURL: string;
    attacks: IAttack[];
}

declare interface ICard extends IPreviewCard {
    id: string;
    cardCost: number;
}

declare interface IPlayer {
    id?: string;
    name: string;
    money: number;
    deck: ICard[];
    activeCard: ICard; // index of Player.deck
    host: boolean;
}

declare interface IRoom {
    phase: PhaseT;
    players: Record<string, IPlayer>;
    currentRound: number;
    cardLibrary: ICard[];
    activePlayerID: string;
}

declare interface IAttackBroadcast {
    attacker: string;
    reciever: string;
    attack: IAttack;
}
