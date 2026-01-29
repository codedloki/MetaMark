import { Routes,Route } from "react-router-dom";
import Home from "../parts/body/static_pages/Home";
import About from "../parts/body/static_pages/About";

export default function General(){
    return(
        <Routes>
            <Route path="/" Component={Home}/>
        </Routes>
    )
}