import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  server:
    command === "serve"
      ? {
          proxy: {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
            },
            "/images": {
              target: "http://localhost:3000",
              changeOrigin: true,
            },
          },
        }
      : undefined,
}));
