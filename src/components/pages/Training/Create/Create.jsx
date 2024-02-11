import React from 'react';
import "./style.css";
import { FaPlus } from 'react-icons/fa';


const Create = () => {

    return (
        <div className='main'>
            <div>
                <div className='title'>
                    <h1>Predefinição de Treinos</h1>
                    <div className='underline'></div>
                </div>
                <div className='text-input'>
                    <label htmlFor="">
                        <input type="text" placeholder='Título da Predefinição'/>
                    </label>
                </div>
                <h1>Exercícios</h1>

                <div className="content">

                    <div className="cardContainer">
                        <div className="bntAccountContainer">
                            <FaPlus className='icon' />
                            <p className="cardText">Adicionar Exercício</p>
                        </div>
                    </div>
             
                  
                </div>

                <div className='serie_btns'>
                    <button type='submit' className="concluirButton" >
                        Concluir
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Create;
