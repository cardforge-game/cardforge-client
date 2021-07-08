<template>
    <main>
        <MoneyIndicator />

        <section class="card-preview section">
            <h1>
                You've made <b class="h1">{{ acceptedCards }}</b> cards.
            </h1>
            <br />

            <details open class="card-side">
                <p class="h6 cost" v-if="cardData.cardCost">Other players can by this card at: <b>${{ cardData.cardCost }}</b></p>
                <summary class="selectable unhighlightable bold h4">
                    Card Preview
                </summary>
                <Card :size="30" :card="cardData" :show-details="true" />
            </details>

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
                    <h3>Card Stats</h3>

                    <div class="attack-form inline-fields">
                        <div class="field">
                            <label>Card Name</label>
                            <input
                                :class="{attention:(cardData.name.length <= 0)}"
                                v-model="cardData.name"
                                placeholder="Lord of Darkness"
                                maxlength="24"
                                required
                            />
                        </div>

                        <div class="field">
                            <label>Card Health</label>
                            <input
                                v-model.number="cardData.health"
                                type="number"
                                placeholder="10"
                                min="1"
                                required
                            />
                        </div>

                        <div class="field">
                            <label>Card Image URL</label>
                            <input
                                v-model="cardData.imgURL"
                                placeholder="link.jpg"
                                required
                            />
                        </div>
                    </div>
                </div>

                <h3>
                    Card Attacks
                    <button
                        v-if="cardData.attacks.length < 3 && cardData.name"
                        style="--type: var(--success)"
                        @click="
                            cardData.attacks.push({
                                name: '',
                                desc: '',
                            })
                        "
                    >
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
                <details
                    v-for="(a, i) in cardData.attacks"
                    :key="`attackCardCreation-${i}`"
                    open
                    class="attack-form"
                >
                    <summary class="h4 bold section">{{ a.name }}</summary>
                    <div class="section">
                        <div class="field">
                            <label>Attack Name</label>
                            <input
                                v-model="a.name"
                                placeholder="Slap"
                                maxlength="20"
                                required
                            />
                            <button type="button" class="inline-block" @click="setExampleAttack(i)">🎲</button>
                        </div>

                        <div class="field">
                            <label>Attack Description</label>
                            <textarea
                                v-model.lazy="a.desc"
                                maxlength="100"
                                :placeholder="`${
                                    cardData.name || 'someone'
                                } slaps the enemy dealing 10 damage!`"
                                required
                            />
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

                <div class="subsection" v-if="cardData.name">
                    <div class="button-group">
                        <button
                            type="button"
                            style="--type: var(--primary)"
                            @click="previewCard"
                        >
                            Preview Card
                        </button>
                        <button type="submit" style="--type: var(--success)">
                            Publish Card
                        </button>
                    </div>
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
                attacks: [
                
                ],
            } as IPreviewCard,
            acceptedCards: 0,
            currentCache: JSON.parse(
                localStorage.getItem("cachedCards") || "[]"
            ) as IPreviewCard[],
        };
    },
    mounted() {
        if (!connection.eventRegistered && connection.room) {
            Swal.fire(
                "Creating Cards",
                "In this phase of the game, you can to create your own playing cards for your opponents to use. " +
                    "Each card can have up to 3 moves, which can heal you or damage an opponent. " +
                    "Make as many cards as you can, but be wise with your decisions, as your opponents are using your cards.",
                "info"
            );

            connection.eventRegistered = true;

            connection.room.onMessage("previewCard", (card: IPreviewCard) => {
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

                this.currentCache = JSON.parse(
                    localStorage.getItem("cachedCards") || "[]"
                );

                if (this.currentCache.length >= 7) {
                    this.currentCache.shift();
                }

                localStorage.setItem(
                    "cachedCards",
                    JSON.stringify([...this.currentCache, this.cardData])
                );

                this.cardData = {
                    name: "",
                    health: 10,
                    imgURL: "",
                    attacks: [],
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
        setExampleAttack(i: number){
            Vue.set(this.cardData.attacks,i,getExampleAttack(this.cardData.name,connection.state.resultsShown))
        }
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

    background: var(--dark);
}

details:first-of-type {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

details:last-of-type {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.card-preview summary {
    background: var(--primary);
    color: var(--light);
    padding: 1rem;
    text-align: left;
}

.card {
    text-align: left;
    display: inline-flex;
}

.previous-card {
    padding: 1rem;
    display: flex;
    align-items: center;
}

.previous-card .h4 {
    color: var(--light);
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

.field {
    margin: 1rem 0;
}

.inline-fields .field {
    display: inline-block;
    margin-right: 1rem;
}

input,
textarea {
    padding: 0.25rem 0.5rem;
}

.field label {
    font-weight: bold;
    display: block;
}

.field textarea {
    width: 30rem;
    height: 5rem;
}

h3 {
    display: flex;
    align-items: center;
}

h3 * {
    margin: 0 1rem;
}

.attack-form:not(details) {
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 10px;
    border: var(--primary) 1.5px solid;
}

details.attack-form *:not(input):not(textarea) {
    color: var(--light);
}

details.attack-form summary {
    background: var(--secondary);
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

.cost{
    color: var(--light);
    margin-top: 0.5rem;
}

.cost b{
    background-color: var(--success);
    color: var(--light);
    padding: 0px 0.5rem;
}

.attention{
    border:solid 3px var(--secondary);
    border-radius: 10px;
}
</style>
