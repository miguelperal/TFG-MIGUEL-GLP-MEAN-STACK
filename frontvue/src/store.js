import { createStore } from 'vuex';
//import axios from 'axios'; con axios también funciona

const store = createStore({
  state: {
    // Tu estado Vuex aquí
    isLoggedIn: false, // Ejemplo de una propiedad en el estado
    isAdminUser: false, // Ejemplo de otra propiedad en el estado
    token: localStorage.getItem('token') || null,
    usuarios: [],
    apiUrl: 'http://localhost:3000/api',
    errorMensaje: '',
    errorEstado: false,
  },
  mutations: {
    // Tus mutaciones Vuex aquí
    setIsLoggedIn(state, value) {
      state.isLoggedIn = value;
    },
    setIsAdminUser(state, value) {
      state.isAdminUser = value;
    },
    SET_PUBLICACIONES(state, publicaciones) {
      state.publicaciones = publicaciones;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token); // Guarda el token en localStorage

    },
    setUsuarios(state, usuarios) {
      state.usuarios = usuarios;
    }, 
    setNombresUsuarios(state, nombresUsuarios) {
      state.nombresUsuarios = nombresUsuarios;
    }, 
    setErrorMensaje(state, mensaje) {
      state.errorMensaje = mensaje;
      state.errorEstado = true;
    },
    clearError(state) {
      state.errorMensaje = '';
      state.errorEstado = false;
    },
    SET_PUBLICACIONESU(state, publicacionesU) {
      state.publicacionesU = publicacionesU;
    },
    SET_PUBLICACIONESA(state, publicacionesA) {
      state.publicacionesA = publicacionesA;
    },
    SET_MENSAJE_RECUPERACION(state, mensaje) {
      state.mensajeRecuperacion = mensaje;
    },
    // Mutación para manejar errores y actualizar el estado
    SET_ERROR(state, error) {
      state.errorMensaje = error;
    }

  },
  actions: {
    // Tus acciones Vuex aquí
    login({ commit }) {
      // Ejemplo de una acción para iniciar sesión
      commit('setIsLoggedIn', true);
      commit('setToken', localStorage.getItem('token'));
      const token = localStorage.getItem('token');
    
      // Decodificar el token para obtener la información del usuario
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    
        // Verificar si el rol 'admin' está presente en los roles del usuario
        if (tokenPayload.roles && (tokenPayload.roles == 'admin')) {//HASTA AQUI BIEN MIRAR POR QUE NO DE AQUI EN ADELANTE
          commit('setIsAdminUser', true);
        } else {
          commit('setIsAdminUser', false);
        }

      }
     
   
    },

    isAdminUser({ commit }) {
      // Obtiene el token del almacenamiento local
      const token = localStorage.getItem('token');
    
      // Decodificar el token para obtener la información del usuario
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    
        // Verificar si el rol 'admin' está presente en los roles del usuario
        if (tokenPayload.roles && (tokenPayload.roles == 'admin')) {//HASTA AQUI BIEN MIRAR POR QUE NO DE AQUI EN ADELANTE
          commit('setIsAdminUser', true);
          return true;
        }

      }
      commit('setIsAdminUser', false);
      return false;
    },
    logout({ commit }) {
      // Ejemplo de una acción para cerrar sesión
      commit('setIsLoggedIn', false);
      commit('setToken', null);
      localStorage.removeItem('token');
      window.location.reload();
    },
    async fetchPublicaciones({ commit }) {
      try {
        // Realiza una solicitud HTTP GET al backend para obtener las publicaciones
        const response = await fetch('http://localhost:3000/api/Publicacion/obtener-entradas'); // Ajusta la URL según la ruta correcta en tu backend
        if (!response.ok) {
          throw new Error('No se pudo obtener las publicaciones');
        }
        const data = await response.json();
        // Cuando se completa la solicitud, llama a la mutación SET_PUBLICACIONES para actualizar el estado Vuex con los datos de las publicaciones recibidas
        commit('SET_PUBLICACIONES', data);
      } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
        throw error; // Propaga el error para que el componente pueda manejarlo si es necesario
      }
    },
    async searchPublicaciones({ commit }, terminoBusqueda) {
      try {
        const response = await fetch(`http://localhost:3000/api/Publicacion/buscar-entradas?terminoBusqueda=${terminoBusqueda}`);
        if (!response.ok) {
          throw new Error('No se pudo realizar la búsqueda de publicaciones');
        }
        const data = await response.json();
        commit('SET_PUBLICACIONES', data);
      } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        throw error;
      }
    },
 
    async registrarUsuario(_, userData) {
      try {
        const response = await fetch('http://localhost:3000/api/Usuario/registro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }
        // Aquí puedes realizar alguna acción adicional después de registrar al usuario
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
      }
    },

    async obtenerUsuarios({ state, commit }) {
      const url = `${state.apiUrl}/Usuario/admin`;
      const headers = new Headers({ 'x-auth-token': state.token });
      try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error('Error al obtener usuarios');
        }
        const users = await response.json();
        commit('setUsuarios', users);
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    },
    async buscarUsuarios({ state, commit }, terminoBusqueda) {
      const url = `${state.apiUrl}/Usuario/admin?nombreUsuario=${terminoBusqueda}`;
      const headers = new Headers({ 'x-auth-token': state.token });
      try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
          commit('setErrorMensaje', 'Error en la búsqueda de usuarios');
          throw new Error('Error en la búsqueda de usuarios');
        }
        const users = await response.json();
        commit('setUsuarios', users);
      } catch (error) {
        console.error('Error:', error);
        commit('setErrorBusqueda', error.message);
        throw error;
      }
    },
    async eliminarUsuario({ state }, nombreUsuario) {
      const url = `${state.apiUrl}/Usuario/admin/${nombreUsuario}`;
      const headers = new Headers({ 'x-auth-token': state.token });
      try {
        const response = await fetch(url, { method: 'DELETE', headers });
        if (!response.ok) {
          throw new Error('Error al eliminar usuario');
        }
        // Podrías querer actualizar el estado o realizar alguna acción posterior aquí
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    },
    async editarUsuario({ state }, { nombreUsuario, datos }) {
      const url = `${state.apiUrl}/Usuario/admin/${nombreUsuario}`;
      const headers = new Headers({
        'x-auth-token': state.token,
        'Content-Type': 'application/json'
      });
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify(datos)
        });
        if (!response.ok) {
          throw new Error('Error al editar usuario');
        }
        // Podrías querer actualizar el estado o realizar alguna acción posterior aquí
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    },
    async agregarUsuario({ commit, state  }, datos) {
      const url = `${state.apiUrl}/Usuario/admin`;
      const headers = new Headers({
        'x-auth-token': state.token,
        'Content-Type': 'application/json'
      });
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(datos)
        });
        if (!response.ok) {
          throw new Error('Error al agregar usuario');
        }
        const newUser = await response.json();
        commit('añadirUsuario', newUser);
        // Podrías querer actualizar el estado o realizar alguna acción posterior aquí
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    },

     async fetchEntradasUsuario({ commit,state }) {
      const url = `${state.apiUrl}/Publicacion/obtener-entradasporUsuario`;
      const headers = new Headers({
        'x-auth-token': state.token,
        'Content-Type': 'application/json'
      });
        try {
          const response = await fetch(url, { headers });
          if (!response.ok) {
            throw new Error('Error al obtener entradas');
          }
          const publicaciones = await response.json();
          commit('SET_PUBLICACIONESU', publicaciones);
        } catch (error) {
          console.error('Error al obtener las publicaciones:', error);
          throw error;
        }
    },
    /* CON AXIOS TAMBIÉN FUNCIONA
    async fetchEntradasUsuario({ commit, state }) {
      const url = `${state.apiUrl}/Publicacion/obtener-entradasporUsuario`;
      
      try {
        const response = await axios.get(url, {
          headers: {
            'x-auth-token': state.token,
            'Content-Type': 'application/json'
          }
        });
        if (response.status !== 200) {
          throw new Error('Error al obtener entradas');
        }
        commit('SET_PUBLICACIONESU', response.data); // Asegúrate de que la respuesta es manejada correctamente
      } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
        throw error;
      }
    },*/

    async agregarEntradaUsuario({state }, entradaData) {
      const url = `${state.apiUrl}/Publicacion/crear-entrada`;
      const headers = new Headers({
        'x-auth-token': state.token,
      });
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: entradaData
        });
        if (!response.ok) {
          throw new Error('Error al agregar la entrada');
        }
      } catch (error) {
        console.error('Error al agregar la entrada:', error);
        throw error;
      }
    },
  
    // Acción para editar una entrada del usuario
    async editarEntradaUsuario({ state }, entradaData) {
      const url = `${state.apiUrl}/Publicacion/editar-entrada`;
      const headers = new Headers({
        'x-auth-token': state.token,
      });
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers,
          body: entradaData
        });
        if (!response.ok) {
          throw new Error('Error al editar la entrada');
        }
      } catch (error) {
        console.error('Error al editar la entrada:', error);
        throw error;
      }
    },
  
    // Acción para eliminar una entrada del usuario
    async eliminarEntradaUsuario({ state }, tituloEntrada) {
      const url = `${state.apiUrl}/Publicacion/eliminar-entrada?titulo=${tituloEntrada}`;
      const headers = new Headers({
        'x-auth-token': state.token,
      });
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers
        });
        if (!response.ok) {
          throw new Error('Error al eliminar la entrada');
        }
      } catch (error) {
        console.error('Error al eliminar la entrada:', error);
        throw error;
      }
    },
    async buscarEntradasUsuario({ commit,state }, terminoBusqueda ) {
      const url = `${state.apiUrl}/Publicacion/obtener-entradasPorUsuarioYBuscar?terminoBusqueda=${terminoBusqueda}`;
      const headers = new Headers({
        'x-auth-token': state.token,
        'Content-Type': 'application/json'
      });
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers
        });
        if (!response.ok) {
          throw new Error('Error al buscar las entradas');
        }
        const publicaciones = await response.json();
        commit('SET_PUBLICACIONESU', publicaciones);
       
        //return await response.json(); // Devuelve el resultado de la búsqueda
      } catch (error) {
        console.error('Error al buscar las entradas:', error);
        throw error;
      }
    },

    async buscarEntradasAdmin({ commit,state },terminoBusqueda ) {
      const url = `${state.apiUrl}/Publicacion/buscar-entradasAdmin?terminoBusqueda=${terminoBusqueda}`;
      const headers = {
          'x-auth-token': state.token,
          'Content-Type': 'application/json'
      };
      try {
        const response = await fetch(url,
          {
            method: 'GET',
            headers
          });
          if (!response.ok) throw new Error('Error al buscar entradas admin');
        const publicaciones = await response.json();
        commit('SET_PUBLICACIONESA', publicaciones);
      } catch (error) {
          console.error('Error:', error);
          throw error;
      }
  },

  async obtenerEntradasAdmin({ commit,state }) {
      const url = `${state.apiUrl}/Publicacion/obtener-entradasAdmin`;
      const headers = new Headers( {
          'x-auth-token': state.token,
          'Content-Type': 'application/json'
      });
      try {
          const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error('Error al obtener entradas admin');
          
        }
        const publicacion = await response.json();
          commit('SET_PUBLICACIONESA', publicacion);

      } catch (error) {
          console.error('Error:', error);
          throw error;
      }
    },
   

  async crearEntradaAdmin({ state },datos) {
      const url = `${state.apiUrl}/Publicacion/crear-entradaAdmin`;
      const headers = {
          'x-auth-token': state.token,
      };
      try {
        const response = await fetch(url,
          {
            method: 'POST',
            headers,
            body: datos,
          });
          if (!response.ok) throw new Error('Error al crear entrada admin');
      } catch (error) {
          console.error('Error:', error);
          throw error;
      }
    },


  async editarEntradaAdmin({ state }, datos) {
      const url = `${state.apiUrl}/Publicacion/editar-entradaAdmin`;
      const headers =new Headers({
          'x-auth-token': state.token,
      });
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers,
          body: datos
        });
          if (!response.ok) throw new Error('Error al editar entrada admin');
      } catch (error) {
          console.error('Error:', error);
          throw error;
      }
    },
   
   

    async eliminarEntradaAdmin({ state }, { tituloEntradad, nombreUsuariod } ) {
      console.log(tituloEntradad);
      console.log(nombreUsuariod);
      const url = `${state.apiUrl}/Publicacion/eliminar-entradaAdmin`;
      const headers = {
          'x-auth-token': state.token,
          'Content-Type': 'application/json'
      };
      const body = JSON.stringify({ titulo: tituloEntradad, nombreUsuario: nombreUsuariod });
      try {
        const response = await fetch(url,
          {
            method: 'DELETE',
            headers,
            body
          });
          if (!response.ok) throw new Error('Error al eliminar entrada admin');
      } catch (error) {
          console.error('Error:', error);
          throw error;
      }
    },

      async obtenerNombresDeUsuario({ state, commit }) {
        const url = `${state.apiUrl}/Publicacion/usuarios`;
        const headers = new Headers({
          'x-auth-token': state.token,
        });
  
        try {
          const response = await fetch(url, { headers });
          if (!response.ok) {
            throw new Error('Error al obtener los nombres de usuario');
          }
          const nombres = await response.json();
          commit('setNombresUsuarios', nombres);
        } catch (error) {
          console.error('Error:', error);
        }
    },
    recuperarContrasena({ commit, state }, correoElectronico) {
      const url = `${state.apiUrl}/Usuario/solicitud-recuperacion`;
      const datos = { correoElectronico }; // Ajusta los datos según sea necesario
  
      // Envía una solicitud POST al servidor para iniciar el proceso de recuperación de contraseña
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': state.token // Asegúrate de que el token es manejado correctamente si es necesario
        },
        body: JSON.stringify(datos)
      })
      .then(response => {
        if (!response.ok) {
          // Lanza un error si la respuesta del servidor no es exitosa
          throw new Error('Error al solicitar la recuperación de contraseña');
        }
        return response.json(); // Procesa la respuesta en formato JSON
      })
      .then(data => {
        // Procesa los datos de respuesta, por ejemplo, muestra un mensaje
        commit('SET_MENSAJE_RECUPERACION', data.mensaje); // Asumiendo que el servidor envía un mensaje
        console.log('Recuperación solicitada correctamente:', data);
      })
      .catch(error => {
        console.error('Error en la recuperación de contraseña:', error);
        commit('SET_ERROR', error.message);
      });
    },


      
    },
    getters: {
      // Tus getters Vuex aquí
      isLoggedIn: state => state.isLoggedIn,
      isAdminUser: state => state.isAdminUser,
      token: state => state.token,
     
    }
  },);

export default store;
