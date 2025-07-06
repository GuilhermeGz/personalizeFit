import React, { useState, useEffect } from "react";
import { FaDumbbell, FaPencilAlt, FaEnvelope, FaUser, FaEye } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import UserImage from "../../../../img/user.jpg"
import { jwtDecode } from "jwt-decode";
import Navbar from "../../../../Navbar";

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const [imageUrls, setImageUrls] = useState({}); // Adiciona um estado para URLs de imagem
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const [userSessionImage, setUserSessionImage] = useState("");
  const [userSessionName, setUserSessionName] = useState("");
  const [token, setToken] = useState(localStorage.getItem('token'));


  useEffect(() => {    
    
    const decoded = jwtDecode(token);     
    const userSessionId = decoded.sub; 
    console.log("info aqui");
    
    console.log(decoded);
    
    setUserSessionName(decoded.name || decoded.preferred_username)

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



  useEffect(() => {

    const fetchData = async () => {
      try {
        // Busca alunos associados
        const response = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/user/api/trainer-management/trainerHasStudents", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setAssociatedStudents(data);

        const imageUrls = {};
        for (const student of data) {
          
          try {
            const imageResponse = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/user/api/UserHasFile/?userId=${student.id}`, {
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
              imageUrls[student.id] = imageObjectURL;
            } else {

              imageUrls[student.id] = UserImage; 
            }
          } catch (error) {
            console.error(`Erro ao buscar imagem para aluno ${student.id}:`, error);
            imageUrls[student.id] = UserImage; 
          }
        }
        setImageUrls(imageUrls); 
      } catch (error) {
        console.error('Erro ao buscar a lista de alunos associados:', error);
      }
    };

    fetchData();
  }, [userData]);

  const handleConcluirClick1 = () => {
    navigate(`/Training/Preset`, { state: { userData: userData } });
  };

  const handleConcluirClick2 = () => {
    navigate(`/Exercise/Create`, { state: { userData: userData } });
  };

  const handleConcluirClick3 = () => { };

  const handleConcluirClick4 = () => {
    navigate(`/Aluno/Create`, { state: { userData: userData } });
  };

  const studentInfoButton = (id, username, email, active) => {
    const studentInfo = {
      id: id,
      username: username,
      email: email,
      active: active,
    };

    navigate(`/Aluno/info`, { state: { studentInfo: studentInfo, userData: userData } });
  };

  return (
    <>
    <Navbar/>

    <div className="main">
      <div className="trainer-info">
        <div className="trainer-profile">
          <img src={userSessionImage} alt="Treinador" className="student-avatar"/>
          <div className="trainer-details">
            <h1>{userSessionName.toUpperCase()}</h1>
            {/* <p>Idade: 30 anos</p> */}
          </div>
        </div>
        <div className="button-container">
          <button className="buttonTreino" onClick={handleConcluirClick1}>
            <FaDumbbell className="icon iconTreino" />
            <span>Treinos</span>
          </button>
          {/* <button className="buttonTreino" onClick={handleConcluirClick2}>
            <FaPencilAlt className="icon iconTreino" />
            <span>Solicitar exercício</span>
          </button> */}
          {/* <button className="buttonTreino" onClick={handleConcluirClick3}>
            <FaEnvelope className="icon iconTreino" />
            <span>Nova postagem</span>
          </button> */}
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
              <img src={imageUrls[student.id] || UserImage} alt="Student Avatar" className="student-avatar" />
              <p className="cardText" title={student.username}>{student.username.length > 10 ? `${student.username.substring(0, 10)}...` : student.username}</p>
              <div className="cardContact">
                <FaEye className="icon eyeIcon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Home;
