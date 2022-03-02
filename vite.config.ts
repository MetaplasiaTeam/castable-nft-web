import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@page': resolve(__dirname, 'src/page'),
      '@img': resolve(__dirname, 'src/assets/img'),
      stream: 'stream-browserify',
      process: 'process/browser',
      zlib: 'browserify-zlib',
      util: 'util',
    },
  },
  base: './',
  server: {
    port: 3000,
  },
  define: {
    'process.env.BASE_URL': '"/"',
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      exclude: [
        'node_modules/lodash-es/**',
        'node_modules/@types/lodash-es/**',
      ],
    },
    rollupOptions: {
      // @ts-ignore
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
      },
    },
  },
})
