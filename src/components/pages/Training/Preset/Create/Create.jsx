import React, { useEffect, useState } from "react";
import "./style.css";
import { FaPlus, FaDumbbell, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputName, setInputName] = useState("");
  const userData = location.state && location.state.userData;
  const [token, setToken] = useState(localStorage.getItem('token'));


  const cancelButtonClick = () => {
    navigate(`/Training/Preset`, {state: { userData: userData}});
  };

  const submitButtonCliclk = () => {
    console.log("Dados do Usuário1111");

    console.log(userData);

    if (inputName.trim() === "") {
      alert("Por favor, insira um título para a predefinição de treino.");
      return;
    }
    const aux = {
      title: inputName,
      presetDefaultFlag: true,
      studentHasTrainingPresets: []
    };

    console.log(aux);
    fetch(`http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${userData.access_token}`
      },
      body: JSON.stringify(aux),
    })
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then((data) => {
        console.log("Resposta da solicitação POST:", data);
      })
      .catch((error) => {
        console.error("Erro na solicitação POST:", error);
      });

    navigate(`/Training/Preset`, {state: { userData: userData}});
  };


  useEffect(() => {
    console.log("Dados do Usuário");
    console.log(userData);
  },[]);

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
            onClick={submitButtonCliclk}
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
