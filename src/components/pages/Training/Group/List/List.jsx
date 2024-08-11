import "./style.css";
import { FaDumbbell, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const List = () => {
    const [trainingPresetList, setTrainingPresetList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state && location.state.userData;
    const trainingPreset = location.state && location.state.trainingPreset;

    useEffect(() => {
        console.log("Dados do Usuário");
        console.log(userData);
        console.log(location.state.trainingPreset);
        const fetchTrainingPresetList = async () => {
            const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingGroup', {
                headers: {
                    'Authorization': `Bearer ${userData.access_token}`
                }
            });
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
        console.log("Criação do treino");
        navigate(`/Training/Create`, {state: {update: location.state.trainingPreset.id, userData: userData} });
    }

    const handleButtonClick2 = (trainingGroup) => {
        console.log(trainingGroup);
        console.log("Vai atualizar");
        navigate(`/Training/Update`, { state: { trainingGroup, userData: userData}});
    }

    const handleConcluirClick = () => {
        navigate(`/Training/Preset`, {state: { userData: userData}});
    };

    const handleConcluirClick1 = () => {
        navigate(`/Training/Preset`, {state: { userData: userData}});
    };

    const handleButtonClickDelete = async (preset) => {
        try {
            const response = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingGroup/${preset.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.access_token}`
                    
                }
            });

            if (response.ok) {
                console.log("Preset deleted successfully:", preset);
                setTrainingPresetList(prevList => prevList.filter(item => item.id !== preset.id));
            } else {
                console.error("Failed to delete preset:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting preset:", error);
        }
    }

    const linkarAlunoTreino = () => {
        navigate(`/Training/Association`, {state: { userData: userData, trainingPreset: trainingPreset}})
    };

    return (
        <div className='main'>
            <div>
                <div className='title'>
                    <div className='title2'>
                        <h1>Grupos de Treino</h1>
                        <button type='submit' className="concluirButton" onClick={linkarAlunoTreino}>
                            Associar Aluno
                        </button>
                    </div>
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
                                <FaTimes className='trashCard' onClick={(e) => { e.stopPropagation(); handleButtonClickDelete(preset); }} />
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
