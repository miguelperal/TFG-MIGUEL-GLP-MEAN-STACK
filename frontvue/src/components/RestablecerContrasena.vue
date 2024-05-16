<template>
    <div class="reset-password-container">
      <h2>Restablecer Contraseña</h2>
      <form @submit.prevent="restablecerContrasena">
        <div class="form-group">
          <label for="nuevaContrasena">Nueva Contraseña:</label>
          <input type="password" id="nuevaContrasena" v-model="nuevaContrasena" required>
        </div>
        <button type="submit" class="btn btn-primary">Restablecer Contraseña</button>
        <button @click="irAInicioSesion">Ir a inicio</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        nuevaContrasena: ''
      };
    },
    methods: {
      restablecerContrasena() {
        const url = `${this.$store.state.apiUrl}/Usuario/restablecer-contrasena`;
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if required
          },
          body: JSON.stringify({ nuevaContrasena: this.nuevaContrasena })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al restablecer la contraseña');
          }
          return response.json();
        })
        .then(() => {
          alert('Contraseña restablecida correctamente');
          this.$router.push('/inicio-sesion'); // Navigate on success
        })
        .catch(error => {
          alert(error.message);
        });
      },
      irAInicioSesion() {
        this.$router.push('/inicio-sesion');
      }
    }
  }
  </script>
  
  <style>
  .reset-password-container {
    padding: 20px;
    border: 1px solid #ccc;
    margin: auto;
    width: 80%;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
  </style>
  