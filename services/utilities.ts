export function invertObject<
    T extends Record<string | number | symbol, string | number | symbol>
>(obj: T) {
    const flipped: Record<T[keyof T], keyof T> = Object.create(null);

    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            flipped[obj[prop]] = prop;
        }
    }

    return flipped;
}

export const PHASES_TO_ROUTES: Record<PhaseT, string> = {
    WAITING: "",
    CREATING: "create",
    BUYING: "buy",
    FIGHTING: "fight",
    RESULTS: "results",
};

export const ROUTES_TO_PHASES = invertObject(PHASES_TO_ROUTES);

export const getPhaseFromRoute = (path: string) =>
    ROUTES_TO_PHASES[path.split("/").reverse()[0]];

export const formPathFromPhase = (phase: PhaseT, id?: string) =>
    `/${id}/${PHASES_TO_ROUTES[phase]}`;
