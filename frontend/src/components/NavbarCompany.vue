<template>
  <header class="main-header">
    <div class="header-left">
      <router-link to="/empresa" class="logo"><span>●</span> JobBoost</router-link>
    </div>
    
    <div class="header-center">
      <nav>
        <ul>
          <li><router-link to="/empresa" exact-active-class="active">Inicio</router-link></li>
          <li><router-link to="/empresa/publicar" active-class="active">Publicar Empleo</router-link></li>
          <li><router-link to="/empresa/solicitudes" active-class="active">Solicitudes</router-link></li>
          <li><router-link to="/empresa/estado-vacantes" active-class="active">Estado Vacantes</router-link></li>
          <li><router-link to="/empresa/gestion" active-class="active">Valorar Empresa</router-link></li>
          <li><router-link to="/empresa/perfil" active-class="active">Mi Perfil</router-link></li>
        </ul>
      </nav>
    </div>
    
    <div class="header-right" @click="toggleDropdown" style="cursor: pointer; position: relative;">
      <div class="avatar-circle" style="border: 2px solid #2ecc71; display: flex; align-items: center; justify-content: center; font-weight: bold; background: #e0fdf4; color: #166534; overflow: hidden; width: 40px; height: 40px; border-radius: 50%;">
        <img v-if="logoUrl" :src="logoUrl" alt="Logo" style="width: 100%; height: 100%; object-fit: cover;" />
        <span v-else>{{ usuario && usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'E' }}</span>
      </div>
      <span class="user-label">{{ primerNombre }}</span>

      <div class="user-dropdown" :class="{ active: showDropdown }" style="text-align: left;">
        <router-link to="/empresa/perfil"><i class="fa-solid fa-user"></i> Mi Perfil</router-link>
        <a href="#" @click.prevent="cerrarSesion" style="color: #e74c3c;"><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getEmpresaData } from '../utils/empresaUtils'

const router = useRouter()
const usuario = ref(null)
const logoUrl = ref('')
const showDropdown = ref(false)

const primerNombre = computed(() => {
  if (!usuario.value || !usuario.value.nombre) return 'Empresa'
  return usuario.value.nombre.split(' ')[0]
})

const checkSession = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (userJson) {
    try {
      usuario.value = JSON.parse(userJson)
      const empData = await getEmpresaData()
      if (empData && empData.logo_url) {
        logoUrl.value = empData.logo_url
      } else {
        logoUrl.value = ''
      }
    } catch (e) {
      usuario.value = null
      logoUrl.value = ''
    }
  } else {
    usuario.value = null
    logoUrl.value = ''
  }
}

onMounted(() => {
  checkSession()
  window.addEventListener('storage', checkSession)
  document.addEventListener('click', closeDropdownOnClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('storage', checkSession)
  document.removeEventListener('click', closeDropdownOnClickOutside)
})

const toggleDropdown = (e) => {
  e.stopPropagation()
  showDropdown.value = !showDropdown.value
}

const closeDropdownOnClickOutside = () => {
  showDropdown.value = false
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('currentUser')
  usuario.value = null
  router.push('/')
}
</script>

<style scoped>
.user-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    min-width: 180px;
    z-index: 1000;
    flex-direction: column;
    overflow: hidden;
    margin-top: 15px;
}
.user-dropdown.active {
    display: flex;
    animation: fadeIn 0.2s ease-out;
}
.user-dropdown a {
    padding: 12px 15px;
    text-decoration: none;
    color: #444;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background 0.2s;
}
.user-dropdown a:hover {
    background: #f8f9fa;
    color: var(--azul-jobboost);
}
.user-dropdown a#btn-logout:hover {
    color: #e74c3c;
    background: #fdf5f5;
}
</style>
