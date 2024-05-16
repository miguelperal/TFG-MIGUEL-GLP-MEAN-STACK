<template>
  <div class="registro-container">
    <div class="registro-form">
      <h2>Registro</h2>

      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" v-model="nombre" required minlength="3" maxlength="15" pattern="^[A-Za-z\s]*$" :class="{ 'error-input': nombreInvalido }">
      <div v-if="nombreInvalido" class="error-message">
        <small v-if="nombreRequerido">El nombre es obligatorio.</small>
        <small v-if="nombreMinLength">El nombre debe tener al menos 3 caracteres.</small>
        <small v-if="nombreMaxLength">El nombre debe tener como máximo 15 caracteres.</small>
        <small v-if="nombreInvalidoFormato">El formato del nombre es inválido. Solo se permiten letras y espacios.</small>
      </div>

      <label for="correoElectronico">Correo Electrónico:</label>
      <input type="email" id="correoElectronico" v-model="correoElectronico" required email :class="{ 'error-input': correoInvalido }">
      <div v-if="correoInvalido" class="error-message">
        <small v-if="correoRequerido">El correo electrónico es obligatorio.</small>
        <small v-if="correoInvalidoFormato">El formato del correo electrónico es inválido.</small>
      </div>

      <label for="nombreUsuario">Nombre de Usuario:</label>
      <input type="text" id="nombreUsuario" v-model="nombreUsuario" required :class="{ 'error-input': nombreUsuarioInvalido }">
      <div v-if="nombreUsuarioInvalido" class="error-message">
        <small v-if="nombreUsuarioRequerido">El nombre de usuario es obligatorio.</small>
      </div>

      <label for="contrasena">Contraseña:</label>
      <input type="password" id="contrasena" v-model="contrasena" required minlength="6" maxlength="20" :class="{ 'error-input': contrasenaInvalida }">
      <div v-if="contrasenaInvalida" class="error-message">
        <small v-if="contrasenaRequerida">La contraseña es obligatoria.</small>
        <small v-if="contrasenaMinLength">La contraseña debe tener al menos 6 caracteres.</small>
        <small v-if="contrasenaMaxLength">La contraseña debe tener como máximo 20 caracteres.</small>
      </div>

      <button @click="registrar">Registrarse</button>
      <button @click="navegarAtras">Volver</button>

      <div v-if="errorRegistro" class="error-message">{{ errorRegistro }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nombre: '',
      correoElectronico: '',
      nombreUsuario: '',
      contrasena: ''
    };
  },
  computed: {
    nombreInvalido() {
      return !this.nombre || (this.nombre.length < 3 || this.nombre.length > 15) || !/^[A-Za-z\s]*$/.test(this.nombre);
    },
    nombreRequerido() {
      return !this.nombre;
    },
    nombreMinLength() {
      return this.nombre.length < 3;
    },
    nombreMaxLength() {
      return this.nombre.length > 15;
    },
    nombreInvalidoFormato() {
      return !/^[A-Za-z\s]*$/.test(this.nombre);
    },
    correoInvalido() {
      return !this.correoElectronico || !this.validarCorreoElectronico(this.correoElectronico);
    },
    correoRequerido() {
      return !this.correoElectronico;
    },
    correoInvalidoFormato() {
      return !this.validarCorreoElectronico(this.correoElectronico);
    },
    nombreUsuarioInvalido() {
      return !this.nombreUsuario;
    },
    nombreUsuarioRequerido() {
      return !this.nombreUsuario;
    },
    contrasenaInvalida() {
      return !this.contrasena || (this.contrasena.length < 6 || this.contrasena.length > 20);
    },
    contrasenaRequerida() {
      return !this.contrasena;
    },
    contrasenaMinLength() {
      return this.contrasena.length < 6;
    },
    contrasenaMaxLength() {
      return this.contrasena.length > 20;
    }
  },
  methods: {
    registrar() {
      if (!this.nombreInvalido && !this.correoInvalido && !this.nombreUsuarioInvalido && !this.contrasenaInvalida) {
        this.$store.dispatch('registrarUsuario', {
          nombre: this.nombre,
          correoElectronico: this.correoElectronico,
          nombreUsuario: this.nombreUsuario,
          contrasena: this.contrasena
        }).then(() => {
          this.$router.push('/inicio-sesion');
        }).catch(error => {
          this.errorRegistro = error.response.data.message || 'Error al registrar. Por favor, inténtalo de nuevo más tarde.';
        });
      }
    },
    navegarAtras() {
      this.$router.go(-1);
    },
    validarCorreoElectronico(correo) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    }
  }
};
</script>

<style scoped>
.registro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
}

.registro-form {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: auto;
}

.registro-form h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.registro-form label {
  display: block;
  margin-bottom: 10px;
  color: #555;
}

.registro-form input {
  width: calc(100% - 20px);
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.registro-form input:focus {
  border-color: #007bff;
}

.registro-form button {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.registro-form button:hover {
  background-color: #0056b3;
}

.error-input {
  background-color: #ffcccc;
  border-color: #ff0000;
}

.error-message {
  color: #ff0000;
  margin-top: 8px;
  font-size: 14px;
}
</style>
