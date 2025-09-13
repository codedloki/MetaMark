import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const address = localStorage.getItem('storesession');




  const location = useLocation();
  return address ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location.pathname }} />
  );
};

export default ProtectedRoute;