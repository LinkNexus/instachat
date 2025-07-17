import {defineConfig} from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import process from "node:process";
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    symfonyPlugin(),
    react()
  ],
  build: {
    rollupOptions: {
      input: {
        app: "./assets/index.tsx"
      },
    }
  },
  server: {
    host: "0.0.0.0",
    cors: {
      origin: process.env.SITE_NAME,
      credentials: true
    },
    hmr: {
      host: new URL(process.env.SITE_NAME).hostname,
    }
  }
});
