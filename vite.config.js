import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
plugins: [react(), tailwindcss()],

server:{
    allowedHosts:true,
},
optimizeDeps:{
    include: ['@metamask/sdk'],
}
// resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src/"),
//     },
//   },
})
