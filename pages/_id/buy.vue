<template>
    <main>
        <MoneyIndicator />

        <div class="row">
            <div class="deck">
                <h1 class="section-header shop">Card Shop 🛒</h1>
                <div class="card-container">
                    <div
                        v-for="(c, i) in connection.unsynced.library"
                        :key="`card-${i}`"
                        class="card-item"
                    >
                        <div class="card-overhead">
                            <span class="card-price-display">
                                Cost: $ {{ c.cardCost }}
                            </span>
                        </div>
                        <Card
                            :key="`card-${i}`"
                            :card="c"
                            :size="15"
                            :shadow="false"
                            @click="buyCard(c.id)"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="deck">
                <h1 class="section-header">Collection 🎒</h1>
                <div class="card-container">
                    <div
                        v-for="(c, i) in connection.currentPlayer.inventory"
                        :key="`card-inv-${i}`"
                        class="card-item"
                    >
                        <Card
                            :card="c"
                            :size="15"
                            :shadow="false"
                            @click="addToDeck(i)"
                        />
                    </div>
                </div>
            </div>
            <div class="deck">
                <h1 class="section-header">
                    Active Deck ⚡ ({{
                        connection.currentPlayer.deck.length
                    }}/7)
                </h1>
                <div class="card-container">
                    <p
                        v-if="connection.currentPlayer.deck.length === 0"
                        class="hint"
                    >
                        Click on cards from your collection to use them in
                        battle!
                    </p>
                    <div
                        v-for="(c, i) in connection.currentPlayer.deck"
                        :key="`card-deck-${i}`"
                        class="card-item"
                    >
                        <Card
                            :card="c"
                            :size="15"
                            :shadow="false"
                            @click="addToInv(i)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import Swal from "sweetalert2";
import Vue from "vue";
import connection from "~/services/connection";
import audio from "~/services/audio";

export default Vue.extend({
    // middleware: "validateGamePhase",

    data() {
        return {
            cards: [] as ICard[],
            inventory: [],
        };
    },
    computed: {
        connection() {
            return connection;
        },
    },
    mounted() {
        Swal.fire(
            "Buying Cards",
            "In this phase of the game, you get to buy cards and add to your inventory and deck. " +
                "Your inventory can have an infinite amount of cards, but your deck can have up to 7." +
                "Make sure you have a good amount of cards in your deck, as you can only use your deck in the fighting phase.",
            "info"
        );
    },
    methods: {
        buyCard(id: string) {
            connection.room?.send("buyCard", { id });
            audio.buy.play();
        },
        addToDeck(index: number) {
            connection.room?.send("addCardToDeck", { index });
            audio.changeCard.play();
        },
        addToInv(index: number) {
            connection.room?.send("addCardToInventory", { index });
            audio.changeCard.play();
        },
    },
});
</script>

<style scoped>
main {
    margin: 1rem 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex-direction: column;
}
@media only screen and (max-width: 640px) {
    main {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }
}

.card:hover {
    cursor: pointer;
}

.card-container {
    max-height: 78vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.card-container .hint {
    text-align: center;
}

.card-item {
    display: inline-block;

    margin: 0.5rem 1rem;
    vertical-align: top;
}

.card-overhead span {
    display: inline-block;

    font-weight: bold;

    padding: 0.25rem 0.5rem;
}

.card-overhead .card-price-display {
    background-color: var(--success);
    color: var(--light);
}

.card-overhead .card-buy-button {
    background-color: var(--primary);
    color: var(--light);
}

.card-overhead :not(span:first-of-type) {
    margin: 0 -6.25px;
}

.row {
    display: flex;
    flex-direction: column;
}

.row .deck {
    border-radius: 10px 10px 10px 10px;
    margin-right: 0;
    border-right: none;
}

.deck {
    background-color: var(--theme-dark);
    flex: 1;
    margin: 1rem;
    overflow: hidden;
}

.section-header {
    padding: 1rem;
    margin: -2px;

    font-size: max(20px, 2vw);
    font-weight: bold;
}

.deck.horizontal .section-header {
    padding: 1rem 0;
}

.deck.horizontal h1 {
    font-size: max(20px, 2vw);
    font-weight: bold;

    color: var(--light);
    padding: 0 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px var(--dark) solid;
}

.active-deck-info {
    color: var(--light);
    padding: 1rem;
    max-width: 11rem;
}

.active-deck-info b {
    color: var(--light);
}
</style>
