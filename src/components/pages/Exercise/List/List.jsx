import React, { useState, useEffect } from 'react';
import { FaDumbbell } from 'react-icons/fa';
import "./style.css";

const List = () => {
    const [exerciseList, setExerciseList] = useState([]);

    useEffect(() => {
        const fetchExerciseList = async () => {
            const response = await fetch('http://localhost:8000/exercise/api/Exercise');
            const data = await response.json();
            setExerciseList(data);
        };

        fetchExerciseList();
    }, []); 

    return (
        <div className='main'>
            <div>
                <div className='title'>
                    <h1>Exercícios</h1>
                    <div className='underline'></div>
                </div>
                <div className='text-input'>
                    <label htmlFor="">
                        <input type="text" placeholder='Exercício ou Grupo Muscular' />
                    </label>
                </div>
                
                <div className="content">
                    {exerciseList.map((exercise, index) => (
                        <div className="cardContainer" key={index}>
                            <div className="bntAccountContainer">
                                <FaDumbbell className='icon' />
                                <p className="cardText">{exercise.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default List;
