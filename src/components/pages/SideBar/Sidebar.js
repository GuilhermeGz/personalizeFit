import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSignOutAlt,
  FaDumbbell,
  FaUserAlt,
  FaCog,
  FaClipboardList,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import "./Sidebar.css";
import CreateAluno from "../NewAluno/New/Create";
import CreatePreset from "../NewPreset/Create/Create";
import { jwtDecode } from "jwt-decode";


function Sidebar() {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [token] = useState(localStorage.getItem("token"));

  const handleSave = (updatedAluno) => {
    console.log("Aluno atualizado:", updatedAluno);
    setModalOpen(false);
  };

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const [type, setType] = useState(2); 

  useEffect(() => {
    try {
      const decoded = jwtDecode(token);
      const role = decoded?.realm_roles?.[0];
      console.log("Role:", role);
      
  
      if (role === "admin-role") {
        setType(1);
      } else {
        setType(2);
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
    }
  }, [token]);

  const homeRoute = type === 1 ? "/admin/home" : "/NewPage";

  

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="icon">
          <FaUserAlt />
        </div>
        <span className="sidebar-text">Treinador Teste</span>
      </div>

      <div className="sidebar-menu">
        

        {type !== 1 && (
          <>
            <div className="menu-item" onClick={() => navigate(homeRoute)}>
              <FaHome />
              <span>Página Inicial</span>
            </div>
            <div className="menu-item" onClick={() => navigate("/newTreino")}>
              <FaDumbbell />
              <span>Treinos</span>
            </div>
            <div className="menu-item" onClick={() => handleEditClick()}>
              <HiUserGroup />
              <span>Registro de Aluno</span>
            </div>
            
          </>
        )}

        {type == 1 && (
          <>
            <div className="menu-item" onClick={() => navigate("/ExerciseList2")}>
              <FaClipboardList />
              <span>Exercicios</span>
            </div>
          </>
          )}

            <div className="menu-item" onClick={() => navigate("/Profile")}>
              <FaCog />
              <span>Perfil</span>
            </div>
      </div>

      <div className="sidebar-bottom">
        <div className="menu-item" onClick={() => navigate("/")}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>

      <CreateAluno
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        alunoData={selectedAluno}
      />

      <CreatePreset
        isOpen={isModalOpen2}
        onClose={() => setModalOpen2(false)}
        onSave={handleSave}
      />
    </div>
  );
}


export default Sidebar;
