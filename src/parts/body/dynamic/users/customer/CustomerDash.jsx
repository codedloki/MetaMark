import React from "react"
import { useState,useEffect } from "react"
import { useConnect } from "../../../../providers/ConnectProvider"
import ConnectWarn from "../../../static_pages/ConnectWarn"
import { useUser } from "../../../../providers/UsersProvider"

export default function CustomerDash(){
    const {isConnected} = useConnect()
    const {role} = useUser()

    if(!isConnected)  return (
        <div className="p-20 w-full text-black">
            <ConnectWarn/>
        </div>

    );
    
   if (isConnected && role == 2)
    return (
        <div className="p-20 w-full text-black">
            <h1>Dashboard</h1>
        </div>
    )

    else return(
        <div>
            <h1>Unauthorized</h1>
        </div>
    )
}