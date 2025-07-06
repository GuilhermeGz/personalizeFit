import React, { useState, useEffect } from "react";
import "./Create.css";

const Create = ({ isOpen, onClose }) => {
  const [trainingPresetList, setTrainingPresetList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPresetTitle, setNewPresetTitle] = useState("");
  const token = localStorage.getItem("token");

  const fetchTrainingPresetList = async () => {
    try {
      const response = await fetch(
        "http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar predefinições de treino");
      }
      const data = await response.json();
      setTrainingPresetList(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTrainingPresetList();
    }
  }, [isOpen]);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewPresetTitle("");
  };

  const handleConclude = async () => {
    if (newPresetTitle.trim() === "") {
      alert("Por favor, insira um título para a predefinição de treino.");
      return;
    }

    const newPreset = {
      title: newPresetTitle,
      presetDefaultFlag: true,
      studentHasTrainingPresets: [],
    };

    try {
      const response = await fetch(
        "http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPreset),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar predefinição de treino");
      }

      await fetchTrainingPresetList();
      handleCancel();
    } catch (error) {
      console.error("Erro na solicitação POST:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta predefinição?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir predefinição de treino");
      }

      await fetchTrainingPresetList();
    } catch (error) {
      console.error("Erro na solicitação DELETE:", error);
    }
  };

  const handleChange = (event) => {
    setNewPresetTitle(event.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2 className="modal-title">
          {isAdding ? "Criação de Treino" : "Gerenciar Treinos"}
        </h2>

        {!isAdding ? (
          <div>
            <div className="preset-cards">
              {trainingPresetList.map((preset, index) => (
                <div key={index} className="preset-card">
                  <span>{preset.title}</span>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(preset.id)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={onClose}>
                Cancelar
              </button>
              <button className="add-button" onClick={handleAddClick}>
                Adicionar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="presetTitle">Título:</label>
              <input
                type="text"
                id="presetTitle"
                value={newPresetTitle}
                onChange={handleChange}
                placeholder="Digite o título do treino"
                required
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="save-button" onClick={handleConclude}>
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
