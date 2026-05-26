<template>
  <main class="login-container login-body">
    <div class="login-box">
      
      <div class="login-header">
        <h1 class="logo" style="margin-bottom: 10px;"><span>●</span> JobBoost</h1>
        <h2>Iniciar Sesión</h2>
        <p>Bienvenido de nuevo, postulante.</p>
      </div>

      <form class="login-form" @submit.prevent="iniciarSesion">
        
        <div class="input-group">
          <label for="email">Correo electrónico</label>
          <input type="email" id="email" v-model="email" placeholder="ejemplo@correo.com" required>
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" placeholder="••••••••" required>
        </div>

        <button type="submit" id="btn-login" class="btn-primary btn-block">
          Entrar <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </button>
      </form>

      <footer class="login-footer">
        <p>¿No tienes cuenta? <router-link to="/registro">Regístrate aquí</router-link></p>
        <p><a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a></p>
      </footer>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

// Estas variables guardarán automáticamente lo que el usuario escriba
const email = ref('')
const password = ref('')

// Esta función se ejecuta al hacer clic en "Entrar"
const iniciarSesion = () => {
  console.log('Intentando entrar con:', email.value, password.value)
  // Más adelante, aquí pondremos el código para validar con tu base de datos
}
</script>

<style scoped>
/* Aquí pondremos los estilos más adelante si lo necesitamos */
</style>