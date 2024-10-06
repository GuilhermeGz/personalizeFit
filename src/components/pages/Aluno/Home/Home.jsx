import React, { useState, useEffect } from "react";
import { FaDumbbell, FaTimes, FaPlus, FaPhone, FaEnvelope, FaEye, FaPencilAlt, FaUserFriends, FaFolder } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./style.css";
import CardWhite from "../../Cards/Divisao/CardWhite";
import { jwtDecode } from "jwt-decode";
import UserImage from "../../../../img/user.jpg"
import Navbar from "../../../../Navbar";

// import jwt from 'jsonwebtoken'; // Importar jwt corretamente

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [trainingPresets, setTrainingPresets] = useState([]);
  const userData = location.state && location.state.userData;
  const [userSessionImage, setUserSessionImage] = useState("");
  const [userSessionName, setUserSessionName] = useState("");
  const [token, setToken] = useState(localStorage.getItem('token'));


  useEffect(() => {
    const decoded = jwtDecode(token);     
    const userSessionId = decoded.sub; 
    setUserSessionName(decoded.preferred_username)
    
    const fetchData = async () => {
    try {
      const imageResponse = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/user/api/UserHasFile/?userId=${userSessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const fileData = await imageResponse.json();
      let fileId = null;

      if (Array.isArray(fileData) && fileData.length > 0) {
        fileId = fileData[0].fileId;
      }            

      if (fileId) {
        const imageResponse = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/file/api/file/${fileId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const imageFileData = await imageResponse.json();
        const { fileBytes, extension } = imageFileData;
        const imageObjectURL = `data:image/${extension};base64,${fileBytes}`;
        setUserSessionImage(imageObjectURL)
      } else {
        setUserSessionImage(UserImage)
      }
    } catch (error) {
      console.error(`Erro ao buscar imagem para aluno ${userSessionId}:`, error);
      setUserSessionImage(UserImage)
    }
  };

  fetchData();
  }, []);

  // useEffect(() => {
  //   // Simulação de dados dos alunos associados
  //   const simulatedData = [
  //     { id: 1, name: "Aluno 1", phone: "123456789", email: "random@example.com" },
  //     { id: 2, name: "Aluno 2", phone: "987654321", email: "random2@example.com" },
  //     { id: 3, name: "Aluno 4", phone: "456123789", email: "random3@example.com" }
  //   ];
  //   setAssociatedStudents(simulatedData);
  // }, []);

  // useEffect(() => {
  //   const decoded = jwt.decode(userData);

  //   console.log(decoded);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/training/api/StudentHasPresets", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setTrainingPresets(data[0]);
      } catch (error) {
        console.error('Erro ao buscar a lista de alunos associados:', error);
      }
    };
  
    fetchData();
  
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    // const hours = date.getHours().toString().padStart(2, "0");
    // const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const handleConcluirClick1 = () => {
    navigate(`/Training/Preset`);
};

  const handleConcluirClick2 = () => {
    navigate(`/Training/Preset`);

  }


  const handleConcluirClick3 = () => {
    navigate(`/Training/Preset`);

  }

  const ClickTraning = (training) => {
    navigate(`/Aluno/Training`, {state: { userData: userData, training: training}});

  }

  return (
    <>
    <Navbar/>
    <div className="main">
      <div className="trainer-info">

        <div className="trainer-profile">
          <img src={userSessionImage} alt="Treinador" className="student-avatar" />
          <div className="trainer-details">
            <h1>{userSessionName.toUpperCase()}</h1>
            {/* <p>Idade: 30 anos</p>  */}
          </div>
        </div>



        <div className="button-container">

          <button className="buttonTreino" onClick={handleConcluirClick1}>

            <FaFolder className="icon iconTreino" />
            <span>Avaliações</span>
          </button>

          <button className="buttonTreino" onClick={handleConcluirClick2}>
            <FaDumbbell className="icon iconTreino" />
            <span>Personal</span>
          </button>

          <button className="buttonTreino" onClick={handleConcluirClick3}>
            <FaUserFriends className="icon iconTreino" />
            <span>Parceiro Treino</span>
          </button>
          
        </div>

      </div>

      <div className="title">
        <h2>Treinos</h2>
        <div className="underline"></div>
      </div>
      <div className="content">
      {trainingPresets && trainingPresets.trainingPreset && (
        <CardWhite content = "">
          <div className="dados" onClick={() => ClickTraning(trainingPresets.trainingPreset)}>
            <h2>Dados do Treino</h2>
            <div className="data">
              <span>Data:</span>
              <span>{formatDate(trainingPresets.expirationDate)}</span>
            </div>
            <div className="personal">
              <span>Personal:</span>
              <span>Carlos Moroy</span>
            </div>
            <div className="objetivo">
              <span>Objetivo:</span>
              <span>{trainingPresets.trainingPreset.title}</span>
            </div>
            {/* nome dos grupos */}
            <div className="divisao">
              <span>Divisão:</span>
              {trainingPresets.trainingPreset.trainingGroups.map((exercise, index) => (
                <span key={index}>{exercise.name}</span>
              ))}
            </div>
            <div className="ativo">
              <span>Ativo:</span>
              <span>+</span>
            </div>
          </div>
        </CardWhite>
      )}
    </div>
      

      

    </div>
    </>
  );
};

export default Home;
