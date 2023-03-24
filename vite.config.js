import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	base: "https://github.com/Smayan-n/pathfinding-visualizer/tree/gh-pages",
	plugins: [react()],
});
