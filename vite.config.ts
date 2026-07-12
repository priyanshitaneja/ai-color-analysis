import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export const mediapipeCopyTargets = [
  {
    src: 'node_modules/@mediapipe/face_mesh/face_mesh_solution_*',
    dest: 'mediapipe',
    rename: { stripBase: true as const },
  },
  {
    src: 'node_modules/@mediapipe/face_mesh/face_mesh.binarypb',
    dest: 'mediapipe',
    rename: { stripBase: true as const },
  },
]

export default defineConfig({
  plugins: [react(), tailwindcss(), viteStaticCopy({ targets: mediapipeCopyTargets })],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('@mediapipe')) return 'mediapipe';
        },
      },
    },
  },
  ssr: {
    noExternal: ['framer-motion'],
  },
})
