<template>
  <header class="main-header">
    <div class="header-left">
      <router-link to="/empresa" class="logo">
        <span class="logo-dot">●</span> JobBoost
      </router-link>
    </div>
    
    <div class="header-center">
      <nav>
        <ul>
          <li><router-link to="/empresa" exact-active-class="active">Inicio</router-link></li>
          <li><router-link to="/empresa/publicar" active-class="active">Publicar Empleo</router-link></li>
          <li><router-link to="/empresa/solicitudes" active-class="active">Solicitudes</router-link></li>
          <li><router-link to="/empresa/estado-vacantes" active-class="active">Estado Vacantes</router-link></li>
          <li><router-link to="/empresa/gestion" active-class="active">Mi Empresa</router-link></li>
          <li><router-link to="/empresa/perfil" active-class="active">Mi Perfil</router-link></li>
        </ul>
      </nav>
    </div>
    
    <div class="header-right" @click="toggleDropdown" style="cursor: pointer; position: relative;">
      <div class="avatar-circle">
        <img v-if="logoUrl" :src="logoUrl" alt="Logo de empresa" />
        <span v-else>{{ usuario && usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'E' }}</span>
      </div>
      <span class="user-label">{{ primerNombre }}</span>

      <div class="user-dropdown" :class="{ active: showDropdown }">
        <router-link to="/empresa/perfil" class="dropdown-item">
          <i class="fa-solid fa-user"></i>
          <span>Mi Perfil</span>
        </router-link>
        <a href="#" @click.prevent="cerrarSesion" class="dropdown-item logout">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Cerrar Sesión</span>
        </a>
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
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 70px;
}

/* Header Left */
.header-left .logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
}

.logo-dot {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-size: 1.8rem;
  margin-right: 2px;
}

/* Header Center */
.header-center nav ul {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.header-center nav ul li a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;
}

.header-center nav ul li a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.header-center nav ul li a:hover {
  color: #667eea;
}

.header-center nav ul li a:hover::after {
  width: 100%;
}

.header-center nav ul li a.active {
  color: #667eea;
}

.header-center nav ul li a.active::after {
  width: 100%;
}

/* Header Right */
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: white;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid #2ecc71;
}

.avatar-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
  background: #f0fdf4;
  padding: 4px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.header-right:hover .user-label {
  background: #dcfce7;
}

/* Dropdown */
.user-dropdown {
  display: none;
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;
}

.user-dropdown.active {
  display: flex;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 12px 16px;
  text-decoration: none;
  color: #444;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.dropdown-item i {
  width: 18px;
  color: #667eea;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #667eea;
}

.dropdown-item.logout {
  border-top: 1px solid #eef2f6;
}

.dropdown-item.logout i {
  color: #e74c3c;
}

.dropdown-item.logout:hover {
  background: #fef5f5;
  color: #e74c3c;
}

/* Responsive */
@media (max-width: 1100px) {
  .main-header {
    padding: 0 20px;
  }
  
  .header-center nav ul {
    gap: 16px;
  }
  
  .header-center nav ul li a {
    font-size: 0.9rem;
  }
}

@media (max-width: 900px) {
  .main-header {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 20px;
    gap: 12px;
  }
  
  .header-left {
    flex: 1;
  }
  
  .header-center {
    order: 3;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .header-center nav ul {
    gap: 20px;
    justify-content: center;
    min-width: max-content;
  }
  
  .header-center nav ul li a {
    font-size: 0.85rem;
  }
  
  .user-label {
    display: none;
  }
  
  .avatar-circle {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 640px) {
  .main-header {
    padding: 10px 15px;
  }
  
  .logo {
    font-size: 1.2rem;
  }
  
  .logo-dot {
    font-size: 1.4rem;
  }
  
  .header-center nav ul {
    gap: 14px;
  }
  
  .header-center nav ul li a {
    font-size: 0.75rem;
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .header-left .logo {
    font-size: 1.1rem;
  }
  
  .header-center nav ul {
    gap: 10px;
  }
  
  .header-center nav ul li a {
    font-size: 0.7rem;
    padding: 6px 0;
  }
  
  .avatar-circle {
    width: 32px;
    height: 32px;
  }
}
</style>