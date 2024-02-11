import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./style.css";
import Logo from '../../../img/Anderson.png'

const Login = () => {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('teste')
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
                    <br></br>
                    <input type="text" className='inputLogin' placeholder='E-mail'/>
                </label>
           
                <br />
                <div className='btnss'>
                    <button type='submit'>Entrar</button>
                </div>
            </form>


        </div>
    </div>

  )
}

export default Login