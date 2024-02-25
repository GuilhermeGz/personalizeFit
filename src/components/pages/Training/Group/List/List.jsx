import "./style.css";
import { FaDumbbell, FaTrash, FaPlus } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const List = () => {
    const [trainingPresetList, setTrainingPresetList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log(location.state.trainingPreset);
        const fetchTrainingPresetList = async () => {
            const response = await fetch('http://localhost:8000/training/api/TrainingGroup');
            const data = await response.json();
            setTrainingPresetList(data);
        };

        fetchTrainingPresetList();
    }, []);

    const filteredPresetList = trainingPresetList.filter(preset =>
        preset.trainingPreset.id === location.state.trainingPreset.id &&
        preset.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleButtonClick = () => {
        navigate(`/Training/Create`, {state: {update: location.state.trainingPreset.id} });
    }

    const handleButtonClick2 = (trainingGroup) => {
        console.log(trainingGroup);
        console.log("Vai atualizar");
        navigate(`/Training/Update`, { state: { trainingGroup }});
    }

    const handleConcluirClick = () => {
        navigate(`/Training/Preset`);
    };

    const handleConcluirClick1 = () => {
        // navigate(`/Exercise/List`, { state: { trainingAux } });
    };

    return (
        <div className='main'>
            <div>
                <div className='title'>
                    <h1>Grupos de Treino</h1>
                    <div className='underline'></div>
                </div>
                <div className='text-input'>
                    <label htmlFor="">
                        <input
                            type="text"
                            placeholder='Pesquisar Grupo de Treino'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </label>
                </div>
                <h1>Treinos</h1>

                <div className="content">
                    <div className="cardContainer" onClick={handleButtonClick}>
                        <div className="bntAccountContainer">
                            <FaPlus className='icon' />
                            <p className="cardText">Adicionar Treino</p>
                        </div>
                    </div>

                    {filteredPresetList.map((preset, index) => (
                        <div className="cardContainer" key={index} onClick={() => handleButtonClick2(preset)}>
                            <div className="bntAccountContainer">
                                <FaDumbbell className='icon' />
                                <p className="cardText">{preset.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='serie_btns'>
                    <button type='submit' className="concluirButton cancelarButton" onClick={handleConcluirClick}>
                        Cancelar
                    </button>

                    <button type='submit' className="concluirButton" onClick={handleConcluirClick1}>
                        Concluir
                    </button>
                </div>
            </div>
        </div>
    );
}

export default List;
