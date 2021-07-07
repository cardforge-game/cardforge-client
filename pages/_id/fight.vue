<template>
    <main>
        <MoneyIndicator />

        <div v-if="activePlayer" class="info-bar">
            <b class="h4">It's {{ activePlayer.name }}'s turn!</b>
        </div>

        <TableTop />
        <PlayerHand />
    </main>
</template>

<script lang="ts">
import Vue from "vue";
import Swal from "sweetalert2";
import connection from "~/services/connection";
import audio from "~/services/audio";

export default Vue.extend({
    middleware: "validateGamePhase",

    computed: {
        connection() {
            return connection;
        },
        activePlayer() {
            return connection.state.players?.[connection.state.activePlayerID];
        },
    },
    mounted() {
        connection.room?.onMessage("attacked", (d: IAttackBroadcast) => {
            //Incrementally play attack effects

            //Base attack info at 0
            connection.unsynced.lastAttack = {
                ...d,
                attack:{
                    name:d.attack.name,
                    desc:d.attack.desc,
                    damage:0,
                    heal:0,
                }
            }
            //Determine what to animate
            const animationQueue = Object.entries(d.attack).filter(([k,v])=> typeof v === "number" && v > 0).map(([k,v])=>k) as unknown as (keyof IAttack)[]
            //Play effects 
            const effectsPlayer:any = setInterval(function(){
                //Exit if all animations have finished
                if (animationQueue.length === 0 || !connection.unsynced.lastAttack?.attack) return clearInterval(effectsPlayer)
                //Get key of effect in audio/attack
                const effectType:keyof IAttack = animationQueue.splice(0,1)[0];
                //Play the audio
                (audio as any)[effectType].play();
                //Set the effect
                if(connection.unsynced.lastAttack){
                    (connection.unsynced.lastAttack.attack[effectType] as any)  = (d.attack[effectType] as any)
                }

         
             
            },1000)

            setTimeout(()=>{
                clearInterval(effectsPlayer)
                connection.unsynced.lastAttack = undefined
            },4000)

        });
    },
});
</script>

<style scoped>
.info-bar {
    padding: 1rem;
}

main {
    overflow: hidden;
    display: flex;

    flex-direction: column;
    align-items: center;
}
</style>
