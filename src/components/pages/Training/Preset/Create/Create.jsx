import React, { useEffect, useState } from "react";
import "./style.css";
import { FaPlus, FaDumbbell, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputName, setInputName] = useState("");

  const cancelButtonClick = () => {
    navigate(`Training/Preset`);
  };

  return (
    <div className="main">
      <div>
        <div className="title">
          <h1>Predefinição de Treinos</h1>
          <div className="underline"></div>
        </div>
        <div className="text-input">
          <label htmlFor="">
            <input
              type="text"
              placeholder="Título da Predefinição"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </label>
        </div>
        <h1>Grupos de Treino</h1>

        <div className="content">
          <div className="cardContainer">
            <div className="bntAccountContainer">
              <FaPlus className="icon" />
              <p className="cardText">Adicionar Treino</p>
            </div>
          </div>

          {/* {exercises.map((exercise, index) => (
            <div className="cardContainer" key={index}>
              <div className="bntAccountContainer">
                <FaTimes
                  className="trashCard"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClickDelete(exercise);
                  }}
                />
                <FaDumbbell className="icon" />
                <p className="cardText">{exercise.name}</p>
              </div>
            </div>
          ))} */}
        </div>

        <div className="serie_btns">
          <button
            type="submit"
            className="concluirButton cancelarButton"
            onClick={cancelButtonClick}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="concluirButton"
            // onClick={handleConcluirClick2}
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
