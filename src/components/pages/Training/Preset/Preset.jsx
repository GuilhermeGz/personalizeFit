import "./style.css";
import { FaDumbbell, FaTrash, FaPlus } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

const Preset = () => {
    const [trainingPresetList, setTrainingPresetList] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchTrainingPresetList = async () => {
            const response = await fetch('http://localhost:8000/training/api/TrainingPreset');
            const data = await response.json();
            setTrainingPresetList(data);
        };

        fetchTrainingPresetList();
    }, []);

    const filteredPresetList = trainingPresetList.filter(preset =>
        preset.title.toLowerCase().includes(searchValue.toLowerCase())
    );

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
                            placeholder='Pesquisar Predefinição de Treino'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </label>
                </div>
                <h1>Predefinições</h1>

                <div className="content">
                    <div className="cardContainer">
                        <Link to='/Training/Create'> 
                            <div className="bntAccountContainer">
                                <FaPlus className='icon' />
                                <p className="cardText">Adicionar</p>
                            </div>
                        </Link>
                    </div>

                    {filteredPresetList.map((preset, index) => (
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
