<template>
    <main>
        <div class="leaderboard">
            <h1 class="bold">Leaderboard</h1>
            <br>
            <div class="leaderboard-content">
                <div>
                    <p class="leaderboard-listing" v-for="(player, i) in results" :key="i">
                        <b class="h5">{{ player.name.charAt(0).toUpperCase() + player.name.slice(1) }}</b><br>
                        <span class="h5">{{player.points}} points</span>
                    </p>
                </div>
                <div>
                    <h4 class="h4">Points by round</h4>
                    <line-chart xtitle="Round" ytitle="Points" :data="pointMetrics"></line-chart>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import Vue from "vue";
import connection from "~/services/connection";

export default Vue.extend({
    //middleware: "validateGamePhase",

    computed: {
        results() {
            return Object.entries(connection.unsynced.leaderboard).sort((a,b)=> b[1] - a[1]).map(([k,v])=>{return {name:k,points:v}})   
        },
        pointMetrics(){
            return connection.unsynced.pointMetrics;
        }
    },
});
</script>

<style scoped>
.leaderboard-content{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
}
.leaderboard-listing{
    text-align: left;
    padding: 0vw 5vw;
}
.leaderboard-listing b{
    background-color:var(--primary);
    border-radius: 10px;
    padding:0rem 1rem;
    color:white;
}
main {
    padding: 0rem 8rem;
}
.h5{
    line-height: 3rem;
}
.leaderboard{
    text-align:center;
    padding: 4vw 20vw;
}
.leaderboard-name{
    font-size: 1.25rem;
    line-height: 1.75rem;
}
.leaderboard li{
    text-align: left;
}
@media only screen and (max-width: 640px) {
    .leaderboard {
        padding: 0vw 5vw;
    }

    main {
        padding: 0rem 0rem;
    }

    .leaderboard-listing {
        text-align: center;

    }

    .leaderboard-content {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }
}
</style>
