<template>
    <main>
        <MoneyIndicator />

        <section class="card-preview section">
            <h1>
                You've made <b class="h1">{{ acceptedCards }}</b> cards.
            </h1>
            <br />
            <p v-if="cardData.cardCost" class="h6 cost">
                Other players can buy this card at:
                <b>${{ cardData.cardCost }}</b>
                <br>
                When a player purchases a card you designed, you earn <span class="bold">1</span> point
            
            </p>
            <Card :size="30" :card="cardData" :show-details="true" />

            <details v-if="currentCache.length > 0" class="card-side">
                <summary class="selectable unhighlightable bold h4">
                    Previous Cards
                </summary>
                <div
                    v-for="(card, i) in currentCache"
                    :key="i"
                    class="previous-card"
                >
                    <span class="h4">{{ card.name }}</span>

                    <div class="button-group">
                        <button @click="loadCard(card)">Load Card</button>
                        <button
                            style="--type: var(--danger)"
                            @click="deleteCard(i)"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </details>
        </section>
        <section class="section">
            <form @submit.prevent="publishCard">
                <div class="subsection">
                    <h3 class="bold">Card Stats</h3>

                    <div class="attack-form inline-fields">
                        <div class="field">
                            <label>Card Name</label>
                            <input v-model="cardData.name" :class="{
                                    attention: cardData.name.length <= 0,
                                }" placeholder="Lord of Darkness" maxlength="24" required />
                        </div>

                        <div class="field">
                            <label>Card Health</label>
                            <input v-model.number="cardData.health" type="number" placeholder="10" min="1"
                                @blur="previewCard" required />
                        </div>

                        <div class="field">
                            <label>Card Image URL</label>
                            <input v-model="cardData.imgURL" placeholder="link.jpg" required />
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3 class="bold">
                        Card Attacks
                        <button v-if="cardData.attacks.length < 3 && cardData.name" style="--type: var(--success)"
                            @click="
                                cardData.attacks.push({
                                    name: '',
                                    desc: '',
                                })
                            ">
                            Add Attack ⚔️
                        </button>
                    </h3>

                    <p v-if="cardData.attacks.length === 0 && cardData.name" class="field">
                        You have no attacks setup! Click "Add Attack"
                    </p>
                    <p v-else-if="!cardData.name" class="field">
                        Start creating a card by typing a name!
                    </p>
                    <div v-if="cardData.name">
                        <details v-for="(a, i) in cardData.attacks" :key="`attackCardCreation-${i}`" open
                            class="attack-form">
                            <summary v-if="a.name.length > 0" class="h4 section">
                                {{ a.name }}
                            </summary>
                            <summary v-else class="h4 placeholder section">
                                No Name
                            </summary>
                            <div class="section">
                                <div class="field">
                                    <label>Attack Name</label>
                                    <input v-model="a.name" placeholder="Slap" maxlength="20" required :class="{
                                            attention: a.name.length <= 0,
                                        }" />
                                    <button type="button" class="inline-block" @click="setExampleAttack(i)">
                                        🎲
                                    </button>
                                </div>

                                <div class="field">
                                    <label>Attack Description</label>
                                    <textarea @blur="previewCard" v-model.lazy="a.desc" maxlength="100" :placeholder="`${
                                            cardData.name || 'someone'
                                        } slaps the enemy dealing 10 damage!`" required />
                                    </div>

                                <div class="field">
                                    <button
                                        style="--type: var(--danger)"
                                        @click="cardData.attacks.splice(i, 1)"
                                    >
                                        Remove Attack
                                    </button>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>

                <div v-if="cardData.name" class="subsection">
                    <button type="submit" style="--type: var(--success)">
                            Publish Card
                    </button>
                </div>
            </form>
        </section>
    </main>
</template>

<script lang="ts">
import Vue from "vue";
import Swal from "sweetalert2";
import connection from "~/services/connection";
import getExampleAttack from "~/services/exampleAttacks";

export default Vue.extend({
    middleware: "validateGamePhase",

    data() {
        return {
            cardData: {
                name: "",
                health: 10,
                imgURL: "",
                attacks: [],
                modifiers:[]
            } as IPreviewCard,
            acceptedCards: 0,
            currentCache: JSON.parse(
                localStorage.getItem("cachedCards") || "[]"
            ) as IPreviewCard[],
        };
    },
    mounted() {
        if (!connection.eventRegistered && connection.room) {
            this.cardData.health = (connection.state.resultsShown || 1) * 10;
            Swal.fire(
                "Creating Cards",
                "In this phase of the game, you can to create your own playing cards for your opponents to use. " +
                    "Each card can have up to 3 moves, which can heal you or damage an opponent. " +
                    "Make as many cards as you can, but be wise with your decisions, as your opponents are using your cards.",
                "info"
            );

            // connection.eventRegistered = true;

            connection.room.onMessage("previewCard", (card: IPreviewCard) => {
                console.log(card)
                this.cardData = card;
            });

            connection.room.onMessage("cardAccepted", () => {
                Swal.fire({
                    title: "Card Accepted!",
                    icon: "success",
                    toast: true,
                    position: "top-end",
                });

                this.acceptedCards++;

                if (this.currentCache.length >= 7) {
                    this.currentCache.shift();
                }

                const cache = JSON.parse(
                    (localStorage.getItem("cachedCards") as any) || "[]"
                );

                localStorage.setItem(
                    "cachedCards",
                    JSON.stringify([...cache, this.cardData])
                );

                this.currentCache = JSON.parse(
                    localStorage.getItem("cachedCards") || "[]"
                );

                this.cardData = {
                    name: "",
                    health: (connection.state.resultsShown || 1) * 10,
                    imgURL: "",
                    attacks: [],
                    modifiers:[]
                };
            });
        }
    },
    methods: {
        publishCard() {
            connection.room?.send("submitCard", this.cardData);
        },
        previewCard() {
            connection.room?.send("previewCard", this.cardData);
        },
        loadCard(card: IPreviewCard) {
            this.cardData = JSON.parse(JSON.stringify(card));
        },
        deleteCard(i: number) {
            this.currentCache.splice(i, 1);
            localStorage.setItem(
                "cachedCards",
                JSON.stringify(this.currentCache)
            );
        },
        setExampleAttack(i: number) {
            Vue.set(
                this.cardData.attacks,
                i,
                getExampleAttack(
                    this.cardData.name,
                    connection.state.resultsShown
                )
            );
            this.previewCard();
        },
    },
});
</script>

<style scoped>
main {
    display: flex;
    flex-direction: row;
    align-items: stretch;
}
main section {
    flex: 1;
    overflow-y: scroll;
    padding: 2rem 1rem;
}

.card-preview {
    text-align: center;
    padding: 1rem;
}

.card {
    margin: 1rem;
}

details {
    overflow: hidden;
}

details:first-of-type {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

details:last-of-type {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

details .section {
    background-color: var(--theme-dark);
}

.card-preview summary {
    background: var(--theme-dark);
    padding: 1rem;
    text-align: left;
}

.card {
    text-align: left;
    display: inline-block;
}

.previous-card {
    padding: 1rem;
    display: flex;
    align-items: center;
}

.previous-card .button-group {
    margin-left: auto;
}

@media only screen and (max-width: 1100px) {
    main {
        flex-direction: column;
    }
    main section {
        flex: none;
    }
}

.subsection {
    margin: 0 0.5rem;
}

h3 {
    display: flex;
    align-items: center;
}

h3 * {
    margin: 0 1rem;
}

.attack-form:not(details) {
    padding: 1rem 0rem;
    margin: 1rem 0;
    border-radius: 10px;
}

.attack-form summary {
    margin-top: 1rem;
}

details.attack-form summary {
    position: relative;
}

details.attack-form:first-of-type {
    margin-top: 2rem;
}

details.attack-form:last-of-type {
    margin-bottom: 2rem;
}

.inline-block {
    display: inline-block;
}

.cost {
    padding: 0.5rem 0;
    background-color: var(--theme-dark);
}

.cost b {
    background-color: var(--success);
    color: var(--light);
    padding: 0px 0.5rem;
}

.attention {
    border: solid 3px var(--secondary);
}

.placeholder {
    color: gray;
    font-style: italic;
}
</style>
