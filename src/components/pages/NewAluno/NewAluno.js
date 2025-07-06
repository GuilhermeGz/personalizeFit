import React, { useState } from "react";
import "./NewAluno.css";
import { FaUserEdit, FaCamera } from "react-icons/fa";

const NewAluno = ({ isOpen, onClose, onSave, alunoData }) => {
  const [formData, setFormData] = useState({
    username: alunoData?.username || "",
    email: alunoData?.email || "",
    dateOfBirth: alunoData?.dateOfBirth || "",
    phoneNumber: alunoData?.phoneNumber || "",
    isActive: alunoData?.isActive || false,
    profileImage: null, // Para armazenar a imagem carregada
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === "isActive" ? event.target.checked : value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImage: imageURL }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2 className="modal-title">
          <FaUserEdit className="modal-icon" /> Editar Aluno
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Input para imagem */}
          <div className="form-group image-upload">
            <label htmlFor="profileImage" className="image-label">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Preview"
                  className="profile-preview"
                />
              ) : (
                <FaCamera className="camera-icon" />
              )}
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Nome:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Digite o nome do aluno"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite o email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Data de Nascimento:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Telefone:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Digite o telefone"
            />
          </div>
          <div className="form-group checkbox-container">
            <label htmlFor="isActive">Aluno ativo?</label>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAluno;
