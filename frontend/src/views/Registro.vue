<template>
  <main class="login-container login-body">
    <div class="login-box" style="max-width: 500px;">
      
      <div class="login-header">
        <h1 class="logo" style="margin-bottom: 10px;"><span>●</span> JobBoost</h1>
        <h2>Crear Cuenta</h2>
        <p>Únete a la mejor plataforma de empleo.</p>
      </div>

      <form class="login-form" @submit.prevent="crearCuenta">
        
        <div class="input-group">
          <label for="rol">Registrarme como</label>
          <select id="rol" v-model="rol" style="width: 100%; padding: 12px; border: 1px solid #eef2f6; border-radius: 8px; font-size: 0.9rem; background-color: #fafbfc; color: #333;" required>
            <option value="postulante">Postulante (Busco empleo)</option>
            <option value="empresa">Empresa / Reclutador</option>
          </select>
        </div>

        <div class="input-group">
          <label for="nombre">{{ rol === 'empresa' ? 'Nombre de la empresa' : 'Nombre completo' }}</label>
          <input type="text" id="nombre" v-model="nombre" :placeholder="rol === 'empresa' ? 'Nombre legal de la compañía' : 'Juan Pérez'" required>
        </div>

        <!-- Campos adicionales para Empresa -->
        <template v-if="rol === 'empresa'">
          <div class="input-group">
            <label for="nit">Número de Identificación Tributaria (NIT)</label>
            <input type="text" v-model="nit" id="nit" placeholder="0000-000000-000-0" required>
          </div>

          <div class="input-group">
            <label for="sector">Sector o Industria</label>
            <input type="text" v-model="sector" id="sector" placeholder="Ej. Tecnología, Alimentos, Textil" required>
          </div>

          <div class="input-group">
            <label for="ubicacion">Ubicación</label>
            <input type="text" v-model="ubicacion" id="ubicacion" placeholder="Dirección de la oficina central" required>
          </div>

          <div class="input-group">
            <label for="telefono">Teléfono de Contacto</label>
            <input type="tel" v-model="telefono" id="telefono" placeholder="2200-0000" required>
          </div>

          <div class="input-group">
            <label for="horario">Horario Laboral</label>
            <input type="text" v-model="horario" id="horario" placeholder="Ej. Lunes a Viernes 8:00 AM - 5:00 PM" required>
          </div>
        </template>

        <div class="input-group">
          <label for="email">Correo electrónico{{ rol === 'empresa' ? ' corporativo' : '' }}</label>
          <input type="email" id="email" v-model="email" :placeholder="rol === 'empresa' ? 'rrhh@empresa.com' : 'ejemplo@correo.com'" required>
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" placeholder="••••••••" required>
        </div>

        <div v-if="rol === 'empresa'" class="input-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Repite tu contraseña" required>
        </div>

        <p v-if="mensajeEstado" :style="{ color: esError ? '#e53e3e' : '#38a169' }" style="text-align: center; margin-bottom: 10px; font-weight: bold; font-size: 0.95rem;">
          {{ mensajeEstado }}
        </p>

        <button type="submit" :disabled="cargando" id="btn-registro" class="btn-primary btn-block" style="margin-top: 15px;">
          {{ cargando ? 'Registrando…' : 'Registrarme' }} <i v-if="!cargando" class="fa-solid fa-user-plus"></i>
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
const confirmPassword = ref('')
const rol = ref('postulante')

// Campos empresa
const nit = ref('')
const sector = ref('')
const ubicacion = ref('')
const telefono = ref('')
const horario = ref('')

const mensajeEstado = ref('')
const esError = ref(false)
const cargando = ref(false)

const router = useRouter()

const crearCuenta = async () => {
  // Validar contraseñas para empresa
  if (rol.value === 'empresa' && password.value !== confirmPassword.value) {
    esError.value = true
    mensajeEstado.value = 'Las contraseñas no coinciden.'
    return
  }

  cargando.value = true
  esError.value = false
  mensajeEstado.value = 'Procesando registro...'

  try {
    if (rol.value === 'empresa') {
      // 1) Crear la empresa en la tabla "empresas"
      const empResponse = await fetch('http://localhost:3000/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.value.trim(),
          descripcion: sector.value
            ? `Sector: ${sector.value}. NIT: ${nit.value}. Tel: ${telefono.value}. Horario: ${horario.value}`
            : '',
          ubicacion: ubicacion.value.trim(),
          sitio_web: ''
        })
      })

      const empData = await empResponse.json()
      if (!empResponse.ok) {
        throw new Error(empData.message || 'Error al registrar la empresa.')
      }

      // 2) Crear la cuenta de usuario con rol "empresa" para poder iniciar sesión
      const userResponse = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.value.trim(),
          email: email.value.trim(),
          contrasenia: password.value,
          rol: 'empresa'
        })
      })

      const userData = await userResponse.json()
      if (!userResponse.ok) {
        throw new Error(userData.errors ? userData.errors.map(e => e.msg).join(', ') : userData.message || 'Error al crear cuenta de usuario.')
      }

      esError.value = false
      mensajeEstado.value = '¡Empresa registrada con éxito! Redirigiendo...'
      setTimeout(() => router.push('/'), 2000)

    } else {
      // Registro normal de postulante
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      esError.value = false
      mensajeEstado.value = '¡Registro exitoso! Redirigiendo...'
      setTimeout(() => router.push('/'), 2000)
    }
  } catch (err) {
    esError.value = true
    mensajeEstado.value = err.message || 'No se pudo conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* Utiliza los estilos heredados del login de style.css */
</style>
