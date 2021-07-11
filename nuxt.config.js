export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Target: https://go.nuxtjs.dev/config-target
    target: "static",

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: "CardFlow",
        htmlAttrs: {
            lang: "en",
        },
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                hid: "description",
                name: "description",
                content:
                    "An AI-powered card game where infinite creativity is in your hand.",
            },
            {
                hid: "og:title",
                name: "og:title",
                content: "CardForge",
            },
            {
                hid: "og:image",
                property: "og:image",
                content: "/logo.png",
            },
            {
                hid: "og:description",
                property: "og:description",
                content:
                    "An online party card battling game where the players make the cards!",
            },
            { name: "format-detection", content: "telephone=no" },
        ],
        link: [
            { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
            },
        ],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ["~/assets/css/main.css"],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ["~/plugins/PortalVue.ts","~/plugins/Charts.ts"],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        "@nuxt/typescript-build",
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},

    // Environment Variables:
    env: {
        SERVER_ENDPOINT:
            process.env.NODE_ENV === "production"
                ? "wss://cardforge-server.herokuapp.com/"
                : "ws://localhost:8080",
    },

    generate: {
        fallback: true,
    },
};
