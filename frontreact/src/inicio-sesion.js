import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './inicio-sesion.css';

function InicioSesion() {
     const navigate = useNavigate ();
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [errorMensaje, setErrorMensaje] = useState('');

    const iniciarSesion = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/Usuario/inicio-sesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ nombreUsuario, contrasena })
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData && responseData.token) {
                    localStorage.setItem('token', responseData.token);
                    // Aquí deberías implementar la lógica para cambiar el estado global
                    console.log('Login successful', responseData);
                    // Redirigir al inicio o a otra ruta
                    navigate('/inicio');
                } else {
                    setErrorMensaje("Respuesta del servidor no válida");
                }
            } else {
                setErrorMensaje("Error al iniciar sesión: " + response.statusText);
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setErrorMensaje("Error al iniciar sesión");
        }
    };

    return (
        <div className="blog-container">
            <div className="blog-header">
                <h1>BLOG PUBLICACIONES MEAN STACK</h1>
                <p>Bienvenido a nuestro blog de tecnología MEAN Stack</p>
            </div>

            <div className="login-form">
                <h2>Iniciar Sesión</h2>

                <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
                <input
                    type="text"
                    id="nombreUsuario"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    required
                />

                <label htmlFor="contrasena">Contraseña:</label>
                <input
                    type="password"
                    id="contrasena"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                />

                <button onClick={iniciarSesion}>Iniciar Sesión</button>
                <div className="auth-links">
                    <button onClick={() => navigate('/registro')}>Registrar Usuario</button>
                    <button onClick={() => navigate('/recuperar-contrasena')}>Recuperar Contraseña</button>
                    <button onClick={() => navigate('/inicio')}>Back</button>
                </div>
                {errorMensaje && <div className="error-mensaje">{errorMensaje}</div>}
            </div>
        </div>
    );
}

export default InicioSesion;
