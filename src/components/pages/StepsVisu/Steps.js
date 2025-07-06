import React, { useState, useEffect } from "react";
import "./Steps.css";
import Sidebar from "../SideBar/Sidebar";
import Notificacao from "../Notificacao/Notificacao";
import { FaDumbbell } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function StepUpdate() {
  const [trainingName, setTrainingName] = useState("");
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const [token] = useState(localStorage.getItem("token"));
  const id = location.state?.id;

  useEffect(() => {
    const fetchTrainingGroups = async () => {
      try {
        const res = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingGroup", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const filteredGroups = data.filter(group => group.trainingPreset.id === parseInt(id));
        if (filteredGroups.length === 0) {
          console.warn("Nenhum grupo encontrado para o treino.");
          return;
        }

        setTrainingName(filteredGroups[0].trainingPreset.title);

        const formattedGroups = filteredGroups.map(group => {
          const exercises = group.trainingGroupHasExercises.map(ex => {
            const exerciseName = exerciseOptions.find(opt => opt.id === ex.exerciseId)?.name || "Exercício Desconhecido";
            return {
              title: exerciseName,
              observacao: ex.observation || "",
              series: JSON.parse(ex.trainingSetJsonString || "[]"),
            };
          });

          return { name: group.name, exercises };
        });

        setGroups(formattedGroups);
      } catch (err) {
        console.error("Erro ao buscar grupos do treino:", err);
      }
    };

    if (exerciseOptions.length > 0) fetchTrainingGroups();
  }, [exerciseOptions, id]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setExerciseOptions(data);
      } catch (error) {
        console.error("Erro ao carregar exercícios:", error);
      }
    };

    fetchExercises();
  }, []);

  const toggleExpandGroup = (index) => {
    setExpandedGroup(expandedGroup === index ? null : index);
  };

  const toggleExpandExercise = (groupIndex, exerciseIndex) => {
    setExpandedExercise(
      expandedExercise?.groupIndex === groupIndex &&
      expandedExercise?.exerciseIndex === exerciseIndex
        ? null
        : { groupIndex, exerciseIndex }
    );
  };

  return (
    <div className="body">
      <Sidebar />
      <Notificacao />
      <div className="body001">
        <div className="newTreino-content001">
          <h2 className="header001">Visualizar Treino</h2>

          <div className="input-group001">
            <label>Título</label>
            <input type="text" value={trainingName} readOnly  />
          </div>

          <div className="input-group001">
              <label>Grupos</label>
            </div>

          {groups.length > 0 && (
            <div className="group-list001">
              {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="group-item001">
                  <div className="group-header001">
                    <span onClick={() => toggleExpandGroup(groupIndex)}>
                      {group.name} {expandedGroup === groupIndex ? "▼" : "▶"}
                    </span>
                  </div>

                  {expandedGroup === groupIndex && (
                    <div className="group-content001">
                      {group.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="exercise-item001">
                          <div className="exercise-header001">
                            <span onClick={() => toggleExpandExercise(groupIndex, exerciseIndex)}>
                              {exercise.title} {expandedExercise?.groupIndex === groupIndex && expandedExercise?.exerciseIndex === exerciseIndex ? "▼" : "▶"}
                            </span>
                          </div>

                          {expandedExercise?.groupIndex === groupIndex && expandedExercise?.exerciseIndex === exerciseIndex && (
                            <div className="exercise-content001">
                              <div className="icon-wrapper">
                                <FaDumbbell className="halter-icon" />
                              </div>

                              <div className="text-input">
                                <label>
                                  <span className="labelTextArea">Observações:</span>
                                  <textarea
                                    className="textArea"
                                    placeholder="  Digite observações do exercício"
                                    value={exercise.observacao}
                                    disabled
                                  ></textarea>
                                </label>
                              </div>

                              <table className="exercise-table">
                                <thead>
                                  <tr>
                                    <th>Série</th>
                                    <th>Repetição</th>
                                    <th>Carga</th>
                                    <th>Descanso</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {exercise.series.map((serie, serieIndex) => (
                                    <tr key={serieIndex}>
                                      <td className="serieNumber">{serieIndex + 1}</td>
                                      <td><input type="text" value={serie.repeticao} disabled /></td>
                                      <td><input type="text" value={serie.carga} disabled /></td>
                                      <td><input type="text" value={serie.descanso} disabled /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="form-buttons0012">
            <button type="button" className="cancel-button0012" onClick={() => navigate(-1)}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepUpdate;
