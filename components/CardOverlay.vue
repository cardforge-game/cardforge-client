<template>
  <transition name="overlay">
    <div class="card-overlay" v-if="card && show">
      <Card :showDetails="true" :card="card" :size="30" />
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import connection from "~/services/connection";
export default Vue.extend({
  data() {
    return {
      card: undefined as ICard | undefined,
      enabled: false,
      show:false
    }
  },
  mounted() {
    //Queue a card to be overlayed
    connection.$on("showOverlay", (c: ICard) => {
      this.enabled = true;
      this.card = c;
      setTimeout(() => {
        if (this.enabled) this.show = true
      }, 1500)

    })

     //Turn off overlay
    connection.$on("hideOverlay", () => {
      this.enabled = false;
      this.card = undefined;
      this.show = false;
    })
  }
})
</script>

<style>
    .overlay-enter-active{
      opacity: 0;
      animation:enter-active 0.5s ease-in-out;
    }
    .overlay-leave-active{
      animation:leave-active 0.2s ease-in-out;
    }

    @keyframes enter-active {
      from{
        opacity: 0;
        transform: scale(0)
      }

      to{
        opacity: 1;
        transform: scale(1)
      }
    }

    @keyframes leave-active {
      to{
        opacity: 0;
        transform: scale(0)
      }
    }
    .card-overlay{
        z-index:3;
        pointer-events: none;
        margin-top: 10vh;
        width:100vw;
        height:100vw;
        display: flex;
        justify-content: center;
        position: fixed;
    }
</style>