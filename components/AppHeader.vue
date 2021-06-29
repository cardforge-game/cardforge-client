<template>
    <header>
        <a href="http://localhost:3000/"><img src="~/assets/images/logo-header.png" /></a>

        <div class="right-side">
            <portal-target name="header"></portal-target>
        </div>
    </header>
</template>

<style scoped>
header {
    padding: 1rem;
    background: var(--dark);
    display: flex;
    align-items: center;
}

.h5 {
    color: var(--light);
}

.right-side {
    margin-left: auto;
}

img {
    height: 3.25rem;
}
</style>
