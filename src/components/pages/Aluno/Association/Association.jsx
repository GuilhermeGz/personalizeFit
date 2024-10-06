import "./style.css";
import { FaDumbbell, FaTimes, FaPlus, FaPhone, FaEnvelope } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../../../../Navbar";

const Association = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleButtonClick = () => {
    // Fazer algo aqui 2
  };

  const handleButtonClick2 = () => {
    // Fazer algo aqui 1
  };

  // useEffect para simular a chamada GET e preencher os alunos associados
  useEffect(() => {

      // fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/teste', {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${userData}`
    //   }
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log("Retorno da Solicitação:");
    //   console.log(data);
    //   // setTrainerStudents(data);
    // })
    // .catch(error => {
    //   console.error('Erro na solicitação GET:', error);
    //   navigate('/');
    // });


    // Simulação de dados dos alunos associados
    const simulatedData = [
      { id: 1, name: "Aluno Random", phone: "123456789", email: "random@example.com" },
      { id: 2, name: "Aluno Random 2", phone: "987654321", email: "random2@example.com" },
      { id: 3, name: "Aluno Random 4", phone: "456123789", email: "random3@example.com" }
    ];
    setAssociatedStudents(simulatedData);
  }, []);


  return (
    <>
    <Navbar/>
    <div className="main">
      <div>
        <div className="title">
          <h1>Alunos Associados</h1>
          <div className="underline"></div>
        </div>
        <div className="text-input">
          <label htmlFor="">
            <input
              type="text"
              placeholder="Nome do Aluno"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>
        </div>

        <div className="content">
          <div className="cardContainer" onClick={handleButtonClick}>
            <div className="bntAccountContainer">
              <FaPlus className="icon" />
            </div>
          </div>

          {associatedStudents.map(student => (
            <div className="cardContainer" key={student.id}>
              <div className="bntAccountContainer">
                <FaDumbbell className="icon" />
                <p className="cardText">{student.name}</p>
                <div className="cardContact">
                  <FaPhone className="icon contactIcon" />
                  <FaEnvelope className="icon mailIcon" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
};

export default Association;
