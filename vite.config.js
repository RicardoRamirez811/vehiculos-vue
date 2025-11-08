// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],

  // Producción (GitHub Pages)
  base: '/vehiculos-vue/',
  build: { outDir: 'docs' },

  // Desarrollo (Vite dev server)
  server: {
    proxy: {
      '/apiVehiculo': {
        // En dev, Vite reenviará /apiVehiculo/... al host real
        target: 'https://pruebas.somee.com', // o https si tu API lo soporta
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apiVehiculo/, '')
      }
    }
  }
}))
