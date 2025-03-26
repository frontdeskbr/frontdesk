
import React from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Use Navigate component directly instead of useEffect + useNavigate hook
  // This provides immediate rendering without the intermediate blank state
  return <Navigate to="/login" replace />;
};

export default Index;
