<template>
    <div
        :class="`card ${isInteractive ? 'interactive-card' : ''}`"
        :style="cardStyles"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
    >
        <header>
            <h1
                class="card-title"
                :style="`
                    font-size: max(${1.25 * size}px, ${
                    showDetails ? 1.5 : 1.25
                }rem);`"
            >
                {{ card.name }}
            </h1>

            <span class="card-health">
                <b class="small">HP</b>
                <span :class="graphicOnly ? '' : 'h6'">
                    {{ card.health }}
                </span>
            </span>
        </header>

        <div v-if="!graphicOnly" class="card-content">
            <div class="attack-container">
                <div
                    v-for="(a, i) in card.attacks"
                    :key="`attk-${i}`"
                    class="attack"
                    :style="isInteractive ? `width: ${1.2 * size}rem` : ''"
                    @click="isInteractive && onAttackTrigger(a, i)"
                >
                    <div>
                        <p
                            class="outline"
                            :style="`font-size: max(${size}px, 1rem);`"
                        >
                            {{ a.name }}
                        </p>
                        <small
                            v-if="showDetails"
                            :style="`font-size: max(${
                                0.6 * size
                            }px,  0.75rem);`"
                            class="attack-desc"
                        >
                            {{
                                a.desc.length > 30
                                    ? `${a.desc.substring(0, 90)}...`
                                    : a.desc
                            }}
                        </small>
                    </div>
                    <div class="outline attack-stats">
                        <p v-if="a.damage">{{ a.damage }}⚔️</p>
                        <p v-if="a.heal" class="attackStat">{{ a.heal }}🩹</p>
                    </div>

                    <hr />
                </div>
            </div>
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
            required: true,
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
                        ? "box-shadow: 0 -5px 20px rgba(1, 9, 32, 0.5);"
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

<style>
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
    border: 2px var(--light) solid;
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
    height: 100%;
    justify-content: space-evenly;
}

.outline {
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
        1px 1px 0 #000;
}

header {
    display: flex;
    align-items: flex-start;
}

.card-health {
    text-align: right;

    margin-left: auto;
    padding: calc(0.375rem - 1px) calc(0.25rem - 1px);

    border-radius: 0 10px 0 10px;
    border-right: 2px var(--light) solid;
    border-top: 2px var(--light) solid;

    position: relative;
    bottom: 2px;
    left: 2px;

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
    display: flex;
    flex-direction: column;

    min-width: 100px;
    min-height: 140px;

    border-radius: 10px;
    border: 2px solid var(--light);

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    --rotate: 0deg;
    transform: rotate(var(--rotate));

    transition: all 0.5s ease-in-out;
}

hr {
    border: none;
    border-top: 1px white solid;
}
</style>
