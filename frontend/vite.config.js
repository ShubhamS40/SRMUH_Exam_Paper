import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
// vite.config.js

  server: {
    port: 4000,  // Port set karna
    host: '0.0.0.0',  // Host ko 0.0.0.0 pe set karna
  },

})

