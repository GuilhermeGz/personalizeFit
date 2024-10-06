import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./style.css";
import Logo from '../../../img/Anderson.png'
import InitScreen from "../../Assets/Init/Init"


const Forgot = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/sua-rota-de-api', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ email })
        //     });

        //     if (response.ok) {
        //         console.log('E-mail enviado com sucesso!');
        //     } else {
        //         console.error('Erro ao enviar e-mail:', response.statusText);
        //     }
        // } catch (error) {
        //     console.error('Erro ao realizar a solicitação:', error);
        // }
    }

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    return (
        <div className='main'>
            <InitScreen> 

            <div className='forgot-form'>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="">
                        <p className='forgot-text'>Informe seu E-mail</p>
                        <br />
                        <input type="text" className='input-login' placeholder='E-mail' value={email} onChange={handleChange} />
                    </label>
                
                    <div className='create-account'>
                        <button type='submit' className='forgot-btn'>Enviar</button>
                    </div>
                </form>
            </div>

            </InitScreen>
        </div>
    )
}

export default Forgot;
