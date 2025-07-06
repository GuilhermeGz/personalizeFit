import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaDumbbell, FaPlus } from 'react-icons/fa';
import "./style.css";
import { useLocation } from "react-router-dom";
import Navbar from "../../../../Navbar";
import Sidebar from "../../../pages/SideBar/Sidebar";

const Create = () => {
    const [exerciseName, setExerciseName] = useState('');
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
    const [similarExercises, setSimilarExercises] = useState([]);
    const [selectedSimilarExercises, setSelectedSimilarExercises] = useState([]);
    const location = useLocation();
    const userData = location.state && location.state.userData;
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [inputType, setInputType] = useState('file');
    const [url, setUrl] = useState('');

    useEffect(() => {
        const fetchMuscleGroups = async () => {
            try {
                const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/MuscularGroup', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setMuscleGroups(data);
            } catch (error) {
                console.error('Erro ao buscar os grupos musculares:', error);
            }
        };
        fetchMuscleGroups();
    }, []);

    useEffect(() => {
        const fetchSimilarExercises = async () => {
            try {
                const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setSimilarExercises(data);
            } catch (error) {
                console.error('Erro ao buscar os exercícios semelhantes:', error);
            }
        };
        fetchSimilarExercises();
    }, []);

    const clearFields = () => {
        setExerciseName('');
        setSelectedMuscleGroup('');
        setSelectedSimilarExercises([]);
        setFile(null);
        setFileType('');
        setUrl('');
    };

    const handleRequest = () => {
        // Validação de campos obrigatórios
        if (!exerciseName.trim()) {
            alert("Nome do exercício não pode estar vazio.");
            return;
        }
        if (!selectedMuscleGroup) {
            alert("Selecione um grupo muscular.");
            return;
        }
        if (!fileType.trim()) {
            alert("Digite o tipo de arquivo.");
            return;
        }
        if (inputType === 'file' && !file) {
            alert("Selecione um arquivo.");
            return;
        }
        if (inputType === 'url' && !url.trim()) {
            alert("Digite a URL.");
            return;
        }

        const exerciseData = {
            name: exerciseName,
            muscularGroupId: selectedMuscleGroup,
            equivalentExerciseIds: selectedSimilarExercises,
            status: "valido",
            trainerId: "1"
        };

        fetch('http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(exerciseData)
        })
        .then(response => response.json())
        .then(data => {
            const exerciseId = data; // Assume que retorna ID direto
            clearFields();

            if (inputType === 'file') {
                const formData = new FormData();
                formData.append('Name', fileType);
                formData.append('FileData', file);

                return fetch('http://gaetec-server.tailf2d209.ts.net:8000/file/api/File', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                }).then(response => response.json())
                  .then(fileId => ({ exerciseId, fileId }));
            } else if (inputType === 'url') {
                const formData = new FormData();
                formData.append('Name', fileType);
                formData.append('Path', url);

                return fetch('http://gaetec-server.tailf2d209.ts.net:8000/file/api/File/url', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                }).then(response => response.json())
                  .then(fileId => ({ exerciseId, fileId }));
            }
        })
        .then(({ exerciseId, fileId }) => {
            const exerciseFile = {
                exerciseId: exerciseId,
                fileId: fileId,
                fileType: fileType
            };
            console.log(exerciseFile);
            

            return fetch('http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/ExerciseHasFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(exerciseFile)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao associar o arquivo ao exercício');
            }
            alert("Exercício criado com sucesso!");
        })
        .catch(error => {
            console.error('Erro na solicitação POST:', error);
            alert("Erro ao criar o exercício.");
        });
    };

    return (
        <>
            <Sidebar />
            <div className='main exercise-back'>
                <div className='title'>
                    <h1>Cadastro de Exercício</h1>
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
                            <select
                                className="textArea"
                                id="grupoMuscularInput"
                                value={selectedMuscleGroup}
                                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                            >
                                <option value="">Selecione um grupo muscular</option>
                                {muscleGroups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className='text-input'>
                        <label htmlFor="exerciciosSemelhantesInput">
                            <span className='labelTextArea'>Exercícios Semelhantes:</span>
                            <Select className='fonn'
                                defaultValue={[]}
                                placeholder="Exercicios Semelhantes"
                                isMulti
                                name="exerciciosSemelhantes"
                                options={similarExercises.map(exercise => ({
                                    value: exercise.id,
                                    label: exercise.name
                                }))}
                                value={selectedSimilarExercises.map(exerciseId => ({
                                    value: exerciseId,
                                    label: similarExercises.find(exercise => exercise.id === exerciseId)?.name
                                }))}
                                onChange={(selectedOptions) => {
                                    setSelectedSimilarExercises(selectedOptions.map(option => option.value));
                                }}
                            />
                        </label>
                    </div>
                    <div className='text-input'>
                        <label>
                            <span className='labelTextArea'>Tipo de Envio:</span>
                            <div className='radio-container'>
                                <label>
                                    <input
                                        type="radio"
                                        value="file"
                                        className='create_exercise_radio'
                                        checked={inputType === 'file'}
                                        onChange={() => setInputType('file')}
                                    />
                                    Arquivo
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="url"
                                        className='create_exercise_radio'
                                        checked={inputType === 'url'}
                                        onChange={() => setInputType('url')}
                                    />
                                    URL
                                </label>
                            </div>
                        </label>
                    </div>
                    <div className='text-input'>
                        <label htmlFor="fileTypeInput">
                            <span className='labelTextArea'>Tipo de Arquivo:</span>
                            <input
                                className="textArea"
                                id="fileTypeInput"
                                placeholder="Digite o tipo de arquivo"
                                value={fileType}
                                onChange={(e) => setFileType(e.target.value)}
                            />
                        </label>
                    </div>

                    {inputType === 'file' ? (
                        <div className='text-input'>
                            <label htmlFor="fileInput">
                                <span className='labelTextArea'>Arquivo:</span>
                                <input
                                    type="file"
                                    id="fileInput"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </label>
                        </div>
                    ) : (
                        <div className='text-input'>
                            <label htmlFor="urlInput">
                                <span className='labelTextArea'>URL:</span>
                                <input
                                    className="textArea"
                                    id="urlInput"
                                    placeholder="Digite a URL"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </label>
                        </div>
                    )}

                    <div className="serie_btns">
                        <button type='submit' className="concluirButton" onClick={handleRequest}>
                            <span>Criar</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Create;
