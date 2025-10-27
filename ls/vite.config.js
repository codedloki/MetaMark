import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
// import { ngrok } from 'vite-plugin-ngrok'
import Terminal from "vite-plugin-terminal";


// https://vite.dev/config/
export default defineConfig({

  plugins: [
    react(),
    tailwindcss(),
    // ngrok('2YuI6PsgaPVBZSzmroLFqJ3Lytr_4JWzY8VGHUZsBuvqY33V6')
    Terminal({
    console: 'terminal',
    output: ['terminal', 'console']
  }),

  ],

  server: {
    // This setting allows Vite to accept requests from your ngrok URL.
    allowedHosts: [
      'd609d5ab4883.ngrok-free.app'
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
