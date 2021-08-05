<template>
    <div v-if="connection.unsynced.disconnnected" class="disconnect-alert">
        <p class="h6"><b class="h6">Disconnected:</b>{{connection.unsynced.disconnnected}}</p>
        <nuxt-link to="/menu">
        <button style="--type: var(--primary)" class="selectable">
            Leave
        </button>
        </nuxt-link>
    </div>
    <header v-else>
       <nuxt-link to="/" v-if="!connection.room">
            <p
                class="selectable logo"
                alt="CardForge">
            </p>
       </nuxt-link>
        <nuxt-link to="/menu" v-else>
            <button style="--type: var(--danger)" class="selectable">
                Leave
            </button>
        </nuxt-link>
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

.logo{
    background-image: url('~assets/images/logo-header.png');
    background-repeat: no-repeat;
    background-size: contain;
    padding: 0px;
    margin: 0px;
    width: 50vw;
    height: 50px;
}

.disconnect-alert{
    width:100vw;
    color: var(--light);
    background-color: var(--danger);
    text-align: center;
    height:5vh;
    display:flex;
    justify-content:space-evenly;
    align-items: center;
}

.disconnect-alert p, .disconnect-alert b{
    color: var(--light);
}


</style>
