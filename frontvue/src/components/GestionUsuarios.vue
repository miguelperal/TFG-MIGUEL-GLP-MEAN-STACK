<template>
    <div class="usuarios-container">
      <h1>Gestión de Usuarios</h1>
          <!-- Botón para abrir el formulario de añadir usuario -->
  <button v-if="isAdminUser" @click="añadirUsuarioF">Añadir Usuario</button>
  <div class="search-add-container">
  <!-- Input con v-model para enlace bidireccional y v-bind:class para añadir la clase condicionalmente -->
  <input type="text" v-model="busqueda" placeholder="Buscar..."
    :class="{'error-input': errorBusqueda}">
  
  <!-- Botón con evento click que llama a buscarUsuarios y está deshabilitado basado en isAdminUser -->
  <button @click="buscarlosUsuarios()" :disabled="!isAdminUser">Buscar</button>
  <button @click="this.$router.push('/inicio');" :disabled="!isAdminUser">Back</button>
</div>


<div v-if="errorBusqueda && busquedas" class="error-message">
      {{ mensajeError }}
    </div>


      <div v-if="usuarios && usuarios.length">
        <div v-for="usuario in usuarios" :key="usuario.id" class="usuario-item">
          <p>Nombre: {{ usuario.nombre }}</p>
          <p>Correo: {{ usuario.correoElectronico }}</p>
          <p>Nombre de Usuario: {{ usuario.nombreUsuario }}</p>
          <p>Roles: {{ usuario.roles.join(', ') }}</p>
          <button @click="deleteUsuario(usuario.nombreUsuario)">Eliminar</button>
          <div v-if="errorEliminar && usuario.nombreUsuario==this.usuarioEliminar" class="error-message">
          {{ mensajeError }}
          </div>
          <button  @click="mostrarFormularioEditar(usuario)">Editar Usuario</button>
          <hr>
        </div>
        
      </div>
      <div v-else>
        <p>No se encontraron usuarios.</p>
      </div>
    </div>


    <div v-if="mostrarFormularioAñadir || mostrarFormularioEditarE" class="overlay"></div>
<!-- Formulario para añadir o editar usuarios -->
<div class="form-container" v-if="mostrarFormularioAñadir">
  <h2>Añadir Nuevo Usuario</h2>
  <form @submit.prevent="añadirUsuario">

    <label for="nombre">Nombre:</label>
    <input v-model="usuarioForm.nombre" type="text" id="nombre" placeholder="Introduce el nombre del usuario" @blur="validarNombre">
    <div v-if="erroresForm.nombre" class="error-message">{{ erroresForm.nombre }}</div>
    
    <label for="correo">Correo:</label>
    <input v-model="usuarioForm.correoElectronico" type="text" id="correo" placeholder="Introduce el correo electrónico del usuario" @blur="validarCorreo">
    <div v-if="erroresForm.correo" class="error-message">{{ erroresForm.correo }}</div>
    
    <label for="nombreUsuario">Nombre de Usuario:</label>
    <input v-model="usuarioForm.nombreUsuario" type="text" id="nombreUsuario" placeholder="Introduce el nombre de usuario" @blur="validarNombreUsuario">
    <div v-if="erroresForm.nombreUsuario" class="error-message">{{ erroresForm.nombreUsuario }}</div>
    
    <label for="contrasena">Contraseña:</label>
    <input v-model="usuarioForm.contrasena" type="password" id="contrasena" placeholder="Introduce la contraseña del usuario" @blur="validarContraseña">
    <div v-if="erroresForm.contrasena" class="error-message">{{ erroresForm.contrasena }}</div>
    
    <button type="submit">Guardar</button>
    <button type="button" @click="mostrarFormularioAñadir = false">Cancelar</button>
    <div v-if="errorCrear" class="error-message">
      {{ mensajeError }}
    </div>
  </form>
</div>


<div class="form-container" v-if="mostrarFormularioEditarE">
  <h2>Editar Usuario</h2>
  <form @submit.prevent="editarElUsuario()">
      <label for="nombreE">Nombre:</label>
      <input type="text" id="nombreE" v-model="usuarioEditado.nombre" @blur="validarNombreEditado">
      <div v-if="erroresFormEditado.nombre" class="error-message">{{ erroresFormEditado.nombre }}</div>

      <label for="correoE">Correo Electrónico:</label>
      <input type="text" id="correoE" v-model="usuarioEditado.correoElectronico" @blur="validarCorreoEditado">
      <div v-if="erroresFormEditado.correo" class="error-message">{{ erroresFormEditado.correo }}</div>

      <label for="nombreUsuarioE">Nombre de Usuario:</label>
      <input type="text" id="nombreUsuarioE" v-model="usuarioEditado.nombreUsuario" @blur="validarNombreUsuarioEditado">
      <div v-if="erroresFormEditado.nombreUsuario" class="error-message">{{ erroresFormEditado.nombreUsuario }}</div>

      <button type="submit">Guardar</button>
      <button type="button" @click="mostrarFormularioEditarE=false">Cancelar</button>
      <div v-if="errorEditar" class="error-message">
      {{ mensajeError }}
    </div>
  </form>
</div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';
  
  export default {
    name: 'GestionUsuarios',
    computed: {
        ...mapState(['usuarios']),
    }, // Asegúrate de que 'usuarios' está definido en tu Vuex store

    data() {
    return {
        mostrarFormularioAñadir: false,
      mostrarFormularioEditarE: false,
      errorEditar: false,
      errorEliminar: false,
      errorCrear:false,
        usuarioEliminar:'',
        errorBusqueda: false,
        nombreUsuarioA:'',
      usuarioEditado:{
        nombre: '',
        correoElectronico: '',
        nombreUsuario: '',
        },
      usuarioForm: {
        nombre: '',
        correoElectronico: '',
        nombreUsuario: '',
        contrasena: ''
      },
      erroresForm: {
      nombre: '',
      correo: '',
      nombreUsuario: '',
      contrasena: ''
      },
      erroresFormEditado: {
      nombre: '',
      correo: '',
      nombreUsuario: ''
    },
      
      esAdmin: true  // Este valor debería determinarse basado en la autenticación del usuario
    };

    },
    methods: {
        ...mapActions(['obtenerUsuarios', 'isAdminUser', 'agregarUsuario','eliminarUsuario','editarUsuario','buscarUsuarios']), // Asegúrate de que 'obtenerUsuarios' es una acción definida en Vuex

        añadirUsuarioF() {
        this.mostrarFormularioAñadir = true;
        this.errorCrear = false;  
      },
      validarNombre() {
    this.erroresForm.nombre = this.usuarioForm.nombre.length > 2 ? '' : 'El nombre debe tener al menos 3 caracteres.';
  },
  validarCorreo() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.erroresForm.correo = regex.test(this.usuarioForm.correoElectronico) ? '' : 'Formato de correo no válido.';
  },
  validarNombreUsuario() {
    const regex = /^[a-zA-Z0-9_]+$/;
    this.erroresForm.nombreUsuario = regex.test(this.usuarioForm.nombreUsuario) ? '' : 'El nombre de usuario solo puede contener letras, números y guiones bajos.(No puede estar vacio)';
  },
  validarContraseña() {
    this.erroresForm.contrasena = this.usuarioForm.contrasena.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres.';
      },

      validarNombreEditado() {
    this.erroresFormEditado.nombre = this.usuarioEditado.nombre.length > 2 ? '' : 'El nombre debe tener al menos 3 caracteres.';
  },
  validarCorreoEditado() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.erroresFormEditado.correo = regex.test(this.usuarioEditado.correoElectronico) ? '' : 'Formato de correo no válido.';
  },
  validarNombreUsuarioEditado() {
    const regex = /^[a-zA-Z0-9_]+$/;
    this.erroresFormEditado.nombreUsuario = regex.test(this.usuarioEditado.nombreUsuario) ? '' : 'El nombre de usuario solo puede contener letras, números y guiones bajos.';
  },
        añadirUsuario() {
          this.errorBusqueda = false;
        this.errorEditar = false;
        this.errorEliminar = false;
        this.errorCrear = false;
        this.mensajeError = '';

            // Validaciones básicas
            if (!this.usuarioForm.nombre || !this.usuarioForm.correoElectronico || !this.usuarioForm.nombreUsuario || !this.usuarioForm.contrasena) {
              this.errorCrear = true;
              this.mensajeError = 'Todos los campos son obligatorios.';
              return;
            }

            // Validación de formato de correo electrónico
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(this.usuarioForm.correoElectronico)) {
              this.errorCrear = true;
              this.mensajeError = 'El formato del correo electrónico no es válido.';
              return;
            }

            this.agregarUsuario(this.usuarioForm).then(() => {
              this.usuarioForm = { nombre: '', correoElectronico: '', nombreUsuario: '', contrasena: '' };
              this.mostrarFormularioAñadir = false;
              this.obtenerUsuarios();
            }).catch(error => {
              console.error('Error al añadir el usuario:', error);
              this.errorCrear = true;
              this.mensajeError = 'Error al añadir el usuario: ' + (error.message || '');
            });
          },

      deleteUsuario(nombreUsuario) {
        this.errorBusqueda = false;
        this.errorEditar = false;
        this.errorEliminar = false;
        this.errorCrear = false;
        this.usuarioEliminar = nombreUsuario;
        this.mensajeError = '';
            if (nombreUsuario !== 'admin') {

                this.eliminarUsuario(nombreUsuario).then(() => {
                    console.log('Usuario eliminado correctamente');
                    this.obtenerUsuarios();
                }).catch(error => {
                  console.error('Error al eliminar usuario:', error);
                  this.errorEliminar = true;                  
                this.mensajeError = 'Error al eliminar usuario';
                });
            } else {
              console.error('Error al eliminar usuario al ser admin');
              this.errorEliminar = true;
              this.mensajeError = 'Error al eliminar usuario al ser admin';
            }

        },

        mostrarFormularioEditar(usuario) {

        this.usuarioEditado = {
        nombre: usuario.nombre,
        correoElectronico: usuario.correoElectronico,
        nombreUsuario: usuario.nombreUsuario,
        
        };
            // Establece mostrarFormulario a true para mostrar el formulario de edición
            this.nombreUsuarioA=usuario.nombreUsuario,        
            this.mostrarFormularioEditarE = true;
            console.log(this.usuarioEditado);
        },

     

      editarElUsuario() {
        this.errorEditar = false;
        this.errorBusqueda = false;
        this.errorEliminar = false;
        this.errorCrear = false;
        this.mensajeError = '';
        
        if (this.nombreUsuarioA !== 'admin') {

          // Validaciones básicas
          if (!this.usuarioEditado.nombre || !this.usuarioEditado.correoElectronico || !this.usuarioEditado.nombreUsuario) {
            this.errorEditar = true;
            this.mensajeError = 'Todos los campos son obligatorios.';
            return;
          }

          // Validación de formato de correo electrónico
          const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!regexCorreo.test(this.usuarioEditado.correoElectronico)) {
            this.errorEditar = true;
            this.mensajeError = 'El formato del correo electrónico no es válido.';
            return;
          }

          this.editarUsuario({
            nombreUsuario: this.nombreUsuarioA,
            datos: this.usuarioEditado
          }).then(() => {
            this.usuarioEditado = { nombre: '', correoElectronico: '', nombreUsuario: '' };
            this.nombreUsuarioA = '';
            this.mostrarFormularioEditarE = false;
            this.obtenerUsuarios();
          }).catch(error => {
            console.error('Error al editar el usuario:', error);
            this.errorEditar = true;
            this.mensajeError = 'Error al editar usuario: ' + (error.message || '');
          });
        } else {
              console.error('Error al editar usuario al ser admin');
              this.errorEditar = true;
              this.mensajeError = 'Error al editar usuario al ser admin';
            }
    },

    buscarlosUsuarios() {
      const token = localStorage.getItem('token'); // Suponiendo que guardas el token en localStorage
      this.errorBusqueda = false;
      this.errorEditar = false;
      this.errorEliminar = false;
      this.errorCrear = false;
      this.mensajeError = '';
      if (!token) {
        console.error('Error con el token:');
        return;
      }

      const patronValido = /^[A-Za-z0-9_-]*$/;

      if (!patronValido.test(this.busqueda)) {
        this.errorBusqueda = true;
        this.mensajeError = 'Error: La búsqueda contiene caracteres no válidos.(Solo puede incluir letras, números o _ )';
        this.httpErrorMessage = '';
        return;
      } else {
        this.errorBusqueda = false;
        this.mensajeError = '';
        this.httpErrorMessage = '';
      }


            this.buscarUsuarios(this.busqueda).then(response => {
            this.usuarios = response;
        if (this.usuarios.length === 0) {
          this.errorBusqueda = true;
          this.mensajeError = 'No se encontró ningún usuario con ese nombre.';
          this.busquedas = true;
          this.httpErrorMessage = '';
        } else {
          this.errorBusqueda = false;
          this.mensajeError = '';
          this.busquedas = false;
          this.httpErrorMessage = '';
        }
      }).catch(error => {
        console.error('Error al buscar usuarios:', error);
        this.errorBusqueda = true;
        this.mensajeError = error.response && error.response.data && error.response.data.mensaje ? error.response.data.mensaje : 'Error al buscar usuarios.';
        this.busquedas = true;
      });
            
     
       
    },
    
  },


    created() {
       // this.$store.dispatch('isAdminUser');
        this.obtenerUsuarios(); // Carga los usuarios cuando el componente es creado
        }
    
  };

  </script>
  
  <style scoped>
 /* gestion-usuarios.component.css */

/* Contenedor principal */
.usuarios-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  position: relative;
}

/* Estilo para los títulos */
h1, .blog-header h1 {
  color: #333;
  text-align: center;
}

/* Contenedor de búsqueda y añadir */
.search-add-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* Estilo para el campo de búsqueda */
.search-add-container input {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px; /* Agregamos un borde redondeado */
  width: 70%; /* Ajustamos el ancho */
}

/* Estilo para el botón de búsqueda y añadir */
.search-add-container button, button {
  padding: 8px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px; /* Agregamos un borde redondeado */
}

/* Detalles del usuario */
.user-details {
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.user-details p {
  margin: 5px 0;
}

/* Estilo para los botones de acción en los detalles del usuario */
.user-details button {
  margin-right: 10px;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px; /* Agregamos un borde redondeado */
}

/* Estilo para el botón de eliminación */
.user-details button.delete {
  background-color: #dc3545;
}

.form-container {
  position: fixed; /* Posicionamiento fijo respecto a la ventana del navegador */
  top: 50%; /* Centrado vertical */
  left: 50%; /* Centrado horizontal */
  transform: translate(-50%, -50%); /* Ajusta el centrado exacto del formulario */
  z-index: 1000; /* Asegura que el formulario esté por encima de otros elementos */
  width: 90%; /* Ancho del formulario */
  max-width: 500px; /* Máximo ancho del formulario */
  padding: 20px;
  background: white; /* Fondo blanco para el formulario */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* Sombra para resaltar el formulario */
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
  z-index: 999; /* Justo detrás del formulario */
}

/* Estilo para las etiquetas */
label {
  display: block;
  margin-bottom: 8px;
}

/* Estilo para los campos de entrada */
input,
button {
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 5px; /* Agregamos un borde redondeado */
  border: 1px solid #ccc; /* Estilo inicial */
}

/* Estilo para el botón */
button {
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

/* Estilo para el mensaje de error */
.error-message {
  color: red;
  font-size: 14px; /* Ajustamos el tamaño de la fuente */
}

/* Estilo para el campo cuando hay error */
.error-input {
  border-color: red;
}

/* Estilo para el campo cuando está en estado :focus */
input:focus {
  border-color: #007bff; /* Cambiamos el color al enfocar */
}

/* Estilo para el campo cuando es válido */
.valid-input {
  border-color: green; /* Cambiamos el color cuando es válido */
}

.error-message {
  color: red;
  margin-top: 10px;
}


</style>


