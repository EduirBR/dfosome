import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'DFO_'],
    server: {
      proxy: {
        '/df': {
          target: 'https://api.dfoneople.com',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('apikey', env.DFO_API_KEY)
            })
          },
        },
      },
    },
  }
})