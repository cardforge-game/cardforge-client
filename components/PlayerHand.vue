<template>
    <footer>

        <transition name="help">
            <span class="help-text h4 bold" v-if="pickCard">
                Click on a card from your hand to play it!
            </span>
        </transition>

        <transition name="help">
            <span class="help-text h4 bold" v-if="attacking">
                Click on an enemy card to attack them!
            </span>
        </transition>
        

        <div class="deck">
            <Card
                v-for="(card, i) in connection.currentPlayer.combatHand"
                :key="i"
                :card="card"
                :size="15"
                :rotation="getCardRotation(i)"
                :show-details="true"
                :custom-style="`z-index: ${i + 100};`"
                @click="setActive(i)"
                @mouseenter="playHoverSound"
            />
        </div>
    </footer>
</template>

<script lang="ts">
import Vue from "vue";
import connection from "~/services/connection";
import audio from "~/services/audio";
export default Vue.extend({
    computed: {
        connection() {
            return connection;
        },
        pickCard(){
            return (connection.currentPlayer && connection.room && !connection.currentPlayer.activeCard && connection.currentPlayer.combatHand.length > 0)
        },
        attacking() {
            return (connection.room && connection.room.state.activePlayerID === connection.currentPlayer?.id)
        }
    },
    methods: {
        playHoverSound() {
            audio.hover.play();
        },
        getCardRotation(i: number): number {
            if (connection.currentPlayer) {
                const midpoint = (connection.currentPlayer.deck.length - 1) / 2;
                return 2.5 * (i - midpoint);
            }
            return 0;
        },
        setActive(index: number) {
            connection.room?.send("setActive", { index });
            audio.placeCard.play();
        },
    },
});
</script>

<style scoped>
.help-enter-active {
    animation: slide-up .75s;
}
.help-leave-active {
    animation: slide-up .75s reverse;
}
@keyframes slide-up {
    from {
        opacity: 0;
        transform:translateX(-50%) translateY(200%);
    }
    to{
        opacity: 1;
        transform:translateX(-50%) translateY(-200%);
    }
  }
  
.help-text {
    z-index:2;
    color: var(--light);
    position: absolute;
    left:50%;
    transform:translateX(-50%) translateY(-200%);
    text-align:center;
}

footer {
    justify-self: flex-end;
    align-self: stretch;
    position: relative;
    height: 2.5rem;
}

.deck {
    background: var(--success);
    position: absolute;
    left: 0;
    right: 0;
    bottom: -15rem;
    height: 17.5rem;
    transition: bottom 0.25s ease-in-out;
    box-shadow: 0 -5px 20px rgba(1, 9, 32, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.card {
    margin: 0 -2rem;
    transition: transform 0.25s ease-in-out;
}

.card:hover {
    transform: translateY(-20rem) scale(1.25) !important;
    z-index: 500 !important;
}
</style>
