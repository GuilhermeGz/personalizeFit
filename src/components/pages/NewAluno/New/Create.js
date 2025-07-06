import React, { useState } from "react";
import "./Create.css";
import { FaUserEdit, FaCamera } from "react-icons/fa";

const Create = ({ isOpen, onClose, onSave, alunoData }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: alunoData?.username || "",
    email: alunoData?.email || "",
    dateOfBirth: alunoData?.dateOfBirth || "",
    phoneNumber: alunoData?.phoneNumber || "",
    isActive: alunoData?.isActive || false,
    password: "123", // Senha padrão
  });
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const associateFileWithUser = async (userId, fileId) => {
    const userFile = {
      userId: userId,
      fileId: fileId,
      fileType: "profile/image",
    };

    try {
      const response = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/user/api/UserHasFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userFile),
      });

      if (!response.ok) {
        console.error("Erro ao associar o arquivo ao usuário:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na solicitação de associação do arquivo:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    try {
      const response = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/user/api/auth/register-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Deu bom com o registro");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 3000);
        const userId = await response.text();

        if (file) {
          const fileData = new FormData();
          fileData.append("Name", "ProfileImage");
          fileData.append("FileData", file);
          console.log(fileData);

          const fileResponse = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/file/api/File", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: fileData,
          });

          if (fileResponse.ok) {
            const fileResponseData = await fileResponse.json();
            await associateFileWithUser(userId, fileResponseData);
          } else {
            console.error("Erro ao enviar o arquivo:", fileResponse.statusText);
          }
        }

        onSave(formData);
      } else {
        console.error("Erro ao registrar o aluno:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao realizar a solicitação:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="modal-title">
          <FaUserEdit className="modal-icon" /> Registrar Aluno
        </h2>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group image-upload">
            <label htmlFor="profileImage" className="image-label">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
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

export default Create;
