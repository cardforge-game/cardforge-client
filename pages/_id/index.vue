<template>
    <main>
        <portal to="header">
            <div
                v-if="connection.currentPlayer && connection.currentPlayer.host"
                class="info-sidebar"
            >
                <div class="text">
                    <span class="lead">You are the host! 👑</span>
                    <div v-if="connection.room" class="code-display">
                        <b>Code:</b> <span class="hidden">{{ connection.room.id }}</span>
                    </div>
                </div>
                <button style="--type: var(--success)" @click="startGame">
                    Start Game
                </button>
            </div>
            <div v-else class="info-sidebar">
                <div class="text">
                    <span class="lead">Waiting for host to start...</span>
                </div>
            </div>
        </portal>

        <TableTop />
    </main>
</template>

<script lang="ts">
import Swal from "sweetalert2";
import Vue from "vue";
import connection from "~/services/connection";
export default Vue.extend({
    computed: {
        id() {
            return this.$route.params.id;
        },
        connection() {
            return connection;
        },
    },
    async mounted() {
        connection.redirect = (path: string) => this.$router.push(path);

        if (connection.currentPlayer?.host) {
            // If the user created the room:

            Swal.fire(
                "Your game is ready!",
                "Send the current link to your friends to play with them. " +
                    "When all your friends are in, hit the 'Start Game' button to get going. " +
                    "(The game needs at least 3 players, up to 8 players, more the better!)",
                "success"
            );
        } else if(!connection.currentPlayer) {
            // Someone is joining with a direct link:

            const res = await Swal.fire({
                title: "Enter in a username.",
                input: "text",
                inputLabel:
                    "Make it short, sweet, and representative of your greatness.",
                showCancelButton: true,
                inputValidator: (value) =>
                    value.trim().length < 3 ? "Usernames must be at least three characters long." : null,
            });

            if (res.isDenied || res.isDismissed) {
                return this.$router.push("/menu");
            }

            const connected = await connection.joinRoom(res.value.trim(), this.id.trim());
            if(!connected.success) connection.unsynced.disconnnected = "That room code does not exist or has already been expired"
            
            connection.temp = {
                host: false,
                username: "",
            };
        }
    },
    methods: {
        startGame() {
            connection.room?.send("startGame");
        },
    },
});
</script>

<style scoped>
main {
    display: flex;
    flex-direction: column;
}
.info-sidebar {
    display: flex;
    align-items: center;
}
.info-sidebar .text {
    text-align: right;
}
span,b,p{
    color: var(--light);
}
.info-sidebar button {
    margin: 0 0.5rem;
}

.hidden{
   color: transparent;
   text-shadow: 0 0 6px rgba(255,255,255,1);
   transition: color 0.25s ease-in-out;
}
.hidden:hover{
   color: var(--light);
}
</style>
