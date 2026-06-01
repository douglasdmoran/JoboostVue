<template>
  <aside class="admin-sidebar">
    <div style="padding: 30px;">
      <router-link to="/admin" class="logo" style="font-size: 1.5rem; text-decoration: none;">
        <span>●</span> JobBoost
      </router-link>
    </div>

    <div v-if="usuario" style="padding: 0 20px 20px 20px; border-bottom: 1px solid #eee; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
      <div style="background: #e0f2fe; color: #0033ff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; border: 1px solid #0033ff;">
        {{ usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'A' }}
      </div>
      <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span style="display: block; font-weight: bold; font-size: 0.85rem; color: #333;">{{ usuario.nombre }}</span>
        <span style="display: block; font-size: 0.75rem; color: #888; text-transform: capitalize;">{{ usuario.rol }}</span>
      </div>
    </div>

    <nav style="flex: 1; padding: 0 20px;">
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;">
          <router-link to="/admin" class="nav-link" exact-active-class="active-link">
            <i class="fa-solid fa-house"></i> Dashboard
          </router-link>
        </li>
        <li style="margin-bottom: 10px;">
          <router-link to="/admin/vacantes" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-pen-to-square"></i> Vacantes
          </router-link>
        </li>
        <li style="margin-bottom: 10px;">
          <router-link to="/admin/foros" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-file-invoice"></i> Foros
          </router-link>
        </li>
        <li style="margin-bottom: 10px;">
          <router-link to="/admin/empresas" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-star"></i> Empresas
          </router-link>
        </li>
        <li style="margin-bottom: 10px;">
          <router-link to="/admin/usuarios" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-user"></i> Usuarios
          </router-link>
        </li>
      </ul>
    </nav>

    <div style="padding: 20px; border-top: 1px solid #eee;">
      <a href="#" @click.prevent="cerrarSesion" style="text-decoration: none; color: #333; font-weight: 500;">
        <i class="fa-solid fa-right-from-bracket"></i> Salir
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
  router.push('/')
}
</script>

<style scoped>
/* Nos trajimos los estilos en línea aquí para mantener el HTML más limpio */
.admin-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #eef2f6;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
}

.nav-link {
  text-decoration: none;
  color: #666;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  transition: 0.3s;
}

/* Esta clase se aplica automáticamente cuando la URL coincide con el botón */
.active-link {
  background: #0033ff;
  color: white;
}
</style>