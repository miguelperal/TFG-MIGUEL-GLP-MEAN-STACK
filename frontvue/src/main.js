import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index'; // Importa tu archivo de configuración del enrutador
import store from './store'; // Importa tu módulo Vuex aquí

const app = createApp(App);
app.use(router); // Registra el enrutador en la aplicación Vue
app.use(store); // Registra el almacenamiento Vuex en la aplicación Vue
app.mount('#app');
