import "./style.css";
import { FaDumbbell, FaTimes, FaPlus, FaPhone, FaEnvelope, FaEye  } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../../../../Navbar";

const Association = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const userData = location.state && location.state.userData;
  const [trainingPreset, setTrainingPreset] = useState(location.state && location.state.trainingPreset);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {

    fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/trainer-management/trainerHasStudents', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {

      setAssociatedStudents(data);
    })
    .catch(error => {
      console.error('Erro na solicitação GET:', error);
      navigate('/');
    });

  }, [trainingPreset]);

  const removerAluno = (studentId) => {

      if (trainingPreset.hasOwnProperty("studentHasTrainingPresets")) {
        trainingPreset.studentHasTrainingPresets = trainingPreset.studentHasTrainingPresets.filter(preset => preset.studentId !== studentId);
      }

    const aux = trainingPreset;
    const dadosPreset = {
      title: aux.title,
      presetDefaultFlag: true,
      studentHasTrainingPresets: aux.studentHasTrainingPresets
    }

    atualizarLista(trainingPreset.id, dadosPreset);

  };

  const addAluno = (studentId) =>{
    const aux = trainingPreset;
    const dadosPreset = {
      title: aux.title,
      presetDefaultFlag: true,
      studentHasTrainingPresets: aux.studentHasTrainingPresets
    }
    const dadosAluno = {
      expirationDate: "2024-05-05T20:25:33.889Z",
      acquisitionType: "random",
      studentId: `${studentId}`
    }

    dadosPreset.studentHasTrainingPresets.push(dadosAluno);

    atualizarLista(aux.id, dadosPreset);
  };

  const atualizarLista = (studentId, data) =>{
    fetch(`http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then((data) => {
        console.log("Resposta da solicitação POST:", data);
      })
      .catch((error) => {
        console.error("Erro na solicitação POST:", error);
      });
  };


  return (
    <>
    <Navbar/>
    <div className="main">
      <div>
        <div className="title">
          <h1>Vincular Aluno a Treino</h1>
          <div className="underline"></div>
        </div>

        <div className="cardContainer">
            <div className="cardTrainingAsso">
              <FaDumbbell className="icon" />
              <p className="cardText">{trainingPreset.title}</p>
            </div>
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

          {associatedStudents.map(student => (
            <div className="cardContainer" key={student.id}>
              <div className="bntAccountContainerTraining">
                <FaDumbbell className="icon"  onClick={() => addAluno(student.id)}/>
                <p className="cardText">{student.username}</p>
                {trainingPreset.studentHasTrainingPresets.some(preset => preset.studentId === student.id) && (
                  <FaTimes className='trashCard' onClick={(e) => { e.stopPropagation(); removerAluno(student.id)}} />
                )}              
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
