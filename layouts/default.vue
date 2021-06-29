<template>
    <div id="root">
        <AppHeader />
        <ClockBar />
        <Nuxt />
    </div>
</template>

<style scoped>
#root {
    width: 100%;
    height: 100vh;

    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
    overflow-y: auto;
}
</style>
