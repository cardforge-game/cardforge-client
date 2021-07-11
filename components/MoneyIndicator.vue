<template>
    <portal to="header">
        <b>{{ currentPlayer.name }}</b>

        <span v-if="currentPlayer">
            <b class="text-light">${{ currentPlayer.money }}</b>
        </span>
    </portal>
</template>

<script lang="ts">
import Vue from "vue";
import connection from "~/services/connection";

export default Vue.extend({
    computed: {
        currentPlayer() {
            return connection.currentPlayer || {name:""};
        },
    },
});
</script>

<style scoped>
span {
    background: var(--success);
    padding: 0.25rem 0.5rem;
    border-radius: 10px;
    margin-left: 0.25rem;
}

b {
    color: var(--dark);
}

.text-light{
    color: var(--light);
}
</style>
