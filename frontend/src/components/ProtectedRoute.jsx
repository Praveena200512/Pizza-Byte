import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;