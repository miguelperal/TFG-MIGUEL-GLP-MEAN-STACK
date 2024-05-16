import React, { useState, useEffect } from 'react';
import './GestionEntradasUsuario.css';

function GestionEntradasUsuario() {
    const [publicaciones, setPublicaciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [errorBusqueda, setErrorBusqueda] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const [mostrarFormularioNuevaEntrada, setMostrarFormularioNuevaEntrada] = useState(false);
    const [mostrarFormularioEdicion, setMostrarFormularioEdicion] = useState(false);
    const [entradaActual, setEntradaActual] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // Variable para almacenar la imagen seleccionada
    const [erroresFormE, setErroresFormE] = useState({});
    const [entradaForm, setEntradaForm] = useState({
        titulo: '',
        contenido: '',
        categorias: '',
        etiquetas: '',
        imagenes: null
    });
    const [entradaFormE, setEntradaFormE] = useState({
        titulo: '',
        contenido: '',
        categorias: '',
        etiquetas: '',
        nombreUsuario:''
    });
    const [erroresForm, setErroresForm] = useState({});

    useEffect(() => {
        fetchEntradas();
    }, []);

    const fetchEntradas = async () => {
        const response = await fetch('http://localhost:3000/api/Publicacion/obtener-entradasPorUsuario', {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const publicaciones = await response.json();
        setPublicaciones(publicaciones);
    };

    const buscarEntradas = async (terminoBusqueda) => {
        setErrorBusqueda(false);
        setMensajeError('');
    
        if (!terminoBusqueda.trim()) {
            await fetchEntradas();
            return;
        }
    
        const pattern = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ-]+$/;
        if (!pattern.test(terminoBusqueda)) {
            setErrorBusqueda(true);
            setMensajeError('Patrón de búsqueda no válido.');
            return;
        }
    
        try {
            const url = `http://localhost:3000/api/Publicacion/obtener-entradasPorUsuarioYBuscar?terminoBusqueda=${terminoBusqueda}`;
            const headers = {
                'x-auth-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            };
            const response = await fetch(url, {
                method: 'GET',
                headers
            });
    
            if (!response.ok) {
                throw new Error(`Error al realizar la búsqueda: ${response.statusText}`);
            }
    
            const result = await response.json();
            if (result && result.length === 0) {
                setErrorBusqueda(true);
                setMensajeError('No se encontraron entradas con ese término.');
            } else {
                setPublicaciones(result);
                setErrorBusqueda(false);
            }
        } catch (error) {
            setErrorBusqueda(true);
            setMensajeError(error.message);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEntradaForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    function validarTitulo() {
        const titulo = entradaForm.titulo;
        if (!titulo) {
            setErroresForm(prev => ({ ...prev, titulo: 'El título es obligatorio.' }));
            return false;
        } else if (titulo.length < 3 || titulo.length > 50) {
            setErroresForm(prev => ({ ...prev, titulo: 'El título debe tener entre 3 y 50 caracteres.' }));
            return false;
        } else {
            setErroresForm(prev => ({ ...prev, titulo: '' }));
            return true;
        }
    }
    
    function validarContenido() {
        const contenido = entradaForm.contenido;
        if (!contenido) {
            setErroresForm(prev => ({ ...prev, contenido: 'El contenido es obligatorio.' }));
            return false;
        } else if (contenido.length < 10 || contenido.length > 10500) {
            setErroresForm(prev => ({ ...prev, contenido: 'El contenido debe tener entre 10 y 10500 caracteres.' }));
            return false;
        } else {
            setErroresForm(prev => ({ ...prev, contenido: '' }));
            return true;
        }
    }
    
    function validarcategorias() {
        if (!entradaForm.categorias) {
            setErroresForm(prev => ({ ...prev, categorias: 'Debe seleccionar una categoría.' }));
            return false;
        } else {
            setErroresForm(prev => ({ ...prev, categorias: '' }));
            return true;
        }
    }
    
    function validarEtiquetas() {
        if (!entradaForm.etiquetas) {
            setErroresForm(prev => ({ ...prev, etiquetas: 'Debe seleccionar una etiqueta.' }));
            return false;
        } else {
            setErroresForm(prev => ({ ...prev, etiquetas: '' }));
            return true;
        }
    }

    function validarImagen() {
        if (!selectedFile) {
            setErroresForm(prev => ({ ...prev, imagenes: 'Debe seleccionar una imagen.' }));
            return false;
        } else {
            setErroresForm(prev => ({ ...prev, imagenes: '' }));
            return true;
        }
    }
    
    function validarFormulario() {
        // Perform all validations and ensure all return true
        const validTitulo = validarTitulo();
        const validContenido = validarContenido();
        const validCategorias = validarcategorias();
        const validEtiquetas = validarEtiquetas();
        const validImagen = validarImagen();
    
        return validTitulo && validContenido && validCategorias && validEtiquetas && validImagen;
    }
    const eliminarEntrada = async (titulos) => {
        try {
            const url = `http://localhost:3000/api/Publicacion/eliminar-entrada?titulo=${titulos}`;
            const headers = {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
            };
            const response = await fetch(url, {
                method: 'DELETE',
                headers
            });
           
            if (!response.ok) {
                throw new Error('Error al eliminar entrada');
            }
            console.log('Entrada eliminada correctamente');
            fetchEntradas();
        } catch (error) {
            console.error('Error al eliminar entrada:', error);
            setMensajeError('Error al eliminar entrada');
        }
    };


    const submitEntrada = async () => {
        if (!validarFormulario()) {
            console.log('Formulario inválido, revise los errores.');
            return;
        }

        const formData = new FormData();
        formData.append('titulo', entradaForm.titulo);
        formData.append('contenido', entradaForm.contenido);
        formData.append('categorias', entradaForm.categorias);
        formData.append('etiquetas', entradaForm.etiquetas);
        if (selectedFile) {
            formData.append('imagenes', selectedFile);
        }

        try {
            const response = await fetch(`http://localhost:3000/api/Publicacion/crear-entrada`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'x-auth-token': localStorage.getItem('token'),
                    },
                });
            console.log('Entrada creada correctamente:', response.data);
            setEntradaForm({ titulo: '', contenido: '', categorias: '', etiquetas: '', imagenes: null });
            fetchEntradas();
            setMostrarFormularioNuevaEntrada(false);
        } catch (error) {
            console.error('Error al agregar la entrada:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (validarFormulario()) {
                await submitEntrada();
            } else {
                console.log("Formulario inválido, revise los errores.");
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEntradaForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const handleFileUpload = (event) => {
        setSelectedFile(event.target.files[0]); // Almacenar el archivo seleccionado en selectedFile
    };

    function validarContenidoE() {
        const contenido = entradaFormE.contenido;
        if (!contenido) {
            setErroresFormE(prev => ({ ...prev, contenido: 'El contenido es obligatorio.' }));
            return false;
        } else if (contenido.length < 10 || contenido.length > 10500) {
            setErroresFormE(prev => ({ ...prev, contenido: 'El contenido debe tener entre 10 y 10500 caracteres.' }));
            return false;
        } else {
            setErroresFormE(prev => ({ ...prev, contenido: '' }));
            return true;
        }
    }
    
    function validarcategoriasE() {
        if (!entradaFormE.categorias) {
            setErroresFormE(prev => ({ ...prev, categorias: 'Debe seleccionar una categoría.' }));
            return false;
        } else {
            setErroresFormE(prev => ({ ...prev, categorias: '' }));
            return true;
        }
    }
    
    function validarEtiquetasE() {
        if (!entradaFormE.etiquetas) {
            setErroresFormE(prev => ({ ...prev, etiquetas: 'Debe seleccionar una etiqueta.' }));
            return false;
        } else {
            setErroresFormE(prev => ({ ...prev, etiquetas: '' }));
            return true;
        }
    }
    
    function validarFormularioEditar() {
        const validContenido = validarContenidoE();
        const validCategorias = validarcategoriasE();
        const validEtiquetas = validarEtiquetasE();
    
        return validContenido && validCategorias && validEtiquetas;
    }

    const handleEdit = (entrada) => {
        if (entrada && entrada.nombreUsuario) {
            setMostrarFormularioEdicion(true);
            setEntradaActual(entrada);
            setEntradaFormE({
                titulo: entrada.titulo,
                contenido: entrada.contenido,
                categorias: entrada.categorias.join(', '), // Assuming categories are an array
                etiquetas: entrada.etiquetas.join(', '), // Assuming etiquetas are an array
            });
        }else {
            console.error('Error: Publicación no definida');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
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

    const submitEntradaE = async (event) => {
        event.preventDefault();
        if (validarFormularioEditar()) {
            const formData = new FormData();
            formData.append('titulo', entradaFormE.titulo);
            formData.append('contenido', entradaFormE.contenido);
            formData.append('categorias', entradaFormE.categorias);
            formData.append('etiquetas', entradaFormE.etiquetas);
            if (selectedFile) {
                formData.append('imagenes', selectedFile);
            }
    
            try {
                const response = await fetch('http://localhost:3000/api/Publicacion/editar-entrada', {
                    method: 'PUT',
                    headers: {
                        'x-auth-token': localStorage.getItem('token'),
                    },
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Error al editar la entrada');
                }
                const data = await response.json();
                console.log('Entrada editada correctamente:', data);
                setMostrarFormularioEdicion(false);
                fetchEntradas(); // Recargar las publicaciones
            } catch (error) {
                console.error('Error al enviar el formulario de edición:', error);
            }
        } else {
            console.log("Formulario inválido, revise los errores.");
        }
    };

    return (
        <div className="entradas-container">
            <button onClick={() => setMostrarFormularioNuevaEntrada(true)}>Añadir Nueva Entrada</button>
            <button onClick={() => window.location.href = '/inicio'}>Back</button>

            <div className="search-add-container">
                <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar..." />
                <button onClick={() => buscarEntradas(busqueda)}>Buscar</button>
            </div>
            {errorBusqueda && <div className="error-message">{mensajeError}</div>}

            {publicaciones.map((publicacion, index) => (
                <div key={index}>
                    <h2>{publicacion.titulo}</h2>
                    <p>{publicacion.contenido}</p>
                    {publicacion.imagen && publicacion.imagen.length > 0 && (
                        <div className="imagenes">
                            {publicacion.imagen.map((imagen, index) => (
                                <img key={index} src={imagen} alt="Imagen de la publicación" />
                            ))}
                        </div>
                    )}
                    {publicacion.imagenes && (
                        <div>
                            <img src={`http://localhost:3000/${publicacion.imagenes}`} className="publicacion-image" alt="Imagen de la publicacion" />
                        </div>
                    )}
                    
                    <p>Autor: {publicacion.nombreUsuario}</p>
                    <p>Categorías: {publicacion.categorias.join(', ')}</p>
                    <p>Etiquetas: {publicacion.etiquetas.join(', ')}</p>
                    <p>Fecha de Creación: {formatDate(publicacion.fechaCreacion)}</p>
                    <p>Fecha de Edición: {publicacion.fechaEdicion ? formatDate(publicacion.fechaEdicion) : "No editado"}</p>
                    <button onClick={() => handleEdit(publicacion)}>Editar Entrada</button>
                    <button onClick={() => eliminarEntrada(publicacion.titulo)}>Eliminar</button>
                </div>
            ))}

{mostrarFormularioNuevaEntrada && (
    <div className="form-container">
        <h2>Añadir Nueva Entrada</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="titulo">Título:</label>
            <input
                type="text"
                name="titulo"
                value={entradaForm.titulo}
                onChange={handleChange}
                placeholder="Título"
            />
            {erroresForm.titulo && <div className="error-message">{erroresForm.titulo}</div>}

            <label htmlFor="contenido">Contenido:</label>
            <textarea
                name="contenido"
                value={entradaForm.contenido}
                onChange={handleChange}
                placeholder="Contenido"
            ></textarea>
            {erroresForm.contenido && <div className="error-message">{erroresForm.contenido}</div>}

            <label htmlFor="categorias">Categoría:</label>
            <select
                id="categorias"
                name="categorias"
                value={entradaForm.categorias}
                onChange={handleChange}
                onBlur={validarcategorias}
            >
                <option disabled value="">Seleccione una categoría</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Salud">Salud</option>
                <option value="Viajes">Viajes</option>
                <option value="Educación">Educación</option>
                <option value="Comida">Comida</option>
                <option value="Deportes">Deportes</option>
            </select>
            {erroresForm.categorias && <div className="error-message">{erroresForm.categorias}</div>}

            <label htmlFor="etiquetas">Etiquetas:</label>
            <select
                id="etiquetas"
                name="etiquetas"
                value={entradaForm.etiquetas}
                onChange={handleChange}
                onBlur={validarEtiquetas}
            >
                <option disabled value="">Seleccione una etiqueta</option>
                <option value="Novedad">Novedad</option>
                <option value="Antiguo">Antiguo</option>
                <option value="Positivo">Positivo</option>
                <option value="Negativo">Negativo</option>
                <option value="Cercano">Cercano</option>
                <option value="Lejano">Lejano</option>
            </select>
            {erroresForm.etiquetas && <div className="error-message">{erroresForm.etiquetas}</div>}

            <input type="file" onChange={handleFileUpload} accept="image/png, image/jpeg" />
            {erroresForm.imagenes && <div className="error-message">{erroresForm.imagenes}</div>}

            <div className="buttons-container">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setMostrarFormularioNuevaEntrada(false)}>Cancelar</button>
            </div>
        </form>
    </div>
)}

{mostrarFormularioEdicion && (
    <div className="form-container">
        <h2>Editar Entrada</h2>
        <form onSubmit={submitEntradaE}>
            <label htmlFor="titulo">Título:</label>
            <input
                type="text"
                id="titulo"
                value={entradaFormE.titulo}
                onChange={(e) => setEntradaFormE({ ...entradaFormE, titulo: e.target.value })}
                readOnly
            />
            {erroresFormE.titulo && <div className="error-message">{erroresFormE.titulo}</div>}

            <label htmlFor="contenido">Contenido:</label>
            <textarea
                id="contenido"
                value={entradaFormE.contenido}
                onChange={(e) => setEntradaFormE({ ...entradaFormE, contenido: e.target.value })}
            ></textarea>
            {erroresFormE.contenido && <div className="error-message">{erroresFormE.contenido}</div>}

            <label htmlFor="categorias">Categoría:</label>
            <select
                id="categorias"
                value={entradaFormE.categorias}
                onChange={(e) => setEntradaFormE({ ...entradaFormE, categorias: e.target.value })}
            >
                <option disabled value="">Seleccione una categoría</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Salud">Salud</option>
                <option value="Viajes">Viajes</option>
                <option value="Educación">Educación</option>
                <option value="Comida">Comida</option>
                <option value="Deportes">Deportes</option>
            </select>
            {erroresFormE.categorias && <div className="error-message">{erroresFormE.categorias}</div>}

            <label htmlFor="etiquetas">Etiquetas:</label>
            <select
                id="etiquetas"
                value={entradaFormE.etiquetas}
                onChange={(e) => setEntradaFormE({ ...entradaFormE, etiquetas: e.target.value })}
            >
                <option disabled value="">Seleccione una etiqueta</option>
                <option value="Novedad">Novedad</option>
                <option value="Antiguo">Antiguo</option>
                <option value="Positivo">Positivo</option>
                <option value="Negativo">Negativo</option>
                <option value="Cercano">Cercano</option>
                <option value="Lejano">Lejano</option>
            </select>
            {erroresFormE.etiquetas && <div className="error-message">{erroresFormE.etiquetas}</div>}

            <div className="buttons-container">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setMostrarFormularioEdicion(false)}>Cancelar</button>
            </div>
        </form>
    </div>
)}
        </div>
    );
}

export default GestionEntradasUsuario;
