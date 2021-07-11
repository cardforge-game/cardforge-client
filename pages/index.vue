<template>
    <main>
        <portal to="header">
            <div class="button-group">
                <button style="--type: var(--success)" @click="initGame('createGame')">
                    Start Game
                </button>
                <button style="--type: var(--primary)" @click="initGame('joinGame')">
                    Join Game
                </button>
            </div>
        </portal>
        <div class="grid banner">
            <section class="text-section">
                <h1 class="text-xl">Card<br>Forge</h1>
                <h2 class="h2">The imagination is in your hand</h2>
            </section>
            <section>
                <Card class="lg-card" :showDetails="true" :card="exampleCards[0]" :size="20" />
                <Card class="sm-card" :card="exampleCards[1]" :showDetails="false" :size="15" />
            </section>
        </div>
        <div class="content">
            <p class="h6">CardForge is an online party game where the players face of to <b class="h5">build</b>, <b
                    class="h5">exchange</b>, and <b class="h5">battle</b> their own custom
                cards!</p>
            <br><br>
            <p class="h6 bold"> Here's a quick run down of the game</p>
        </div>
        <div class="features">
            <div class="feature content">
                <h1 class="bold h1">Build Cards</h1>
                <br><br>
                <section class="grid flex-center">
                    <span>
                        <p class="h5">Use our AI-powered card designer to forge cards <br> <b class="h5">simply by
                                typing!</b><br><br> Watch <b class="h5"> anything you want </b> come to life</p>
                    </span>
                    <span>
                        <div class="exampleinput">
                            <span>Sir woofus slaps the enemy to remove 10 health!</span>
                        </div>
                        <p class="hint">Becomes</p>
                        <Card :card="exampleCards[2]" :showDetails="true" />
                    </span>
                </section>

            </div>
            <br>
            <div class="feature content">
                <h1 class="bold h1">Exchange Cards</h1>
                <br><br>
                <section class="grid flex-center">
                    <span>
                        <div class="deck">
                            <h1 class="shop">Card Shop 🛒</h1>

                            <div v-for="(c, i) in exampleCards.slice(-3)" :key="`card-${i}`" class="card-item">
                                <div class="card-overhead">
                                </div>
                                <Card :class="{'hide-sm':(i!==1)}" :key="`card-${i}`" :card="c" :size="13"
                                    :shadow="false" />
                            </div>

                        </div>
                    </span>
                    <span>
                        <p class="h5">
                            Explore cards created by <b class="h5">other players</b> and purchase ones that stand out to
                            you
                            <br><br>
                            Cards that are more powerful will <b class="h5">cost more</b>
                        </p>
                    </span>
                </section>

            </div>
            <div class="feature content">
                <h1 class="bold h1">Battle Cards!</h1>
                <br><br>
                <section class="grid flex-center">
                    <span>
                        <div class="deck">
                            <Card :key="`card-${i}`" :showDetails="true" :card="exampleCards[2]" :size="13"
                                :shadow="false" :is-interactive="true" />

                        </div>
                    </span>
                    <span>
                        <p class="h5">
                            Fight other players with cards in a <b class="h5">turn-based arena</b>
                            <br><br>
                            All cards and attacks are made up<b class="h5"> on the fly by the players</b>
                        </p>
                    </span>
                </section>

            </div>
            <div class="feature content">
                <h1 class="bold h1">Connect with us</h1>
                <br><br>
                <section class="grid flex-center">
                    <span>
                        <p class="h5">
                            The game is currently still in a <b class="h5">preview state</b> and is currently under
                            heavy development
                            <br><br>
                            Drop by our discord to follow the latest updates and find other players
                        </p>
                    </span>
                    <span>
                        <div class="deck">
                            <iframe src="https://discord.com/widget?id=862843702497378345&theme=dark" width="350"
                                height="500" allowtransparency="true" frameborder="0"
                                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                        </div>
                    </span>
                </section>

            </div>
        </div>
    </main>
</template>

<script lang="ts">
import Swal from "sweetalert2";
import Vue from "vue";
import connection from "~/services/connection";

export default Vue.extend({
    data(){
        return{
            exampleCards:[
                JSON.parse(`{ "name": "Sir Woofus", "health": 50, "imgURL": "${require(`~/assets/images/woof.webp`)}", "attacks": [ { "name": "Soaring Chomp", "desc": "Sir Woofus bites on the foe and launches them into the air dealing 20 damage", "damage": 20 }, { "name": "Pant", "desc": "Sir Woofus lies down on the ground to rest and restore 12 health", "heal": 12 } ] }`),
                JSON.parse(`{ "name": "Vince", "health": 20, "imgURL": "${require(`~/assets/images/vince.webp`)}", "attacks": [ { "name": "Fists of Fury", "desc": "Vince rapidly punches the enemy to deal 50 damage", "damage": 50 } ] }`),
                JSON.parse(`{ "name": "Sir Woofus", "health": 50, "imgURL": "${require(`~/assets/images/woof.webp`)}", "attacks": [ { "name": "Slap!", "desc": "Sir woofus slaps the enemy to remove 10 health", "damage":10 }] }`),
                JSON.parse(`{ "name": "Kiana the Silent", "health": 20, "imgURL": "${require(`~/assets/images/hood.webp`)}", "attacks": [ { "name": "Nimble Strike","damage":30}] }`),
                JSON.parse(`{ "name": "Literal Lemon", "health": 5, "imgURL": "${require(`~/assets/images/lem.webp`)}", "attacks": [ { "name": "Lemon Juice Spray","damage":100}] }`),
            ]
        }
    },
    mounted() {
        connection.resetGameState();
    },
    methods: {
        async initGame(action: "createGame" | "joinGame") {
            const res = await Swal.fire({
                title: "Enter in a username.",
                input: "text",
                inputLabel:
                    "Make it short, sweet, and representative of your greatness.",
                showCancelButton: true,
                inputValidator: (value) =>
                    value.trim().length === 0 ? "Type in a username." : null,
            });

            if (!(res.isDenied || res.isDismissed)) {
                this[action](res.value);
            }
        },
        async createGame(username: string) {
            const creationResponse = await connection.createRoom(username);

            if (creationResponse.success && connection.room) {
                connection.temp.host = true;
                this.$router.push(`/${connection.room?.id}`);
            } else {
                Swal.fire(
                    "That didn't work.",
                    `Unable to create a room.\nReason: ${creationResponse.error}`,
                    "error"
                );
            }
        },
        async joinGame(username: string) {
            const codePrompt = await Swal.fire({
                title: "Enter in a room code.",
                input: "text",
                inputLabel: "An alphanumeric code.",
                showCancelButton: true,
                inputValidator: (value) =>
                    value.trim().length === 0 ? "Type in a code." : null,
            });

            connection.temp.username = username;

            if (
                !(codePrompt.isDenied || codePrompt.isDismissed) &&
                codePrompt.value
            ) {
                this.$router.push(`/${codePrompt.value}`);
            }
        },
    },
});
</script>

<style scoped>
main {
    margin-top: 10vh;
    padding: 0 2rem;
}

.shop{
    transform: rotate(-90deg);
}

.content{
    text-align: center;
    padding:5% 15%;
}

.deck{
    display:flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.banner{
    height:90vh;
    text-align: left;
}
.feature{
    margin: 2rem 0;
}
.grid{
    display:grid;
    column-gap: 20px;
    grid-template-columns:1fr 1fr;
    grid-template-rows: 1fr;
}

.text-xl{
    font-size:9rem;
    font-weight:800;
    text-transform: uppercase;
    line-height:0.9;
}


.flex-center{
    display:flex;
    justify-content:space-evenly;
    align-items:center;
}

.lg-card{
    transform: scale(1.3) translateY(100px);
}
.sm-card{
    transform: translate(300px,-120px);
}

.exampleinput{
    padding: 0.65rem 0.65rem;
    background-color: var(--light);
}

.hint{
    font-style: italic;
}
.features{
    display:flex;
    justify-content: space-between;
    flex-direction: column;
    height:150vh;
}
@media only screen and (max-width: 768px) {
    .text-xl {
        font-size: 4rem;
        font-weight: 800;
        text-transform: uppercase;
    }

    .sm-card {
        transform: translate(0px, -100px);
    }

    .hide-sm{
        display: none;
    }

    .lg-card {
        display: none;
    }

    .banner {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        row-gap: 50px;
    }

    .content {
        padding: 5% 5%;
    }
    .deck{
        flex-direction: column;
    }
    .shop{
        transform: rotate(0deg);
        font-size: 2rem;
    }
}

.banner .card{
    position:relative;
    z-index: -1;
}


.banner section{
    margin: auto auto;
}

</style>
