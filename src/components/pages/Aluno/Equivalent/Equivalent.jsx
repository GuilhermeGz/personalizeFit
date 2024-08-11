import React, { useState, useEffect } from "react";
import { FaDumbbell } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./Equivalent.css";
import CardWhite from "../../Cards/Divisao/CardWhite";

const Equivalent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const userExerciseId = location.state && location.state.id;
  const [equivalentExercises, setEquivalentExercises] = useState([]);

  useEffect(() => {
    getEquivalentExercises(userExerciseId);
  }, []);

  const getEquivalentExercises = async (id) => {
    try {
      const response = await fetch(
        `http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      const equivalentExercises = data.equivalentExercises;
      setEquivalentExercises(equivalentExercises);

      equivalentExercises.forEach((exercise) => {
        getEquivalentExerciseDetails(exercise.id);
      });
    } catch (error) {
      console.error("Erro ao buscar os exercícios equivalentes:", error);
    }
  };

  const getEquivalentExerciseDetails = async (id) => {
    try {
      const response = await fetch(
        `http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      setEquivalentExercises(prevExercises => {
        return prevExercises.map(exercise => {
          if (exercise.id === id) {
            return {
              ...exercise,
              details: data
            };
          }
          return exercise;
        });
      });
    } catch (error) {
      console.error("Erro ao buscar os detalhes do exercício equivalente:", error);
    }
  };

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
      </div>
      <div className="title">
        <div className="underline"></div>
      </div>
      <div className="content">
        {equivalentExercises.map((exercise, index) => (
          <CardWhite key={index}>
            <h2>{exercise.name}</h2>
            <div className="icon-middle">
              <FaDumbbell size={80} />
            </div>
            {exercise.details && (
              <div>
                <p>Grupo Muscular: {exercise.details.muscularGroup.name}</p>
              </div>
            )}
       
          </CardWhite>
        ))}
      </div>
    </div>
  );
};

export default Equivalent;
