import React, { useState, useEffect } from "react";
import "./Steps.css";
import Sidebar from "../SideBar/Sidebar";
import Notificacao from "../Notificacao/Notificacao";
import { FaTrash, FaPlus, FaTimes, FaDumbbell } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function TrainingForm() {
  const [trainingName, setTrainingName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setExerciseOptions(data); // API retorna [{ id, name }]
      } catch (error) {
        console.error("Erro ao carregar exercícios:", error);
      }
    };

    fetchExercises();
  }, []);

  const handleAddGroup = () => {
    if (groupName.trim() === "") {
      alert("Digite um nome para o grupo antes de adicioná-lo.");
      return;
    }
  
    setGroups([...groups, { name: groupName, exercises: [] }]);
    setGroupName("");
  };
  

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

  const handleAddExercise = (groupIndex) => {
    if (selectedExercise) {
      const newExercise = {
        title: selectedExercise,
        observacao: "", // Novo campo
        series: [{ repeticao: "", carga: "", descanso: "" }],
      };
      const updatedGroups = [...groups];
      updatedGroups[groupIndex].exercises.push(newExercise);
      setGroups(updatedGroups);
      setSelectedExercise("");
    }
  };
  

  const handleInputChange = (groupIndex, exerciseIndex, serieIndex, field, value) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].exercises[exerciseIndex].series[serieIndex][field] = value;
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

  const handleRemoveSerie = (groupIndex, exerciseIndex, serieIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].exercises[exerciseIndex].series.splice(serieIndex, 1);
    setGroups(updatedGroups);
  };

  const handleRemoveGroup = (groupIndex) => {
    const updatedGroups = [...groups];
    updatedGroups.splice(groupIndex, 1);
    setGroups(updatedGroups);
  };

  const handleRemoveExercise = (groupIndex, exerciseIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].exercises.splice(exerciseIndex, 1);
    setGroups(updatedGroups);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const presetPayload = {
      title: trainingName,
      presetDefaultFlag: true,
      studentHasTrainingPresets: []
    };

    try {
      const presetRes = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(presetPayload),
      });

      const createdPresetId = await presetRes.json();
      console.log(createdPresetId);
      
      const trainingPresetId = createdPresetId;
      
      if (!trainingPresetId) {
        alert("Erro ao obter o ID do preset criado.");
        return;
      }
      

      for (const group of groups) {
        const trainingGroupHasExercises = [];

        for (const exercise of group.exercises) {
          const trainingSet = exercise.series.map((serie) => ({
            repeticao: serie.repeticao,
            carga: serie.carga,
            descanso: serie.descanso
          }));

          const matchingExercise = exerciseOptions.find(opt => opt.name === exercise.title);
          const exerciseId = matchingExercise?.id;

          if (exerciseId) {
            trainingGroupHasExercises.push({
              exerciseId,
              observation: exercise.observacao || "", // usa observacao real
              trainingSetJsonString: JSON.stringify(trainingSet)
            });
          }
        }

        const groupPayload = {
          name: group.name,
          trainingPresetId,
          trainingGroupHasExercises
        };

        await fetch("http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingGroup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(groupPayload),
        });
      }

      alert("Treino salvo com sucesso!");
      navigate(`/NewTreino`, { state: { userData } });

    } catch (error) {
      console.error("Erro na solicitação:", error);
      alert("Erro ao salvar o treino.");
    }
  };

  return (
    <div className="body">
      <Sidebar />
      <Notificacao />
      <div className="body001">
        <div className="newTreino-content001">
          <h2 className="header001">Cadastro de Treino</h2>
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
              <label>Grupo</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button type="button" className="add-button001" onClick={handleAddGroup}>
                Adicionar Grupo
              </button>
            </div>

            {groups.length > 0 && (
              <div className="group-list001">
                {groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="group-item001">
                    <div className="group-header001">
                      <span onClick={() => toggleExpandGroup(groupIndex)}>
                        {group.name} {expandedGroup === groupIndex ? "▼" : "▶"}
                      </span>
                      <FaTimes
                        className="trash001"
                        onClick={() => handleRemoveGroup(groupIndex)}
                        title="Excluir grupo"
                      />
                    </div>
                    {expandedGroup === groupIndex && (
                      <div className="group-content001">
                        <select
                          value={selectedExercise}
                          onChange={(e) => setSelectedExercise(e.target.value)}
                        >
                          <option value="">Selecione um exercício</option>
                          {exerciseOptions.map((exercise) => (
                            <option key={exercise.id} value={exercise.name}>
                              {exercise.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleAddExercise(groupIndex)}
                          className="add-button001 add-exercise001"
                        >
                          <FaPlus />
                        </button>
                        {group.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="exercise-item001">
                            <div className="exercise-header001">
                              <span onClick={() => toggleExpandExercise(groupIndex, exerciseIndex)}>
                                {exercise.title}{" "}
                                {expandedExercise?.groupIndex === groupIndex &&
                                expandedExercise?.exerciseIndex === exerciseIndex
                                  ? "▼"
                                  : "▶"}
                              </span>
                              <FaTimes
                                className="trash001"
                                onClick={() => handleRemoveExercise(groupIndex, exerciseIndex)}
                                title="Excluir exercício"
                              />
                            </div>
                            {expandedExercise?.groupIndex === groupIndex &&
                              expandedExercise?.exerciseIndex === exerciseIndex && (
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
                                          <td>
                                            <input
                                              type="text"
                                              placeholder="Repetição"
                                              value={serie.repeticao}
                                              onChange={(e) =>
                                                handleInputChange(groupIndex, exerciseIndex, serieIndex, 'repeticao', e.target.value)
                                              }
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="text"
                                              placeholder="Carga"
                                              value={serie.carga}
                                              onChange={(e) =>
                                                handleInputChange(groupIndex, exerciseIndex, serieIndex, 'carga', e.target.value)
                                              }
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="text"
                                              placeholder="Descanso"
                                              value={serie.descanso}
                                              onChange={(e) =>
                                                handleInputChange(groupIndex, exerciseIndex, serieIndex, 'descanso', e.target.value)
                                              }
                                            />
                                          </td>
                                          <td className="trash-pos001">
                                            {exercise.series.length > 1 && (
                                              <FaTrash
                                                className="trash001"
                                                onClick={() =>
                                                  handleRemoveSerie(groupIndex, exerciseIndex, serieIndex)
                                                }
                                                title="Remover série"
                                              />
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  <button
                                    type="button"
                                    onClick={() => handleAddSerie(groupIndex, exerciseIndex)}
                                    className="add-button001"
                                  >
                                    Adicionar
                                  </button>
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
                Salvar Treino
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TrainingForm;
