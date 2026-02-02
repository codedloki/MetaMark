import {Button} from './components/ui/button'
import { useState,useEffect } from 'react'
import AppSidebar from './parts/defaults/AppSidebar'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {SidebarProvider,SidebarTrigger} from './components/ui/sidebar'
import { BrowserRouter as Router ,Routes,Route } from 'react-router-dom' 
import General from './routes/General.jsx'
import {ThemeProvider} from './components/theme-provider'
import './App.css'
import MobDrawer from './parts/defaults/MobDrawer.jsx'
import Auth from './routes/Auth.jsx'
import Navbar from './parts/defaults/Navbar.jsx'
import {useConnect} from './parts/providers/ConnectProvider.jsx'
import CustRoute from './routes/CustRoutes.jsx'
import ManufactRoutes from './routes/ManufactRoutes.jsx'
import NotFoundTV from './parts/defaults/NotFoundTV.jsx'

function App() {
const [open, setOpen] = useState(false);
  const [mobdrawopen,setmobdrawopen] = useState(false)
    const { walletAddress, isConnected, connectwallet } = useConnect();

  useEffect(()=>{
    console.log("Component Mounted")
    console.log(walletAddress)

  },[])
  return (
    <>
    <div className="w-screen h-screen">
    <ThemeProvider defaultTheme='dark' storageKey="vite-ui-theme">
      
      <SidebarProvider>
         <Router>
      <div className="flex  w-full overflow-hidden ">
      <div className='hidden md:h-full md:block md:w-[10%]  hidden shrink-0'>
        <AppSidebar />
      </div>
    
      <div className="w-full h-screen  flex-1 bg-white">
            <div className="w-full block md:hidden">
                    <Navbar onMenuClick={()=>{setOpen(true)}}/>
                   <MobDrawer open={open} onOpenChange={setOpen} />
            </div>
        <div className="md:ml-10 md:p-6   ">
         <General/>
         <Auth/>
         <CustRoute/>
              <ManufactRoutes/>
          
                 </div>
        
      </div>
      </div>
       </Router>
      </SidebarProvider> 
      </ThemeProvider>    
      </div>
      </>

  )
}

export default App
