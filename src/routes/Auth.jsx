import {Routes,Route} from 'react-router-dom'
import Register from '../parts/body/dynamic/Registration'
export default function Auth(){
    return (
        <Routes>
            <Route path='/register' element={<Register/>}/>
        </Routes>
    )
}