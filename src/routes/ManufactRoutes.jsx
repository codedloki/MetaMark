import { Routes,Route } from "react-router-dom";
import ManufactDash from "../parts/body/dynamic/users/manufacturer/ManufactDash";
import CreateProd from "../parts/body/dynamic/users/manufacturer/CreateProd";
import AddActions from "../parts/body/dynamic/users/manufacturer/AddActions";
import AddBatch from "../parts/body/dynamic/users/manufacturer/AddBatch";

export default function ManufactRoutes(){
    return(
        <Routes>
                <Route path='/m/dashboard' element={<ManufactDash/>}/>
              <Route path='/m/create/product' element={<CreateProd/>}/>
              <Route path="/m/create/actions/" element={<AddActions/>} />
              <Route path="/m/create/batch/" element={<AddBatch/>} />
        </Routes>
    )
}