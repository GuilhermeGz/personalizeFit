import "./style.css";
import { FaDumbbell, FaTimes, FaPlus } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Preset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const [trainerStudents, setTrainerStudents] = useState([]);
  
  // Exemplo de dados de alunos
  const exampleStudents = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
  ];

  useEffect(() => {
    console.log("Token usuário:", userData);
    fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/trainer-management/trainerHasStudents', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userData.access_token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Retorno da Solicitação:");
      console.log(data);
      // setTrainerStudents(data);
    })
    .catch(error => {
      console.error('Erro na solicitação GET:', error);
      navigate('/');
    });


    console.log(userData.refresh_token);
    
    fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/auth/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( { refreshToken: userData.refresh_token})
    })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
          return response.json();
      } else {
          return response.text();
      }
    })
    .then(data => {
        data = JSON.parse(data); 
        console.log('Token atualizado:', data);
    })
    .catch(error => {
        console.error('Erro na solicitação POST:', error);
    });

  }, []);

  return (
    <div className="main">
      <div>
        <div className="title">
          <h1>Lista de Alunos</h1>
          <div className="underline"></div>
        </div>
        <div className="text-input">
          <label htmlFor="">
            <input
              type="text"
              placeholder="Pesquisar Alunos"
            />
          </label>
        </div>
        <h1>Alunos</h1>

        <div className="content">
          {trainerStudents.map(student => (
            <div key={student.id} className="cardContainer">
              <div className="bntAccountContainer">
                <FaPlus className="icon" />
                <p className="cardText">{student.name}</p>
              </div>
            </div>
          ))}
          
          {/* Uso com dados fixos para exemplo */}
          {exampleStudents.map(student => (
            <div key={student.id} className="cardContainer">
              <div className="bntAccountContainer">
                <FaDumbbell className="icon" />
                <p className="cardText">{student.name}</p>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default Preset;
