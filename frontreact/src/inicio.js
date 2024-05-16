import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './inicio.css';  // Asegúrate de crear un archivo Inicio.css con los estilos proporcionados abajo
//import { jwtDecode } from 'jwt-decode';

function Inicio() {
    const [publicaciones, setPublicaciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Simula el estado de autenticación
    const [isAdminUser, setIsAdminUser] = useState(false); // Simula el estado de admin
   // const [error, setError] = useState('');
    const navigate = useNavigate();

    // Usar useEffect para cargar las publicaciones al montar el componente
    useEffect(() => {
        const token = localStorage.getItem('token');        
        fetchPublicaciones();
        if (token) {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
           // const decodedToken = jwtDecode(token); // Decode the token
            if (tokenPayload.roles.includes('admin')) {
                setIsAdminUser(true); // Check if the user's role is 'admin'
            }
            setIsLoggedIn(true);
            
        } else {
            setIsLoggedIn(false);
        }
    }, []);

     // Función para obtener todas las publicaciones
     const fetchPublicaciones = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/Publicacion/obtener-entradas');
            if (!response.ok) {
                throw new Error('No se pudo obtener las publicaciones');
            }
            const data = await response.json();
            setPublicaciones(data);
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
           // setError(error.message);
        }
    };

    // Función para buscar publicaciones según un término de búsqueda
    const searchPublicaciones = async () => {
        if (busqueda === '') {
            fetchPublicaciones();
        } else {
        try {
            const response = await fetch(`http://localhost:3000/api/Publicacion/buscar-entradas?terminoBusqueda=${busqueda}`);
            if (!response.ok) {
                throw new Error('No se pudo realizar la búsqueda de publicaciones');
            }
            const data = await response.json();
            setPublicaciones(data);
        } catch (error) {
            console.error('Error al buscar las publicaciones:', error);
            // setError(error.message);
        }
    }
    };

    const navigateTo = (route) => {
        navigate(route);
    };

    const logout = () => {
        // Lógica para cerrar sesión
        localStorage.removeItem('token');  // Remove the token from localStorage
        setIsLoggedIn(false);  // Update login state
        //navigate('/inicio-sesion'); 
        window.location.reload();
    };

    const formatarFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <div>
            <h1>BLOG PUBLICACIONES MEAN STACK</h1>
            <div className="acciones">
                {!isLoggedIn && <button onClick={() => navigateTo('/inicio-sesion')}>Iniciar Sesión</button>}
                {!isLoggedIn && <button onClick={() => navigateTo('/registro')}>Registro</button>}
                {isLoggedIn && <button onClick={logout}>Cerrar sesión</button>}
                {isLoggedIn && isAdminUser && <button onClick={() => navigateTo('/gestion-usuarios')}>Gestión de Usuarios</button>}
                {isLoggedIn && !isAdminUser &&<button onClick={() => navigateTo('/gestionar-entradas')}>Gestión de Entradas</button>}
                {isLoggedIn && isAdminUser && <button onClick={() => navigateTo('/gestion-entradas-admin')}>Gestión de Entradas</button>}
            </div>
            <div className="container">
                <div className="search-bar">
                    <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar..."/>
                    <button onClick={searchPublicaciones}>Buscar</button>
                </div>
                <div className="publicaciones">
                    {!publicaciones.length && <p className="sin-coincidencias">No hay ninguna publicación que coincida.</p>}
                    {publicaciones.map((publicacion, index) => (
                        <div key={index} className="publicacion">
                            <div className="titulo">
                                <h2>{publicacion.titulo}</h2>
                            </div>
                            <div className="contenido-recuadro">
                                <div className="contenido">
                                    <p>{publicacion.contenido}</p>
                                    {publicacion.imagenes && <img src={`http://localhost:3000/${publicacion.imagenes}`} className="publicacion-image" alt="Imagen de la publicacion"/>}
                                    <p>Autor:{publicacion.nombreUsuario}</p>
                                </div>
                            </div>
                            {publicacion.categorias && (
                                <div className="categorias">
                                    <p>Categorías: {publicacion.categorias.join(', ')}</p>
                                </div>
                            )}
                            {publicacion.etiquetas && (
                                <div className="etiquetas">
                                    <p>Etiquetas: {publicacion.etiquetas.join(', ')}</p>
                                </div>
                            )}
                            <div className="fechas">
                                <p>Fechas:</p>
                                <p>Fecha de Creación: {formatarFecha(publicacion.fechaCreacion)}</p>
                                <p>Fecha de edición: {publicacion.fechaEdicion ? formatarFecha(publicacion.fechaEdicion) : 'No editado'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Inicio;
