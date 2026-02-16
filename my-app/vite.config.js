import { defineConfig } from "vite"; // Add this import
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173, // Default Vite port is usually 5173; 5000 is common for backends
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Point this to your actual backend port
        changeOrigin: true,
      },
    },
  },
});
