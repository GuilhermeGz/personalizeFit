import React, { useState, useEffect } from "react";
import { FaDumbbell, FaClock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./Training.css";
import CardDivAtual from "../../Cards/Divisao/CardDivAtual";
import CardWhite from "../../Cards/Divisao/CardWhite";
import CardDivActive from "../../Cards/Divisao/CardDivActive"

const Training = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const userTraining = location.state && location.state.training;
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [exerciseNames, setExerciseNames] = useState({});

  useEffect(() => {
    if (selectedGroup !== null) {
      setSelectedGroup(null); 
    }
  }, [userTraining]);

  useEffect(() => {
    if (userTraining && userTraining.trainingGroups && userTraining.trainingGroups.length > 0) {
      setSelectedGroup(userTraining.trainingGroups[0]); 
    }
  }, [userTraining]); 

  const handleCardGroupClick = (group) => {
    setSelectedGroup(group);
  };

  useEffect(() => {
    if (selectedGroup) {
      selectedGroup.trainingGroupHasExercises.forEach(async (exercise) => {
        const name = await getNameExercise(exercise.exerciseId);
        console.log("Pegando nome");
        setExerciseNames((prevNames) => ({
          ...prevNames,
          [exercise.exerciseId]: name,
        }));
      });
    }
  }, [selectedGroup]);

  const getNameExercise = async (id) => {
    try {
      const response = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise/${id}`, {
        headers: {
          'Authorization': `Bearer ${userData.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data.name;

    } catch (error) {
      console.error('Erro ao buscar o nome do exercício:', error);
      return null;
    }
  };

  const ClickExercise = (exercises) => {
    console.log("Ta enviando isso aqui");
    console.log(exercises);
    navigate(`/Aluno/Exercise`, {state: { userData: userData, exercises: exercises}});

  }

  return (
    <div className="main">
      <div className="trainer-info">
        <div className="trainer-profile">
          <img src="treinador.jpg" alt="Treinador" />
          <div className="trainer-details">
            <h1>Aluno Corno</h1>
            <p>Idade: 30 anos</p>
          </div>
        </div>
        <div className="button-container">
          {userTraining.trainingGroups.map((group, index) => (
            
            <div className="CardGroup" key={index} onClick={() => handleCardGroupClick(group)}>
              {selectedGroup && selectedGroup === group ? (
                  <CardDivActive name={group.name} />
                ) : (
                  <CardDivAtual name={group.name} />
              )}            
            </div>
          ))}
        </div>
      </div>
      <div className="title">
        <div className="underline"></div>
      </div>
      <div className="content">
        {selectedGroup && selectedGroup.trainingGroupHasExercises.map((exercise, index) => (
          <CardWhite key={index}>
            <h2 onClick={() => ClickExercise(selectedGroup.trainingGroupHasExercises)}>{exerciseNames[exercise.exerciseId]}</h2>
            <div className="icon-middle">
              <FaDumbbell size={80} />
            </div>
            <p>Observação: {exercise.observation}</p>
            <h3>-------</h3>
            {JSON.parse(exercise.trainingSetJsonString).map((set, setIndex) => (
              <div className="training-set" key={setIndex}>
                <p>Repetição: {set.repeticao}</p>
                <p>Carga: {set.carga}</p>
                <p>Descanso: {set.descanso}</p>
              </div>
            ))}
          </CardWhite>
        ))}
      </div>
    </div>
  );
};

export default Training;
