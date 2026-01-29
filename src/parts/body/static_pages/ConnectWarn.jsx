import { Button } from "../../../components/ui/button"

export default function ConnectWarn(){
    return(
        <div className="text-2xl text-center">
            <h2 className="font-bold"> Please Install Any Wallet Extension</h2> <br/>
            <Button    className="w-20 h-20 bg-white">
                <div className=" w-full  bg-white">
                    <img src="https://i.ibb.co/pB8KFmXV/Metamask-Open-Source-Logo-PNG.png"   className="w-full"/>
                </div>
            </Button>

        </div>
    )
}