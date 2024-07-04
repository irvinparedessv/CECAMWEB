// components/AuthGuard.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = ({ isAuthenticated, roleName, allowedRoles }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(roleName)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
