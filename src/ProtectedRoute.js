import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element, requiredRole }) => {
  const savedToken = localStorage.getItem("token");

  if (!savedToken) {
    console.warn("Usuário não autenticado.");
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(savedToken);
    const userRole = decoded?.realm_roles?.[0];

    if (requiredRole && userRole !== requiredRole) {
      console.warn("Usuário não autorizado para esta rota.");
      return <Navigate to="/" />; // rota opcional para acesso negado
    }

    console.log("Acesso autorizado.");
    return element;
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;

// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ element }) => {
//   const savedToken = localStorage.getItem('token'); 

//   if (!savedToken) {
//     console.log("Precisar estar logado");
    
//     return <Navigate to="/" />;
//   }

//   console.log("Login realizado");
  
//   return element;
// };

// export default ProtectedRoute;
