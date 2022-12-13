import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import envJson from './env.json'
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': envJson
  },
  plugins: [vue()]
})
