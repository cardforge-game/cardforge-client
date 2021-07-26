<template>
  <main>
      <section class="menu-panel">
          <h1 class="h1 bold">Public Games</h1>
          <input v-model="filterName" placeholder="Filter by Name..." />
          <button @click="refreshGames">Refresh</button>
          <br><br>
          <div class="gamelisting">
              <table>
                  <tr>
                      <th>Room Name</th>
                      <th>Region</th>
                      <th>Players</th>
                      <th>Join</th>
                  </tr>
                  <!--ERRORS-->
                  <p v-if="error" class="bold" style="color:var(--danger)">Connection Error:{{error}}</p>
                  <p v-else-if="loading">Connecting to the server...</p>
                  <p v-else-if="games.length === 0">No public games! Try making a new game or find players in our <a
                          target="_blank" href="https://discord.gg/Sp88DPedwh">discord server!</a></p>
                  <p v-else-if="filterName.length > 0 && filteredGames.length === 0">No rooms with name "{{filterName}}"
                  </p>
                  <!-- END ERRORS -->
                  <tr v-for="(game) in filteredGames" :key="game.roomId">
                      <td>{{game.metadata.roomName}}</td>
                      <td>{{game.metadata.region}}</td>
                      <td class="bold">{{game.clients}}/{{game.maxClients}}</td>
                      <td><button style="--type: var(--success)" @click="joinRoom(game.roomId)">Join</button></td>
                  </tr>
              </table>
          </div>

      </section>
      <section class="menu-panel">
          <h1 class="h1 bold">{{(create) ? "Create" : "Join"}} A Game</h1>
          <p class="toggle" @click="create = !create">{{(create) ? "Join" : "Create"}} a Game</p>
          <br><br>
          <div class="form-dev">
              <form @submit.prevent="handleSubmit">
                  <div class="field">
                      <label class="bold">Nickname</label>
                      <input class="fullwidth" minlength="3" maxlength="15" required v-model="name" />
                  </div>
                  <div class="field" v-if="!create && hasCode">
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
                  <br><br>
                  <button v-if="hasCode || create" type="submit">{{(create) ? "Create" : "Join"}}</button>
                  <button v-else type="submit">Quick Join</button>
                  <p v-if="!create" class="toggle" @click="hasCode = !hasCode">{{(hasCode) ? "Join without" : "I have"}} a code</p>
              </form>
          </div>
      </section>
      <section class="menu-panel">
          <h1 class="h1 bold">News</h1>
          <br><br>
          <div class="dev-notice-content">
              <p>To keep up with the latest information on the development of CardForge, check our server!</p>
              <a target="_blank" href="https://discord.gg/Sp88DPedwh"><button style="--type: var(--secondary)">Discord
                      Server</button></a>
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
                hasCode:false as boolean,
                error:undefined as string| undefined,
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
                this.error = undefined;
                try{
                const gameListing = await connection.client.getAvailableRooms("standard")
                this.games = gameListing
                }catch(e){
                    this.error = e.message;
                }
                this.loading = false;
            },
            async handleSubmit(){
                if(this.create){
                    await connection.createRoom(this.name, this.roomName, this.privateRoom)
                }else if(!this.hasCode){
                    this.quickJoin()
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
    grid-template-columns: 1fr 1.5fr 1fr;
    grid-template-rows: 1fr;
    padding: 0 5rem;
    column-gap: 2rem;
    row-gap: 2rem;
    padding-top: 10vh;
    background:  url('~assets/images/bg.webp');
    background-size:cover;
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

.toggle{
    text-decoration: underline;
    cursor: pointer;
    color:var(--primary);
    user-select: none;
}

.menu-panel{
    width:100%;
    height:80vh;
    background-color: #eae0d79f;
    padding: 2rem 1rem;
}

.dev-notice{
    margin-top: 0.7rem;
    padding: 0 0.5rem;
}

.gamelisting{
    max-height: 65vh;
    overflow-y: scroll;
}

table {
    width:100%;
    text-align: left;
    border-collapse: collapse;
}

th{
    font-weight: bold;
}

td, th {
  text-align: left;
  padding: 8px;
}

tr{
    background-color: var(--theme);
}

tr:nth-child(even) {
  background-color: var(--theme-dark);
}

@media only screen and (max-width: 768px) {
    main {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 2fr 1fr;
        padding: 20vh 1rem;
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