import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo.user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;