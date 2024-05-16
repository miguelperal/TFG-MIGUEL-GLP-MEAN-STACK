<template>
    <div class="entradas-container">
      <button @click="mostrarFormularioNuevaEntrada = true">Añadir Nueva Entrada</button>
      <button @click="irAInicio">Back</button>
  
      <div class="search-add-container">
        <input type="text" v-model="busqueda" placeholder="Buscar...">
        <button @click="buscarlasEntradasAdmin">Buscar</button>
      </div>
      <div class="error-message" v-if="errorBusqueda">{{ mensajeError }}</div>
      
  
      <div v-for="publicacion in publicacionesAdmin" :key="publicacion.titulo">
        <div>
          <h2>{{ publicacion.titulo }}</h2>
          <p>{{ publicacion.contenido }}</p>
          <div v-if="publicacion.imagen && publicacion.imagen.length > 0" class="imagenes">
            <img v-for="imagen in publicacion.imagen" :src="imagen" :key="imagen" alt="Imagen de la publicación">
          </div>
          <div v-if="publicacion.imagenes">
            <img :src="'http://localhost:3000/' + publicacion.imagenes" class="publicacion-image" alt="Imagen de la publicacion">
          </div>
          <p>Autor: {{ publicacion.nombreUsuario }}</p>
          <p>Categorías: <span v-for="categoria in publicacion.categorias" :key="categoria">{{ categoria }}</span></p>
          <p>Etiquetas: <span v-for="etiqueta in publicacion.etiquetas" :key="etiqueta">{{ etiqueta }}</span></p>
          <p>Fecha de Creación: {{ formatarFecha(publicacion.fechaCreacion) }}</p>
          <p>Fecha de Edición: {{ publicacion.fechaEdicion ? formatarFecha(publicacion.fechaEdicion) : 'No editado' }}</p>
          <button @click="mostrarFormularioEditar(publicacion)">Editar Entrada</button>
          <button @click="eliminarEntradadelAdmin(publicacion.titulo, publicacion.nombreUsuario)">Eliminar Entrada</button>
        </div>
        <hr>
      </div>
    </div>

    <div class="form-container" v-if="mostrarFormularioNuevaEntrada">
    <h2>Añadir Nueva Entrada</h2>
    <form @submit.prevent="submitEntrada(entradaForm)">
      <label for="titulo">Título:</label>
      <input v-model="entradaForm.titulo" type="text" id="titulo" placeholder="Introduce el título de la entrada" @blur="validarTitulo">
      <div v-if="erroresForm.titulo" class="error-message">{{ erroresForm.titulo }}</div>    

      <label for="contenido">Contenido:</label>
      <textarea type=textarea v-model="entradaForm.contenido" id="contenido" placeholder="Introduce el contenido de la entrada" @blur="validarContenido"></textarea>
      <div v-if="erroresForm.contenido" class="error-message">{{ erroresForm.contenido }}</div> 

      <label for="imagen">Imagen</label>
      <input type="file" @change="handleFileUpload2" accept="image/png, image/jpeg" @blur=validarImagen >
      <div v-if="erroresForm.imagenes" class="error-message">{{ erroresForm.imagenes }}</div> 

      <label for="nombreUsuario">Nombre de Usuario</label>
    <select class="form-control" v-model="entradaForm.nombreUsuario" id="nombreUsuario" @blur=validarNombreUsuario>
      <option value="" disabled selected>Selecciona un usuario</option>
      <option v-for="nombre in nombresUsuario" :key="nombre" :value="nombre">
        {{ nombre }}
      </option>
    </select>
    <div v-if="erroresForm.nombreUsuario" class="error-message">{{ erroresForm.nombreUsuario }}</div> 

      <label for="categoria">Categoría:</label>
    <select v-model="entradaForm.categoria" id="categoria" @change="validarCategoria">
      <option disabled value="">Seleccione una categoría</option>
      <option value="Tecnología">Tecnología</option>
      <option value="Salud">Salud</option>
      <option value="Viajes">Viajes</option>
      <option value="Educación">Educación</option>
      <option value="Comida">Comida</option>
      <option value="Deportes">Deportes</option>
    </select>
    <div v-if="erroresForm.categoria" class="error-message">{{ erroresForm.categoria }}</div> 


    <label for="etiquetas">Etiquetas:</label>
    <select v-model="entradaForm.etiquetas" id="etiquetas" @change="validarEtiquetas">
      <option disabled value="">Seleccione una etiqueta</option>
      <option value="Novedad">Novedad</option>
      <option value="Antiguo">Antiguo</option>
      <option value="Positivo">Positivo</option>
      <option value="Negativo">Negativo</option>
      <option value="Cercano">Cercano</option>
      <option value="Lejano">Lejano</option>
    </select>
    <div v-if="erroresForm.etiquetas" class="error-message">{{ erroresForm.etiquetas }}</div>   

      <button type="submit">Guardar</button>
      <button type="button" @click="mostrarFormularioNuevaEntrada = false">Cancelar</button>
    </form>
  </div>

  <div class="form-container" v-if="mostrarFormularioEdicion">
    <h2>Editar Entrada</h2>
    <form @submit.prevent="submitEntradaE(entradaFormE)">
      <label for="titulo">Título:</label>
      <input v-model="entradaFormE.titulo" type="text" id="titulo" readonly @blur="validarTitulo">
      <div v-if="erroresFormE.titulo" class="error-message">{{ erroresFormE.titulo }}</div>

      <label for="contenido">Contenido:</label>
      <textarea type=textarea v-model="entradaFormE.contenido" id="contenido" @blur="validarContenido"></textarea>
      <div v-if="erroresFormE.contenido" class="error-message">{{ erroresFormE.contenido }}</div>


      <label for="categoria">Categoría:</label>
    <select v-model="entradaFormE.categoria" id="categoria" @change="validarCategoria">
      <option disabled value="">Seleccione una categoría</option>
      <option value="Tecnología">Tecnología</option>
      <option value="Salud">Salud</option>
      <option value="Viajes">Viajes</option>
      <option value="Educación">Educación</option>
      <option value="Comida">Comida</option>
      <option value="Deportes">Deportes</option>
    </select>
    <div v-if="erroresFormE.categoria" class="error-message">{{ erroresFormE.categoria }}</div>

    <label for="etiquetas">Etiquetas:</label>
    <select v-model="entradaFormE.etiquetas" id="etiquetas" @change="validarEtiquetas">
      <option disabled value="">Seleccione una etiqueta</option>
      <option value="Novedad">Novedad</option>
      <option value="Antiguo">Antiguo</option>
      <option value="Positivo">Positivo</option>
      <option value="Negativo">Negativo</option>
      <option value="Cercano">Cercano</option>
      <option value="Lejano">Lejano</option>
    </select>
    <div v-if="erroresFormE.etiquetas" class="error-message">{{ erroresFormE.etiquetas }}</div>

      <button type="submit">Guardar</button>
      <button type="button" @click="mostrarFormularioEdicion = false">Cancelar</button>
    </form>
  </div>
   


  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';
  
  export default {
    name: 'GestionEntradasAdmin',
    computed: {
      ...mapState({
          publicacionesAdmin: state => state.publicacionesA,
        nombresUsuario: state => state.nombresUsuarios,
      }),
    },
    data() {
      return {
        busqueda: '',
        errorBusqueda: false,
        mensajeError: '',
        mostrarFormularioNuevaEntrada: false,
          mostrarFormularioEdicion: false,
          imagenB:null,
          entradaForm: {
        titulo: '',
        contenido: '',
        categoria: '',
        etiquetas: '',
              imagenes: null,
              nombreUsuario: '',
          },
          erroresForm: {
        titulo: '',
        contenido: '',
        categoria: '',
        etiquetas: '',
        imagenes: '',
        nombreUsuario:''
          },
          entradaFormE: {
        titulo: '',
        contenido: '',
        categoria: '',
              etiquetas: '',
        nombreUsuario:'',
          },
          erroresFormE: {
        titulo: '',
        contenido: '',
        categoria: '',
        etiquetas: '',
          },
      }
    },
    methods: {
        ...mapActions([
            'obtenerEntradasAdmin',
            'buscarEntradasAdmin',
            'eliminarEntradaAdmin',
            'crearEntradaAdmin',
            'obtenerNombresDeUsuario',
            'editarEntradaAdmin',
            // Agregar otros métodos necesarios
        ]),
        irAInicio() {
          this.$router.push('/inicio');
          this.$store.dispatch('isAdminUser');
        },



        async buscarlasEntradasAdmin() {
            this.errorBusqueda = false;
            this.mensajeError = '';
          
            if (this.busqueda.trim() === '') {
        this.obtenerEntradasAdmin();
        return;
            }
      


      
      const pattern = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ-]+$/;
      if (!pattern.test(this.busqueda)) {
        this.errorBusqueda = true;
        this.mensajeError = 'Patrón de búsqueda no válido.';
        return;
      }

      try {
        const response = await this.buscarEntradasAdmin(this.busqueda);

          if (response && response.length === 0) {
              this.errorBusqueda = true;
              this.mensajeError = 'No se encontró ninguna entrada con ese nombre o que pertenezca a ese usuario.';
              this.httpErrorMessage = '';
          } else {
              this.publicaciones = response;
              this.errorBusqueda = false;
              this.mensajeError = '';
              this.httpErrorMessage = '';
          }
      } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        this.errorBusqueda = true;
        this.mensajeError = 'Error al realizar la búsqueda.';
        // Manejo adicional de errores HTTP si fuera necesario
      }
      },

        validarTitulo() {
    if (!this.entradaForm.titulo) {
      this.erroresForm.titulo = 'El título es obligatorio.';
    } else if (this.entradaForm.titulo.length < 3 || this.entradaForm.titulo.length > 50) {
      this.erroresForm.titulo = 'El título debe tener entre 3 y 50 caracteres.';
    } else {
      this.erroresForm.titulo = '';
    }
  },

  validarContenido() {
    if (!this.entradaForm.contenido) {
      this.erroresForm.contenido = 'El contenido es obligatorio.';
    } else if (this.entradaForm.contenido.length < 10 || this.entradaForm.contenido.length > 10500) {
      this.erroresForm.contenido = 'El contenido debe tener entre 10 y 10500 caracteres.';
    } else {
      this.erroresForm.contenido = '';
    }
  },

  validarCategoria() {
    if (!this.entradaForm.categoria) {
      this.erroresForm.categoria = 'Debe seleccionar una categoría.';
    } else {
      this.erroresForm.categoria = '';
    }
  },

  validarEtiquetas() {
    if (!this.entradaForm.etiquetas) {
      this.erroresForm.etiquetas = 'Debe seleccionar una etiqueta.';
    } else {
      this.erroresForm.etiquetas = '';
    }
        },
        validarNombreUsuario() {
    if (!this.entradaForm.nombreUsuario) {
      this.erroresForm.nombreUsuario = 'Debe seleccionar nombre de usuario.';
    } else {
      this.erroresForm.nombreUsuario = '';
    }
      },
      validarImagen() {
    if (!this.imagenB) {
      this.erroresForm.imagenes = 'Debe seleccionar una imagen.';
    } else {
      this.erroresForm.imagenes = '';
    }
  },

  validarFormulario() {
    this.validarTitulo();
    this.validarContenido();
    this.validarCategoria();
    this.validarEtiquetas();
    this.validarNombreUsuario();
    this.validarImagen();

    return !this.erroresForm.titulo && !this.erroresForm.contenido && !this.erroresForm.categoria && !this.erroresForm.nombreUsuario && !this.erroresForm.etiquetas && !this.erroresForm.imagenes;
        },

        validarContenidoE() {
    if (!this.entradaFormE.contenido) {
      this.erroresFormE.contenido = 'El contenido es obligatorio.';
    } else if (this.entradaFormE.contenido.length < 10 || this.entradaFormE.contenido.length > 10500) {
      this.erroresFormE.contenido = 'El contenido debe tener entre 10 y 10500 caracteres.';
    } else {
      this.erroresFormE.contenido = '';
    }
  },

  validarCategoriaE() {
    if (!this.entradaFormE.categoria) {
      this.erroresFormE.categoria = 'Debe seleccionar una categoría.';
    } else {
      this.erroresFormE.categoria = '';
    }
  },

      validarEtiquetasE() {
        if (!this.entradaFormE.etiquetas) {
          this.erroresFormE.etiquetas = 'Debe seleccionar una etiqueta.';
        } else {
          this.erroresFormE.etiquetas = '';
        }
      },
      validarFormularioEditar() {
    this.validarContenidoE();
    this.validarCategoriaE();
    this.validarEtiquetasE();
      return !this.erroresFormE.titulo && !this.erroresFormE.contenido && !this.erroresFormE.categoria && !this.erroresFormE.etiquetas;

  },
      mostrarFormularioEditar(entrada) {

          this.entradaFormE = {
            titulo: entrada.titulo,
            contenido: entrada.contenido,
            categoria: entrada.categorias[0],
              etiquetas: entrada.etiquetas[0],
              nombreUsuario:entrada.nombreUsuario,
    
        };
        console.log(entrada.categorias,entrada.etiquetas);
    // Establece mostrarFormulario a true para mostrar el formulario de edición
    this.mostrarFormularioEdicion = true;
    console.log(this.entradaFormE);
},


        handleFileUpload2(event) {
    const files = event.target.files;
    if (!files) {
      //this.erroresForm.imagenes = 'Debe seleccionar una imagen.';
      this.imagenB = null;
    } else {
      const archivo = files[0];
      const formatoAceptado = /image\/(jpeg|png)$/;
      if (!formatoAceptado.test(archivo.type)) {
        //this.erroresForm.imagenes = 'Formato no válido. Solo se permiten imágenes JPG o PNG.';
        this.imagenB = null;
      } else {
        this.imagenB = archivo;
        //this.erroresForm.imagenes = '';
      }
    }
  },

    submitEntrada(entradaForm) {
                    if (this.validarFormulario()) {
                    const formData = new FormData();
                formData.append('titulo', entradaForm.titulo);
                formData.append('contenido', entradaForm.contenido);
                formData.append('nombreUsuario', entradaForm.nombreUsuario);
                formData.append('categorias', entradaForm.categoria);
                formData.append('etiquetas', entradaForm.etiquetas);
                if (this.imagenB) {
                    formData.append('imagenes', this.imagenB);
                }
                console.log(this.imagenB);
                this.$store.dispatch('crearEntradaAdmin',formData)
                    .then(() => {
                    console.log('Entrada agregada correctamente');
                    this.entradaForm = { titulo: '', contenido: '', categoria: '', etiquetas:'' };
                    this.obtenerEntradasAdmin(); // Actualiza la lista de entradas después de agregar una nueva
                    this.mostrarFormularioNuevaEntrada = false;
                    })
                    .catch(error => {
                    console.error('Error al agregar la entrada:', error);
                    this.errorCrear = true;
                    });

                    
                } else {
            console.log("Formulario inválido, revise los errores.");
            }

      },

        eliminarEntradadelAdmin(titulo, usuarioNombre) {
                    this.$store.dispatch('eliminarEntradaAdmin', {
            tituloEntradad: titulo,
            nombreUsuariod: usuarioNombre
        }).then(() => {
                console.log('Entrada eliminada correctamente');
                this.obtenerEntradasAdmin();
            }).catch(error => {
                console.error('Error al eliminar entrada:', error);
                this.errorEliminar = true;                  
            this.mensajeError = 'Error al eliminar entrada';
            });
        }, 

        formatarFecha(fecha) {
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
        },

    
        submitEntradaE(entradaFormE) {
        if (this.validarFormularioEditar()) {
          const formDataE = new FormData();
          formDataE.append('titulo', entradaFormE.titulo);
          formDataE.append('contenido', entradaFormE.contenido);
            formDataE.append('categorias', entradaFormE.categoria);
          formDataE.append('nombreUsuario', entradaFormE.nombreUsuario)
          formDataE.append('etiquetas', entradaFormE.etiquetas);


          this.$store.dispatch('editarEntradaAdmin',formDataE)
            .then(() => {
              console.log('Entrada editada correctamente');
              this.entradaFormE = { titulo: '', contenido: '', categoria: '', etiquetas: '' };
              this.obtenerEntradasAdmin(); // Actualiza la lista de entradas después de agregar una nueva
              this.mostrarFormularioEdicion = false;
            })
            .catch(error => {
              console.error('Error al editar la entrada:', error);
            });

        } else {
          console.log("Formulario inválido, revise los errores.");
        }

      },
    },
      created() {
          this.obtenerEntradasAdmin();  // Carga inicial de datos
          this.obtenerNombresDeUsuario();
      }
    }
  </script>
  
  <style scoped>
/* Estilos generales para el contenedor principal */
.entradas-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
}

/* Estilos para la barra de búsqueda y botones de acción */
.search-add-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-add-container input {
  flex-grow: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-add-container button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-add-container button:hover {
  background-color: #0056b3;
}

/* Estilos para los botones principales */
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

button:hover {
  background-color: #0056b3;
}

/* Estilos para mensajes de error */
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 10px;
}

/* Estilos para cada publicación individual */
div[v-for="publicacion in publicacionesAdmin"] {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.h2, .autor, .categorias, .etiquetas, .fechas {
  margin-bottom: 10px;
}

.imagenes img, .publicacion-image {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

/* Estilos para el formulario de entrada */
.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input[type="text"], form textarea, form select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
}

form button {
  margin-top: 10px;
}

/* Modal y botón de cierre */
.modal-content, .close-button {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  color: #aaa;
}

.close-button:hover {
  color: #777
} 
  /* Estilos adicionales para recuadros de input y textarea en el formulario */
input[type="text"], textarea, select {
  width: 100%; /* Asegura que ocupen todo el ancho disponible */
  padding: 10px; /* Espacio interno para mejorar la legibilidad */
  border: 1px solid #ccc; /* Borde sutil */
  border-radius: 4px; /* Bordes redondeados para un look moderno */
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
  margin-bottom: 20px; /* Espacio entre los elementos del formulario */
}


/* Estilos para el input de tipo 'file' para imágenes */
input[type="file"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: block;
  width: 100%;
  margin-bottom: 20px; /* Espacio después del input para separarlo de otros elementos */
  cursor: pointer; /* Indica que el elemento es interactivo */
}

/* Estilos para los botones dentro del formulario */
button {
  background-color: #007bff; /* Color de fondo azul */
  color: white; /* Texto blanco para alto contraste */
  border: none; /* Sin borde para un diseño más limpio */
  padding: 10px 15px; /* Padding adecuado para un tamaño fácil de clicar */
  border-radius: 4px; /* Bordes redondeados */
  cursor: pointer; /* Indica que el elemento es clickeable */
  transition: background-color 0.3s; /* Transición suave para el cambio de color */
  margin-right: 10px; /* Margen derecho para separación entre botones */
}

button:hover {
  background-color: #0056b3; /* Cambio de color al pasar el cursor */
}

/* Estilo para el botón 'Cancelar' que quizás necesite un estilo distinto */
button[type="button"] {
  background-color: #6c757d; /* Un gris suave para diferenciarlo del botón principal */
}

button[type="button"]:hover {
  background-color: #5a6268; /* Un gris más oscuro al pasar el cursor */
}

/* Ajustes para el contenedor del formulario para mejorar la visibilidad */
.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
}

/* Mejoras para la visibilidad y accesibilidad del formulario */
label {
  font-weight: bold; /* Hace que las etiquetas sean más fáciles de identificar */
  margin-bottom: 5px; /* Espacio antes de cada input */
};


</style>
  