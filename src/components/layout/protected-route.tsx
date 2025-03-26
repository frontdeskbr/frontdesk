
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state if auth is still being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
