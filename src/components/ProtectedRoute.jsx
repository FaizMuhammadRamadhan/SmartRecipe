import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // Belum login sama sekali
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Kalau butuh role spesifik dan role user beda
    return <Navigate to="/homepage" replace />;
  }

  return children;
};

export default ProtectedRoute;
