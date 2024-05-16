import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registro.css';

function Registro() {
    const [nombre, setNombre] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [errorNombre, setErrorNombre] = useState('');
    const [errorCorreo, setErrorCorreo] = useState('');
    const [errorUsuario, setErrorUsuario] = useState('');
    const [errorContrasena, setErrorContrasena] = useState('');
    const [errorRegistro, setErrorRegistro] = useState('');

    const navigate = useNavigate();

    const validarNombre = () => {
        if (!nombre) {
            setErrorNombre('El nombre es obligatorio.');
            return false;
        } else if (nombre.length < 3 || nombre.length > 15) {
            setErrorNombre('El nombre debe tener entre 3 y 15 caracteres.');
            return false;
        } else if (!/^[A-Za-z\s]*$/.test(nombre)) {
            setErrorNombre('El nombre solo puede contener letras y espacios.');
            return false;
        } else {
            setErrorNombre('');
            return true;
        }
    };

    const validarCorreoElectronico = () => {
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoElectronico) {
            setErrorCorreo('El correo electrónico es obligatorio.');
            return false;
        } else if (!correoRegex.test(correoElectronico)) {
            setErrorCorreo('Ingresa un correo electrónico válido.');
            return false;
        } else {
            setErrorCorreo('');
            return true;
        }
    };

    const validarNombreUsuario = () => {
        if (!nombreUsuario) {
            setErrorUsuario('El nombre de usuario es obligatorio.');
            return false;
        }  else if (nombreUsuario.length < 3 || nombreUsuario.length > 15) {
            setErrorNombre('El nombre de usuario debe tener entre 3 y 15 caracteres.');
            return false;
        }else {
            setErrorUsuario('');
            return true;
        }
    };

    const validarContrasena = () => {
        if (!contrasena) {
            setErrorContrasena('La contraseña es obligatoria.');
            return false;
        } else if (contrasena.length < 6 || contrasena.length > 20) {
            setErrorContrasena('La contraseña debe tener entre 6 y 20 caracteres.');
            return false;
        } else {
            setErrorContrasena('');
            return true;
        }
    };


    const registrar = async () => {
        // Validar cada campo individualmente
        if (validarNombre() && validarCorreoElectronico() && validarNombreUsuario() && validarContrasena()){
            try {
                const response = await fetch('http://localhost:3000/api/Usuario/registro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre,
                        correoElectronico,
                        nombreUsuario,
                        contrasena
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al registrar el usuario');
                }

                const result = await response.json();  // Suponiendo que el servidor responde con datos útiles
                console.log('Registro exitoso', result);
                navigate('/inicio-sesion');
            } catch (error) {
                console.error('Error al registrar el usuario:', error);
                setErrorRegistro(error.message || 'Error al registrar. Por favor, inténtalo de nuevo más tarde.');
            }
        } else {
            setErrorRegistro('Por favor, completa todos los campos.');
        }
    };

    const navegarAtras = () => {
        navigate(-1);
    };

    return (
        <div className="registro-container">
            <div className="registro-form">
                <h2>Registro</h2>
                {/* Agregar validaciones en los eventos onChange para cada campo */}
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onBlur={validarNombre}
                    required minLength="3" maxLength="15"
                    pattern="^[A-Za-z\s]*$" className={errorNombre ? 'error-input' : ''}
                />
                {errorNombre && <div className="error-message">{errorNombre}</div>}

                <label htmlFor="correoElectronico">Correo Electrónico:</label>
                <input type="email" id="correoElectronico" value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                    onBlur={validarCorreoElectronico}
                    required className={errorCorreo ? 'error-input' : ''}
                />
                {errorCorreo && <div className="error-message">{errorCorreo}</div>}

                <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
                <input type="text" id="nombreUsuario" value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    onBlur={validarNombreUsuario}
                    required className={errorUsuario ? 'error-input' : ''}
                />
                {errorUsuario && <div className="error-message">{errorUsuario}</div>}

                <label htmlFor="contrasena">Contraseña:</label>
                <input type="password" id="contrasena" value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    onBlur={validarContrasena}
                    required minLength="6" maxLength="20"
                    className={errorContrasena ? 'error-input' : ''}
                />
                {errorContrasena && <div className="error-message">{errorContrasena}</div>}

                <button onClick={registrar}>Registrarse</button>
                <button onClick={navegarAtras}>Volver</button>

                {errorRegistro && <div className="error-message">{errorRegistro}</div>}
            </div>
        </div>
    );
}

export default Registro;