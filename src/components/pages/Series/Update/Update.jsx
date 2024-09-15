import React, { useState, useEffect } from 'react';
import "./style.css";
import { FaDumbbell, FaTrash, FaPlus } from 'react-icons/fa';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Update = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const exerciseId = location.state && location.state.exercise.exerciseId;
    const [requestProcessed, setRequestProcessed] = useState(false);
    const [exerciseAux, setExerciseAux] = useState(location.state && location.state.exercise);
    const [observation, setObservation] = useState(exerciseAux.observation);
    const [exerciseName, setExerciseName] = useState(exerciseAux.name);
    const [series, setSeries] = useState([]);
    const userData = location.state && location.state.userData;
    const [token, setToken] = useState(localStorage.getItem('token'));


    const handleAddSerie = () => {
        const newSeries = series.concat({
            repeticao: "",
            carga: "",
            descanso: ""
        });
        setSeries(newSeries);
    };

    const handleRemoveSerie = (index) => {
        const newSeries = [...series];
        newSeries.splice(index, 1);
        setSeries(newSeries);
    };

    const handleInputChange = (index, field, value) => {
        const newSeries = [...series];
        newSeries[index][field] = value;
        setSeries(newSeries);
    };


    const handleRequest = async () => {
        const trainingSetJsonString = JSON.stringify(series);
        const newTrainingGroupHasExercises = 
            {
                exerciseId: exerciseAux.exerciseId,
                observation: observation,
                name: exerciseAux.name,
                trainingSetJsonString: trainingSetJsonString
            }
        ;
 
        setExerciseAux(newTrainingGroupHasExercises);
        setRequestProcessed(true);
    };
    
    useEffect(() => {
        if (requestProcessed) {
            console.log("Novo trainingAux:", exerciseAux);
            console.log(location.state.trainingAux);
            navigate(`/Training/Update`, { state: { exerciseAux: exerciseAux, trainingGroup: location.state.trainingAux, userData: userData } });
        }
    }, [requestProcessed]);


    

    useEffect(() => {
        const trainingSet = JSON.parse(exerciseAux.trainingSetJsonString);
        setSeries(trainingSet); 
        console.log(exerciseAux);
    }, []);

    return (
        <div className='main'>
            <div className='title'>
                <h1>Definição de Séries</h1>
                <div className='underline'></div>
            </div>
            <div className='serieContainer'>
                <div className="cardContainer">
                    <div className="bntAccountContainer">
                        <FaDumbbell className='icon' />
                        <p className="cardText">{exerciseName}</p>
                    </div>
                </div>
                <div className='text-input'>
                    <label htmlFor="exercicioInput">
                        <span className='labelTextArea'>Observações:</span>
                        <textarea
                            className="textArea"
                            id="exercicioInput"
                            placeholder=' Digite aqui'
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                        ></textarea>
                    </label>
                </div>
                <div className="titleSerie">
                    <h4>Séries</h4>
                    <button className="addSerieButton" onClick={handleAddSerie}>
                        <FaPlus className="addIcon" />
                    </button>
                </div>
                <div className='serieContent'>
                    {series.map((serie, index) => (
                        <div className="cardContent" key={index}>
                            <div className="linha">
                                <span>{index + 1}.</span>
                                <input
                                    type="text"
                                    placeholder="Repetição"
                                    value={serie.repeticao}
                                    onChange={(e) => handleInputChange(index, 'repeticao', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Carga"
                                    value={serie.carga}
                                    onChange={(e) => handleInputChange(index, 'carga', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Descanso"
                                    value={serie.descanso}
                                    onChange={(e) => handleInputChange(index, 'descanso', e.target.value)}
                                />
                                <FaTrash
                                    className="trash"
                                    size={60}
                                    color="red"
                                    onClick={() => handleRemoveSerie(index)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

         
                <div className='serie_btns'>
                    <button type='submit' className="concluirButton" onClick={handleRequest}>
                        Concluir
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Update;
