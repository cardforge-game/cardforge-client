<template>
    <main>
        <ol v-if="results">
            <li v-for="(player, i) in Object.entries(results)" :key="i">
                <b>{{ player[0] }}</b>
                : {{ player[1] }} points
            </li>
        </ol>
    </main>
</template>

<script lang="ts">
import Vue from "vue";
import connection from "~/services/connection";

export default Vue.extend({
    computed: {
        results() {
            return connection.results;
        },
    },
});
</script>

<style scoped>
main {
    padding: 4rem 8rem;
}
</style>
