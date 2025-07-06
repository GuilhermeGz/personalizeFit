import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import "./style.css";
import Logo from '../../../img/Anderson.png'
import { jwtDecode } from "jwt-decode";
import UploadVideo from '../../../UploadVideo';
import InitScreen from "../../Assets/Init/Init"

const Login = () => {

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const userData ={
        email: userEmail,
        password: userPassword
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/auth/login', {
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
            localStorage.setItem('token', data.access_token);


            if (decoded.realm_roles.includes("trainer-role")) {
                // navigate('/Trainer/Home', {state: { userData: data}});
                navigate('/NewPage', {state: { userData: data}});

            } else if (decoded.realm_roles.includes("student-role")) {
                navigate('/Aluno/Home', {state: { userData: data}});

            }else{
               navigate('/ExerciseList2', {state: { userData: data}});

            }


        })
        .catch(error => {
            setError(true)
            console.error('Erro na solicitação POST:', error);
        });
        
    }

  return (
    <div className='main'>
        <InitScreen>
            <div className='login-form'>

                <h2>Acesse sua conta</h2>
                
                {
                error &&
                    <div className="error">
                        Login/Senha incorreto
                    </div> 
                }

                <form>
                    <label>
                    <input
                        type="email"
                        className='input-login'
                        placeholder='E-mail'
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    </label>
                    <label>
                    <input
                        type="password"
                        className='input-login'
                        placeholder='Senha'
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                    />
                    </label>

                    <Link to="/forgot-password" className='forgot-password'>
                    Esqueceu sua senha?
                    </Link>

                    <button type='submit' className='login-btn' onClick={handleSubmit}> 
                    Entrar
                    </button>

                    <div className='create-account'>
                        <p className='create-account-text'>Ainda não tem acesso?</p>
                        <Link to="/signup" className='create-account-btn'>
                            Criar conta
                        </Link>
                    </div>

                </form>
            </div>
        </InitScreen>
    </div>

  )
}

export default Login