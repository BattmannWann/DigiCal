import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const digicalAccessToken = localStorage.getItem("digicalAccessToken");

  if (!accessToken && !digicalAccessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
