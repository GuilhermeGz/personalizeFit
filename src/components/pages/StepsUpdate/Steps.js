import React, { useState, useEffect } from "react";
import "./Steps.css";
import Sidebar from "../SideBar/Sidebar";
import Notificacao from "../Notificacao/Notificacao";
import { FaDumbbell, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function StepUpdate() {
  const [trainingName, setTrainingName] = useState("");
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [removedGroupIds, setRemovedGroupIds] = useState([]);
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

        const exerciseMap = exerciseOptions.reduce((acc, ex) => {
          acc[ex.id] = ex.name;
          return acc;
        }, {});

        const formattedGroups = filteredGroups.map(group => {
          const exercises = group.trainingGroupHasExercises.map(ex => {
            const exerciseName = exerciseMap[ex.exerciseId] || "Exercício Desconhecido";
            return {
              title: exerciseName,
              observacao: ex.observation || "",
              series: JSON.parse(ex.trainingSetJsonString || "[]"),
            };
          });

          return {
            id: group.id,
            name: group.name,
            exercises,
            trainingPresetId: group.trainingPreset.id
          };
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

  const handleInputChange = (groupIndex, exerciseIndex, serieIndex, field, value) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].exercises[exerciseIndex].series[serieIndex][field] = value;
    setGroups(updatedGroups);
  };

  const handleRemoveSerie = (groupIndex, exerciseIndex, serieIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].exercises[exerciseIndex].series.splice(serieIndex, 1);
    setGroups(updatedGroups);
  };

  const handleGroupNameChange = (index, value) => {
    const updatedGroups = [...groups];
    updatedGroups[index].name = value;
    setGroups(updatedGroups);
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup = {
      id: null,
      name: newGroupName,
      exercises: [],
      trainingPresetId: parseInt(id)
    };
    setGroups([...groups, newGroup]);
    setNewGroupName("");
  };

  const handleRemoveGroup = (index) => {
    const groupToRemove = groups[index];
    if (groupToRemove.id) {
      setRemovedGroupIds(prev => [...prev, groupToRemove.id]);
    }
    const updatedGroups = [...groups];
    updatedGroups.splice(index, 1);
    setGroups(updatedGroups);
  };

  const handleAddSerie = (groupIndex, exerciseIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].exercises[exerciseIndex].series.push({
      repeticao: "",
      carga: "",
      descanso: "",
    });
    setGroups(updatedGroups);
  };

  const handleAddExercise = (groupIndex) => {
    if (!selectedExercise) return;
    const newExercise = {
      title: selectedExercise,
      observacao: "",
      series: [{ repeticao: "", carga: "", descanso: "" }],
    };
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].exercises.push(newExercise);
    setGroups(updatedGroups);
    setSelectedExercise("");
  };

  const handleRemoveExercise = (groupIndex, exerciseIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].exercises.splice(exerciseIndex, 1);
    setGroups(updatedGroups);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (trainingName.trim() === "") {
      alert("Por favor, insira um título para o treino.");
      return;
    }
  
    if (groups.length === 0) {
      alert("Adicione ao menos um grupo.");
      return;
    }
  
    for (const group of groups) {
      if (!group.name.trim()) {
        alert("Nome de grupo não pode estar vazio.");
        return;
      }
  
      if (!group.exercises || group.exercises.length === 0) {
        alert(`O grupo "${group.name}" precisa conter ao menos um exercício.`);
        return;
      }
  
      for (const exercise of group.exercises) {
        const matchingExercise = exerciseOptions.find(opt => opt.name === exercise.title);
        if (!matchingExercise) {
          alert(`O exercício "${exercise.title}" não é válido.`);
          return;
        }
  
        if (!exercise.series || exercise.series.length === 0) {
          alert(`O exercício "${exercise.title}" precisa ter ao menos uma série.`);
          return;
        }
  
        for (const [i, serie] of exercise.series.entries()) {
          if (
            !serie.repeticao.trim() ||
            !serie.carga.trim() ||
            !serie.descanso.trim()
          ) {
            alert(`Preencha todos os campos da série ${i + 1} do exercício "${exercise.title}".`);
            return;
          }
        }
      }
    }
  
    try {
      // Atualiza título
      await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: trainingName,
          presetDefaultFlag: true,
          studentHasTrainingPresets: []
        }),
      });
  
      // Remove grupos marcados
      for (const groupId of removedGroupIds) {
        await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingGroup/${groupId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      // Atualiza ou cria grupos
      for (const group of groups) {
        const trainingGroupHasExercises = group.exercises.map((exercise) => {
          const exerciseId = exerciseOptions.find(opt => opt.name === exercise.title)?.id;
          return {
            exerciseId,
            observation: exercise.observacao,
            trainingSetJsonString: JSON.stringify(exercise.series)
          };
        });
  
        const payload = {
          name: group.name,
          trainingPresetId: group.trainingPresetId,
          trainingGroupHasExercises
        };
  
        const method = group.id ? "PUT" : "POST";
        const url = group.id
          ? `http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingGroup/${group.id}`
          : `http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingGroup`;
  
        await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }
  
      alert("Treino atualizado com sucesso!");
      navigate(`/NewTreino`, { state: { userData } });
    } catch (error) {
      console.error("Erro ao salvar treino:", error);
      alert("Erro ao salvar o treino.");
    }
  };
  

  return (
    <div className="body">
      <Sidebar />
      <Notificacao />
      <div className="body001">
        <div className="newTreino-content001">
          <h2 className="header001">Editar Treino</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group001">
              <label>Título</label>
              <input
                type="text"
                value={trainingName}
                onChange={(e) => setTrainingName(e.target.value)}
              />
            </div>
            <div className="input-group001">
              <label>Novo Grupo</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <button type="button" className="add-button001" onClick={handleAddGroup}>Adicionar Grupo</button>
            </div>

            {groups.length > 0 && (
              <div className="group-list001">
                {groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="group-item001">
                    <div className="group-header001">
                    {expandedGroup === groupIndex ? (
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) => handleGroupNameChange(groupIndex, e.target.value)}
                      />
                        ) : (
                          <span>{group.name}</span>
                        )}
                      <span className="expand" onClick={() => toggleExpandGroup(groupIndex)}>
                        {expandedGroup === groupIndex ? "▼" : "▶"}  
                      </span>
                      <FaTimes className="trash001" onClick={() => handleRemoveGroup(groupIndex)} />

                    </div>

                    {expandedGroup === groupIndex && (
                      <div className="group-content001">
                        <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
                          <option value="">Selecione um exercício</option>
                          {exerciseOptions.map((exercise) => (
                            <option key={exercise.id} value={exercise.name}>{exercise.name}</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => handleAddExercise(groupIndex)} className="add-button001 add-exercise001">
                          <FaPlus />
                        </button>
                        {group.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="exercise-item001">
                            <div className="exercise-header001">
                              <span onClick={() => toggleExpandExercise(groupIndex, exerciseIndex)}>
                                {exercise.title} {expandedExercise?.groupIndex === groupIndex && expandedExercise?.exerciseIndex === exerciseIndex ? "▼" : "▶"}
                              </span>
                              <FaTimes className="trash001" onClick={() => handleRemoveExercise(groupIndex, exerciseIndex)} title="Excluir exercício" />
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
                                      onChange={(e) => {
                                        const updatedGroups = [...groups];
                                        updatedGroups[groupIndex].exercises[exerciseIndex].observacao = e.target.value;
                                        setGroups(updatedGroups);
                                      }}
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
                                      <th>Ação</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {exercise.series.map((serie, serieIndex) => (
                                      <tr key={serieIndex}>
                                        <td className="serieNumber">{serieIndex + 1}</td>
                                        <td><input type="text" value={serie.repeticao} onChange={(e) => handleInputChange(groupIndex, exerciseIndex, serieIndex, 'repeticao', e.target.value)} /></td>
                                        <td><input type="text" value={serie.carga} onChange={(e) => handleInputChange(groupIndex, exerciseIndex, serieIndex, 'carga', e.target.value)} /></td>
                                        <td><input type="text" value={serie.descanso} onChange={(e) => handleInputChange(groupIndex, exerciseIndex, serieIndex, 'descanso', e.target.value)} /></td>
                                        <td>
                                          {exercise.series.length > 1 && (
                                            <FaTrash className="trash001" onClick={() => handleRemoveSerie(groupIndex, exerciseIndex, serieIndex)} title="Remover série"/>
                                          )}
                                      </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <button type="button" className="add-button001" onClick={() => handleAddSerie(groupIndex, exerciseIndex)}>Adicionar</button>
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

            <div className="form-buttons001">
              <button type="button" className="cancel-button001" onClick={() => navigate(-1)}>
                Cancelar
              </button>
              <button type="submit" className="save-button001">
                Atualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StepUpdate;