import React, { useState, useEffect } from 'react';
import "./style.css";
import { FaDumbbell, FaTrash, FaPlus } from 'react-icons/fa';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Create = () => {
    const [series, setSeries] = useState([]);
    const [observation, setObservation] = useState('');
    const [exerciseName, setExerciseName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const exerciseId = location.state && location.state.exerciseId;
    const [trainingAux, setTrainingAux] = useState(location.state && location.state.trainingAux);
    const [requestProcessed, setRequestProcessed] = useState(false);
    const tipo = location.state && location.state.tipo;

    const handleAddSerie = () => {
      const newSeries = series.concat({
        repeticao: "",
        carga: "",
        descanso: "",
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
      const newTrainingGroupHasExercises = [
        ...trainingAux.trainingGroupHasExercises,
        {
          exerciseId: exerciseId,
          observation: observation,
          trainingSetJsonString: trainingSetJsonString,
        },
      ];

      setTrainingAux({
        ...trainingAux,
        trainingGroupHasExercises: newTrainingGroupHasExercises,
      });

      setRequestProcessed(true);
    };

    useEffect(() => {
      console.log(tipo);

      console.log("Update 1");
      if (requestProcessed) {
        console.log("ta entrando aqui");
        console.log("Novo trainingAux:", trainingAux);

        if (tipo == "create") {
          navigate(`/Training/Create`, {
            state: { trainingAux1: trainingAux },
          });
        } else {
          navigate(`/Training/Update`, {
            state: { trainingGroup: trainingAux },
          });
        }
      }
    }, [requestProcessed]);

    useEffect(() => {
      console.log("Update 2");
      console.log(exerciseId);
      console.log(trainingAux);
      const fetchExerciseName = async () => {
        console.log("ta entrando aqui222");

        try {
          const response = await fetch(
            `http://localhost:8000/exercise/api/Exercise/${exerciseId}`
          );
          const data = await response.json();
          setExerciseName(data.name);
        } catch (error) {
          console.error("Erro ao buscar o nome do exercício:", error);
        }
      };

      if (exerciseId) {
        fetchExerciseName();
      }
    }, [exerciseId]);



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

export default Create;
