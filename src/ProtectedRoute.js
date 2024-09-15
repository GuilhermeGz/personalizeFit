import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking', 'authenticated', 'unauthenticated'
  const [userData, setUserData] = useState(location.state && location.state.userData);
  const [timer, setTimer] = useState(0);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setAuthStatus('authenticated');

    const updateToken = async () => {
      if (userData) {
        try {
          // console.log("Tentando atualizar o token...");
          
          const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ refreshToken: userData.refresh_token }),
          });

          if (response.ok) {
            const data = await response.json();
            setUserData(prevData => ({
              ...prevData,
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              expires_in: data.expires_in,
            }));
            setAuthStatus('authenticated');
            // console.log("Token atualizado com sucesso!");
          } else {
            setAuthStatus('unauthenticated');
            // console.log("Falha ao atualizar o token.");
          }
        } catch (error) {
          console.error('Erro ao atualizar o token:', error);
          setAuthStatus('unauthenticated');
        }
      } else {
        setAuthStatus('unauthenticated');
      }
    };

    const calculateTimeUntilUpdate = () => {
      // Define o intervalo em milissegundos (200 segundos = 200000 ms)
      const interval = 200000; 

      if (userData && userData.expires_in) {
        // Calcula o tempo restante até a próxima atualização
        const tokenExpiration = userData.expires_in * 1000;
        const currentTime = new Date().getTime();
        const timeUntilUpdate = Math.max(interval - (currentTime % interval), 0);

        setTimer(timeUntilUpdate);
        // console.log(`Tempo restante até a próxima atualização: ${timeUntilUpdate} ms`);
      }
    };

    // Atualiza o token imediatamente ao montar o componente e define o temporizador
    // updateToken();
    // calculateTimeUntilUpdate();

    // // Define um intervalo para atualizar o token a cada 200 segundos
    // const intervalId = setInterval(() => {
    //   // console.log("Tempo para atualizar o token passou. Atualizando...");
    //   updateToken();
    //   calculateTimeUntilUpdate();
    // }, 20000); // 20000 ms = 20 s

    // Limpa o intervalo quando o componente for desmontado
    return () => {
      // console.log("Componente desmontado. Limpando intervalo.");
      // clearInterval(intervalId);
    };
  }, [userData]);

  if (authStatus === 'checking') {
    return <div>Loading...</div>; // Ou um componente de carregamento
  }

  if (authStatus === 'unauthenticated') {
    console.log("Não logado.");
    return <Navigate to="/" replace />;
  }

  console.log("Logado.");
  return element;
};

export default ProtectedRoute;
