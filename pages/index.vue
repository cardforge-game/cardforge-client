<template>
    <main>
        <portal to="header">
            <div class="button-group">
                <button
                    style="--type: var(--success)"
                    @click="initGame('createGame')"
                >
                    Start Game
                </button>
                <button
                    style="--type: var(--primary)"
                    @click="initGame('joinGame')"
                >
                    Join Game
                </button>
            </div>
        </portal>

        <section class="container level hero">
            <div class="level-item">
                <img src="~/assets/images/logo.png" />
                <p class="lead bold">
                    An AI-powered card game where infinite creativity is in your
                    hand.
                </p>
            </div>
            <div class="level-item">
                <img src="~/assets/images/cards.svg" />
            </div>
        </section>

        <section class="container game-buttons">
            <div class="hero-section-2-small" style="padding-bottom: 0px">
                <h5 style="color: white">
                    Start a game by creating a room, or enter someone else's
                    room with their join code!
                </h5>
            </div>
            <div class="hero-section-2-small">
                <div class="button-group">
                    <button
                        class="h5"
                        style="--type: var(--success)"
                        @click="initGame('createGame')"
                    >
                        Start Game
                    </button>
                    <button
                        class="h5"
                        style="--type: var(--primary)"
                        @click="initGame('joinGame')"
                    >
                        Join Game
                    </button>
                </div>
            </div>
        </section>

        <section class="container instructions">
            <h1 class="bold">How to Play</h1>

            <div class="text-grid">
                <h4>Joining a Game Room</h4>

                <div class="content">
                    To create a game room, you can click the
                    <a
                        class="bold selectable"
                        style="color: var(--primary-dark)"
                        @click="initGame('createGame')"
                    >
                        Start Game
                    </a>
                    button above. If someone else has started a game, you can
                    join them using their code by clicking the
                    <a
                        class="bold selectable"
                        style="color: var(--success-dark)"
                        @click="initGame('joinGame')"
                    >
                        Join Game
                    </a>
                    button above.
                </div>

                <h4>Phase 1: Creation</h4>

                <div class="content">
                    During the creation phase, you can design and build your own
                    cards. A card has a custom image, health value, and attacks.
                    Simply describe each attack, and our artifical intelligence
                    system will create a corresponding card, almost magically.
                </div>

                <h4>Phase 2: Deck Building</h4>

                <div class="content">
                    Build your game deck using the cards your opponents have
                    created. This is your inventory of cards. From your
                    inventory, you can choose up to 8 cards to bring into
                    battle. This is your deck. Choose a deck wisely, as you
                    cannot change it during a round!
                </div>

                <h4>Phase 3: Fighting</h4>

                <div class="content">
                    During the fight, choose an active card to play with. Using
                    this card, you can deal damage to other cards and heal
                    yourself during your turn. Your goal is to knock out as many
                    players as you can while keeping you characters at a high
                    health! When you are knocked out, you may substitute in
                    another card from your deck.
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
main {
    padding: 0 calc(calc(100vw - 2250px) / 2);
}

.hero.level {
    align-items: center;
}

.hero .level-item {
    margin: 1rem;
}

.hero .level-item:first-of-type {
    text-align: right;
}

.hero img {
    max-height: 50vh;
    max-width: 30vw;
}

.game-buttons {
    padding: 1rem;

    background: var(--dark);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);

    text-align: center;

    border-radius: 20px;
}

.game-buttons > div {
    margin: 1rem 0;
}

.instructions {
    text-align: center;

    margin-top: 2rem;

    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);

    border-radius: 20px;

    overflow: hidden;
}

.instructions h1 {
    padding: 1rem;

    background: var(--dark-primary);

    color: var(--light);
}

.instructions .text-grid {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
}

.instructions .text-grid > * {
    padding: 1rem;
}

.instructions .text-grid h4 {
    background: var(--primary);

    color: var(--light);
    font-weight: bold;
    text-align: right;
}

.instructions .text-grid .content {
    background: var(--light-primary);

    text-align: left;
}
</style>
