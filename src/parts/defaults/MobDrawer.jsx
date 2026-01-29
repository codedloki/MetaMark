import React from 'react'
import { Button } from '../../components/ui/button.tsx'
import { Drawer,DrawerClose,DrawerContent,DrawerDescription,DrawerFooter,DrawerHeader,DrawerTitle,DrawerTrigger } from '../../components/ui/drawer.tsx'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from 'react';

export default function MobDrawer({open,onopenchange}){
  const [isConnected,setisConnected] = useState(false)


  return(
  <div>
      <Drawer open={open} onopenchange={onopenchange}>
        {/* <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer</Button>

        </DrawerTrigger> */}
        <DrawerTitle>Metamark</DrawerTitle>
        <DrawerContent>
          <div className="items-center text-center p-4 gap-4">
            <div className="p-2">
              <h3>Home</h3>
            </div>
            <div className="p-2 ">
              <h3>About</h3>
            </div>
            <div className="p-2">
              <h3>Guide</h3>
            </div>
            <div className="p-2">
              {
                isConnected ? (
                  <button>Connected</button>

                ):(
                  <ConnectButton/>

                )
              }
              
            </div>
            <div>

              <button onClick={()=>{onopenchange(false)}} className='bg-blue-600 rounded-6xl'>
                X
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
  </div>
  )
}
