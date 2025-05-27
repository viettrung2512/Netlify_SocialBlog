import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // Chỉ hoạt động trong môi trường development
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/uploads': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        },
        '/cloudinary': {
          target: 'https://res.cloudinary.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/cloudinary/, '')
        }
      }
    },
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      }
    }
  };
});
