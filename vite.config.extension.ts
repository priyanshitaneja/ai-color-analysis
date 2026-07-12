import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { mediapipeCopyTargets } from './vite.config'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        ...mediapipeCopyTargets,
        { src: 'extension/manifest.json', dest: '.', rename: { stripBase: true as const } },
        { src: 'extension/background.js', dest: '.', rename: { stripBase: true as const } },
        { src: 'extension/icons/*', dest: 'icons', rename: { stripBase: true as const } },
      ],
    }),
  ],
  define: {
    'import.meta.env.VITE_BUILD_TARGET': '"extension"',
  },
  build: {
    outDir: 'dist-extension',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('@mediapipe')) return 'mediapipe';
        },
      },
    },
  },
})
