<template>
    <portal to="header">
        <b>{{ currentPlayer.name }}</b>

        <span v-if="currentPlayer">
            <b>${{ currentPlayer.money }}</b>
        </span>
    </portal>
</template>

<script lang="ts">
import Vue from "vue";
import connection from "~/services/connection";

export default Vue.extend({
    computed: {
        currentPlayer() {
            return connection.currentPlayer;
        },
    },
});
</script>

<style scoped>
span {
    background: var(--success-dark);
    padding: 0.25rem 0.5rem;
    border-radius: 10px;
    margin-left: 0.25rem;
}

b {
    color: var(--light);
    text-shadow: 1px 1px 5px black;
}
</style>
