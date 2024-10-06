import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const savedToken = localStorage.getItem('token'); 

  if (!savedToken) {
    console.log("Precisar estar logado");
    
    return <Navigate to="/" />;
  }

  console.log("Login realizado");
  
  return element;
};

export default ProtectedRoute;
