import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaDumbbell, FaPlus } from 'react-icons/fa';
import "./style.css";
import { useLocation } from "react-router-dom";


const Create = () => {
    const [exerciseName, setExerciseName] = useState('');
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
    const [similarExercises, setSimilarExercises] = useState([]);
    const [selectedSimilarExercises, setSelectedSimilarExercises] = useState([]);
    const location = useLocation();
    const userData = location.state && location.state.userData;

    useEffect(() => {
        const fetchMuscleGroups = async () => {
            try {
                const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/MuscularGroup', {
                    headers: {
                        'Authorization': `Bearer ${userData.access_token}`
                    }
                });
                const data = await response.json();
                setMuscleGroups(data);
            } catch (error) {
                console.error('Erro ao buscar os grupos musculares:', error);
            }
        };
    
        fetchMuscleGroups();
    }, []);
    
    useEffect(() => {
        const fetchSimilarExercises = async () => {
            try {
                // const token = 'xxx'; 
                const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise', {
                    headers: {
                        'Authorization': `Bearer ${userData.access_token}`
                    }
                });
                const data = await response.json();
                setSimilarExercises(data);
            } catch (error) {
                console.error('Erro ao buscar os exercícios semelhantes:', error);
            }
        };
    
        fetchSimilarExercises();
    }, []);

    const clearFields = () => {
        setExerciseName('');
        setSelectedMuscleGroup('');
        setSelectedSimilarExercises([]);
    };

    const handleRequest = () => {
        const exerciseData = {
            name: exerciseName,
            muscularGroupId: selectedMuscleGroup,
            equivalentExerciseIds: selectedSimilarExercises,
            status: "valido",
            trainerId: "inexistente"
        };

        console.log(exerciseData);
    
        fetch('http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData}` 
            },
            body: JSON.stringify(exerciseData)
        })
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then(data => {
            clearFields();

            console.log('Resposta da solicitação POST:', data);
        })
        .catch(error => {
            console.error('Erro na solicitação POST:', error);
        });
    };
    

    return (
        <div className='main'>
            <div className='title'>
                <h1>Solicitação de Exercício</h1>
                <div className='underline'></div>
            </div>
            <div className='serieContainer'>
                <div className='text-input'>
                    <label htmlFor="exercicioInput" className="exercicioLabel">
                        <span className='labelTextArea'>Nome:</span>
                        <input
                            className="textArea"
                            id="exercicioInput"
                            placeholder="Digite aqui"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                        />
                    </label>
                </div>
                <div className='text-input'>
                    <label htmlFor="grupoMuscularInput">
                        <span className='labelTextArea'>Grupo Muscular:</span>
                        <select
                            className="textArea"
                            id="grupoMuscularInput"
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
                    <label htmlFor="exerciciosSemelhantesInput">
                        <span className='labelTextArea'>Exercícios Semelhantes:</span>
                        <Select className='fonn'
                            defaultValue={[]}
                            placeholder="Exercicios Semelhantes"
                            isMulti
                            name="exerciciosSemelhantes"
                            options={similarExercises.map(exercise => ({
                                value: exercise.id,
                                label: exercise.name
                            }))}
                            value={selectedSimilarExercises.map(exerciseId => ({
                                value: exerciseId,
                                label: similarExercises.find(exercise => exercise.id === exerciseId).name
                            }))}
                            onChange={(selectedOptions) => {
                                setSelectedSimilarExercises(selectedOptions.map(option => option.value));
                            }}
                        />
                    </label>
                </div>
                <div className="content">
                    <div className="cardContainer">
                        <div className="bntAccountContainer">
                            <FaPlus className='icon' />
                            <p className="cardText">Adicionar Exercício</p>
                        </div>
                    </div>
                    {/* <div className="cardContainer">
                        <div className="bntAccountContainer">
                            <FaDumbbell className='icon' />
                            <p className="cardText">Exercício 1</p>
                        </div>
                    </div> */}
                </div>
                <div className="serie_btns">
                    <button type='submit' className="concluirButton" onClick={handleRequest}>
                        <span>Solicitar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Create;
