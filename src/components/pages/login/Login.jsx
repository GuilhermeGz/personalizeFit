import React from 'react'
import { Link } from 'react-router-dom'
import "./style.css";
import Logo from '../../../img/Anderson.png'

const Login = () => {

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
                    <p>E-mail / Telefone:</p>
                    <input type="text" />
                </label>
                <label htmlFor="">
                    <p>Senha:</p>
                    <input type="password" />
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

        </div>
    </div>

  )
}

export default Login