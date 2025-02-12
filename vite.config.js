import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

import { svgBuilder } from './src/assets/icon/svgBuilder'

export default defineConfig({
  publicPath: '/',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/node_modules/vue/')) return 'vendor-vue'
            if (id.includes('/node_modules/vue-router/')) return 'vendor-vue-router'
            if (id.includes('/node_modules/element-plus/es/components')) {
              return 'vendor-element-components'
            }
            if (id.includes('/node_modules/element-plus/es/icon')) {
              return 'vendor-element-icons'
            }
            if (id.includes('/node_modules/highlight')) {
              return 'vendor-highlight'
            }
            return 'vendor-others'
          }
        },
      },
    },
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    svgBuilder('./src/assets/icon/svg/'),
    viteCompression({ algorithm: 'brotliCompress' }),
    visualizer({ open: true }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // '@': resolve(__dirname, './src'),
    },
  },
})
