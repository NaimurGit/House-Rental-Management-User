import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_")

  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE_PATH || "/",
  }
})
