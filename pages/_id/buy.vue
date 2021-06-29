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
                                Cost: {{ c.cardCost }}
                            </span>
                            <span
                                class="selectable card-buy-button"
                                @click="buyCard(c.id)"
                            >
                                Buy Card
                            </span>
                        </div>
                        <Card
                            :key="`card-${i}`"
                            :card="c"
                            :size="15"
                            :shadow="false"
                        />
                    </div>
                </div>
            </div>
            <div class="deck">
                <h1 class="section-header">Inventory 🎒</h1>
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
        </div>

        <div class="row deck horizontal">
            <div class="section-header">
                <h1>Active Deck ⚡</h1>
                <p class="active-deck-info">
                    Select 7 cards from your inventory that you can play in the
                    upcoming round.
                    <br /><br />
                    <b
                        >Currently:
                        {{ connection.currentPlayer.deck.length }}/7</b
                    >
                </p>
            </div>
            <div class="card-container">
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
    </main>
</template>

<script lang="ts">
import Swal from "sweetalert2";
import Vue from "vue";
import connection from "~/services/connection";
import audio from "~/services/audio";

export default Vue.extend({
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

    display: flex;
    flex-direction: column;
}

.card-container {
    max-height: 40vh;

    overflow-y: auto;
    overflow-x: hidden;
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

    border: 2px var(--light) solid;
    border-bottom: none;

    border-radius: 10px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.card-overhead .card-price-display {
    background-color: var(--success-dark);
}

.card-overhead .card-buy-button {
    background-color: var(--primary-dark);
    color: var(--light);
}

.card-overhead :not(span:first-of-type) {
    margin: 0 -6.25px;
}

.shop .card::v-deep {
    border-top-left-radius: 0;
}

.row {
    display: flex;
}

.row .deck:first-of-type {
    border-radius: 10px 0 0 10px;
    margin-right: 0;
    border-right: none;
}

.row .deck:last-of-type {
    border-radius: 0 10px 10px 0;
    margin-left: 0;
}

.deck {
    background-color: var(--primary-light);
    flex: 1;
    margin: 1rem;
    border: var(--dark) 2px solid;
    border-radius: 10px;
    overflow: hidden;
}

.section-header {
    padding: 1rem;

    border-bottom: 2px var(--dark) solid;

    font-size: max(20px, 2vw);
    font-weight: bold;

    background: var(--primary);
    color: var(--light);
}

.deck.horizontal .section-header {
    border-bottom: none;
    border-right: 2px var(--dark) solid;
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
    padding: 1rem;
    max-width: 11rem;
}
</style>
