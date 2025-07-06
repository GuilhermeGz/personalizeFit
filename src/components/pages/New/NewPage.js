import React, { useState, useEffect } from "react";
import "./NewPage.css";
import Sidebar from "../../pages/SideBar/Sidebar";
import Notificacao from "../../pages/Notificacao/Notificacao";
import WelcomeContent from "../../pages/WelcomeContent/WelcomeContent";
import MemberContent from "../../pages/MemberContent/MemberContent";
import { FaSignOutAlt, FaUser, FaDumbbell, FaEnvelope, FaEye } from "react-icons/fa";
import UserImage from "../../../img/user.jpg";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://gaetec-server.tailf2d209.ts.net:8000'
});

const addTokenToHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="dashboard-card" style={{ borderLeftColor: color }}>
      <div>
        <div className="dashboard-value">{value}</div>
        <div className="dashboard-title">{title}</div>
      </div>
      <div className="dashboard-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
    </div>
  );
}

function ExpiringTrainingList({ trainings }) {
  return (
    <div className="expiring-list">
      {trainings.length === 0 ? (
        <div className="empty-text">Nenhum treino expirando em breve</div>
      ) : trainings.map(({ title, student, daysLeft }, idx) => (
        <div key={idx} className="expiring-item">
          <div>
            <div className="training-title">{title}</div>
            <div className="student-name">{student}</div>
          </div>
          <div className={`badge ${daysLeft <= 2 ? 'red' : daysLeft <= 5 ? 'orange' : 'green'}`}>
            {daysLeft <= 0 ? 'Expirado' : `${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`}
          </div>
        </div>
      ))}
    </div>
  );
}

function InsightChart({ data, title }) {
  const COLORS = ['#E63946', '#457B9D', '#1D3557', '#F4A261', '#2A9D8F'];
  if (!data || data.length === 0) {
    return <div className="empty-text">Dados insuficientes para {title}</div>;
  }
  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function NewPage() {
  const [userSessionImage, setUserSessionImage] = useState("");
  const [userSessionName, setUserSessionName] = useState("");
  const [treinos, setTreinos] = useState([]);
  const [students, setStudents] = useState([]);
  const [expiringTrainings, setExpiringTrainings] = useState([]);
  const [trainingTypesData, setTrainingTypesData] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalTrainings: 0,
    expiringTrainings: 0,
    activeStudents: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchImage();
        const fetchedTreinos = await getTreinos();
        const fetchedStudents = await getStudents();

        setTreinos(fetchedTreinos);
        setStudents(fetchedStudents);

        const expiringTrainingsList = getExpiringTrainings(fetchedTreinos, fetchedStudents);
        setExpiringTrainings(expiringTrainingsList);

        const trainingTypes = getTrainingTypesData(fetchedTreinos);
        setTrainingTypesData(trainingTypes);

        setDashboardStats({
          totalStudents: fetchedStudents.length,
          totalTrainings: fetchedTreinos.length,
          expiringTrainings: expiringTrainingsList.length,
          activeStudents: fetchedStudents.filter(s => s.active).length
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchImage = async () => {
      try {
        const decoded = jwtDecode(token);
        setUserSessionName(decoded.name || decoded.preferred_username);
        const userSessionId = decoded.sub;

        const response = await fetch(
          `${api.defaults.baseURL}/user/api/UserHasFile/?userId=${userSessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fileData = await response.json();
        if (fileData.length > 0) {
          const fileId = fileData[0].fileId;
          const fileResponse = await fetch(
            `${api.defaults.baseURL}/file/api/file/${fileId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const fileDetails = await fileResponse.json();
          const { fileBytes, extension } = fileDetails;
          const imageObjectURL = `data:image/${extension};base64,${fileBytes}`;
          setUserSessionImage(imageObjectURL);
        } else {
          setUserSessionImage(UserImage);
        }
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
        setUserSessionImage(UserImage);
      }
    };

    fetchData();
  }, [userData, token]);

  const getTreinos = async () => {
    try {
      const headers = addTokenToHeaders();
      const response = await api.get('training/api/TrainingPreset', headers);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
      return [];
    }
  };

  const getStudents = async () => {
    try {
      const headers = addTokenToHeaders();
      const response = await api.get('/user/api/trainer-management/trainerHasStudents', headers);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estudantes: ", error.response);
      return [];
    }
  };

  const getExpiringTrainings = (treinos, students) => {
    return treinos.filter(treino => {
      const expiringPresets = treino.studentHasTrainingPresets.filter(preset => {
        const expirationDate = new Date(preset.expirationDate);
        const today = new Date();
        const diffDays = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
      });
      return expiringPresets.length > 0;
    }).map(treino => {
      console.log(students);
      
      const student = students.find(s => s.id === treino.studentHasTrainingPresets[0].studentId);
      const expirationDate = new Date(treino.studentHasTrainingPresets[0].expirationDate);
      const today = new Date();
      const diffDays = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
      return {
        title: treino.title,
        student: student ? student.username : "Desconhecido",
        daysLeft: diffDays
      };
    }).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5);
  };

  const getTrainingTypesData = (treinos) => {
    const trainingTypes = {};
    treinos.forEach(treino => {
      (treino.studentHasTrainingPresets || []).forEach(preset => {
        const type = preset.acquisitionType || "Não categorizado";
        trainingTypes[type] = (trainingTypes[type] || 0) + 1;
      });
    });
    return Object.keys(trainingTypes).map(type => ({
      name: type,
      value: trainingTypes[type]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (isLoading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="App body">
      <Sidebar />
      <Notificacao />

      <div className="newPage-content trainerhome">
        <div className="header-section">
          <div className="profile-container">
            <div className="profile-circle">
              <img src={userSessionImage} alt="Perfil" />
            </div>
            <div className="user-info">
              <h3>Bem-vindo, {userSessionName}</h3>
            </div>
          </div>
     
        </div>

        <div className="dashboard-cards">
          <DashboardCard title="Alunos" value={dashboardStats.totalStudents} icon={<FaUser />} color="#E63946" />
          <DashboardCard title="Treinos" value={dashboardStats.totalTrainings} icon={<FaDumbbell />} color="#457B9D" />
          <DashboardCard title="Expirando" value={dashboardStats.expiringTrainings} icon={<FaEnvelope />} color="#F4A261" />
          <DashboardCard title="Ativos" value={dashboardStats.activeStudents} icon={<FaEye />} color="#2A9D8F" />
        </div>

        <div className="main-layout">
          <div className="left-content">
            <MemberContent students={students} />
          </div>

          <div className="right-content">
            <div className="expiring-section">
              <h3>Treinos a Expirar</h3>
              <ExpiringTrainingList trainings={expiringTrainings} />
            </div>

            <InsightChart data={trainingTypesData} title="Tipos de Treino" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPage;
