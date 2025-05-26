import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy cho API endpoints
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '') // Xoá prefix /api
      },
      // Proxy cho static files (hình ảnh upload)
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      // Proxy cho Cloudinary (nếu dùng)
      '/cloudinary': {
        target: 'https://res.cloudinary.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/cloudinary/, '')
      }
    }
  },
  build: {
    // Thêm cấu hình assets để fix đường dẫn hình ảnh production
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})