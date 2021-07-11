<template>
    <main>
        <MoneyIndicator />
        <transition name="bounce">
            <div v-if="activePlayer" class="info-bar" @animationstart="newTurnSound">
                <b class="h4">  {{ activePlayer.name}}&nbsp;</b> <span>is thinking &nbsp; &nbsp;</span>
                <div class="sk-chase">
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                </div>
            </div>
        </transition>

        <TableTop />
        <PlayerHand />
    </main>
</template>

<script lang="ts">
import Vue from "vue";
import connection from "~/services/connection";
import audio from "~/services/audio";

export default Vue.extend({
    middleware: "validateGamePhase",
    methods:{
      newTurnSound(){ 
        if(this.activePlayer) audio.turn.play();
      }
    },
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
main {
  position : fixed;
  width : 100vw;
  height :100vh;
}

.info-bar {
    padding: 1rem;
    position: absolute;
    display: flex;
    align-items: center;
    left:50%;
    transform: translateX(-50%);
    z-index:5;
    background: var(--dark);
    padding: 0.5rem 1rem;
    border-radius: 10px;

}
.info-bar .h4{
    color: var(--light);
    font-size: 1.5rem;
    text-transform: uppercase;
    font-weight: bold;
    vertical-align:middle;
}
.info-bar span{
    color: var(--light);;
    font-size: 1rem;
    vertical-align:middle;
}

main {
    overflow: hidden;
    display: flex;

    flex-direction: column;
    align-items: center;
}

/* Current Turn animation */
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateX(-50%) scale(0);
  }
  50% {
    transform: translateX(-50%) scale(1.3);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}
.sk-chase {
  width: 40px;
  height: 40px;
  position: relative;
  display: inline-block;
  animation: sk-chase 2.5s infinite linear both;
}

.sk-chase-dot {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0; 
  animation: sk-chase-dot 2.0s infinite ease-in-out both; 
}

.sk-chase-dot:before {
  content: '';
  display: block;
  width: 25%;
  height: 25%;
  background-color: #fff;
  border-radius: 100%;
  animation: sk-chase-dot-before 2.0s infinite ease-in-out both; 
}

.sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }
.sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }
.sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }
.sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }
.sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }
.sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }
.sk-chase-dot:nth-child(1):before { animation-delay: -1.1s; }
.sk-chase-dot:nth-child(2):before { animation-delay: -1.0s; }
.sk-chase-dot:nth-child(3):before { animation-delay: -0.9s; }
.sk-chase-dot:nth-child(4):before { animation-delay: -0.8s; }
.sk-chase-dot:nth-child(5):before { animation-delay: -0.7s; }
.sk-chase-dot:nth-child(6):before { animation-delay: -0.6s; }

@keyframes sk-chase {
  100% { transform: rotate(360deg); } 
}

@keyframes sk-chase-dot {
  80%, 100% { transform: rotate(360deg); } 
}

@keyframes sk-chase-dot-before {
  50% {
    transform: scale(0.4); 
  } 100%, 0% {
    transform: scale(1.0); 
  } 
}
</style>
