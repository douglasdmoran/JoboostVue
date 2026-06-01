import { createRouter, createWebHistory } from 'vue-router'

// 1. Importamos todas las vistas que creamos
import Login from './views/Login.vue'
import Registro from './views/Registro.vue'
import AdminDash from './views/AdminDash.vue'
import AdminVacantes from './views/AdminVacantes.vue'
import AdminForos from './views/AdminForos.vue'
import AdminEmpresas from './views/AdminEmpresas.vue'
import AdminUsuarios from './views/AdminUsuarios.vue'

// 2. Definimos las rutas
const routes = [
  { path: '/', component: Login }, // La pantalla inicial será el Login
  { path: '/registro', component: Registro },
  { path: '/admin', component: AdminDash },
  { path: '/admin/vacantes', component: AdminVacantes },
  { path: '/admin/foros', component: AdminForos },
  { path: '/admin/empresas', component: AdminEmpresas },
  { path: '/admin/usuarios', component: AdminUsuarios }
]

// 3. Creamos el router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router