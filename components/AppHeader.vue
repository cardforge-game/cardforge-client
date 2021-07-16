<template>
    <header>
        <a href="/">
            <img
                v-if="!connection.room"
                src="~/assets/images/logo-header.png"
                class="selectable"
            />
            <button v-else style="--type: var(--danger)" class="selectable">
                Leave
            </button>
        </a>

        <div class="right-side">
            <portal-target name="header"></portal-target>
        </div>
    </header>
</template>

<script>
import connection from "~/services/connection";
export default {
    computed: {
        connection() {
            return connection;
        },
    },
};
</script>

<style scoped>
header {
    padding: 1rem;
    background: transparent;
    display: flex;
    position: fixed;
    width: 100vw;
    align-items: center;
    z-index: 10;
}

.h5 {
    color: var(--light);
}

.right-side {
    margin-left: auto;
}

img {
    height: 3.25rem;
}
</style>
