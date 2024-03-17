import "./style.css";
import { FaDumbbell, FaTimes, FaPlus, FaPhone, FaEnvelope } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Association = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = () => {
    
  };

  const handleButtonClick2 = () => {
 
  };

  return (
    <div className="main">
      <div>
        <div className="title">
          <h1>Alunos Associados</h1>
          <div className="underline"></div>
        </div>
        <div className="text-input">
          <label htmlFor="">
            <input
              type="text"
              placeholder="Nome do Aluno"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>
        </div>

        <div className="content">

          <div className="cardContainer" onClick={handleButtonClick}>
            <div className="bntAccountContainer">
              <FaPlus className="icon" />
            </div>
          </div>

            <div
              className="cardContainer"
              key= "1"
              onClick={() => {
                handleButtonClick2();
              }}
            >
              <div className="bntAccountContainer">
                <FaDumbbell className="icon" />
                <p className="cardText">Aluno Random</p>
                <div className="cardContact">
                  <FaPhone className="icon contactIcon" />
                  <FaEnvelope className="icon mailIcon" />
                </div>
              </div>
            </div>

            <div
              className="cardContainer"
              key= "1"
              onClick={() => {
                handleButtonClick2();
              }}
            >
              <div className="bntAccountContainer">
                <FaDumbbell className="icon" />
                <p className="cardText">Aluno Random 2</p>
                <div className="cardContact">
                  <FaPhone className="icon contactIcon" />
                  <FaEnvelope className="icon mailIcon" />
                </div>
              </div>
            </div>


          
            <div
              className="cardContainer"
              key= "1"
              onClick={() => {
                handleButtonClick2();
              }}
            >
              <div className="bntAccountContainer">
                <FaDumbbell className="icon" />
                <p className="cardText">Aluno Random 3</p>
                <div className="cardContact">
                  <FaPhone className="icon contactIcon" />
                  <FaEnvelope className="icon mailIcon" />
                </div>
              </div>
            </div>



        </div>
      </div>
    </div>
  );
};

export default Association;
