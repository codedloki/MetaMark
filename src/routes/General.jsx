import { Routes,Route } from "react-router-dom";
import Home from "../parts/body/static_pages/Home";
import About from "../parts/body/static_pages/About";
import NotFoundTV from "../parts/defaults/NotFoundTV";
import BranchingTimeline from "../parts/body/static_pages/Guide";
export default function General(){
    return(
        <Routes>
            <Route path="/" Component={Home}/>
            <Route path="/about" Component={About}/>
            <Route path="/guide" Component={BranchingTimeline}/>
            <Route path="/get-started" Component={BranchingTimeline}/>
            {/* <Route path="*" element={<NotFoundTV/>}/> */}
        </Routes>
    )
}