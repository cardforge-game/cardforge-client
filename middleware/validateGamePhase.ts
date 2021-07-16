import { Middleware } from "@nuxt/types";
import connection from "~/services/connection";
import { formPathFromPhase, getPhaseFromRoute } from "~/services/utilities";

const validateGamePhase: Middleware = ({ params, redirect, route }) => {
    if (!params.id || !connection.room) {
        redirect("/");
    } else if (connection.state.phase !== getPhaseFromRoute(route.path)) {
        redirect(
            formPathFromPhase(connection.state.phase, connection.room?.id)
        );
    }
};

export default validateGamePhase;
