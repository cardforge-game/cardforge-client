<template>
    <div
        :class="{
            card: true,
            'interactive-card': isInteractive,
            damaged: damaged,
            healed: healed,
        }"
        :style="cardStyles"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
        <!-- Shows # Damaged/Healed etc... -->
        <span v-if="indicatorText" class="indicator h1">{{
            indicatorText
        }}</span>
        <header>
            <transition name="slide-up">
                <h1
                    v-if="card.name"
                    class="card-title"
                    :style="`
                    font-size: max(${1.25 * size}px, ${
                        showDetails ? 1.5 : 1.25
                    }rem);`"
                >
                    {{ card.name }}
                </h1>
            </transition>

            <span class="card-health">
                <b class="small">HP</b>
                <span :class="graphicOnly ? '' : 'h6'">
                    {{ card.health > 0 ? card.health : 0 }}
                </span>
            </span>
        </header>
        <div class="card-content-container">
            <section v-if="!graphicOnly" class="card-content">
                <div class="attack-container">
                    <div v-for="(a, i) in card.attacks" :key="`attk-${i}`" class="attack"
                        :style="isInteractive ? `width: ${1.2 * size}rem` : ''"
                        @click="isInteractive && onAttackTrigger(a, i)">
                        <div>
                            <p class="outline" :style="`font-size: max(${size}px, 1rem);`">
                                {{ a.name }}
                            </p>
                            <small v-if="showDetails" :style="`font-size: max(${
                                0.6 * size
                            }px,  0.75rem);`" class="attack-desc">
                                {{
                                a.desc.length > 100
                                    ? `${a.desc.substring(0, 100)}...`
                                    : a.desc
                            }}
                            </small>
                        </div>
                        <div class="outline attack-stats">
                            <p v-if="a.damage">{{ a.damage }}⚔️<span v-if="a.modifiers">{{(a.modifiers.find(atk=>atk.modifyingAttribute === "damage")) ? "+" : ""}}</span></p>
                            <p v-if="a.heal" class="attackStat">{{ a.heal }}🩹<span v-if="a.modifiers">{{(a.modifiers.find(atk=>atk.modifyingAttribute === "heal")) ? "+" : ""}}</span></p>
                        </div>

                        <hr />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import Swal from "sweetalert2";
import Vue, { PropType } from "vue";

export default Vue.extend({
    props: {
        size: {
            type: Number,
        },
        card: {
            type: Object as PropType<ICard>,
            required: true,
        },
        rotation: {
            type: Number,
            default: 0,
        },
        graphicOnly: {
            type: Boolean,
            default: false,
        },
        shadow: {
            type: Boolean,
            default: true,
        },
        showDetails: {
            type: Boolean,
            default: false,
        },
        customStyle: {
            type: String,
            default: "",
        },
        isInteractive: {
            type: Boolean,
            default: false,
        },
        damaged: {
            type: Boolean,
            default: false,
        },
        healed: {
            type: Boolean,
            default: false,
        },
        indicatorText: {
            type: String,
            default: null,
        },
    },
    computed: {
        cardStyles() {
            return `
                width: ${this.size}rem;
                height: ${(this.size * 4) / 3}rem;
                background-image: ${
                    this.graphicOnly
                        ? "linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)),"
                        : "linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),"
                } url(${this.card.imgURL});
                ${this.rotation !== 0 ? `--rotate: ${this.rotation}deg;` : ""}
                ${
                    this.shadow
                        ? "box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);"
                        : ""
                }
                ${this.customStyle}
            `.replace(/\n/g, " ");
        },
    },
    methods: {
        handleClick() {
            this.$emit("click");
        },
        handleMouseEnter() {
            this.$emit("mouseenter");
        },
        handleMouseLeave() {
            this.$emit("mouseleave");
        },
        showAttackDetails(i: number) {
            Swal.fire(
                this.card.attacks[i].name,
                this.card.attacks[i].desc,
                "info"
            );
        },
        onAttackTrigger(attack: IAttack, index: number) {
            this.$emit("onAttackTrigger", attack, index);
        },
    },
});
</script>
<!-- Card Formating/Positions -->
<style>
.card-sidebar{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height:100%;
}
.attack-stats {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.attack-stats p {
    font-size: 80%;
    white-space: nowrap;
    font-weight: bold;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.attack-desc {
    text-overflow: ellipsis;
}

.attack {
    display: grid;
    gap: 1em;
    grid-template-columns: 4fr 1fr;
}

.interactive-card .attack-stats {
    align-items: flex-end;
}

.interactive-card .attack-stats p {
    font-size: 100%;
}

.interactive-card .card-content {
    margin: 0;
    margin-top: 3rem;
}

.interactive-card .attack-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.interactive-card .attack {
    cursor: pointer;
    box-shadow: 0 -5px 20px rgba(1, 9, 32, 0.5);
    transition: background 0.25s ease-in-out;
    padding: 0.75rem;
    margin: 1rem 0;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.8);
    border: 2px transparent solid;
    transition: transform 0.25s ease-in-out;
}

.interactive-card .attack:hover {
    transform: scale(1.25);
}

.attack-container {
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
    margin-right: 1rem;
    height: 175%;
    justify-content: space-evenly;
}

.outline {
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
        1px 1px 0 #000;
}

header {
    display: flex;
    min-width: 100%;
    height:10%;
    align-items: flex-start;
}

.card-health {
    text-align: right;

    margin-left: auto;
    padding: calc(0.375rem - 1px) calc(0.25rem - 1px);

    border-radius: 0 10px 0 10px;

    position: relative;
    float:right;

    background: var(--success);
}

.card-health * {
    color: white;
}

.card-content {
    margin-top: 4rem;
    margin-bottom: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
    padding: 2rem 0;
}

.card-content * {
    color: var(--light);
}

.card-title {
    overflow: hidden;

    color: var(--light);
    font-weight: bold;
    font-size: 140%;

    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
        1px 1px 0 #000;

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    margin-left: 0.5rem;
    margin-top: 0.25rem;
}

.card {
    min-width: 100px;
    min-height: 140px;

    border-radius: 10px;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    --rotate: 0deg;
    transform: rotate(var(--rotate));
    transition: border 0.5s ease-in-out, transform 0.25s ease-in-out;
}

.card-content-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80%;
}

hr {
    border: none;
    border-top: 1px white solid;
}
</style>
<!-- Card Effects -->
<style>
/* DAMAGE */
@keyframes damage {
    0% {
        transform: rotate(var(--rotate)) translateX(50px);
        border: 5px solid var(--danger);
    }
    12.5% {
        transform: rotate(var(--rotate)) translateX(-50px);
    }
    37.5% {
        transform: rotate(var(--rotate)) translateX(40px);
    }
    50% {
        transform: rotate(var(--rotate)) translateX(-40px);
        border: 5px solid var(--danger);
        background-image: linear-gradient(#ff7675, #ff7675, #ff7675);
    }
    62.5% {
        transform: rotate(var(--rotate)) translateX(30px);
    }
    75% {
        transform: rotate(var(--rotate)) translateX(-20px);
    }
    87.5% {
        transform: rotate(var(--rotate)) translateX(20px);
    }
    100% {
        transform: rotate(var(--rotate)) translateX(0px);
    }
}
.damaged {
    animation: damage 0.6s ease;
}

/* HEAL */
@keyframes heal {
    10% {
        transform: rotate(var(--rotate)) scaleX(0.5) scaleY(0.7);
        border: 5px solid #55efc4;
    }
    40% {
        transform: rotate(var(--rotate)) scale(1.3);
        border: 5px solid #55efc4;
        background-image: linear-gradient(#55efc4, #55efc4, #55efc4);
    }
    80% {
        transform: rotate(var(--rotate)) scale(1);
        border: 5px solid #949796;
    }
}
.healed {
    animation: heal 1s ease-in-out;
}

/* Damage etc.. indicator */
@keyframes float-up {
    0% {
        opacity: 0;
        transform: translateY(100px);
    }
    40% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: translateY(-100px);
    }
}
.indicator {
    animation: float-up 2s ease forwards;
    position: absolute;
    color: white;
    font-weight: bold;
    left: 30%;
}
</style>
