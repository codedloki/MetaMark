import { createContext,useContext,useEffect,useState } from "react";

const ConnectContext = createContext(null)

export default function ConnectProvider ({children}){
    const [walletAddress,setWalletAddress] = useState(null)
    const [isConnected,setisConnected] = useState(false)

    const connectwallet = async() =>{
        try {
            if(!window.ethereum){
                alert('Please Install A Wallet')
                return;
            }

            const accounts = await window.ethereum.request({method:"eth_requestAccounts"})
            setWalletAddress(accounts[0])
            setisConnected(true)


        } catch (error) {
            console.error("Wallet Connection error : ",error)
        }
    }

    useEffect(()=>{
        const checkconnection = async() =>{
            if(!window.ethereum) return ;

            const accounts = await window.ethereum.request({method:"eth_requestAccounts"})
            if(accounts.length > 0){
                console.log("Use Accounts",accounts[0])
                setWalletAddress(accounts[0])
                setisConnected(true)
            }
        }
        checkconnection()
    },[])

    //Listen for account change


    useEffect(()=>{
        if(!window.ethereum) return ;
        
        const handleAccountChanged = (accounts) => {
            if(accounts.length === 0){
                setWalletAddress(null)
                setisConnected(false)

            }else{
                setWalletAddress(accounts[0])
                setisConnected(true)
            }



        }
        window.ethereum.on('accountsChanged',handleAccountChanged)
        return () =>{
            window.ethereum.removeListener("accountsChanged",handleAccountChanged)
        }
    })
    
    return(
        <>
        <ConnectContext.Provider
        value={{
            walletAddress,
            isConnected,
            connectwallet
        }}
        >
            {children} 
        </ConnectContext.Provider>
        </>
    )
}


export const useConnect = () => {
    const context = useContext(ConnectContext);
    if(!context){
        throw new Error("use Connect  inside  Connect Provider")
    }
    return context;
}