import React, { useState, useEffect } from "react";
import "./Home.css";
import Sidebar from "../../../pages/SideBar/Sidebar";
import WelcomeContent from "../../../pages/WelcomeContent/WelcomeContent";
import { FaDumbbell, FaPencilAlt, FaEnvelope, FaUser, FaEye } from "react-icons/fa";
import UserImage from "../../../../img/user.jpg"
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";


function NewPage() {
  const [searchValue, setSearchValue] = useState("");
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const [userSessionImage, setUserSessionImage] = useState("");
  const [userSessionName, setUserSessionName] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decoded = jwtDecode(token);
        const userSessionId = decoded.sub;
        setUserSessionName(decoded.name || decoded.preferred_username);

        const imageResponse = await fetch(
          `http://gaetec-server.tailf2d209.ts.net:8000/user/api/UserHasFile/?userId=${userSessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fileData = await imageResponse.json();
        let fileId = null;

        if (Array.isArray(fileData) && fileData.length > 0) {
          fileId = fileData[0].fileId;
        }

        if (3) {
          const imageResponse = await fetch(
            `http://gaetec-server.tailf2d209.ts.net:8000/file/api/file/3`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const imageFileData = await imageResponse.json();
          const { fileBytes, extension } = imageFileData;
          const imageObjectURL = `data:image/${extension};base64,${fileBytes}`;
          setUserSessionImage(imageObjectURL);
        } else {
          setUserSessionImage(UserImage);
        }
      } catch (error) {
        console.error(`Erro ao buscar imagem para aluno:`, error);
        setUserSessionImage(UserImage);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://gaetec-server.tailf2d209.ts.net:8000/user/api/trainer-management/trainerHasStudents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setAssociatedStudents(data);
        console.log("Mudou os dados dos alunos");

        const imageUrls = {};
        for (const student of data) {
          try {
            const imageResponse = await fetch(
              `http://gaetec-server.tailf2d209.ts.net:8000/user/api/UserHasFile/?userId=${student.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const fileData = await imageResponse.json();
            let fileId = null;

            if (Array.isArray(fileData) && fileData.length > 0) {
              fileId = fileData[0].fileId;
            }

            if (fileId) {
              const imageResponse = await fetch(
                `http://gaetec-server.tailf2d209.ts.net:8000/file/api/file/${fileId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
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
        setLoading(false); // Finaliza o carregamento
      } catch (error) {
        console.error("Erro ao buscar a lista de alunos associados:", error);
        setLoading(false); // Finaliza mesmo em caso de erro
      }
    };

    fetchData();
  }, [userData]);

  // Enquanto estiver carregando, mostra um loader
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="App body">
      <Sidebar />
      <div className="newPage-content">
        <div className="main-column">
          <WelcomeContent name={userSessionName} />
        </div>
   
      </div>
    </div>
  );
}

export default NewPage;
