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
                        <b>Code:</b> {{ connection.room.id }}
                    </div>
                </div>
                <button
                    style="--normal-color: var(--success)"
                    @click="startGame"
                >
                    Start Game
                </button>
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
        if (connection.temp.host) {
            // If the user created the room:

            Swal.fire(
                "Your game is ready!",
                "Send the current link to your friends to play with them. " +
                    "When all your friends are in, hit the 'Start Game' button to get going. " +
                    "(The game needs at least 3 players, up to 8 players, more the better!)",
                "success"
            );
        } else if (connection.temp.username.length > 0) {
            // Someone is joining via the homepage:

            const joinResponse = await connection.joinRoom(
                connection.temp.username,
                this.id.trim()
            );

            connection.temp = {
                host: false,
                username: "",
            };

            if (joinResponse.success) {
                Swal.fire(
                    "You're all set!",
                    "Send this link to get more friends in the game, between 3-8 players are allowed. " +
                        "The person that created the game will start it when they see fit, have fun!",
                    "success"
                );
            } else {
                Swal.fire(
                    "Hmm...",
                    `Unable to join this room (code ${this.id.trim()}).Reason: ${
                        joinResponse.error
                    }`,
                    "error"
                );
            }
        } else {
            // Someone is joining with a direct link:

            const res = await Swal.fire({
                title: "Enter in a username.",
                input: "text",
                inputLabel:
                    "Make it short, sweet, and representative of your greatness.",
                showCancelButton: true,
                inputValidator: (value) =>
                    value.trim().length === 0 ? "Type in a code." : null,
            });

            if (res.isDenied || res.isDismissed) {
                return this.$router.push("/");
            }

            await connection.joinRoom(res.value.trim(), this.id.trim());

            connection.temp = {
                host: false,
                username: "",
            };
        }
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
.info-sidebar .text * {
    color: var(--light);
}
.info-sidebar button {
    margin: 0 0.5rem;
}
</style>
