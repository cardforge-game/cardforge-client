<template>
    <div id="root">
        <AppHeader />
        <ClockBar />
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

<script>
import audio from "~/services/audio"

export default {
    mounted() {
        //UI interactions SFX
        document.addEventListener("mouseover",(e) => {
            if(e.target.tagName === "BUTTON" || ( e.target.classList && e.target.classList.contains("selectable"))) audio.uiHover.play()
        });

        document.addEventListener("click",(e) => {
            if((e.target.tagName === "BUTTON" ||( e.target.classList && e.target.classList.contains("selectable"))) && !e.target.getAttribute("customsound")) audio.click.play()
        })

    }
}
</script>