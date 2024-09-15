import React, { useState } from 'react';
import './style.css'; 
import { FaDumbbell } from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router-dom";

const Create = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: `123`
  });

  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state && location.state.userData;
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  
  const handleCheckboxChange = (event) => { 
    setIsChecked(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    console.log('Form submitted:', formData);
    console.log('Checkbox checked:', isChecked); 
       
    try {
        const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/auth/register-student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.access_token}`
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log('Dados enviados com sucesso!');
            const exerciseId = await response.text(); // Obtém a resposta como texto

            console.log(exerciseId);

            const formData = new FormData();
            formData.append('Name', "Teste");
            formData.append('FileData', file);

            console.log(formData);
            console.log("Cria arquivo");
            
            const fileResponse = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/file/api/File', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${data.access_token}`
                },
                body: formData
            });

            if (fileResponse.ok) {
                const fileData = await fileResponse.json();
                console.log("Vai relacionar");
                console.log(fileData);
                
                associateFileWithExercise(exerciseId, fileData);
            } else {
                console.error('Erro ao enviar o arquivo:', fileResponse.statusText);
            }
        } else {
            console.error('Erro ao enviar dados:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao realizar a solicitação:', error);
    }
  };

  const associateFileWithExercise = async (exerciseId, fileId) => {
    const exerciseFile = {
        userId: exerciseId, 
        fileId: fileId,
        fileType: "profile/image",
    };
    console.log("Entrou pra associar");
    
    try {
        const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/UserHasFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.access_token}`
            },
            body: JSON.stringify(exerciseFile)
        });

        if (response.ok) {
            console.log("Associação do arquivo ao user criada com sucesso");
        } else {
            console.error('Erro ao associar o arquivo ao user:', response.statusText);
        }
    } catch (error) {
        console.error('Erro na solicitação POST:', error);
    }
  };

  const handleIconClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const renderIconOrImage = () => {
    if (file) {
      return <img src={URL.createObjectURL(file)} alt="Selected" className='uploaded-image' />;
    }
    return <FaDumbbell className='icon' />;
  };

  return (
    <div className='main'>
      <div className='title'>
        <h1>Dados do Usuário</h1>
        <div className='underline'></div>
      </div>

      <div className="cardContainer">
        <div className="bntAccountContainer" onClick={handleIconClick}>
            {renderIconOrImage()}
        </div>
      </div>

      {/* Input oculto para selecionar arquivo */}
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <form onSubmit={handleSubmit} className='formContainer'>
        <div className='fieldContainer text-input'>
          <label htmlFor="nameInput" className='fieldInput'>Nome:</label>
          <input
            type="text"
            id="nameInput"
            name="username"
            placeholder="Digite seu nome"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className='fieldContainer text-input'>
          <label htmlFor="emailInput" className='fieldInput'>Email:</label>
          <input
            type="email"
            id="emailInput"
            name="email"
            placeholder="Digite seu email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className='fieldContainer text-input'>
          <label htmlFor="dateOfBirthInput" className='fieldInput'>Data de Nascimento:</label>
          <input
            type="date"
            id="dateOfBirthInput"
            name="dateOfBirth"
          />
        </div>
        <div className='fieldContainer text-input'>
          <label htmlFor="phoneNumberInput" className='fieldInput'>Telefone:</label>
          <input
            type="tel"
            id="phoneNumberInput"
            name="phoneNumber"
            placeholder="Digite seu telefone"
          />
        </div>

        <div className="fieldContainer text-input checkbox-container">
            <input
                type="checkbox"
                id="checkboxInput"
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            <label htmlFor="checkboxInput" className="fieldInput">Aluno ativo?</label>
        </div>
                
        <div className="serie_btns">
            <button type='submit' className="concluirButton">
                <span>Cadastrar</span>
            </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
