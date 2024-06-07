import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    root: 'src',
    plugins: [
            vue(),
            libInjectCss(),
        ],
    build: {
        rollupOptions: {
            external: [],
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            },
        },
        outDir: '../../suidouble.github.io/vue-sui', // relative to .root ^
    },
});