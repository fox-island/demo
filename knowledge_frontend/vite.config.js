import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080, // 前端自己的端口
    proxy: {
      '/api': {             // 只要遇到以 /api 开头的请求
        target: 'http://localhost:3000', // 就转发给 Node.js 后端的 3000 端口
        changeOrigin: true, // 允许跨域
      }
    }
  }
})
