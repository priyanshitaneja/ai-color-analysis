import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'mediapipe': ['@mediapipe/face_mesh', '@mediapipe/camera_utils'],
          'html2canvas': ['html2canvas'],
        },
      },
    },
  },
})
