import "./style.css";
import { FaDumbbell, FaTimes, FaPlus } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../../../../Navbar";

const Preset = () => {
  const [trainingPresetList, setTrainingPresetList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const [token, setToken] = useState(localStorage.getItem('token'));


  const fetchTrainingPresetList = async () => {
    const response = await fetch(
      "http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset",{
        headers: {
           'Authorization': `Bearer ${token}`
        }
      }
    );
    const data = await response.json();
    setTrainingPresetList(data);
  };

  useEffect(() => {
    const fetchTrainingPresetListExec = async () => {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await sleep(200);
      await fetchTrainingPresetList();
    };
    fetchTrainingPresetListExec();
  }, []);

  const filteredPresetList = trainingPresetList.filter((preset) =>
    preset.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleButtonClick = () => {
    navigate(`/Training/Preset/Create`, {state: { userData: userData}});
  };

  const handleButtonClickDelete = async (id) => {
    try {
      const response = await fetch(
        `http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          
          },
        }
      );

      if (response.ok) {
        await fetchTrainingPresetList();
      } else {
        console.error("Failed to delete preset:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting preset:", error);
    }
  };

  const handleButtonClick2 = (trainingPreset) => {
    navigate(`/Training/Group/List`, {
      state: { trainingPreset: trainingPreset , userData: userData},
    });
  };

  const handleButtonClick3 = () => {
    navigate(`/Trainer/Home`, { state: { userData: userData},});
  };

  return (
    <>
    <Navbar/>
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
              placeholder="Pesquisar Predefinição de Treino"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>
        </div>
        <h1>Predefinições</h1>

        <div className="content">
          <div className="cardContainer" onClick={handleButtonClick}>
            <div className="bntAccountContainer">
              <FaPlus className="icon" />
              <p className="cardText">Adicionar</p>
            </div>
          </div>

          {filteredPresetList.map((preset, index) => (
            <div
              className="cardContainer"
              key={index}
              onClick={() => {
                handleButtonClick2(preset);
              }}
            >
              <div className="bntAccountContainer">
                <FaTimes
                  className="trashCard"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClickDelete(preset.id);
                  }}
                />
                <FaDumbbell className="icon" />
                <p className="cardText">{preset.title}</p>
              </div>
            </div>
          ))}

        

        </div>

        <div className='serie_btns'>
            <button type='submit' className="concluirButton cancelarButton1" onClick={handleButtonClick3}>
              Cancelar
            </button>
        </div>

      </div>
    </div>
    </>

  );
};

export default Preset;
