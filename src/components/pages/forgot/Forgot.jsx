import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./style.css";
import Logo from '../../../img/Anderson.png'

const Forgot = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email);
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
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='logo'>
                        <img src={Logo} alt="Imagem de um gostoso na academia" />
                        <h1>PERSONALIZE FIT</h1>
                    </div>
                    <label htmlFor="">
                        <p>Informe seu e-mail</p>
                        <br />
                        <input type="text" className='inputLogin' placeholder='E-mail' value={email} onChange={handleChange} />
                    </label>
                
                    <br />
                    <div className='btnss'>
                        <button type='submit'>Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Forgot;
