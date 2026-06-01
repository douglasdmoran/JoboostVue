<template>
  <main class="login-container login-body">
    <div class="login-box">
      
      <div class="login-header">
        <h1 class="logo" style="margin-bottom: 10px;"><span>●</span> JobBoost</h1>
        <h2>Crear Cuenta</h2>
        <p>Únete a la mejor plataforma de empleo.</p>
      </div>

      <form class="login-form" @submit.prevent="crearCuenta">
        
        <div class="input-group">
          <label for="nombre">Nombre completo</label>
          <input type="text" id="nombre" v-model="nombre" placeholder="Juan Pérez" required>
        </div>

        <div class="input-group">
          <label for="email">Correo electrónico</label>
          <input type="email" id="email" v-model="email" placeholder="ejemplo@correo.com" required>
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" placeholder="••••••••" required>
        </div>

        <div class="input-group">
          <label for="rol">Registrarme como</label>
          <select id="rol" v-model="rol" style="width: 100%; padding: 12px; border: 1px solid #eef2f6; border-radius: 8px; font-size: 0.9rem; background-color: #fafbfc; color: #333;" required>
            <option value="postulante">Postulante (Busco empleo)</option>
            <option value="gestor">Gestor de Empleos</option>
            <option value="empresa">Empresa / Reclutador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button type="submit" id="btn-registro" class="btn-primary btn-block" style="margin-top: 15px;">
          Registrarme <i class="fa-solid fa-user-plus"></i>
        </button>
      </form>

      <footer class="login-footer">
        <p>¿Ya tienes una cuenta? <router-link to="/">Inicia sesión aquí</router-link></p>
      </footer>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const nombre = ref('')
const email = ref('')
const password = ref('')
const rol = ref('postulante')

const router = useRouter()

const crearCuenta = async () => {
  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombre.value,
        email: email.value,
        contrasenia: password.value,
        rol: rol.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.errors ? data.errors.map(e => e.msg).join(', ') : data.message || 'Error al registrar')
    }

    alert('¡Registro exitoso! Ya puedes iniciar sesión.')
    router.push('/')
  } catch (err) {
    alert('Error al registrar usuario: ' + err.message)
  }
}
</script>

<style scoped>
/* Utiliza los estilos heredados del login de style.css */
</style>
