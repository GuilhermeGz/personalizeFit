import "./style.css";
import { FaDumbbell, FaTimes, FaPlus } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Preset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const [trainerStudents, setTrainerStudents] = useState("123");

  useEffect(() => {
    console.log("Token usuário:", userData);
    fetch('http://localhost:8000/user/api/trainer-management/trainerHasStudents', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userData}`
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Retorno da Solicitação:");
      console.log(data);
    })
    .catch(error => {
      console.error('Erro na solicitação GET:', error);
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
          <div className="cardContainer">
            <div className="bntAccountContainer">
              <FaPlus className="icon" />
              <p className="cardText">EXEMPLO</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Preset;
