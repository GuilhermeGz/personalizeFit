import React, { useState, useEffect } from 'react';
import { FaDumbbell } from 'react-icons/fa';
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const List = () => {
    const [exerciseList, setExerciseList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const trainingAux = location.state && location.state.trainingAux;
    const tipo = location.state && location.state.tipo;
    const userData = location.state && location.state.userData;
    const [token, setToken] = useState(localStorage.getItem('token'));


    useEffect(() => {
      console.log("Aquiii");
      console.log(tipo);
      console.log(trainingAux);
      const fetchExerciseList = async () => {
        const response = await fetch(
          "http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise", {
            headers: {
                 'Authorization': `Bearer ${userData.access_token}`
            }
          }
        );
        const data = await response.json();
        setExerciseList(data);
      };

      fetchExerciseList();
    }, []);

    const filteredExerciseList = exerciseList.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleConcluirClick = (exerciseId) => {
      navigate(`/Serie/Create`, { state: { exerciseId, trainingAux, tipo, userData } });
    };

    const handleConcluirClick1 = () => {
        navigate(`/Training/Create`, {state: {userData}});
    };

    return (
        <div className='main'>
            <div>
                <div className='title'>
                    <h1>Exercícios</h1>
                    <div className='underline'></div>
                </div>
                <div className='text-input'>
                    <label htmlFor="">
                        <input
                            type="text"
                            placeholder='Exercício ou Grupo Muscular'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </label>
                </div>
                
                <div className="content">
                    {filteredExerciseList.map((exercise, index) => (
                        <div className="cardContainer" key={index} onClick={() => handleConcluirClick(exercise.id)}>
                            <div className="bntAccountContainer">
                                <FaDumbbell className='icon' />
                                <p className="cardText">{exercise.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='serie_btns'>
                    <button type='submit' className="concluirButton cancelarButton1" onClick={handleConcluirClick1}>
                        Cancelar
                    </button>
                </div>

            </div>
        </div>
    );
}

export default List;
