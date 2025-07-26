import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    react(),
    tailwindcss()

  ],

 server: {
    // This setting allows Vite to accept requests from your ngrok URL.
    allowedHosts: [
      '3e8f57363c08.ngrok-free.app'
    ],
    // FIX: Add the required headers for camera permissions.
    headers: {
      'Permissions-Policy': 'camera=*'
    }
  }
})
