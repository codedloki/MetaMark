import { React, useState,useEffect, useCallback } from "react"
import { Wallet  } from 'lucide-react'
import { Button }  from '../../../../components/ui/button.tsx'
import { useUser } from "../../../providers/UsersProvider.jsx"
import { useConnect } from "../../../providers/ConnectProvider.jsx"
import  {useNavigate} from 'react-router-dom'
import WalletIcon  from '../../../../components/ui/wallet-icon.tsx'
export default function ConnectedW  () {
  const { walletAddress, isConnected, disconnectWallet } = useConnect()
  const { provider,registry,role } = useUser()
  const navigate = useNavigate()

  const getmyRole = () =>{
    console.log("Role:",role)
  }

  useEffect(()=>{
    getmyRole()
  },[role])

  const actiregister = (e) =>{
    e.preventDefault()
    navigate('/register')
  }

  return (
  <div className="w-full items-center text-white bg-blue-60">
    <div className="flex w-full bg-[#1A1A1A] items-center gap-2 p-4 rounded-2xl">
      {/* <WalletIcon className="text-white text-sm" /> */}
      {/* <span className="text-white">{role}</span> */}

      {
        role === 0 ? (
          <Button className="text-white bg-blue-60" variant="ghost" onClick={actiregister}>
            Not Registered
          </Button>
        ) : role === 1 ? (
          <div onClick={(e)=>{
            e.preventDefault()
            navigate('/m/dashboard')
          }}>
            Manufacturer
          </div>
        ) : role === 2 ? (
          <>Customer</>
        ) : (
          <>Invalid</>   
        )
      }
    </div>
  </div>
)
}
