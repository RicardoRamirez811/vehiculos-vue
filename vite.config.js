// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/apiVehiculo': {
        target: 'https://pruebas.somee.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apiVehiculo/, '')
      }
    }
  }
})
