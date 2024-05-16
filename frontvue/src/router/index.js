import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import InicioSesion from '../components/InicioSesion.vue'
import InicioComponent from '../components/InicioComponent.vue'
import RegistroComponent from '../components/RegistroComponent.vue'
import GestionUsuarios from '../components/GestionUsuarios.vue'
import GestionEntradasUsuario from '../components/GestionEntradasUsuario.vue'
import GestionEntradasAdmin from '../components/GestionEntradasAdmin.vue'
import RecuperarContrasena from '../components/RecuperarContrasena.vue'
import RestablecerContrasena from '../components/RestablecerContrasena.vue'

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/inicio-sesion',
    name: 'InicioSesion',
    component: InicioSesion
  },
  {
    path: '/inicio',
    name: 'InicioComponent',
    component: InicioComponent
  },
  {
    path: '/registro',
    name: 'RegistroComponent',
    component: RegistroComponent
  },
  {
    path: '/gestion-usuarios',
    name: 'GestionUsuarios',
    component: GestionUsuarios
  },
  {

  path: '/gestionar-entradas',
  name: 'GestionEntradasUsuario',
  component: GestionEntradasUsuario
  },
  {

    path: '/gestion-entradas-admin',
    name: 'GestionEntradasAdmin',
    component: GestionEntradasAdmin
  },
  {

    path: '/recuperar-contrasena',
    name: 'RecuperarContrasena',
    component: RecuperarContrasena
  },
  
  {

    path: '/restablecer-contrasena',
    name: 'RestablecerContrasena',
    component: RestablecerContrasena
    },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router