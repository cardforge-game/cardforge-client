<template>
    <Card
        v-if="player && player.activeCard"
        :ref="player.name"
        :card="activeCard"
        :class="{
            'is-active-card': isActiveCard,
            thinking: isNotCurrentPlayer,
            'is-enemy': isEnemy,
        }"
        :size="9"
        :graphic-only="true"
        :damaged="isDamaged"
        :healed="isHealed"
        :indicator-text="indicatorText"
        @click="onClick"
        @mouseenter="showOverlay(activeCard)"
        @mouseleave="hideOverlay"
    />
    <p v-else-if="player" class="no-active-username">
        {{ player.name }}
        {{ player.host ? "👑" : "" }}
    </p>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import connection from "~/services/connection";

export default Vue.extend({
    props: {
        player: {
            type: Object as PropType<IPlayer>,
            default: undefined,
        },
    },
    computed: {
        isDamaged(): boolean {
            return (
                connection.unsynced.lastAttack?.reciever === this.player?.id &&
                (connection.unsynced.lastAttack?.attack.damage || -1) > 0
            );
        },
        isHealed(): boolean {
            return (
                connection.unsynced.lastAttack?.attacker === this.player?.id &&
                (connection.unsynced.lastAttack?.attack.heal || -1) > 0
            );
        },
        indicatorText(): string | null {
            // Find the value and prefix of the indicatorText
            const effect = [
                {
                    prefix: "-",
                    condition: this.isDamaged,
                    value: connection.unsynced.lastAttack?.attack.damage,
                },
                {
                    prefix: "+",
                    condition: this.isHealed,
                    value: connection.unsynced.lastAttack?.attack.heal,
                },
            ].find((e) => e.condition);

            if (!effect) return null;

            return `${effect.prefix}${effect.value}`;
        },
        isActiveCard(): boolean {
            return connection.state.activePlayerID === this.player?.id;
        },
        isCurrentPlayer(): boolean {
            return (
                this.isActiveCard &&
                connection.currentPlayer?.id === this.player?.id
            );
        },
        isNotCurrentPlayer(): boolean {
            return this.isActiveCard == true && !this.isCurrentPlayer;
        },
        activeCard(): ICard | undefined {
            return this.player.activeCard;
        },
        isEnemy(): boolean {
            const selfTurn =
                connection.currentPlayer?.id ===
                connection.state.activePlayerID;

            const isSelf = this.player.id === connection.currentPlayer?.id;

            return selfTurn && !isSelf;
        },
    },
    methods: {
        onClick() {
            this.$emit("click");
            this.hideOverlay();
        },
        showOverlay(card:ICard){
             connection.$emit("showOverlay",card)
        },
        hideOverlay(){
             connection.$emit("hideOverlay")
        }
    },
});
</script>

<style scoped>
@keyframes pulse {
    0% {
        transform: rotate(var(--rotate)) scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }

    70% {
        transform: rotate(var(--rotate)) scale(1);
        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }

    100% {
        transform: rotate(var(--rotate)) scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
}

@keyframes border-pulse {
    25% {
        border-color: var(--success);
        border-left-color: #2c3e50;
    }

    50% {
        border-color: var(--success);
        border-top-color: #2c3e50;
    }

    75% {
        border-color: var(--success);
        border-right-color: #2c3e50;
    }

    100% {
        border-color: var(--success);
        border-bottom-color: #2c3e50;
    }
}

.thinking {
    animation: border-pulse 5.5s infinite;
}

.is-enemy {
    border-color: var(--danger);
    border-width: 5px;
}
.is-enemy:hover {
    transform: scale(1.5);
}

.is-active-card {
    border: 5px solid var(--success);
}

.no-active-username {
    color: var(--light);
    font-size: 1.5rem;
    text-transform: uppercase;
    font-weight: bold;
    background: var(--dark);
    padding: 0.5rem 1rem;
    border-radius: 10px;
}
</style>
