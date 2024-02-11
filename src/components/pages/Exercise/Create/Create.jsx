import React, { useState } from 'react';
import { FaDumbbell, FaTrash, FaPlus } from 'react-icons/fa';
import "./style.css";

const Create = () => {
    const [exerciseName, setExerciseName] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [similarExercises, setSimilarExercises] = useState('');

    const handleRequest = () => {
        const exerciseData = {
            name: "teste",
            muscularGroupId: "1",
            equivalentExerciseIds: [],
            status: "valido",
            trainerId: "inexistente"
        };

        fetch('http://localhost:8000/exercise/api/Exercise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
                        <input
                            className="textArea"
                            id="grupoMuscularInput"
                            placeholder="Digite aqui"
                            value={muscleGroup}
                            onChange={(e) => setMuscleGroup(e.target.value)}
                        />
                    </label>
                </div>
                <div className='text-input'>
                    <label htmlFor="exerciciosSemelhantesInput">
                        <span className='labelTextArea'>Exercícios Semelhantes:</span>
                        <input
                            className="textArea"
                            id="exerciciosSemelhantesInput"
                            placeholder="Digite aqui"
                            value={similarExercises}
                            onChange={(e) => setSimilarExercises(e.target.value)}
                        />
                    </label>
                </div>

                <div className="content">

                    <div className="cardContainer">
                        <div className="bntAccountContainer">
                            <FaPlus  className='icon' />
                            <p className="cardText">Adicionar Exercício</p>
                        </div>
                    </div>

                    <div className="cardContainer">
                        <div className="bntAccountContainer">
                            <FaDumbbell className='icon' />
                            <p className="cardText">Exercício 1</p>
                        </div>
                    </div>


                </div>

                <div className="titleSerieSS">
                    <button className="addSerieButton" onClick={handleRequest}>
                        <span>Solicitar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Create;
