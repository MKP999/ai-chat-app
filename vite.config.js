import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
      customCollections: {
        'custom': FileSystemIconLoader('./src/assets/icons')
      },
      scale: 1.2,
      defaultClass: 'inline-icon',
    }),
    Components({
      resolvers: [
        IconsResolver({
          prefix: 'icon',
          enabledCollections: ['mdi', 'carbon']
        })
      ],
      dts: true
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
}) 