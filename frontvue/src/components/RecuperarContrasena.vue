<template>
    <div class="blog-container">
      <div class="blog-header">
        <h1>Recuperar Contraseña</h1>
        <p v-if="mensaje">{{ mensaje }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
  
      <div class="login-form">
        <label for="correo">Correo Electrónico:</label>
        <input type="email" id="correo" v-model="correo" required>
  
        <button @click="recuperarContrasena" :disabled="!correo">Recuperar Contraseña</button>
        <button v-if="mensajeEnv" @click="restablecerContrasena">Restablecer Contraseña</button>
      </div>
  
      <div class="back-button">
        <button @click="volverPaginaAnterior">Volver</button>
      </div>
    </div>
  </template>
  
<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'RecuperarContrasena',
    computed: {
      ...mapState({
      }),
    },
    data() {
      return {
        correo: '',
        mensaje: '',
        error: '',
        mensajeEnv: false,
        apiUrl: 'http://localhost:3000/api',
      };
    },
    methods: {

        ...mapActions([
        ]),
      recuperarContrasena() {
        const url = `${this.apiUrl}/Usuario/solicitud-recuperacion`;
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correoElectronico: this.correo })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error enviando el correo de recuperación.');
          }
          return response.json();
        })
        .then(data => {
          this.mensaje = 'Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada.';
          this.mensajeEnv = true;
            this.error = '';
            data;
        })
        .catch(error => {
          this.error = error.message;
          this.mensaje = '';
        });
      },
      volverPaginaAnterior() {
        this.$router.push('/inicio-sesion');
      }
    }
  }
  </script>
  
  <style>
  .blog-container {
    padding: 20px;
    border: 1px solid #ccc;
    margin: auto;
    width: 80%;
  }
  
  .blog-header h1 {
    color: #333;
  }
  
  .error {
    color: red;
  }
  
  .login-form input[type="email"],
  .login-form button {
    display: block;
    width: 100%;
    margin-top: 10px;
    padding: 10px;
  }
  
  .back-button button {
    margin-top: 20px;
    padding: 10px 20px;
  }
  </style>
  