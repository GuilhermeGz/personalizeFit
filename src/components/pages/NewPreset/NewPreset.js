import "./NewPreset.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const NewPreset = ({ isOpen, onClose, presets }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate("/StepsVisu", { state: { id } });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="modal-title">Treinos</h2>

        <div className="preset-cards">
          {presets.length > 0 ? (
            presets.map((preset, index) => (
              <div
                key={preset.id}
                className="preset-card"
                onClick={() => handleClick(preset.id)}
              >
                {preset.title}
              </div>
            ))
          ) : (
            <div style={{ padding: "8px" }}>Nenhum treino encontrado</div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>Voltar</button>
        </div>
      </div>
    </div>
  );
};

export default NewPreset;
