import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

function ProtectedRoute({ children, allowedRole }) {
  const user = auth.currentUser;
  const userRole = localStorage.getItem("userRole");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;