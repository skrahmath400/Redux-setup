// src/components/PermissionGuard.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { usePermission } from "../hooks/usePermission";

const PermissionGuard = ({ permissionKey, children }) => {
  const { canView } = usePermission(permissionKey);

  if (!canView) {
    return <Navigate to="/scopes" replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;