<template>
    <Card
        v-if="player && player.activeCard"
        :card="activeCard"
        :class="isActivePlayer ? 'is-active-player' : ''"
        :custom-style="isEnemy ? 'border-color: var(--danger);' : ''"
        :size="9"
        :graphic-only="true"
        @click="onClick"
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
        isActivePlayer(): boolean {
            return connection.state.activePlayerID === this.player?.id;
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
        },
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

.is-active-player {
    border: 5px solid var(--success);
    animation: pulse 1.5s infinite;
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
