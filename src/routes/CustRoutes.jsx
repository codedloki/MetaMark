import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../parts/providers/UsersProvider";

// Components
import CustomerDash from "../parts/body/dynamic/users/customer/CustomerDash";
import ScanMe from "../parts/body/dynamic/users/customer/ScanMe";

// Security Wrapper for Customers (Role 3)
const ProtectedCustomer = ({ children }) => {
  const { role, loading } = useUser();

  // Show loader while fetching role from blockchain
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
        <p className="mt-4 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Authenticating User...</p>
      </div>
    );
  }

  // If not a customer (role !== 3), kick them out to home or login
  if (role !== 2) {
    console.log(role)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function CustRoute() {
  return (
    <Routes>
      <Route 
        path="/c/dashboard" 
        element={
          <ProtectedCustomer>
            <CustomerDash />
          </ProtectedCustomer>
        } 
      />
      
      <Route 
        path="/c/scan" 
        element={
          <ProtectedCustomer>
            <ScanMe />
          </ProtectedCustomer>
        } 
      />
    </Routes>
  );
}