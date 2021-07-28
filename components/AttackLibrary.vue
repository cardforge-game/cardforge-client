<template>
    <div class="library-container" v-if="show">
        <div class="library">
            <div class="library-header">
                <span class="bold h1">Attack Library 📚</span>
                <span class="close" @click="show=false">X</span>
            </div>
            <br>
            <div class="library-content">
                <section class="sidebar">
                    <a v-for="(e,i) in entries" :key="`entry-${i}`" @click="setPage(e.name)">{{e.name}}</a>
                </section>
                <article class="entry" v-if="page">
                    <h3 class="bold h3">{{page.name}}</h3>
                    <pre>
                    <p>{{page.description}}</p>
                    </pre>
                    <br><br>
                    <h5 class="h5">Examples of {{page.name.split(" ")[0]}}</h5>
                    <span @click="copy(ex)" class="example" v-for="(ex,i) in page.examples" :key="`example-${i}`">
                        {{ex}}
                    </span>
                </article>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Swal from "sweetalert2";
import connection from "~/services/connection";

interface IEntry{
    name:string;
    description:string;
    examples:string[];
} 
const attributeEntries = JSON.parse(`[
    {
        "name":"Damage ⚔️",
        "description":"Damage removes health from the enemy card.\\nIf you make their health 0, you earn 2 points.",
        "examples":["Deal 20 damage","Remove 10 health","Strike the enemy to inflict 50 damage"]
    },
    {
        "name":"Heal 🩹",
        "description":"Healing adds health to the card that uses it.",
        "examples":["Heal 20 health","Heal for 30 health","Relax in the shade and restore 50 health"]
    }
]`) as IEntry[]

const actionEntries = JSON.parse(`[
    {
        "name":"Add ➕",
        "description":"This will combine a base number with a variable",
        "examples":["Deal 2 damage plus the ____","Heal 2 health plus the ____","This deals 50 damage plus the ____"]
    },
    {
        "name":"Subtract ➖",
        "description":"Removes a base number with a variable",
        "examples":["Deal 2 damage minus the ____","Heal 5 health minus the ____","This deals 50 damage minus the ____"]
    },
    {
        "name":"Multiply ✖️",
        "description":"Multiplies a base number with a variable",
        "examples":["Deal 2 damage for each ____","Heal 5 health times ____","This deals 50 damage per ____"]
},
{
        "name":"Divide ➗",
        "description":"Divides a base number with a variable",
        "examples":["Deal 2 damage divided by ____","Heal 5 health divided by ____","This deals 50 damage divided by____"]
}
]`) as IEntry[]

const itemEntries = JSON.parse(`[
   {
        "name":"You 💪",
        "description":"Refers to your stats during combat",
        "examples":["Your ____  ","The user's ____"]
},
{
        "name":"Enemy 🎯",
        "description":"Refers to the enemy/enemy card's stats",
        "examples":["The target's ____","The opponent's ____","The foe's ____"]
},
{
        "name":"Hand 🎴",
        "description":"Refers to the count of someone's hand (max is 6)",
        "examples":["Each of your cards","The opponent's hand","Your hand"]
},
{
        "name":"Deaths 💀",
        "description":"Refers to the count of cards a player lost",
        "examples":["Each of your deaths","The opponent's deaths","Your losses"]
},
{
        "name":"Kills 🏆",
        "description":"Refers to the count of cards a player knocked out",
        "examples":["Each of your kills","The opponent's knock outs","Your wins"]
},
{
        "name":"Damage_in ⬇️",
        "description":"Refers to the last damage a card took",
        "examples":["the last damage taken by you","enemy's last damage taken","the last damage you tanked"]
},
{
        "name":"Damage_out ⬆️",
        "description":"Refers to the last damage a card inflicted",
        "examples":["the last damage inflicted by you","enemy's last damage inflicted","the last damage you inflicted"]
}
]`) as IEntry[]

import Vue from 'vue'
export default Vue.extend({
    data(){
        return{
            mode:"attribute",
            page:undefined as IEntry | undefined,
            show:false
        }
    },
    computed: {
        entries(){
            switch((this as any).mode){
                case "attribute":
                    return attributeEntries
                case "operation":
                    return actionEntries
                case "variable":
                    return itemEntries
                
            }
        }
    },
    methods: {
        setPage(name: string) {
            this.page = (this as any).entries.find((e: IEntry) => e.name === name)
        },
        copy(text: string) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'Successfully' : 'Unsuccessfully';
                Swal.fire({
                    toast: true,
                    text: `${msg} copied`,
                    position: 'top-end',
                    timer:1500
                })
            } catch (err) {
                Swal.fire({
                    toast: true,
                    text: `Failed to copy`,
                    timer:1500
                })
            }

            document.body.removeChild(textArea);
        }
    },
    mounted() {
            connection.$on('showLibrary',(type:string,emojiPage:string)=>{
                console.log(emojiPage)
                this.mode = type;
                this.page = (this as any).entries.find((e:IEntry)=>e.name.includes(emojiPage));
                this.show = true;
            })
    },
})
</script>

<style scoped>
@keyframes fadeInLib{
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
}
.library-container{
    animation: fadeInLib 0.1s ease-in-out;
    width:100vw;
    height:100vh;
    position:absolute;
    z-index: 3;
    display:flex;
    justify-content: center;
    align-items: center;
}
.library{
    background-color:var(--light);
    padding:1rem 1rem;
    min-width: 70vw;
    height: 70vh;
    box-shadow: 0 19px 38px rgba(0,0,0,0.10), 0 15px 12px rgba(0,0,0,0.02);
    
}
.library-content{
    height: 80%;
    display:grid;
    grid-template-columns: 1fr 5fr;
}
.sidebar{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
.sidebar a{
    padding: 1rem 3rem;
    background-color: #FAF9FE;
    color: var(--dark);
    text-align: center;
    border-radius:10px;
    font-weight:bold;
    cursor: pointer;
    transition:background-color 0.25s ease-in-out, color 0.25s ease-in-out;
}

.sidebar a:hover{
    background-color: var(--primary);
    color:white;
}

.entry{
    text-align: center;
}

.example {
    padding: 0.65rem 0.65rem;
    display: inline-block;
    margin: 2rem 0.5rem;
    transition: box-shadow 0.2s ease-in-out;
    color:white;
    background-color: var(--secondary);
    cursor:copy;
    border: 2px solid transparent;
    transition: border 0.2s ease-in-out;
}

.example:hover{
    border: 2px solid var(--theme);
}

.close{
    color: rgb(187, 171, 171);
    cursor: pointer;
    font-size: 2rem;
    font-weight: 100;
}

.library-header{
    display: flex;
    justify-content: space-between;
}

@media only screen and (max-width: 768px) {
    .library-content {
        grid-template-rows: 1fr 5fr;
        grid-template-columns: 1fr;
    }
    .sidebar{
        display: flex;
        flex-direction: row;
        margin-bottom:2rem;
    }
}
</style>