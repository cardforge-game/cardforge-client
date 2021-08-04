<template>
    <main>
        <MoneyIndicator />
        <AttackLibrary />
        <section class="card-preview section">
            <h1>
                You've made <b class="h1">{{ acceptedCards }}</b> cards.
            </h1>
            <br />
            <p v-if="cardData.cardCost" class="h6 cost">
                Other players can buy this card at:
                <b>${{ cardData.cardCost }}</b>
                <br>
                When a player purchases a card you designed, you earn <span class="bold">1</span> point
            
            </p>
            <Card :size="30" :card="cardData" :show-details="true" />

            <details v-if="currentCache.length > 0" class="card-side">
                <summary class="selectable unhighlightable bold h4">
                    Previous Cards
                </summary>
                <div
                    v-for="(card, i) in currentCache"
                    :key="i"
                    class="previous-card"
                >
                    <span class="h4">{{ card.name }}</span>

                    <div class="button-group">
                        <button @click="loadCard(card)">Load Card</button>
                        <button
                            style="--type: var(--danger)"
                            @click="deleteCard(i)"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </details>
        </section>
        <section class="section" v-if="isEditingAttack">
             <div class="subsection">
                    <h3 class="bold">
                        Editing {{(cardData.attacks[editAttackIndex].name && cardData.attacks[editAttackIndex].name.length > 0) ? cardData.attacks[editAttackIndex].name : "New Attack"}}
                        <button style="--type: var(--primary)" type="button"
                            @click="isEditingAttack=false;editAttackIndex=-1;">
                            Back
                        </button>
                    </h3>
                     <div class="section attack-editor" v-if="isEditingAttack">

                            <div class="field">
                                <label>Attack Name</label>
                                <input v-model="cardData.attacks[editAttackIndex].name" placeholder="Slap" maxlength="20" required :class="{
                                            attention: cardData.attacks[editAttackIndex].name.length <= 0,
                                        }" />
                                <button type="button" class="inline-block" @click="setExampleAttack(editAttackIndex)">
                                    🎲
                                </button>
                            </div>

                            <div class="field">
                                <label>Attack Description</label>
                                <textarea @blur="previewCard" v-model.lazy="cardData.attacks[editAttackIndex].desc" maxlength="100" :placeholder="`${
                                            cardData.name || 'someone'
                                        } slaps the enemy dealing 10 damage!`" required />
                                </div>

                                <div class="field tags">
                                     <p v-if="tags.length === 0">Your attack's tags will show up here!</p>
                                     <p v-else>Attack Tags</p>
                                     <br>
                                     <br v-if="tags.length === 0">
                                     <transition-group name="fade" tag="p">
                                     <span @click="showLibrary(t)" v-for="(t,attackI) in tags(cardData.attacks[editAttackIndex])" :key="`tag-${attackI}`" class="selectable" :style="`background-color:${t.color};`">{{t.name}} {{t.emoji}}</span>
                                     </transition-group>
                                </div>
                                <br><br>
                                <div class="field">
                                    <button
                                        style="--type: var(--danger)"
                                        @click="isEditingAttack=false;cardData.attacks.splice(editAttackIndex, 1);editAttackIndex=-1;"
                                    >
                                        Remove Attack
                                    </button>
                                </div>
                        </div>
                </div>
        </section>
        <section class="section" v-else>
            <form @submit.prevent="publishCard">
                <div class="subsection">
                    <h3 class="bold">Card Stats</h3>

                    <div class="attack-form inline-fields">
                        <div class="field">
                            <label>Card Name</label>
                            <input v-model="cardData.name" :class="{
                                    attention: cardData.name.length <= 0,
                                }" placeholder="Lord of Darkness" maxlength="24" required />
                        </div>

                        <div class="field">
                            <label>Card Health</label>
                            <input v-model.number="cardData.health" type="number" placeholder="10" min="1"
                                @blur="previewCard" required />
                        </div>

                        <div class="field">
                            <label>Card Image URL</label>
                            <input v-model="cardData.imgURL" placeholder="link.jpg" required />
                        </div>
                    </div>
                </div>
                <div class="subsection">
                           <h3 class="bold">
                        Card Attacks
                        <button v-if="cardData.attacks.length < 2 && cardData.name" style="--type: var(--success)"
                            @click="
                                cardData.attacks.push({
                                    name: '',
                                    desc: '',
                                });
                                editAttackIndex = cardData.attacks.length -1;
                                isEditingAttack = true;
                            ">
                            Add Attack ⚔️
                        </button>
                    </h3>

                    <p v-if="cardData.attacks.length === 0 && cardData.name" class="field">
                        You have no attacks setup! Click "Add Attack"
                    </p>
                    <p v-else-if="!cardData.name" class="field">
                        Start creating a card by typing a name!
                    </p>
                    <div v-if="cardData.name">
                        <div class="attack-listing selectable" v-for="(a, i) in cardData.attacks" :key="`attackCardCreation-${i}`" @click="editAttack(i)" customsound>
                            <h4 class="h4" v-if="a.name.length > 0" >{{ a.name }}</h4>
                            <h4 class="h4 placeholder" v-else>No Name</h4>
                        </div>

                    </div>
                    </div>

                <div v-if="cardData.name" class="subsection">
                    <button type="submit" :style="`--type: var(--success);display: ${(isEditingAttack) ? 'none' : 'inline-block'}`">
                            Publish Card
                    </button>
                </div>
            </form>
        </section>
    </main>
</template>

<script lang="ts">
import Vue from "vue";
import Swal from "sweetalert2";
import connection from "~/services/connection";
import getExampleAttack from "~/services/exampleAttacks";
import audio from "~/services/audio";

interface ITag{
    name: string;
    emoji: string;
    type: string;
    color: string;
}

const emojiBindings = {
    damage: "⚔️",
    heal:"🩹",
    deaths:"💀",
    kills:"🏆",
    damage_in:"⬇️",
    damage_out:"⬆️",
    hand:"🎴",
    multiply:"✖️",
    add:"➕",
    subtract:"➖",
    divide:"➗"
}

const colorBindings = {
    attribute:"#34495e",
    operation:"#16a085",
    variable:"#d35400",

}


export default Vue.extend({
    middleware: "validateGamePhase",

    data() {
        return {
            editAttackIndex:-1,
            isEditingAttack:false,
            cardData: {
                name: "",
                health: 10,
                imgURL: "",
                attacks: [],
            } as IPreviewCard,
            acceptedCards: 0,
            currentCache: JSON.parse(
                localStorage.getItem("cachedCards") || "[]"
            ) as IPreviewCard[],
        };
    },
    mounted() {
        if (!connection.eventRegistered && connection.room) {
            this.cardData.health = (connection.state.resultsShown || 1) * 10;
            Swal.fire(
                "Creating Cards",
                "In this phase of the game, you can to create your own playing cards for your opponents to use. " +
                    "Each card can have up to 3 moves, which can heal you or damage an opponent. " +
                    "Make as many cards as you can, but be wise with your decisions, as your opponents are using your cards.",
                "info"
            );

            // connection.eventRegistered = true;

            connection.room.onMessage("previewCard", (card: IPreviewCard) => {
                this.cardData = card;
            });

            connection.room.onMessage("cardAccepted", () => {
                Swal.fire({
                    title: "Card Accepted!",
                    icon: "success",
                    toast: true,
                    position: "top-end",
                    timer:1500
                });

                this.acceptedCards++;

                if (this.currentCache.length >= 7) {
                    this.currentCache.shift();
                }

                const cache = JSON.parse(
                    (localStorage.getItem("cachedCards") as any) || "[]"
                );

                localStorage.setItem(
                    "cachedCards",
                    JSON.stringify([...cache, this.cardData])
                );

                this.currentCache = JSON.parse(
                    localStorage.getItem("cachedCards") || "[]"
                );

                this.cardData = {
                    name: "",
                    health: (connection.state.resultsShown || 1) * 10,
                    imgURL: "",
                    attacks: []
                };
            });
        }
    },
    methods: {
        tags(a:IAttack){
            let tags = [] as ITag[];
            const relevantAttributes = ["heal", "damage"]

            //Filter keys of attacks that are relevant
            const keys = (Object.entries(a).filter(([k, v]) => {
                return relevantAttributes.includes(k) && v > 0
            })).map(([k, v]) => {
                return {
                    name: k,
                    emoji: (emojiBindings as any)[k],
                    color: colorBindings.attribute,
                    type:"attribute"
                }
            })
            tags = tags.concat(keys)

            if (a.modifiers) {
                a.modifiers.forEach(m => {
                    tags.push({
                        name: m.action,
                        color: colorBindings.operation,
                        emoji: (emojiBindings as any)[m.action],
                        type:"operation"
                    })
                    tags.push({
                        name: `based on ${(m.subject === "you") ? "your" : "enemy's"} ${m.item}`,
                        color: colorBindings.variable,
                        emoji: (emojiBindings as any)[m.item],
                        type:"variable"
                    })
                })
            }



            tags = [...new Set(tags)]
            return tags
        },
        publishCard() {
            connection.room?.send("submitCard", this.cardData);
        },
        previewCard() {
            connection.room?.send("previewCard", this.cardData);
        },
        loadCard(card: IPreviewCard) {
            this.cardData = JSON.parse(JSON.stringify(card));
        },
        deleteCard(i: number) {
            this.currentCache.splice(i, 1);
            localStorage.setItem(
                "cachedCards",
                JSON.stringify(this.currentCache)
            );
        },
        setExampleAttack(i: number) {
            audio.random.play()
            Vue.set(
                this.cardData.attacks,
                i,
                getExampleAttack(
                    this.cardData.name,
                    connection.state.resultsShown
                )
            );
            this.previewCard();
        },
        showLibrary(type:ITag){
            connection.$emit("showLibrary",type.type,type.emoji)
        },
        attackPanelSfx(){
            audio.expand.play()
        },
        editAttack(i:number){
            this.attackPanelSfx()
            this.editAttackIndex = i
            this.isEditingAttack = true;
        }
    }
});
</script>

<style scoped>
main {
    display: flex;
    flex-direction: row;
    align-items: stretch;
}
main section {
    flex: 1;
    overflow-y: scroll;
    padding: 2rem 1rem;
}

.card-preview {
    text-align: center;
    padding: 1rem;
}

.card {
    margin: 1rem;
}

details {
    overflow: hidden;
}

details:first-of-type {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

details:last-of-type {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

details .section {
    background-color: var(--theme-dark);
}

.card-preview summary {
    background: var(--theme-dark);
    padding: 1rem;
    text-align: left;
}

.card {
    text-align: left;
    display: inline-block;
}

.previous-card {
    padding: 1rem;
    display: flex;
    align-items: center;
}

.previous-card .button-group {
    margin-left: auto;
}

@media only screen and (max-width: 1100px) {
    main {
        flex-direction: column;
    }
    main section {
        flex: none;
    }
}

.subsection {
    margin: 2rem 0.5rem;
}

h3 {
    display: flex;
    align-items: center;
}

h3 * {
    margin: 0 1rem;
}

.attack-listing{
    background-color: var(--theme-dark);
    padding: 1rem 2rem;
    margin: 1rem 0;
    border-radius: 10px;
    transition: border 0.15s ease-in-out;
    border: 2px transparent solid;
}
.attack-listing:hover{
    border-color: var(--light);
}
.attack-listing:first-of-type {
    margin-top: 2rem;
}

.attack-listing:last-of-type {
    margin-bottom: 2rem;
}

.inline-block {
    display: inline-block;
}

.cost {
    padding: 0.5rem 0;
    background-color: var(--theme-dark);
}

.cost b {
    background-color: var(--success);
    color: var(--light);
    padding: 0px 0.5rem;
}

.attention {
    border: solid 3px var(--secondary);
}

.placeholder {
    color: gray;
    font-style: italic;
}

.tags span{
    color:white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    background-color:var(--secondary);
    white-space: nowrap;
    display: inline-block;
}



</style>
