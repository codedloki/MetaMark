import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login, Registration } from './components/dynamic/dynamic'
import { ethers } from 'ethers'
import { Navbar } from './components/defaults/default'
import Home from './components/static/pages/Home'
import About from './components/static/pages/About'
import Registryabi from './abi/Registry.json'
import { useToast } from './components/hooks/usetoast';
import { ToastViewport, Toast } from './components/custom/Toast'; // adjust path as needed
// import {  WalletProvider } from './components/context/WalletContext'
import Dashboard from './components/dynamic/customer/Dashboard'
import Team from './components/static/pages/Team'
import MDashboard from './components/dynamic/manufacturer/MDashboard'
import Verification from './components/dynamic/customer/Verification'
import ChatApp from './chatApp.jsx';




function App() {
  const [isPopOveropen, setisPopOveropen] = useState(false)
    const { toasts, addToast } = useToast();

  const showSuccessToast = () => {
    addToast({
      title: 'Success!',
      description: 'Your action was completed successfully',
      variant: 'success'
    });
  };
  const showErrorToast = () => {
    addToast({
      title: 'Error',
      description: 'Something went wrong',
      variant: 'destructive'
    });
  };
  return (
    <>
  {/* <WalletProvider> */}
      <Router>
      <div className='fixed mt-[-50vh] ml-0 items-left'>
        <div className='w-screen'>
          <Navbar
            triggerPopup={() => setisPopOveropen(true)}
        
          />
          <Routes>
            <Route path='/' element={<Home isPopoverOpen={isPopOveropen} setIsPopoverOpen={setisPopOveropen} SuccessToast={showSuccessToast} ErrorToast={showErrorToast} />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/register' element={<Registration />} />
            <Route path='/mdashboard' element={<MDashboard />} />
            <Route path='/about' element={<About />} />
            <Route path='/team' element={<Team />} />
            <Route path='/verify' element={<Verification />} />
             <Route path='/chat' element={<ChatApp />} />
          </Routes>
          {toasts.map((toast, index) => (
  <Toast
    key={index}
    variant={toast.variant}
    onClose={() => {}}
  >
    <div>
      <strong>{toast.title}</strong>
      <p>{toast.description}</p>
    </div>
  </Toast>
))}
<ToastViewport />
        </div>
      </div>
    </Router>
  {/* </WalletProvider> */}
  )


  </>
  )
}

export default App
