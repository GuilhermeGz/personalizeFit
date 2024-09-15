import React, { useEffect, useState } from 'react';
import "./style.css";
import { FaPlus, FaDumbbell, FaTimes } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Create = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [inputName, setInputName] = useState(""); 
    const [exercises, setExercises] = useState([]);
    const [update, setUpdate] = useState(location.state && location.state.update);
    const userData = location.state && location.state.userData;
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [trainingAux, setTrainingAux] = useState({
        name: "TrainingAux",
        trainingPresetId: update ? location.state.update : 1,
        trainingGroupHasExercises: []
    });

    const getExerciseNameById = async (exerciseId) => {
        try {
            const response = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise/${exerciseId}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error('Erro ao buscar o nome do exercício:', error);
            return "Nome do Exercício " + exerciseId;
        }
    };

    const handleConcluirClick = () => {
        navigate(`/Training/Preset`, { state: { userData: userData}});
    };

    const handleConcluirClick1 = () => {
        navigate(`/Exercise/List`, { state: { trainingAux, tipo: "create", userData: userData } });
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
        console.log("Dados do Usuário");
        console.log(userData);
 
        if (trainingAux.name != "TrainingAux") {
            console.log("entrou");
            console.log(trainingAux);

            fetch('http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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

            navigate(`/Training/Preset`, { state: {userData: userData}  });
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

    
    const handleButtonClickDelete = (exercise) => {
        const updatedExercises = trainingAux.trainingGroupHasExercises.filter(item => item.exerciseId !== exercise.exerciseId);
        setTrainingAux(prevState => ({
            ...prevState,
            trainingGroupHasExercises: updatedExercises
        }));

        setExercises(updatedExercises);

        console.log("Deletar");
        console.log(trainingAux);
        console.log(exercises);
    }
    
    
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
                                <FaTimes className='trashCard' onClick={(e) => { e.stopPropagation(); handleButtonClickDelete(exercise); }} />
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
