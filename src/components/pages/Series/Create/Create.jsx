import React, { useState } from 'react';
import "./style.css";
import { FaDumbbell, FaTrash, FaPlus } from 'react-icons/fa';

const Create = () => {
    const [series, setSeries] = useState([]);
    const [observation, setObservation] = useState('');

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

    const handleRequest = () => {
        const trainingSetJsonString = JSON.stringify(series);
        const serieData = {
            name: "teste Serie",
            trainingPresetId: "1",
            trainingGroupHasExercises: [
                {
                    exerciseId: 1,
                    observation: observation,
                    trainingSetJsonString: trainingSetJsonString
                }
            ]
        };

        console.log(serieData);
        fetch('http://localhost:8000/training/api/TrainingGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serieData)
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
                <h1>Definição de Séries</h1>
                <div className='underline'></div>
            </div>
            <div className='serieContainer'>
                <div className="cardContainer">
                    <div className="bntAccountContainer">
                        <FaDumbbell className='icon' />
                        <p className="cardText">Exercício 1</p>
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
                                    size={20}
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
