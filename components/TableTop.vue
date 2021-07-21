<template>
    <div v-if="players" class="table">
        <div class="card-dialog-perspective">
            <div class="card-dialog" :style="cardDialogStyles">
                <Card
                    v-if="currentActiveCard"
                    :card="currentActiveCard"
                    :size="25"
                    :show-details="true"
                    :is-interactive="true"
                    @onAttackTrigger="doAttack"
                />
            </div>
        </div>
        <div  @animationstart="playAttackScene" v-if="lastAttack" class="attack-scene" :style="`background-image:url('${lastAttackerImage}')`">
            <h1 class="attack-title h1 bold">
                  {{lastAttack.name}}
            </h1>
        </div>
        <div class="row top">
            <TableTopCard
                v-for="(n, i) in 5"
                :key="i + 5"
                :player="displayPlayers[i + 5]"
                @click="onCardClick(i + 5)"
            />
        </div>
        <div class="row mid">
            <TableTopCard
                v-for="(n, i) in 2"
                :key="i + 3"
                :player="displayPlayers[i + 3]"
                @click="onCardClick(i + 3)"
            />
        </div>
        <div class="row bottom">
            <TableTopCard
                v-for="(n, i) in 3"
                :key="i"
                :player="displayPlayers[i]"
                @click="onCardClick(i)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import connection from "~/services/connection";
import audio from "~/services/audio"
export default Vue.extend({
    data() {
        return {
            showCardDialog: false,
            attackTarget: null as string | null,
        };
    },
    computed: {
        currentActiveCard() {
            return connection.currentPlayer?.activeCard;
        },
        displayPlayers(): IPlayer[] {
            if (connection.currentPlayer) {
                const copy = [...this.players];

                const self = copy.findIndex(
                    (p) => p.id === connection.currentPlayer?.id
                );

                if (copy.length > 1) {
                    [copy[self], copy[1]] = [copy[1], copy[self]];
                }

                return copy;
            } else {
                return this.players;
            }
        },
        players(): IPlayer[] {
            return Object.values(connection.state.players || []);
        },
        cardDialogStyles(): string {
            return `
                transform: rotateY(${this.showCardDialog ? -15 : -90}deg);
            `;
        },
        lastAttack():IAttack | undefined {
            return connection.unsynced.lastAttack?.attack
        },
        lastAttackerImage():string | undefined {
             const id = connection.unsynced.lastAttack?.attacker
             if(!id) return undefined
             if(!connection.state.players[id].activeCard) return undefined
             return connection.state.players[id].activeCard.imgURL
        }

    },
    methods: {
        playAttackScene() {
            audio.attackScene.play()
        },
        onCardClick(index: number) {
            const player: IPlayer = this.displayPlayers[index];

            const clickedSelf = player.id === connection.currentPlayer?.id;

            const selfTurn =
                connection.currentPlayer?.id ===
                connection.state.activePlayerID;

            if (selfTurn && !clickedSelf) {
                this.attackTarget = player.id || null;
                this.showCardDialog = true;
            }
        },
        doAttack(_attack: IAttack, attackIndex: number) {
            this.showCardDialog = false;
            connection.room?.send("attack", {
                id: this.attackTarget,
                attackIndex,
            });
        },
    },
});
</script>

<style scoped>
.table {
    background: url(~/assets/images/logo.png), radial-gradient(#6dd5ed, #387989);

    background-size: 400px 224px, cover;
    background-repeat: no-repeat;
    background-position: center;

    display: flex;
    flex-direction: column;
    flex: 1;

    box-shadow: 0 0 20px rgba(1, 9, 32, 0.5);

    margin: 0;
    width: 100%;
    padding-bottom: 1rem;

    position: relative;
}

.card-dialog-perspective {
    position: fixed;
    right: 100px;
}

.row {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-evenly;

    margin: 0 5rem;
}

.row.mid {
    justify-content: space-between;
}

.card-dialog-perspective {
    perspective: 1000px;
}

.card-dialog {
    transition: transform 0.25s ease-in-out;
}

@media only screen and (min-width: 1000px) {
    .row.mid .card:first-of-type::v-deep {
        --rotate: -90deg;
    }

    .row.mid .card:last-of-type::v-deep {
        --rotate: -90deg;
    }

    .row.top {
        --rotate: 180deg;
    }

    .row.top .no-active-username {
        --rotate: 180deg;
    }

    .row.top .card:first-of-type::v-deep,
    .row.bottom .card:first-of-type::v-deep {
        --rotate: 45deg;
    }

    .row.top .card:last-of-type,
    .row.bottom .card:last-of-type {
        --rotate: -45deg;
    }
}
.attack-scene{
    position:fixed;
    top:30vh;
    height:30vh;
    text-align:left;
    padding: 1rem 2rem;
    width:100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size:cover;
    animation: intro 1.3s linear forwards;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

.attack-title{
    display:flex;
    height:100%;
    font-size: 1.5rem;
    justify-content:center;
    align-items:center;
    color: var(--light);
    font-size:8rem;
    animation: attack-title 1.5s ease-in-out forwards;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,1px 1px 0 #000;
}

@keyframes intro{
    0%{
        transform:scaleY(0);
        background-position:0% -10%;
    }
    15%{
        transform:scaleY(1);
        background-position:0% 50%;
    }
    80%{
        transform:scaleY(1);
        background-position:0% 50%;
    }
    100%{
         transform:scaleY(0);
        background-position:0% -10%;
    }

}

@keyframes attack-title{
    0%{
      transform:translateX(-10%);
      opacity:0
    }
    10%{
        opacity: 0;
    }
    20%{
        opacity: 1;
    }
    80%{
        opacity: 1;
    }
    100%{
        transform:translateX(5%);
    }

}
</style>
