import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ConnectProvider  from './parts/providers/ConnectProvider.jsx'
import UserProvider from './parts/providers/UsersProvider.jsx'
import { WalletProvider } from './parts/providers/WalletProvider.jsx'
//import { WagmiProvider } from 'wagmi'
//import { wagmiConfig } from './parts/providers/wagmi.ts'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

  
  
    <WalletProvider>
    <ConnectProvider>
    <UserProvider>
    <App />
    </UserProvider>
    </ConnectProvider>
    </WalletProvider>
  
)
 