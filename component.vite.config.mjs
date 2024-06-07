import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
            vue(),
            libInjectCss(),
        ],
    build: {
        lib: {
            // src/indext.ts is where we have exported the component(s)
            entry: resolve(__dirname, "src/vue-sui/index.js"),
            name: "VueSui",
            // the name of the output files when the build is run
            fileName: "vue-sui",
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ["vue", "suidouble"],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: "Vue",
                    suidouble: "Suidouble",
                },
            },
            makeAbsoluteExternalsRelative: true,
        },
    },
});