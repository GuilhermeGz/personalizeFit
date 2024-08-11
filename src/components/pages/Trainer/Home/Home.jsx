import React, { useState, useEffect } from "react";
import { FaDumbbell, FaTimes, FaPlus, FaPhone, FaEnvelope, FaEye, FaPencilAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./style.css";

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const userData = location.state && location.state.userData;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/user/api/trainer-management/trainerHasStudents", {
          headers: {
            'Authorization': `Bearer ${userData.access_token}`
          }
        });
        const data = await response.json();
        setAssociatedStudents(data);
      } catch (error) {
        console.error('Erro ao buscar a lista de alunos associados:', error);
      }
    };
  
    fetchData();
  
  }, []);
  

  const handleConcluirClick1 = () => {
    navigate(`/Training/Preset`, {state: { userData: userData}});
  };

  const handleConcluirClick2 = () => {
    navigate(`/Exercise/Create`, {state: { userData: userData}});

  }

  const handleConcluirClick3 = () => {
  }

  const handleConcluirClick4 = () => {
    navigate(`/Aluno/Create`, {state: { userData: userData}});

  }

  const studentInfoButton = (id, username, email, active) => {
    const studentInfo = {
      id: id,
      username: username,
      email: email,
      active: active,
    };

    navigate(`/Aluno/info`, {state: { studentInfo: studentInfo, userData: userData}});

  }

  useEffect(() => {
    console.log("Dados do Usuário");
    console.log(userData);
  });

  return (
    <div className="main">
      <div className="trainer-info">

        <div className="trainer-profile">
          <img src="treinador.jpg" alt="Treinador" />
          <div className="trainer-details">
            <h1>Treinador Corno</h1>
            <p>Idade: 30 anos</p> 
          </div>
        </div>



        <div className="button-container">
          <button className="buttonTreino" onClick={handleConcluirClick1}>
            <FaDumbbell className="icon iconTreino" />
            <span>Treinos</span>
          </button>

          <button className="buttonTreino" onClick={handleConcluirClick2}>
            <FaPencilAlt className="icon iconTreino" />
            <span>Solicitar exercício</span>
          </button>

          <button className="buttonTreino" onClick={handleConcluirClick3}>
            <FaEnvelope className="icon iconTreino" />
            <span>Nova postagem</span>
          </button>

          <button className="buttonTreino" onClick={handleConcluirClick4}>
            <FaUser className="icon iconTreino" />
            <span>Adicionar Aluno</span>
          </button>
          
        </div>
      </div>
      <div className="title">
        <h2>Alunos</h2>
        <div className="underline"></div>
      </div>
      <div className="content">
        {associatedStudents.map(student => (
          <div className="cardContainerTreinador" key={student.id} onClick={() => studentInfoButton(student.id, student.username, student.email, student.active)}>
            <div className="bntAccountContainerTraining">
              <img  />
              <p className="cardText">{student.username}</p>
              <div className="cardContact">
                <FaEye className="icon eyeIcon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
