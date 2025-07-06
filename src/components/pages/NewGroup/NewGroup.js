import React, { useState } from "react";
import "./NewPreset.css";

const NewPreset = ({ isOpen, onClose }) => {
  const [presets, setPresets] = useState(["Grupo 1", "Grupo 2", "Grupo 3", "Grupo 4"]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPresetTitle, setNewPresetTitle] = useState("");

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewPresetTitle("");
  };

  const handleConclude = () => {
    if (newPresetTitle.trim()) {
      setPresets((prevPresets) => [...prevPresets, newPresetTitle.trim()]);
    }
    setIsAdding(false);
    setNewPresetTitle("");
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
        <h2 className="modal-title">Gerenciar Predefinições</h2>

        {!isAdding ? (
          // Conteúdo inicial com a lista de predefinições em cards
          <div>
            <div className="preset-cards">
              {presets.map((preset, index) => (
                <div key={index} className="preset-card">
                  {preset}
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={onClose}>
                Fechar
              </button>
              <button className="add-button" onClick={handleAddClick}>
                Adicionar
              </button>
            </div>
          </div>
        ) : (
          // Formulário para adicionar uma nova predefinição
          <div>
            <div className="form-group">
              <label htmlFor="presetTitle">Título:</label>
              <input
                type="text"
                id="presetTitle"
                value={newPresetTitle}
                onChange={handleChange}
                placeholder="Digite o título da predefinição"
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

export default NewPreset;
