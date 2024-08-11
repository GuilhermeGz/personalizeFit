import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import "./style.css";
import Logo from '../../../img/Anderson.png'
import { jwtDecode } from "jwt-decode";
import UploadVideo from '../../../UploadVideo';

const Login = () => {

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const navigate = useNavigate();
    const userData ={
        email: userEmail,
        password: userPassword
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/auth/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then(data => {
            data = JSON.parse(data); 
            const decoded = jwtDecode(data.access_token);

            if (decoded.realm_roles.includes("trainer-role")) {
                console.log("entrou aqui");
                navigate('/Trainer/Home', {state: { userData: data}});

            } else if (decoded.realm_roles.includes("student-role")) {
                navigate('/Aluno/Home', {state: { userData: data}});

            }else{
                console.log("entrou aqui2");

               // navigate('/Aluno/Home', {state: { userData: data}});

            }


        })
        .catch(error => {
            console.error('Erro na solicitação POST:', error);
        });
        
    }




  return (
    <div className='main'>
        
        <div>
            <form onSubmit={handleSubmit}>
                <div className='logo'>
                    <img src={Logo} alt="Imagem de um gostoso na academia" />
                    <h1>PERSONALIZE FIT</h1>
                </div>
                <label htmlFor="">
                    <p>E-mail / Telefone:</p>
                    <input
                        type="text"
                        className='inputLogin'
                        placeholder='E-mail ou Telefone'
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        />
                </label>
                <label htmlFor="">
                    <p>Senha:</p>
                    <input 
                        type="password"
                        className='inputLogin'
                        placeholder='Senha'
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}    
                        />
                </label>
                <br />
                <div className='btns'>
                    <button type='submit'>Entrar</button>
                </div>
            </form>
            
            <div className='links'> 
                <Link to="/signup" className="linkEsquerda">Cadastrar-se</Link>
                <Link to="/forgot" className="linkDireita">Recuperar senha</Link>
            </div>

            {/* <UploadVideo /> */}
        </div>
    </div>

  )
}

export default Login