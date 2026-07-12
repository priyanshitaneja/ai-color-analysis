import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  define: {
    'import.meta.env.VITE_BUILD_TARGET': '"extension"',
  },
  build: {
    outDir: 'dist-extension/content',
    emptyOutDir: false,
    lib: {
      entry: 'src/extension/content/badges.ts',
      formats: ['iife'],
      name: 'caBadges',
      fileName: () => 'badges.js',
    },
  },
})
