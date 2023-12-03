import React from 'react'

const Forgot = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('RECUPERAÇÃO DE SENHA!')
    }
  return (
    <>
        <h1>FORGOTI</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="">
                <p>Informe seu e-mail</p>
                <input type="email" />
                <br />
                <button type='submit'>Recuperar</button>
            </label>
        </form>
    </>
  )
}

export default Forgot