<template>
  <div class="blog-container">
    <div class="blog-header">
      <h1>BLOG PUBLICACIONES MEAN STACK</h1>
      <p>Bienvenido a nuestro blog de tecnología MEAN Stack</p>
    </div>

    <div class="login-form">
      <h2>Iniciar Sesión</h2>

      <label for="nombreUsuario">Nombre de Usuario:</label>
      <input type="text" id="nombreUsuario" v-model="nombreUsuario" required />

      <label for="contrasena">Contraseña:</label>
      <input type="password" id="contrasena" v-model="contrasena" required />

      <button @click="iniciarSesion">Iniciar Sesión</button>
      <div class="auth-links">
        <button @click="navegarARegistro">Registrar Usuario</button>
        <button @click="navegarARecuperarContrasena">Recuperar Contraseña</button>
      </div>
      <div v-if="errorMensaje" class="error-mensaje">
        {{ errorMensaje }}
      </div>
      
      <!-- Botón de "Back" -->
      <button @click="navegarAInicio">Back</button>
    </div>
  </div>
</template>

<script>
//import axios from 'axios';

export default {
  data() {
    return {
      nombreUsuario: "",
      contrasena: "",
      errorMensaje: ""
    };
  },
  methods: {
async iniciarSesion() {
  try {
    const response = await fetch('http://localhost:3000/api/Usuario/inicio-sesion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        nombreUsuario: this.nombreUsuario,
        contrasena: this.contrasena
      })
    });

    // Verificar si la respuesta es exitosa
    if (response.ok) {
      const responseData = await response.json();
      if (responseData && responseData.token) {
        // Almacena el token en el almacenamiento local
        localStorage.setItem('token', responseData.token);
        
        this.$store.dispatch('login');
        this.$store.dispatch('isAdminUser');

        // Redirigir a la página de inicio o cualquier otra página después de iniciar sesión
        this.$router.push('/inicio');
      } else {
        // Manejar la respuesta incorrecta del servidor
        this.errorMensaje = "Respuesta del servidor no válida";
      }
    } else {
      // Manejar errores de respuesta HTTP
      this.errorMensaje = "Error al iniciar sesión: " + response.statusText;
    }
  } catch (error) {
    // Manejar errores de red u otros errores
    console.error("Error al iniciar sesión:", error);
    this.errorMensaje = "Error al iniciar sesión";
  }
},

    navegarAInicio() {
      this.$router.push('/inicio');
    },
    navegarARegistro() {
      this.$router.push('/registro');
    },
    navegarARecuperarContrasena() {
      this.$router.push('/recuperar-contrasena');
    }
  }
};
</script>

<style scoped>
/* Estilos específicos del componente */
.blog-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.blog-header {
  text-align: center;
  margin-bottom: 30px;
}

.blog-header h1 {
  font-size: 36px;
  margin-bottom: 10px;
  color: #333;
}

.blog-header p {
  font-size: 16px;
  color: #777;
}

.login-form {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
}

input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-links {
  display: flex;
  justify-content: space-between;
}

.auth-links button {
  flex: 1;
  margin-right: 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-mensaje {
  color: red;
  margin-top: 10px;
}
</style>