<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <router-link to="/admin" class="logo">
        <span class="logo-dot">●</span> JobBoost
      </router-link>
    </div>

    <div v-if="usuario" class="user-info">
      <div class="user-avatar">
        {{ usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'A' }}
      </div>
      <div class="user-details">
        <span class="user-name">{{ usuario.nombre }}</span>
        <span class="user-role">{{ usuario.rol }}</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/admin" class="nav-link" exact-active-class="active-link">
            <i class="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/vacantes" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-briefcase"></i>
            <span>Vacantes</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/foros" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-comments"></i>
            <span>Foros</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/empresas" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-building"></i>
            <span>Empresas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/usuarios" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-users"></i>
            <span>Usuarios</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <a href="#" @click.prevent="cerrarSesion" class="logout-link">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Salir</span>
      </a>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref(null)

onMounted(() => {
  const userJson = localStorage.getItem('usuario')
  if (userJson) {
    usuario.value = JSON.parse(userJson)
  }
})

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('currentUser')
  router.push('/')
}
</script>

<style scoped>
.admin-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
  border-right: 1px solid #eef2f6;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

/* Sidebar Header */
.sidebar-header {
  padding: 30px 25px;
  border-bottom: 1px solid #eef2f6;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: inline-block;
}

.logo-dot {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-size: 1.8rem;
  margin-right: 2px;
}

/* User Info */
.user-info {
  padding: 25px 20px;
  margin: 0 20px 20px 20px;
  background: linear-gradient(135deg, #f0f3ff 0%, #e8edff 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.user-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.user-avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.user-details {
  flex: 1;
  overflow: hidden;
}

.user-name {
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  display: block;
  font-size: 0.7rem;
  color: #667eea;
  text-transform: capitalize;
  font-weight: 500;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 0 15px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-link i {
  width: 20px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: #f0f3ff;
  color: #667eea;
  transform: translateX(4px);
}

.nav-link:hover::before {
  transform: scaleY(1);
}

.active-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.active-link i {
  color: white;
}

.active-link:hover {
  transform: translateX(0);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #eef2f6;
  margin-top: auto;
}

.logout-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.logout-link i {
  width: 20px;
  font-size: 1rem;
}

.logout-link:hover {
  background: #fef5f5;
  color: #e74c3c;
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 80px;
    overflow-x: hidden;
  }
  
  .sidebar-header {
    padding: 20px 15px;
    text-align: center;
  }
  
  .logo {
    font-size: 0;
  }
  
  .logo .logo-dot {
    font-size: 1.5rem;
    margin-right: 0;
  }
  
  .user-info {
    justify-content: center;
    padding: 15px;
    margin: 0 10px 15px 10px;
  }
  
  .user-details {
    display: none;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .nav-link span {
    display: none;
  }
  
  .nav-link i {
    width: auto;
    font-size: 1.2rem;
  }
  
  .nav-link {
    justify-content: center;
    padding: 12px;
  }
  
  .logout-link span {
    display: none;
  }
  
  .logout-link {
    justify-content: center;
    padding: 12px;
  }
  
  .logout-link i {
    width: auto;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .admin-sidebar {
    width: 70px;
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .nav-link i,
  .logout-link i {
    font-size: 1rem;
  }
}
</style>