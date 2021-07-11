<template>
    <div
        v-if="formattedTime !== -1 && connection.room"
        class="clock-bar h1 bold"
    >
        {{ formattedTime }}
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import connection from "~/services/connection";

export default Vue.extend({
    computed: {
        connection() {
            return connection;
        },
        formattedTime() {
            if (connection.time === -1) return -1;
            const totalSeconds = connection.time / 1000;
            const minutes = (totalSeconds / 60).toString().split(".")[0];
            const seconds = (totalSeconds % 60).toString().split(".")[0];
            return `${minutes}:${seconds.length === 1 ? "0" : ""}${seconds}`;
        },
    },
});
</script>

<style scoped>
.clock-bar {
    background: transparent;
    color: var(--dark);
    padding: 1rem;
    text-align: center;
    font-family:Arial, Helvetica, sans-serif;
    position: relative;
    z-index: 5;
}
</style>
