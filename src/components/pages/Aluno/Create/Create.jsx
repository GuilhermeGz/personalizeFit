import React, { useState } from 'react';
import './style.css'; 
import { FaDumbbell } from 'react-icons/fa';

const Create = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: '',
  });
  
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

  const handleSubmit = (event) => {
    event.preventDefault(); 
    console.log('Form submitted:', formData);
    console.log('Checkbox checked:', isChecked); 
  };

  return (
    <div className='main'>
      <div className='title'>
        <h1>Dados do Usuário</h1>
        <div className='underline'></div>
      </div>

      <div className="cardContainer">
        <div className="bntAccountContainer">
            <FaDumbbell className='icon' />
        </div>
      </div>

      <form onSubmit={handleSubmit} className='formContainer'>
        <div className='fieldContainer text-input'>
          <label htmlFor="nameInput" className='fieldInput'>Nome:</label>
          <input
            type="text"
            id="nameInput"
            name="name"
            placeholder="Digite seu nome"
            value={formData.name}
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
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className='fieldContainer text-input'>
          <label htmlFor="phoneNumberInput" className='fieldInput'>Telefone:</label>
          <input
            type="tel"
            id="phoneNumberInput"
            name="phoneNumber"
            placeholder="Digite seu telefone"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="fieldContainer text-input checkbox-container">
            <input
                type="checkbox"
                id="checkboxInput"
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            <label for="checkboxInput" className="fieldInput">Aluno ativo?</label>
            
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
