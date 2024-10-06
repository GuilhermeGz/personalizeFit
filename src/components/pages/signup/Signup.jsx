import React, { useState } from 'react';
import "./style.css";
import Logo from '../../../img/Anderson.png'
import { useNavigate, Link } from "react-router-dom";
import { FaDumbbell } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import UserImage from "../../../img/user.jpg"
import InitScreen from "../../Assets/Init/Init"


const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        userType: ''
    });

    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/auth/register-trainer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Cadastro realizado com sucesso!');
                const exerciseId = await response.text();
                if(file){
                    uploadFile(exerciseId, formData);
                }
            } else {
                console.error('Erro ao cadastrar:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao realizar a solicitação:', error);
        }
    }

    const loginResponse = async (login,password) => {

        const userData ={
            email: login,
            password: password
        }
        try {
            const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
    
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error; // Propagar o erro
        }
    };

    const uploadFile = async (exerciseId, dadosForm) => {
        const formData = new FormData();
        formData.append('Name', "Teste");
        formData.append('FileData', file);
        
        const token = await loginResponse(dadosForm.username, dadosForm.password)
        const data = JSON.parse(token); 
        const decoded = jwtDecode(data.access_token);
    
        try {
            const fileResponse = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/file/api/File', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${data.access_token}`
                },
                body: formData
            });

            if (fileResponse.ok) {
                const fileData = await fileResponse.json();  
                associateFileWithExercise(exerciseId, fileData, data.access_token);
            } else {
                console.error('Erro ao enviar o arquivo:', fileResponse.statusText);
            }
        } catch (error) {
            console.error('Erro ao realizar a solicitação de upload:', error);
        }
    }

    const  associateFileWithExercise = async (exerciseId, fileId, token) => {
        const exerciseFile = {
            userId: exerciseId, 
            fileId: fileId,
            fileType: "string"
        };

        try {
            const response = await fetch('http://gaetec-server.tailf2d209.ts.net:8000/user/api/UserHasFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Substitua por um token real
                },
                body: JSON.stringify(exerciseFile)
            });

            if (response.ok) {
                console.log("Associação do arquivo ao usuário criada com sucesso");
                navigate('/');
            } else {
                console.error('Erro ao associar o arquivo ao usuário:', response.statusText);
            }
        } catch (error) {
            console.error('Erro na solicitação POST:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setFile(files[0]);
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    
    const handleIconClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const renderIconOrImage = () => {
        if (file) {
          return <img src={URL.createObjectURL(file)} alt="Selected" className='uploaded-image' />;
        }
        return <img src={UserImage} alt="Treinador" className="student-avatar"/>
    };

    return (
        <div className='main'>
            <InitScreen> 

                {/* <div className='logo'>
                    <img src={Logo} alt="Imagem de um gostoso na academia" />
                    <h1>PERSONALIZE FIT</h1>
                </div>
                <h3 className='titleSignup'>Criar Conta</h3>
                
                <div className="cardContainer">

            <div className="bntAccountContainer" onClick={handleIconClick}>
                    {renderIconOrImage()}
                </div>
            </div>

            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            /> */}



                {/* <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        <p>Nome:</p>
                        <input 
                            type="text" 
                            className='dados-cadastro' 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                        />
                    </label>
                    <label htmlFor="email">
                        <p>E-mail:</p>
                        <input 
                            type="email" 
                            className='dados-cadastro' 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                    </label>
                    <label htmlFor="password">
                        <p>Senha:</p>
                        <input 
                            type="password" 
                            className='dados-cadastro' 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                    </label>

                    <p className='titleCadastro'>Tipo de Cadastro</p>

                    <div className='tipo-perfil'>
                        <label htmlFor="personal">
                            <input 
                                type="radio" 
                                name="userType" 
                                id="personal" 
                                value="Personal" 
                                className='teste' 
                                onChange={handleChange} 
                            />
                            <p>Personal</p>
                        </label>
                        <label htmlFor="aluno">
                            <input 
                                type="radio" 
                                name="userType" 
                                id="aluno" 
                                value="Aluno" 
                                className='teste' 
                                onChange={handleChange} 
                            />
                            <p>Aluno</p>
                        </label>
                    </div>

                    <div className='btns'>
                        <button type="submit">Criar Conta</button>
                    </div>
                </form> */}


                <div className='login-form'>

                    <h2>Criar Conta</h2>


                    <form onSubmit={handleSubmit}>

                        <label>
                            <input
                                type="email"
                                className='input-login'
                                placeholder='Nome do Usuário'
                                value={formData.email} 
                                onChange={handleChange} 
                            />
                        </label>

                        <label>
                            <input
                                type="email"
                                className='input-login'
                                placeholder='E-mail'
                                value={formData.email} 
                                onChange={handleChange} 
                            />
                        </label>

                        <label>
                            <input
                                type="password"
                                className='input-login'
                                placeholder='Senha'
                                value={formData.password}
                                onChange={handleChange} 
                            />
                        </label>

                        <label>
                            <input
                                type="password"
                                className='input-login'
                                placeholder='Confirmar Senha'
                                value={formData.password}
                                onChange={handleChange} 
                            />
                        </label>

                        <p className='titleCadastro'>Tipo de Cadastro</p>

                        <div className='tipo-perfil'>

                            <label htmlFor="personal">
                                <input 
                                    type="radio" 
                                    name="userType" 
                                    id="personal" 
                                    value="Personal" 
                                    className='teste' 
                                    onChange={handleChange} 
                                />
                                <p className='titleCadastro'>Personal</p>
                            </label>

                            <label htmlFor="aluno">
                                <input 
                                    type="radio" 
                                    name="userType" 
                                    id="aluno" 
                                    value="Aluno" 
                                    className='teste' 
                                    onChange={handleChange} 
                                />
                                <p className='titleCadastro'>Aluno</p>
                            </label>

                        </div>


                        <div className='create-account'>
                            <Link to="/signup" className='create-account-btn'>
                                Criar conta
                            </Link>
                            <p className='create-account-text login-text'>Já tem uma conta? <Link to="/" className='link-login create-account-text'> Faça login aqui</Link> </p>
                        </div>

                    </form>
                </div>

            </InitScreen>
        </div>
    )
}

export default Signup;
