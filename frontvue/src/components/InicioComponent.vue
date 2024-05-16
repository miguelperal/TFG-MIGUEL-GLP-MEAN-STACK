<template>
  <div>
    <h1>BLOG PUBLICACIONES MEAN STACK</h1>

    <!-- Botones de navegación -->
    <div class="acciones">
      <button v-if="!isLoggedIn" @click="navigateTo('/inicio-sesion')">Iniciar Sesión</button>
      <button v-if="!isLoggedIn" @click="navigateTo('/registro')">Registro</button>
      <button v-if="isLoggedIn" @click="logout">Cerrar sesión</button>
      <button v-if="mostrarGestionUsuarios" @click="navigateTo('/gestion-usuarios')">Gestión de Usuarios</button>
      <button v-if="mostrarGestionEntradas" @click="navigateTo('/gestionar-entradas')">Gestión de Entradas</button>
      <button v-if="mostrarGestionEntradasAdmin" @click="navigateTo('/gestion-entradas-admin')">Gestión de Entradas</button>
    </div>

    <div class="container">
      <div class="search-bar">
        <input type="text" v-model="busqueda" placeholder="Buscar...">
        <button @click="buscarPublicaciones">Buscar</button>
      </div>

      <div class="publicaciones">

        <p class="sin-coincidencias" v-if="!publicaciones || publicaciones.length === 0">No hay ninguna publicación que coincida.</p>
        <div v-for="publicacion in publicaciones" :key="publicacion.titulo" class="publicacion">
          <div class="titulo">
            <h2>{{ publicacion.titulo }}</h2>
          </div>
        
          <div class="contenido-recuadro">
            <div class="contenido">
              <p>{{ publicacion.contenido }}</p>
              
              <!-- Mostrar imágenes si están disponibles -->
              <div v-if="publicacion.imagen && publicacion.imagen.length > 0" class="imagenes">
                <img v-for="imagen in publicacion.imagen" :src="imagen" :key="imagen" alt="Imagen de la publicación">
              </div>
              <div v-if="publicacion.imagenes">
                <img v-if="publicacion.imagenes" :src="'http://localhost:3000/' + publicacion.imagenes" class="publicacion-image" alt="Imagen de la publicacion">
              </div>
            
              <p>Autor:{{ publicacion.nombreUsuario }}</p>
            </div>
          </div>
        
          <!-- Mostrar categorías si están disponibles -->
          <div v-if="publicacion.categorias && publicacion.categorias.length > 0" class="categorias">
            <p>Categorías:<span v-for="categoria in publicacion.categorias" :key="categoria">{{ categoria }}</span></p>
          </div>
        
          <!-- Mostrar etiquetas si están disponibles -->
          <div v-if="publicacion.etiquetas && publicacion.etiquetas.length > 0" class="etiquetas">
            <p>Etiquetas: <span v-for="etiqueta in publicacion.etiquetas" :key="etiqueta">{{ etiqueta }}</span></p>
          </div>
    
          <div class="fechas">
            <p>Fechas:</p>
            <p>Fecha de Creación: {{ formatarFecha(publicacion.fechaCreacion) }}</p>
            <p>Fecha de edición: {{ publicacion.fechaEdicion ? formatarFecha(publicacion.fechaEdicion) : 'No editado' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      busqueda: '',
    };
  },
  computed: {
    ...mapGetters(['']),
    token() {
      return localStorage.getItem('token'); // Nombre de tu token en localStorage.
    },
    isLoggedIn() {
      return !!this.token; // Verifica si el token existe para determinar si el usuario está logueado.
    },
    isAdminUser() {
      return this.$store.getters.isAdminUser; // Verifica si el token existe para determinar si el usuario está logueado.
    },
    publicaciones() {
      return this.$store.state.publicaciones;
    },
    mostrarGestionUsuarios() {
      return this.isLoggedIn && this.isAdminUser;
    },
    mostrarGestionEntradas() {
      return this.isLoggedIn && !this.isAdminUser;
    },
    mostrarGestionEntradasAdmin() {
      return this.isLoggedIn && this.isAdminUser;
    }
  },
  methods: {
    ...mapActions(['fetchPublicaciones', 'searchPublicaciones', 'logout']),
    async cargarPublicaciones() {
      try {
        await this.fetchPublicaciones();
      } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
      }
    },
    async buscarPublicaciones() {
      if (this.busqueda.trim() !== '') {
        try {
          await this.searchPublicaciones(this.busqueda);
        } catch (error) {
          console.error('Error al buscar las publicaciones:', error);
        }
      } else {
        this.cargarPublicaciones();
      }
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    logout() {
      this.$store.dispatch('logout');
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
  },
  created() {
    this.cargarPublicaciones();
    this.$store.dispatch('isAdminUser');
   
  },
}
</script>

<style scoped>
/* Estilos para la barra de búsqueda y botones de acciones */
.acciones, .search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.acciones button, .search-bar button {
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

/* Estilos para las publicaciones */
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.publicacion {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin-bottom: 20px;
}

.titulo {
  background-color: #007bff;
  color: #fff;
  padding: 15px;
  margin: 0;
}

.contenido-recuadro {
  padding: 15px;
}

.contenido {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.categorias, .etiquetas, .comentarios, .fechas {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.categorias p, .etiquetas p, .comentarios p, .fechas p {
  margin-top: 0;
}

.categorias ul, .etiquetas ul, .comentarios ul {
  margin-top: 5px;
  padding-left: 20px;
}

/* Estilos para el mensaje de búsqueda sin coincidencias */
.sin-coincidencias {
  color: red;
  margin-top: 10px;
}

.search-bar {
  display: flex;
  align-items: center; /* Alinea verticalmente los elementos */
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px; /* Tamaño de la fuente */
}

.search-bar button {
  padding: 12px 20px; /* Aumenta el espacio alrededor del texto */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px; /* Tamaño de la fuente */
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #0056b3; /* Cambia el color de fondo al pasar el cursor */
}

.publicacion-image {
  display: block; /* Hace que la imagen sea un bloque para centrarla con margin */
  margin: 0 auto; /* Centra la imagen horizontalmente */
  max-width: 50%; /* Asegura que la imagen no sea más ancha que su contenedor */
  height: auto; /* Mantiene el aspecto original de la imagen */
}
</style>
