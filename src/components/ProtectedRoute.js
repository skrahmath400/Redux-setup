// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, screenKey }) => {
  const mergedPermissions = useSelector(state => state.authorization?.permissions || {});
  const authToken = localStorage.getItem("authToken");

  console.log("[ProtectedRoute] Current URL path:", window.location.pathname);
  console.log("[ProtectedRoute] Required screenKey:", screenKey);
  console.log("[ProtectedRoute] Permissions in Redux:", mergedPermissions);
  console.log("[ProtectedRoute] Has token?", !!authToken);

  if (!authToken) {
    console.log("[ProtectedRoute] No token → redirect to login");
    return <Navigate to="/login" replace />;
  }

  if (!screenKey) {
    console.log("[ProtectedRoute] Public route → allow");
    return children;
  }

  const perms = mergedPermissions[screenKey] || { view: false, all: false };
  const canView = perms.view || perms.all;

  console.log(`[ProtectedRoute] Can view ${screenKey}?`, canView);

  return canView ? children : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;