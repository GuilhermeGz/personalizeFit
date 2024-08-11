import React, { useState } from 'react';
import "./style.css";
import Logo from '../../../img/Anderson.png'
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        // confirmPassword: '',
        // userType: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Cadastro realizado com sucesso!');
                navigate('/');
            } else {
                console.error('Erro ao cadastrar:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao realizar a solicitação:', error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div className='main'>
            <div className='logo'>
                <img src={Logo} alt="Imagem de um gostoso na academia" />
                <h1>PERSONALIZE FIT</h1>
            </div>
            <h3 className='titleSignup'>Criar Conta</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">
                    <p>Nome:</p>
                    <input type="text" className='dados-cadastro' name="username" value={formData.username} onChange={handleChange} />
                </label>
                <label htmlFor="">
                    <p>E-mail:</p>
                    <input type="email" className='dados-cadastro' name="email" value={formData.email} onChange={handleChange} />
                </label>
                <label htmlFor="">
                    <p>Senha:</p>
                    <input type="password" className='dados-cadastro' name="password" value={formData.password} onChange={handleChange} />
                </label>
                <label htmlFor="">
                    <p>Confirmar senha:</p>
                    <input type="password" className='dados-cadastro' name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                </label>

                <p className='titleCadastro'>Tipo de Cadastro</p>

                <div className='tipo-perfil'>
                    <label htmlFor="">
                        <input type="radio" name="userType" id="personal" value="Personal" className='teste' onChange={handleChange} />
                        <p>Personal</p>
                    </label>
                    <label htmlFor="">
                        <input type="radio" name="userType" id="aluno" value="Aluno" className='teste' onChange={handleChange} />
                        <p>Aluno</p>
                    </label>
                </div>

                <div className='btns'>
                    <button type="submit">Criar Conta</button>
                </div>
            </form>
        </div>
    )
}

export default Signup;
