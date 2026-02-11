import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('@mediapipe')) return 'mediapipe';
          if (id.includes('html2canvas')) return 'html2canvas';
        },
      },
    },
  },
  ssr: {
    noExternal: ['framer-motion'],
  },
})
