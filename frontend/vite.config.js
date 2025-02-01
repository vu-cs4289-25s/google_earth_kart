import { defineConfig } from "vite";

export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3001", // API requests forwarded to Express
                changeOrigin: true, // for cross-origin requests
            },
        },
    },
});
