import React, { useState, useEffect  } from 'react';
import './style.css'; 
import { FaDumbbell } from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router-dom";


const Create = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: `123`
   // dateOfBirth: '',
   // phoneNumber: '',
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
        navigate('/Trainer/Home', {state: { userData: data}});
        // Redirecionar ou mostrar mensagem de sucesso, etc.
      } else {
        console.error('Erro ao enviar dados:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao realizar a solicitação:', error);
    }
    

  };

  useEffect(() => {
    // fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/teste', {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${userData}`
    //   }
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log("Retorno da Solicitação:");
    //   console.log(data);
    //   // setTrainerStudents(data);
    // })
    // .catch(error => {
    //   console.error('Erro na solicitação GET:', error);
    //   navigate('/');
    // });
  }, []);

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
          //  value={formData.dateOfBirth}
          //  onChange={handleChange}
          />
        </div>
        <div className='fieldContainer text-input'>
          <label htmlFor="phoneNumberInput" className='fieldInput'>Telefone:</label>
          <input
            type="tel"
            id="phoneNumberInput"
            name="phoneNumber"
            placeholder="Digite seu telefone"
           // value={formData.phoneNumber}
           // onChange={handleChange}
          />
        </div>

        <div className="fieldContainer text-input checkbox-container">
            <input
                type="checkbox"
                id="checkboxInput"
              //  checked={isChecked}
              //  onChange={handleCheckboxChange}
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
