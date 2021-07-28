<template>
    <div id="root">
        <AppHeader />
        <ClockBar />
        <AttackLibrary />
        <CardOverlay />
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

.page-enter-active,
.page-leave-active {
    transition: opacity 0.5s;
}
.page-enter,
.page-leave-active {
    opacity: 0;
}
</style>
