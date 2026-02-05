import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../parts/providers/UsersProvider";

// Components
import ManufactDash from '../parts/body/dynamic/users/manufacturer/ManufactDash'
import CreateProd from "../parts/body/dynamic/users/manufacturer/CreateProd";
import AddActions from "../parts/body/dynamic/users/manufacturer/AddActions";
import AddBatch from "../parts/body/dynamic/users/manufacturer/AddBatch";
import ProductListing from "../parts/body/dynamic/users/manufacturer/ProductListing";
import ProductDetail from "../parts/body/dynamic/users/manufacturer/ProductDetail";
import DocsPage from "../parts/body/dynamic/users/manufacturer/DocsPage";
import EcosystemPage from "../parts/body/dynamic/users/manufacturer/EcosystemPage";
import CorporatePage from "../parts/body/dynamic/users/manufacturer/CorporatePage";

// Security Wrapper Component
const ProtectedManufacturer = ({ children }) => {
  const { role, loading } = useUser();

  // Show a clean loader while checking role from blockchain
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-widest">Verifying Identity...</p>
      </div>
    );
  }

  // If not a manufacturer (role !== 1), kick them out
  if (role !== 1) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function ManufactRoutes() {
  return (
    <Routes>
      {/* All routes are now wrapped in ProtectedManufacturer */}
      <Route path='/m/dashboard' element={
        <ProtectedManufacturer><ManufactDash /></ProtectedManufacturer>
      } />
      
      <Route path='/m/create/product' element={
        <ProtectedManufacturer><CreateProd /></ProtectedManufacturer>
      } />
      
      <Route path="/m/create/actions" element={
        <ProtectedManufacturer><AddActions /></ProtectedManufacturer>
      } />
      
      <Route path="/m/create/batch" element={
        <ProtectedManufacturer><AddBatch /></ProtectedManufacturer>
      } />
      
      <Route path="/m/catalog/" element={
        <ProtectedManufacturer><ProductListing /></ProtectedManufacturer>
      } />
      
      <Route path="/m/product/:id" element={
        <ProtectedManufacturer><ProductDetail /></ProtectedManufacturer>
      } />
      
      <Route path="/m/docs" element={
        <ProtectedManufacturer><DocsPage /></ProtectedManufacturer>
      } />
      
      <Route path="/m/links" element={
        <ProtectedManufacturer><EcosystemPage /></ProtectedManufacturer>
      } />
      
      <Route path="/m/company" element={
        <ProtectedManufacturer><CorporatePage /></ProtectedManufacturer>
      } />
    </Routes>
  );
}