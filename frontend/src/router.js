import { createRouter, createWebHistory } from 'vue-router'

// 1. Importamos todas las vistas
import Login from './views/Login.vue'
import Registro from './views/Registro.vue'
import AdminDash from './views/AdminDash.vue'
import AdminVacantes from './views/AdminVacantes.vue'
import AdminForos from './views/AdminForos.vue'
import AdminEmpresas from './views/AdminEmpresas.vue'
import AdminUsuarios from './views/AdminUsuarios.vue'

// Vistas de Postulantes
import Bienvenida from './views/Bienvenida.vue'
import Inicio from './views/Inicio.vue'
import Vacantes from './views/Vacantes.vue'
import DetalleVacante from './views/DetalleVacante.vue'
import Foros from './views/Foros.vue'
import DetalleForo from './views/DetalleForo.vue'
import Recursos from './views/Recursos.vue'
import RecursoHarvard from './views/RecursoHarvard.vue'
import Valorar from './views/Valorar.vue'
import DetalleEmpresa from './views/DetalleEmpresa.vue'
import Perfil from './views/Perfil.vue'

// Vistas de Empresas
import RegistroEmpresa from './views/RegistroEmpresa.vue'
import IndexEmpresa from './views/IndexEmpresa.vue'
import PerfilEmpresa from './views/PerfilEmpresa.vue'
import GestionEmpresa from './views/GestionEmpresa.vue'
import Publicar from './views/Publicar.vue'
import Solicitudes from './views/Solicitudes.vue'

// 2. Definimos las rutas
const routes = [
  { path: '/', component: Login },
  { path: '/registro', component: Registro },
  { path: '/registro-empresa', component: RegistroEmpresa },
  
  // Admin
  { path: '/admin', component: AdminDash },
  { path: '/admin/vacantes', component: AdminVacantes },
  { path: '/admin/foros', component: AdminForos },
  { path: '/admin/empresas', component: AdminEmpresas },
  { path: '/admin/usuarios', component: AdminUsuarios },

  // Postulante
  { path: '/bienvenida', component: Bienvenida },
  { path: '/inicio', component: Inicio },
  { path: '/vacantes', component: Vacantes },
  { path: '/vacantes/detalle/:id', component: DetalleVacante },
  { path: '/foros', component: Foros },
  { path: '/foros/detalle/:id', component: DetalleForo },
  { path: '/recursos', component: Recursos },
  { path: '/recursos/cv-harvard', component: RecursoHarvard },
  { path: '/valorar', component: Valorar },
  { path: '/empresas/detalle/:key', component: DetalleEmpresa },
  { path: '/perfil', component: Perfil },

  // Empresa
  { path: '/empresa', component: IndexEmpresa },
  { path: '/empresa/perfil', component: PerfilEmpresa },
  { path: '/empresa/gestion', component: GestionEmpresa },
  { path: '/empresa/publicar', component: Publicar },
  { path: '/empresa/solicitudes', component: Solicitudes }
]

// 3. Creamos el router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router