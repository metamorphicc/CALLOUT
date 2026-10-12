import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: { include: ['react', 'react-dom/client', 'motion/react'] },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
})
