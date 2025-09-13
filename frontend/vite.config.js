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
      "https://9dc41876b5c6.ngrok-free.app/"
    ],
    // FIX: Add the required headers for camera permissions.
    headers: {
      'Permissions-Policy': 'camera=*'
    }
  },


  optimizeDeps: {
    exclude: ["@xmtp/wasm-bindings", "@xmtp/browser-sdk"],
    include: ["@xmtp/proto"],
  },
})

