import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig(() => {
  // Check if .env or .env.local exists in frontend directory; fallback to root workspace directory
  const currentDir = import.meta.dirname || path.resolve('.')
  const hasFrontendEnv =
    fs.existsSync(path.resolve(currentDir, '.env')) ||
    fs.existsSync(path.resolve(currentDir, '.env.local'))
  const envDir = hasFrontendEnv ? currentDir : path.resolve(currentDir, '..')

  return {
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(currentDir, './src'),
      },
    },
    envDir,
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor'
              }
              if (id.includes('firebase')) {
                return 'firebase'
              }
              if (id.includes('lucide-react')) {
                return 'icons'
              }
              return 'deps'
            }
          },
        },
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      proxy: {
        '/api': {
          target: process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  }
})

