import { Routes,Route } from "react-router-dom";
import CustomerDash from "../parts/body/dynamic/users/customer/CustomerDash";

export default function CustRoute(){
    return(
        <Routes>
            <Route path="/c/dashboard" element={<CustomerDash/>}/>
        </Routes>
    )
}