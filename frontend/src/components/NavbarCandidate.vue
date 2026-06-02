<template>
  <header class="main-header">
    <div class="header-left">
      <router-link to="/inicio" class="logo"
        ><span>●</span> JobBoost</router-link
      >
    </div>

    <div class="header-center">
      <nav v-if="usuario">
        <ul>
          <li>
            <router-link to="/inicio" exact-active-class="active"
              >Inicio</router-link
            >
          </li>
          <li>
            <router-link to="/vacantes" active-class="active"
              >Vacantes</router-link
            >
          </li>
          <li>
            <router-link to="/foros" active-class="active">Foros</router-link>
          </li>
          <li>
            <router-link to="/recursos" active-class="active"
              >Recursos</router-link
            >
          </li>
          <li>
            <router-link to="/valorar" active-class="active"
              >Valorar Empresas</router-link
            >
          </li>
          <li>
            <router-link to="/perfil" active-class="active"
              >Mi Perfil</router-link
            >
          </li>
        </ul>
      </nav>
    </div>

    <!-- Logged In Header Right -->
    <div
      v-if="usuario"
      class="header-right"
      @click="toggleDropdown"
      style="cursor: pointer; position: relative"
    >
      <div
        class="avatar-circle"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #fff;
          background: #0033ff;
        "
      >
        {{ usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "P" }}
      </div>
      <span class="user-label">{{ primerNombre }}</span>

      <div
        class="user-dropdown"
        :class="{ active: showDropdown }"
        style="text-align: left"
      >
        <router-link to="/perfil"
          ><i class="fa-solid fa-user"></i> Mi Perfil</router-link
        >
        <a href="#" @click.prevent="cerrarSesion" style="color: #e74c3c"
          ><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</a
        >
      </div>
    </div>

    <!-- Guest/Visitor Header Right -->
    <div v-else class="header-right" style="gap: 15px">
      <button
        class="btn-secondary"
        @click="irALogin"
        style="
          background-color: #e0e0e0;
          color: #333;
          padding: 10px 20px;
          border-radius: 4px;
          border: none;
          font-weight: bold;
          cursor: pointer;
        "
      >
        Iniciar Sesión
      </button>
      <button
        class="btn-primary"
        @click="irARegistro"
        style="padding: 10px 25px; cursor: pointer"
      >
        Registrarse
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const usuario = ref(null);
const showDropdown = ref(false);

const primerNombre = computed(() => {
  if (!usuario.value || !usuario.value.nombre) return "Postulante";
  return usuario.value.nombre.split(" ")[0];
});

const checkSession = () => {
  const userJson =
    localStorage.getItem("usuario") || localStorage.getItem("currentUser");
  if (userJson) {
    try {
      usuario.value = JSON.parse(userJson);
    } catch (e) {
      usuario.value = null;
    }
  } else {
    usuario.value = null;
  }
};

onMounted(() => {
  checkSession();
  window.addEventListener("storage", checkSession);
  document.addEventListener("click", closeDropdownOnClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("storage", checkSession);
  document.removeEventListener("click", closeDropdownOnClickOutside);
});

const toggleDropdown = (e) => {
  e.stopPropagation();
  showDropdown.value = !showDropdown.value;
};

const closeDropdownOnClickOutside = () => {
  showDropdown.value = false;
};

const irALogin = () => {
  router.push("/");
};

const irARegistro = () => {
  router.push("/registro");
};

const cerrarSesion = () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("currentUser");
  usuario.value = null;
  router.push("/");
};
</script>

<style scoped>
/* Estilos adicionales para dropdown consistentes con script.js original */
.user-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
