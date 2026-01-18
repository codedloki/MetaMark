import {Button} from './components/ui/button'
import { useState } from 'react'
import AppSidebar from './parts/defaults/AppSidebar'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {SidebarProvider,SidebarTrigger} from './components/ui/sidebar'
import { BrowserRouter as Router ,Routes,Route } from 'react-router-dom' 
import {Home,About} from './parts/body/static_pages/static'
import {ThemeProvider} from './components/theme-provider'
import './App.css'
import { Register } from './parts/body/dynamic/dynamic'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ThemeProvider defaultTheme='dark' storageKey="vite-ui-theme">
      <SidebarProvider>
         <Router>
      <div className="flex h-full w-full overflow-hidden ">
      <div className='w-[10%] shrink-0'>
        <AppSidebar />
      </div>
      <div className=" flex-1 bg-white">

        <div className="ml-20 p-35 pr-150 ">
         
            <Routes>
              <Route path='/' element={<Home />} /> 
              <Route path='/about' element={<About />} />
              <Route path="/register" element={<Register />} />
              </Routes>
         

        </div>
        
      </div>
      </div>
       </Router>
      </SidebarProvider> 
      </ThemeProvider>    </>
  )
}

export default App
