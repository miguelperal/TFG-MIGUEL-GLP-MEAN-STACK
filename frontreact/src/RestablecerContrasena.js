import React, { useState } from 'react';
import './RestablecerContrasena.css';

function RestablecerContrasena() {
  const [nuevaContrasena, setNuevaContrasena] = useState('');

  const restablecerContrasena = () => {
    const url = `${process.env.REACT_APP_API_URL}/Usuario/restablecer-contrasena`; // Ajusta la URL según tu configuración
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Agrega encabezados de autenticación si es necesario
      },
      body: JSON.stringify({ nuevaContrasena })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al restablecer la contraseña');
      }
      return response.json();
    })
    .then(() => {
      alert('Contraseña restablecida correctamente');
      window.location.href = '/inicio-sesion'; // Navega al inicio de sesión al tener éxito
    })
    .catch(error => {
      alert(error.message);
    });
  };

  const irAInicioSesion = () => {
    window.location.href = '/inicio-sesion';
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={restablecerContrasena}>
        <div className="form-group">
          <label htmlFor="nuevaContrasena">Nueva Contraseña:</label>
          <input type="password" id="nuevaContrasena" value={nuevaContrasena} onChange={(e) => setNuevaContrasena(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Restablecer Contraseña</button>
        <button type="button" onClick={irAInicioSesion}>Ir a inicio</button>
      </form>
    </div>
  );
}

export default RestablecerContrasena;