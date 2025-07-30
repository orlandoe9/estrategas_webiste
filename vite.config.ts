import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Replace with your GitHub repo name if deploying to a subdirectory
const repoName = 'estrategas_website'; // e.g., "portfolio" or "vite-project"

export default defineConfig(({ mode }) => ({
  base: `/${repoName}/`, // <-- Important for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
