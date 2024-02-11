import "./style.css";
import { FaDumbbell, FaTrash, FaPlus   } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';


const Preset = () => {

    const [trainingPresetList, setTrainingPresetList] = useState([]);

    useEffect(() => {
        const fetchTrainingPresetList = async () => {
            const response = await fetch('http://localhost:8000/training/api/TrainingPreset');
            const data = await response.json();
            setTrainingPresetList(data);
        };

        fetchTrainingPresetList();
    }, []); 

    return (
        <div className='main'>
            <div>
                <div className='title'>
                    <h1>Predefinição de Treinos</h1>
                    <div className='underline'></div>
                </div>
                <div className='text-input'>
                    <label htmlFor="">
                        <input type="text" placeholder='Predefinição de Treino'/>
                    </label>
                </div>
                <h1>Predefinições</h1>

                <div className="content">

                    <div className="cardContainer">
                        <div className="bntAccountContainer">
                            <i className="icon">+</i>
                            <p className="cardText">Adiconar</p>
                        </div>
                    </div>

                    {trainingPresetList.map((preset, index) => (
                        <div className="cardContainer" key={index}>
                            <div className="bntAccountContainer">
                                <FaDumbbell className='icon' />
                                <p className="cardText">{preset.title}</p>
                            </div>
                        </div>
                    ))}
                  
                </div>
            </div>
        </div>
    );
}

export default Preset;
