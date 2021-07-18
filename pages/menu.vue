<template>
  <main>
      <section class="menu-panel">
          <h1 class="h1 bold">Public Games</h1>
          <input v-model="filterName" placeholder="Filter by Name..."/>
          <button @click="refreshGames">Refresh</button>   
          <button @click="quickJoin" style="--type: var(--success)">Quick Join</button> 
          <br><br>
          <div class="list">
              <p v-if="loading">Connecting to the server...</p>
              <p v-else-if="games.length === 0">No public games! Try making a new game or find players in our <a target="_blank" href="https://discord.gg/Sp88DPedwh">discord server!</a></p>
              <p v-else-if="filterName.length > 0 && filteredGames.length === 0">No rooms with name "{{filterName}}"</p>
              <div class="gamelisting" v-else v-for="(game) in filteredGames" :key="game.roomId">
                  <h5 class="h5">{{game.metadata.roomName}}</h5>
                  <span>{{game.metadata.region}}</span>
                  <span class="bold">{{game.clients}}/{{game.maxClients}}</span>
                  <button style="--type: var(--success)" @click="joinRoom(game.roomId)">Join</button>
              </div>       
          </div>
      </section>
      <section class="menu-panel">
           <h1 class="h1 bold">{{(create) ? "Create" : "Join"}} A Game</h1>
           <p class="toggle" @click="create = !create">{{(create) ? "Join" : "Create"}} a Game</p>
           <br><br>
           <div class="form-dev">
               <form @submit.prevent="handleSubmit">
                   <div class="field">
                       <label class="bold">Username</label>
                       <input class="fullwidth" minlength="3" required v-model="name" />
                   </div>
                   <div class="field" v-if="!create">
                       <label class="bold">Room Code</label>
                       <input class="fullwidth" required v-model="roomCode" />
                   </div>
                   <div class="field" v-if="create">
                       <label class="bold">Room Name</label>
                       <input class="fullwidth" minlength="3" required v-model="roomName" />
                   </div>
                   <div class="field" v-if="create">
                       <label class="bold">Private Game</label>
                       <input type="checkbox" v-model="privateRoom" />
                   </div>
                   <button style="--type: var(--success)" type="submit">{{(create) ? "Create" : "Join"}}</button>
               </form>
               <div class="dev-notice">
                   <h3 class="h3">News</h3>
                   <br><br>
                   <div class="dev-notice-content">
                   <p>To keep up with the latest information on the development of CardForge, check our server!</p>
                   <a target="_blank" href="https://discord.gg/Sp88DPedwh"><button style="--type: var(--secondary)">Discord Server</button></a>
                   </div>   
               </div>
           </div>
      </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import connection from "~/services/connection";
import { RoomAvailable } from "colyseus.js"
import Swal from "sweetalert2";
export default Vue.extend({
    computed: {
            connection() {
                return connection;
            },
            filteredGames(){
                if(this.filterName.trim() === "") return (this as any).games
                return (this as any).games.filter((games:RoomAvailable) => games.metadata.roomName.toLowerCase().includes(this.filterName.toLowerCase()))
            }
        },
        data() {
            return {
                create:false,
                loading: true,
                games: [] as RoomAvailable <any>[],
                name:"",
                roomCode:"",
                roomName:"",
                privateRoom:false,
                filterName:"",
            }
        },
        methods: {
            async refreshGames() {
                this.loading = true;
                const gameListing = await connection.client.getAvailableRooms("standard")
                this.games = gameListing
                this.loading = false;
            },
            async handleSubmit(){
                if(this.create){
                    await connection.createRoom(this.name, this.roomName, this.privateRoom)
                }else{
                    await connection.joinRoom(this.name,this.roomCode)
                }
                this.$router.push(`/${connection.room?.id}`)
            },
            async joinRoom(id:string){
                this.$router.push(`/${id}`)
            },
            async quickJoin() {
                if (this.name.trim().length < 3) {
                    const res = await Swal.fire({
                        title: "Enter in a username.",
                        input: "text",
                        inputLabel: "Make it short, sweet, and representative of your greatness.",
                        showCancelButton: true,
                        inputValidator: (value) =>
                            value.trim().length < 3 ? "Usernames must be at least three characters long." : null,
                    })
                    if (!res.value) return
                    this.name = res.value.trim()
                }

                await connection.quickJoin(this.name)
                this.$router.push(`/${connection.room?.id}`)
            }
            },
        async mounted() {
            connection.resetGameState()
            this.refreshGames()
        }
})
</script>

<style scoped>
main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    margin-top: 10vh;
    padding: 0 5rem;
    column-gap: 5rem;
}
.form-dev{
    display:grid;
    grid-template-columns:1fr;
    grid-template-rows: 1fr 1fr;
}
form{
    text-align: center;
    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content: space-between;
    height:50%;
    min-width: 0;
}
form .field{
    width:40%;
}
.list{
    text-align: center;
    overflow-y: scroll;
    max-height:70vh;
}
.toggle{
    text-decoration: underline;
    cursor: pointer;
    color:var(--primary);
    user-select: none;
}
.gamelisting{
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.menu-panel{
    width:100%;
    height:80vh;
    background-color: var(--theme-dark);
    padding: 2rem 1rem;
}

.dev-notice{
    margin-top: 0.7rem;
    padding: 0 0.5rem;
}

@media only screen and (max-width: 768px) {
    main {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        padding: 0 1rem;
    }

    .list {
        text-align: center;
        overflow-y: scroll;
        max-height: 30vh;
    }
    .menu-panel {
        height: 40vh;
    }
}
</style>