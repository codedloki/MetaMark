import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Registration } from "./components/dynamic/dynamic";
import { ethers } from "ethers";
import { Navbar } from "./components/defaults/default";
import Home from "./components/static/pages/Home";
import About from "./components/static/pages/About";
import Registryabi from "./abi/Registry.json";
import { useToast } from "./components/hooks/usetoast";
import { ToastViewport, Toast } from "./components/custom/Toast";
import { Chatui } from "./components/dynamic/Chatui.jsx";
import Dashboard from "./components/dynamic/customer/Dashboard";
import Team from "./components/static/pages/Team";
import MDashboard from "./components/dynamic/manufacturer/MDashboard";
import Verification from "./components/dynamic/customer/Verification";
import ChatApp from "./chatApp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AddProduct from "./components/dynamic/manufacturer/Products/AddProduct.jsx";
import { WagmiProvider } from "wagmi";
import Error404 from "./components/static/pages/Error404";
import ChatComp from "./components/dynamic/ChatComp.js";
import GetStarted from "./components/static/pages/GetStarted.jsx";
import ProductForm from "./components/dynamic/manufacturer/ProductForm.jsx";
import AddProductJson from "./components/dynamic/manufacturer/Products/AddProductJson.jsx";
import ProductList from "./components/dynamic/manufacturer/ProductList.jsx";
import BatchVerification from "./components/dynamic/customer/TestVerification.jsx";
import DesktopSidebar from "./components/defaults/DesktopSidebar.jsx";
import MobileNav from "./components/defaults/MobileNav.jsx";
import MobileSidebar from "./components/defaults/MobileSidebar.jsx";

function App() {
  const [isPopOveropen, setisPopOveropen] = useState(false);
  const { toasts, addToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Define triggerPopup here (this fixes the error)
  const triggerPopup = () => {
    setisPopOveropen(true);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const showSuccessToast = () => {
    addToast({
      title: "Success!",
      description: "Your action was completed successfully",
      variant: "success",
    });
  };

  const showErrorToast = () => {
    addToast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive",
    });
  };

  return (
    <>
      <Router>
        <div className="fixed mt-[-86%] md:mt-[-50vh] ml-0 items-left">
          <div className="w-screen">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
              <DesktopSidebar />
            </div>

            {/* Mobile Nav + Sidebar */}
            <div className="mt-[-16%] flex md:hidden">
              <MobileNav onMenuClick={handleSidebarToggle} />
              <MobileSidebar
                triggerPopup={triggerPopup}
                isSidebarOpen={isSidebarOpen}
                handleSidebarToggle={handleSidebarToggle}
              />
            </div>

            {/* Routes */}
            <div>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      isPopoverOpen={isPopOveropen}
                      setIsPopoverOpen={setisPopOveropen}
                      SuccessToast={showSuccessToast}
                      ErrorToast={showErrorToast}
                    />
                  }
                />
                <Route path="/getstarted" element={<GetStarted />} />
                <Route path="/product/list" element={<ProductList />} />
                <Route path="/create" element={<ProductForm />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}></Route>
                <Route path="/chat" element={<ChatComp />} />
                <Route path="/chatui" element={<Chatui />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/about" element={<About />} />
                <Route path="/team" element={<Team />} />
                <Route path="/verify" element={<Verification />} />
                <Route path="/mdashboard" element={<MDashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add" element={<ProductForm />} />
                <Route path="/*" element={<Error404 />} />
              </Routes>

              {/* Toasts */}
              {toasts.map((toast, index) => (
                <Toast key={index} variant={toast.variant} onClose={() => {}}>
                  <div>
                    <strong>{toast.title}</strong>
                    <p>{toast.description}</p>
                  </div>
                </Toast>
              ))}
              <ToastViewport />
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
