import { Routes,Route } from "react-router-dom";
import CustomerDash from "../parts/body/dynamic/users/customer/CustomerDash";
import ScanMe from "../parts/body/dynamic/users/customer/ScanMe";
export default function CustRoute(){
    return(
        <Routes>
            <Route path="/c/dashboard" element={<CustomerDash/>}/>
            <Route path="/c/scan" element={<ScanMe/>}/>
        </Routes>
    )
}