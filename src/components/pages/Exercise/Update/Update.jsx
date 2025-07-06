import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../SideBar/Sidebar";
import "./style.css";

const ExerciseUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const exerciseId = location.state?.id;
  const [token] = useState(localStorage.getItem('token'));

  const [exerciseName, setExerciseName] = useState('');
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [similarExercises, setSimilarExercises] = useState([]);
  const [selectedSimilarExercises, setSelectedSimilarExercises] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [muscleRes, similarRes, exerciseRes] = await Promise.all([
          fetch("http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/MuscularGroup", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise/${exerciseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const [muscleData, similarData, exerciseData] = await Promise.all([
          muscleRes.json(), similarRes.json(), exerciseRes.json()
        ]);

        setMuscleGroups(muscleData);
        setSimilarExercises(similarData);
        setExerciseName(exerciseData.name);
        setSelectedMuscleGroup(exerciseData.muscularGroup?.id || '');
        setSelectedSimilarExercises(exerciseData.equivalentExercises.map(ex => ex.id));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (exerciseId) fetchData();
  }, [exerciseId, token]);

  const handleUpdate = async () => {
    if (!exerciseName.trim() || !selectedMuscleGroup) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      name: exerciseName,
      status: "valido",
      trainerId: "1",
      muscularGroupId: selectedMuscleGroup,
      equivalentExerciseIds: selectedSimilarExercises
    };

    try {
      const res = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise/${exerciseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erro ao atualizar exercício");

      alert("Exercício atualizado com sucesso!");
      navigate("/ExerciseList2");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar o exercício.");
    }
  };

  return (
    <>
      <Sidebar  />
      <div className='main exercise-back'>
        <div className='title'>
          <h1>Editar Exercício</h1>
          <div className='underline'></div>
        </div>
        <div className='serieContainer'>
          <div className='text-input'>
            <label>
              <span className='labelTextArea'>Nome:</span>
              <input
                className="textArea"
                placeholder="Digite o nome do exercício"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </label>
          </div>
          <div className='text-input'>
            <label>
              <span className='labelTextArea'>Grupo Muscular:</span>
              <select
                className="textArea"
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              >
                <option value="">Selecione um grupo muscular</option>
                {muscleGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className='text-input'>
            <label>
              <span className='labelTextArea'>Exercícios Semelhantes:</span>
              <Select
                isMulti
                options={similarExercises.map(ex => ({ value: ex.id, label: ex.name }))}
                value={selectedSimilarExercises.map(id => {
                  const exercise = similarExercises.find(ex => ex.id === id);
                  return { value: id, label: exercise?.name || "Desconhecido" };
                })}
                onChange={(selected) => setSelectedSimilarExercises(selected.map(opt => opt.value))}
              />
            </label>
          </div>

          <div className="serie_btns">
            <button type='submit' className="concluirButton" onClick={handleUpdate}>
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExerciseUpdate;
