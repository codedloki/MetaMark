import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { WalletProvider } from './parts/providers/WalletProvider.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider>
    <App />
    </WalletProvider>
  </StrictMode>,
)
