import React, { useState } from 'react';
import './RecuperarContrasena.css';

function RecuperarContrasena() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [mensajeEnv, setMensajeEnv] = useState(false);
  const apiUrl = 'http://localhost:3000/api';

  const recuperarContrasena = () => {
    const url = `${apiUrl}/Usuario/solicitud-recuperacion`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correoElectronico: correo })
    })
    .then(response => {
      if (!response.ok) {
        return response.text(); // Si la respuesta no es exitosa, obtener el texto de la respuesta
      }
      return response.json(); // Si la respuesta es exitosa, obtener JSON de la respuesta
    })
    .then(data => {
      if (typeof data === 'string') {
        // Si la respuesta es una cadena de texto, mostrarla como mensaje de error
        setError(data);
        setMensaje('');
      } else {
        // Si la respuesta es JSON, procesarla como antes
        setMensaje('Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada.');
        setMensajeEnv(true);
        setError('');
      }
    })
    .catch(error => {
      setError(error.message);
      setMensaje('');
    });
  };

  const volverPaginaAnterior = () => {
    window.location.href = '/inicio-sesion'
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Recuperar Contraseña</h1>
        {mensaje && <p>{mensaje}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="login-form">
        <label htmlFor="correo">Correo Electrónico:</label>
        <input type="email" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        <button onClick={recuperarContrasena} disabled={!correo}>Recuperar Contraseña</button>
        {mensajeEnv && <button onClick={() => console.log('Restablecer contraseña')}>Restablecer Contraseña</button>}
      </div>

      <div className="back-button">
        <button onClick={volverPaginaAnterior}>Volver</button>
      </div>
    </div>
  );
}

export default RecuperarContrasena;
