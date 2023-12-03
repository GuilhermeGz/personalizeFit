import React from 'react';
import "./style.css";

const Signup = () => {
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('CADASTRAR-SE')
    }
    return (
    <div className='main'>
        <h1>CADASTRAR-SE</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">
                    <p>Nome:</p>
                    <input type="text" className='dados-cadastro' />
                </label>
                <label htmlFor="">
                    <p>E-mail:</p>
                    <input type="email" className='dados-cadastro' />
                </label>
                <label htmlFor="">
                    <p>Senha:</p>
                    <input type="password" className='dados-cadastro' />
                </label>
                <label htmlFor="">
                    <p>Confirmar senha:</p>
                    <input type="password" className='dados-cadastro' />
                </label>
                <div className='tipo-perfil'>
                    <label htmlFor="">
                        <input type="radio" name="tipo_cadastro" id="personal" className='teste' />
                        <p>Personal</p>
                    </label>
                    <label htmlFor="">
                        <input type="radio" name="tipo_cadastro" id="aluno" className='teste' />
                        <p>Aluno</p>
                    </label>
                </div>

                <div className='btns'>
                    <button type="submit">Cadastrar</button>
                </div>
            </form>
    </div>
  )
}

export default Signup