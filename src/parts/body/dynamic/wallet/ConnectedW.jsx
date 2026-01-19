import { React, useState,useEffect, useCallback } from "react"
import { Wallet  } from 'lucide-react'
import { Button }  from '../../../../components/ui/button.tsx'

export default function ConnectedW  () {
  return (
    <div  className="w-full items-center  text-white bg-blue-60">
      <Button className="w-full bg-blue-600">
     <Wallet className="text-white"/>
     </Button>
    </div>
  )
}
