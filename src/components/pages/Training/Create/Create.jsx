// Aqui você pode enviar o novo trainingAux para o backend
import React, { useEffect, useState } from 'react';
import "./style.css";
import { FaPlus, FaDumbbell } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Create = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [inputName, setInputName] = useState(""); 
    const [exercises, setExercises] = useState([]);

    const [trainingAux, setTrainingAux] = useState({
        name: "TrainingAux",
        trainingPresetId: 1,
        trainingGroupHasExercises: []
    });

    const getExerciseNameById = async (exerciseId) => {
        try {
            const response = await fetch(`http://localhost:8000/exercise/api/Exercise/${exerciseId}`);
            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error('Erro ao buscar o nome do exercício:', error);
            return "Nome do Exercício " + exerciseId;
        }
    };

    const handleConcluirClick = () => {
        navigate(`/Training/Preset`);
    };

    const handleConcluirClick1 = () => {
        navigate(`/Exercise/List`, { state: { trainingAux } });
    };

    const handleConcluirClick2 = () => {
        if (inputName.trim() !== "") {
            setTrainingAux(prevState => ({
                ...prevState,
                name: inputName
            }));
        }
    };

    useEffect(() => {
        if (trainingAux.name != "TrainingAux") {
            console.log("entrou");
            console.log(trainingAux);

            fetch('http://localhost:8000/training/api/TrainingGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trainingAux)
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

            navigate(`/Training/Preset`);
        }
    }, [trainingAux]);

    useEffect(() => {
        const initializeTrainingAux = () => {
            if (location.state && location.state.trainingAux1) {
                console.log("trainingAux1 encontrado na localização:");
                console.log(location.state.trainingAux1);
                setTrainingAux(location.state.trainingAux1);
            } else {
                console.log("Criando um novo trainingAux padrão...");
            }
        };
    
        initializeTrainingAux();    
        console.log(trainingAux);
    }, [location.state]);

    useEffect(() => {
        if (trainingAux.trainingGroupHasExercises.length > 0) {
            const fetchExercises = async () => {
                const updatedExercises = [];
                for (const exercise of trainingAux.trainingGroupHasExercises) {
                    const name = await getExerciseNameById(exercise.exerciseId);
                    updatedExercises.push({ ...exercise, name });
                }
                setExercises(updatedExercises);
            };
            fetchExercises();
        }
    }, [trainingAux]);

    return (
        <div className='main'>
            <div>
                <div className='title'>
                    <h1>Predefinição de Treinos</h1>
                    <div className='underline'></div>
                </div>
                <div className='text-input'>
                    <label htmlFor="">
                        <input
                            type="text"
                            placeholder='Título da Predefinição'
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)} 
                        />                    
                    </label>
                </div>
                <h1>Exercícios</h1>

                <div className="content">
                    
                    <div className="cardContainer" onClick={handleConcluirClick1}>
                        <div className="bntAccountContainer">
                            <FaPlus className='icon' />
                            <p className="cardText">Adicionar Exercício</p>
                        </div>
                    </div>

                    {exercises.map((exercise, index) => (
                        <div className="cardContainer" key={index}>
                            <div className="bntAccountContainer">
                                <FaDumbbell className='icon' />
                                <p className="cardText">{exercise.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='serie_btns'>
                    <button type='submit' className="concluirButton cancelarButton" onClick={handleConcluirClick}>
                        Cancelar
                    </button>

                    <button type='submit' className="concluirButton" onClick={handleConcluirClick2}>
                        Concluir
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Create;
