import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [
    react(),
    // mkcert({
    //   domains: [''],
    // }),
  ],
  server: {
    host: '0.0.0.0',
    // https: true,
  },
})
