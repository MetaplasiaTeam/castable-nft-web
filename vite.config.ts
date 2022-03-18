import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import inject from '@rollup/plugin-inject'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      includeAssets: ['logo.svg'],
      manifest: false,
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts 静态资源缓存
            handler: 'CacheFirst',
            options: {
              cacheName: 'js-css-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
            },
          },
        ],
      },
    }),
    //viteCompression()
  ],
  assetsInclude: ['src/assets/*'],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@page': resolve(__dirname, 'src/page'),
      '/img': resolve(__dirname, 'src/assets/img'),
      stream: 'stream-browserify',
      process: 'process/browser',
      zlib: 'browserify-zlib',
      util: 'util',
    },
  },
  optimizeDeps: {
    exclude: ['@fortawesome/fontawesome-free'],
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
      exclude: ['node_modules/lodash-es/**'],
    },
    rollupOptions: {
      // @ts-ignore
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
      output: {
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     return id
        //       .toString()
        //       .split('node_modules/')[1]
        //       .split('/')[0]
        //       .toString()
        //   }
        // },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .includes('naive-ui')
            ) {
              return 'naive-ui'
            } else {
              return 'vendor'
            }
          }
        },
      },
    },
  },
})
