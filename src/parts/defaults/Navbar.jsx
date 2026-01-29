import {React,useState} from 'react'
import { Menu } from 'lucide-react'
import  { Button } from '../../components/ui/button.tsx'
//import { DrawerTrigger } from '../../components/ui/drawer.tsx'
export default function Navbar({onMenuClick}) {

  return (
   <div className="p-4 bg-black text-white flex gap-55 font-bold text-xl justify-center">
      <div>
        MetaMark
      </div>
      
      <div>
        
        <Button className="text-white" variant="outline" onClick={onMenuClick}>
        <Menu/>
        </Button>
  
      </div>

      
    </div>
  )
}
