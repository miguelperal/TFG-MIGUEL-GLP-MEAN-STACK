import React, { useState, useEffect } from 'react';
import './GestionUsuarios.css';

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [errorBusqueda, setErrorBusqueda] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const [mostrarFormularioAñadir, setMostrarFormularioAñadir] = useState(false);
    const [usuarioForm, setUsuarioForm] = useState({
        nombre: '',
        correoElectronico: '',
        nombreUsuario: '',
        contrasena: ''
    });
    const [erroresForm, setErroresForm] = useState({});
    const [mostrarFormularioEditarE, setMostrarFormularioEditarE] = useState(false);
    const [usuarioEditado, setUsuarioEditado] = useState({
        nombre: '',
        correoElectronico: '',
        nombreUsuario: ''
    });
    const [erroresFormEditado, setErroresFormEditado] = useState({});
    const [errorEditar, setErrorEditar] = useState(false);
    const [nombreUsuarioA, setNombreUsuarioA] = useState('');

    const isAdminUser = true;

    async function obtenerUsuarios() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/Usuario/admin', {
                headers: {
                    'x-auth-token': token
                }
            });
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de usuarios');
            }
            const usuarios = await response.json();
            setUsuarios(usuarios);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    async function buscarUsuarios(terminoBusqueda) {
        const apiUrl = 'http://localhost:3000/api';
        const url = `${apiUrl}/Usuario/admin?nombreUsuario=${terminoBusqueda}`;
        const token = localStorage.getItem('token');
        const headers = {
            'x-auth-token': token
        };

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error('Error en la búsqueda de usuarios');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async function agregarUsuario(event) {
        event.preventDefault();

        const errores = {};
        if (!usuarioForm.nombre) {
            errores.nombre = 'El nombre es obligatorio.';
        }
        if (!usuarioForm.correoElectronico) {
            errores.correoElectronico = 'El correo electrónico es obligatorio.';
        } else {
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(usuarioForm.correoElectronico)) {
                errores.correoElectronico = 'El formato del correo electrónico no es válido.';
            }
        }
        if (!usuarioForm.nombreUsuario) {
            errores.nombreUsuario = 'El nombre de usuario es obligatorio.';
        }
        if (!usuarioForm.contrasena) {
            errores.contrasena = 'La contraseña es obligatoria.';
        }

        if (Object.keys(errores).length > 0) {
            setErroresForm(errores);
            return;
        }

        const apiUrl = 'http://localhost:3000/api';
        const url = `${apiUrl}/Usuario/admin`;
        const token = localStorage.getItem('token');
        const headers = {
            'x-auth-token': token,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(usuarioForm)
            });
            if (!response.ok) {
                throw new Error('Error al agregar usuario');
            }
            const newUser = await response.json();
            setUsuarios([...usuarios, newUser]);
            setMostrarFormularioAñadir(false);
            setUsuarioForm({
                nombre: '',
                correoElectronico: '',
                nombreUsuario: '',
                contrasena: ''
            });
        } catch (error) {
            console.error('Error:', error);
            setMensajeError('Error al agregar el usuario: ' + (error.message || ''));
        }
    }

    async function buscarLosUsuarios() {
        setErrorBusqueda(false);
        setMensajeError('');

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Error con el token:');
            return;
        }

        const patronValido = /^[A-Za-z0-9_-]*$/;
        if (!patronValido.test(busqueda)) {
            setErrorBusqueda(true);
            setMensajeError('Error: La búsqueda contiene caracteres no válidos.(Solo puede incluir letras, números o _ )');
            return;
        }

        try {
            const response = await buscarUsuarios(busqueda);
            setUsuarios(response);

            if (response.length === 0) {
                setErrorBusqueda(true);
                setMensajeError('No se encontró ningún usuario con ese nombre.');
            } else {
                setErrorBusqueda(false);
                setMensajeError('');
            }
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            setErrorBusqueda(true);
            setMensajeError(error.message || 'Error al buscar usuarios.');
        }
    }

    async function eliminarUsuario(nombreUsuario) {
        setErrorBusqueda(false);
        setMensajeError('');

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Error con el token:');
            return;
        }

        if (nombreUsuario !== 'admin') {
            const url = `http://localhost:3000/api/Usuario/admin/${nombreUsuario}`;
            const headers = new Headers({ 'x-auth-token': token });
            try {
                const response = await fetch(url, { method: 'DELETE', headers });
                if (!response.ok) {
                    throw new Error('Error al eliminar usuario');
                }
                console.log('Usuario eliminado correctamente');
                obtenerUsuarios();
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                setMensajeError('Error al eliminar usuario');
            }
        } else {
            console.error('Error al eliminar usuario al ser admin');
            setMensajeError('Error al eliminar usuario al ser admin');
        }
    }

    async function editarUsuario({ state, nombreUsuario, datos }) {
        const { apiUrl, token } = state;
        const url = `${apiUrl}/Usuario/admin/${nombreUsuario}`;
        const headers = new Headers({
            'x-auth-token': token,
            'Content-Type': 'application/json'
        });
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers,
                body: JSON.stringify(datos)
            });
            const data = await response.json();  // Ensure to parse the JSON response regardless of the status
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al editar usuario');  // Use backend-specific error message if available
            }
            obtenerUsuarios();  // Refresh users after editing
            return data;  // Return the successful data for further use if needed
        } catch (error) {
            console.error('Error:', error);
            throw error;  // Rethrow the error to handle it in the calling function
        }
    }
    

    function handleEditUserClick(usuario) {
        setUsuarioEditado({
            nombre: usuario.nombre,
            correoElectronico: usuario.correoElectronico,
            nombreUsuario: usuario.nombreUsuario
        });
        setNombreUsuarioA(usuario.nombreUsuario);
        setMostrarFormularioEditarE(true);
    }

    function editarElUsuario(e) {
        e.preventDefault();
        if (nombreUsuarioA.toLowerCase() === 'admin') {
            setErrorEditar(true);
            setMensajeError('No puedes editar al usuario "admin".');
            return;
        }
    
        if (!usuarioEditado.nombre || !usuarioEditado.correoElectronico || !usuarioEditado.nombreUsuario) {
            setErrorEditar(true);
            setMensajeError('Todos los campos son obligatorios.');
            return;
        }
    
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(usuarioEditado.correoElectronico)) {
            setErrorEditar(true);
            setMensajeError('El formato del correo electrónico no es válido.');
            return;
        }
    
        editarUsuario({
            state: { apiUrl: 'http://localhost:3000/api', token: localStorage.getItem('token') },
            nombreUsuario: nombreUsuarioA,
            datos: usuarioEditado
        }).then(() => {
            setUsuarioEditado({ nombre: '', correoElectronico: '', nombreUsuario: '' });
            setNombreUsuarioA('');
            setMostrarFormularioEditarE(false);
            setErrorEditar(false);
            setMensajeError('Usuario editado correctamente.');
        }).catch(error => {
            console.error('Error al editar el usuario:', error);
            setErrorEditar(true);
            setMensajeError(error.message);  // Display specific error from the backend
        });
    }

    return (
        <div className="usuarios-container">
            <h1>Gestión de Usuarios</h1>
            {isAdminUser && (
                <button onClick={() => setMostrarFormularioAñadir(true)}>Añadir Usuario</button>
            )}
            <div className="search-add-container">
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar..."
                    className={errorBusqueda ? 'error-input' : ''}
                />
                <button onClick={buscarLosUsuarios}>Buscar</button>
                <button onClick={() => window.location.href = '/inicio'} disabled={!isAdminUser}>Back</button>
            </div>

            {errorBusqueda && (
                <div className="error-message">{mensajeError}</div>
            )}

            {mostrarFormularioAñadir && (
                <div className="form-container">
                    <h2>Añadir Nuevo Usuario</h2>
                    <form onSubmit={agregarUsuario}>

                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            value={usuarioForm.nombre}
                            onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
                            type="text"
                            id="nombre"
                            placeholder="Introduce el nombre del usuario"
                        />
                        {erroresForm.nombre && <div className="error-message">{erroresForm.nombre}</div>}

                        <label htmlFor="correo">Correo:</label>
                        <input
                            value={usuarioForm.correoElectronico}
                            onChange={(e) => setUsuarioForm({ ...usuarioForm, correoElectronico: e.target.value })}
                            type="text"
                            id="correo"
                            placeholder="Introduce el correo electrónico del usuario"
                        />
                        {erroresForm.correoElectronico && <div className="error-message">{erroresForm.correoElectronico}</div>}

                        <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
                        <input
                            value={usuarioForm.nombreUsuario}
                            onChange={(e) => setUsuarioForm({ ...usuarioForm, nombreUsuario: e.target.value })}
                            type="text"
                            id="nombreUsuario"
                            placeholder="Introduce el nombre de usuario"
                        />
                        {erroresForm.nombreUsuario && <div className="error-message">{erroresForm.nombreUsuario}</div>}

                        <label htmlFor="contrasena">Contraseña:</label>
                        <input
                            value={usuarioForm.contrasena}
                            onChange={(e) => setUsuarioForm({ ...usuarioForm, contrasena: e.target.value })}
                            type="password"
                            id="contrasena"
                            placeholder="Introduce la contraseña del usuario"
                        />
                        {erroresForm.contrasena && <div className="error-message">{erroresForm.contrasena}</div>}

                        <button type="submit">Guardar</button>
                        <button type="button" onClick={() => setMostrarFormularioAñadir(false)}>Cancelar</button>
                        {mensajeError && <div className="error-message">{mensajeError}</div>}
                    </form>
                </div>
            )}

            {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                    <div key={usuario.nombreUsuario} className="usuario-item">
                        <p>Nombre: {usuario.nombre}</p>
                        <p>Correo: {usuario.correoElectronico}</p>
                        <p>Nombre de Usuario: {usuario.nombreUsuario}</p>
                        <p>Roles: {usuario.roles.join(', ')}</p>
                        <button onClick={() => eliminarUsuario(usuario.nombreUsuario)}>Eliminar</button>
                        {errorBusqueda && usuario.nombreUsuario === busqueda && (
                            <div className="error-message">{mensajeError}</div>
                        )}
                        <button onClick={() => handleEditUserClick(usuario)}>Editar Usuario</button>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No se encontraron usuarios.</p>
            )}

            {/* Formulario de edición */}
            <div className="form-container" style={{ display: mostrarFormularioEditarE ? 'block' : 'none' }}>
                <h2>Editar Usuario</h2>
                <form onSubmit={editarElUsuario}>
                    <label htmlFor="nombreE">Nombre:</label>
                    <input
                        type="text"
                        id="nombreE"
                        value={usuarioEditado.nombre}
                        onChange={(e) => setUsuarioEditado({ ...usuarioEditado, nombre: e.target.value })}
                    />
                    {erroresFormEditado.nombre && <div className="error-message">{erroresFormEditado.nombre}</div>}

                    <label htmlFor="correoE">Correo Electrónico:</label>
                    <input
                        type="text"
                        id="correoE"
                        value={usuarioEditado.correoElectronico}
                        onChange={(e) => setUsuarioEditado({ ...usuarioEditado, correoElectronico: e.target.value })}
                    />
                    {erroresFormEditado.correo && <div className="error-message">{erroresFormEditado.correo}</div>}

                    <label htmlFor="nombreUsuarioE">Nombre de Usuario:</label>
                    <input
                        type="text"
                        id="nombreUsuarioE"
                        value={usuarioEditado.nombreUsuario}
                        onChange={(e) => setUsuarioEditado({ ...usuarioEditado, nombreUsuario: e.target.value })}
                    />
                    {erroresFormEditado.nombreUsuario && <div className="error-message">{erroresFormEditado.nombreUsuario}</div>}

                    <button type="submit">Guardar</button>
                    <button type="button" onClick={() => setMostrarFormularioEditarE(false)}>Cancelar</button>
                    {errorEditar && <div className="error-message">{mensajeError}</div>}
                </form>
            </div>
        </div>
    );
}

export default GestionUsuarios;
