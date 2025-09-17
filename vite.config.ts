import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // allows access from LAN/mobile
  },
  base: '/PROJECT-SEGRO/', // 👈 important for GitHub Pages, must match repo name
});
