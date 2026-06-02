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
import { useRouter } from 'vue-router'

// Estas variables guardarán automáticamente lo que el usuario escriba
const email = ref('')
const password = ref('')

const router = useRouter()

// Esta función se ejecuta al hacer clic en "Entrar"
const iniciarSesion = async () => {
  try {
    const response = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        contrasenia: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error en credenciales')
    }

    // Guardamos la información del usuario en localStorage
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    localStorage.setItem('currentUser', JSON.stringify(data.usuario))
    
    // Redirigir según el rol del usuario
    const rol = (data.usuario.rol || '').toLowerCase()
    const userEmail = (data.usuario.correo || data.usuario.email || '').toLowerCase()
    
    if (rol === 'admin' || userEmail === 'gestor@jobboost.com') {
      router.push('/admin')
    } else if (rol === 'empresa' || userEmail.endsWith('@empresas.com')) {
      router.push('/empresa')
    } else {
      router.push('/inicio')
    }
  } catch (err) {
    alert('Error al iniciar sesión: ' + err.message)
  }
}
</script>

<style scoped>
/* Aquí pondremos los estilos más adelante si lo necesitamos */
</style>