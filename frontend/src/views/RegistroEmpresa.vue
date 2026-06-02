<template>
  <main class="login-body" style="padding: 50px 0;">
    <div class="login-box" style="max-width: 500px; text-align: center;">
      <div class="login-header">
        <h1 class="logo" style="margin-bottom: 10px;"><span>●</span> JobBoost</h1>
        <h2 style="font-size: 1.8rem; margin-bottom: 5px; font-weight: bold; color: #333;">Empieza en JobBoost</h2>
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 25px;">Registra tu empresa para encontrar al mejor talento.</p>
      </div>

      <form @submit.prevent="registrarEmpresa" id="form-registro-empresa" class="login-form">
        <div class="input-group">
          <label for="emp-nombre">Nombre de la empresa</label>
          <input type="text" v-model="nombre" id="emp-nombre" placeholder="Nombre legal de la compañía" required>
        </div>

        <div class="input-group">
          <label for="emp-nit">Número de Identificación Tributaria (NIT)</label>
          <input type="text" v-model="nit" id="emp-nit" placeholder="0000-000000-000-0" required>
        </div>

        <div class="input-group">
          <label for="emp-sector">Sector o Industria</label>
          <input type="text" v-model="sector" id="emp-sector" placeholder="Ej. Tecnología, Alimentos, Textil" required>
        </div>

        <div class="input-group">
          <label for="emp-ubicacion">Ubicación</label>
          <input type="text" v-model="ubicacion" id="emp-ubicacion" placeholder="Dirección de la oficina central" required>
        </div>

        <div class="input-group">
          <label for="emp-email">Correo Electrónico Corporativo</label>
          <input type="email" v-model="email" id="emp-email" placeholder="rrhh@empresa.com" required>
        </div>

        <div class="input-group">
          <label for="emp-tel">Teléfono de Contacto</label>
          <input type="tel" v-model="telefono" id="emp-tel" placeholder="2200-0000" required>
        </div>

        <div class="input-group">
          <label for="emp-horario">Horario Laboral</label>
          <input type="text" v-model="horario" id="emp-horario" placeholder="Ej. Lunes a Viernes 8:00 AM - 5:00 PM" required>
        </div>

        <div class="input-group">
          <label for="emp-pass">Contraseña</label>
          <input type="password" v-model="password" id="emp-pass" placeholder="Crea una contraseña segura" required>
        </div>

        <div class="input-group">
          <label for="emp-confirm-pass">Confirmar Contraseña</label>
          <input type="password" v-model="confirmPassword" id="emp-confirm-pass" placeholder="Repite tu contraseña" required>
        </div>

        <p v-if="mensajeEstado" :style="{ color: esError ? 'red' : 'green' }" style="text-align: center; margin-bottom: 10px; font-weight: bold;">
          {{ mensajeEstado }}
        </p>

        <button type="submit" :disabled="cargando" class="btn-primary btn-block" style="margin-top: 15px; cursor: pointer;">
          {{ cargando ? 'Registrando…' : 'Registrarse' }}
        </button>
      </form>

      <footer class="login-footer" style="margin-top: 25px;">
        <p>¿Ya tienes cuenta? <router-link to="/">Inicia sesión aquí!</router-link></p>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nombre = ref('')
const nit = ref('')
const sector = ref('')
const ubicacion = ref('')
const email = ref('')
const telefono = ref('')
const horario = ref('')
const password = ref('')
const confirmPassword = ref('')

const mensajeEstado = ref('')
const esError = ref(false)
const cargando = ref(false)

const registrarEmpresa = async () => {
  if (password.value !== confirmPassword.value) {
    esError.value = true
    mensajeEstado.value = 'Las contraseñas no coinciden.'
    return
  }

  cargando.value = true
  esError.value = false
  mensajeEstado.value = 'Procesando registro...'

  try {
    const response = await fetch('http://localhost:3000/empresas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombre.value.trim(),
        descripcion: sector.value ? `Sector: ${sector.value}. NIT: ${nit.value}. Email: ${email.value}. Horario: ${horario.value}. Tel: ${telefono.value}` : '',
        ubicacion: ubicacion.value.trim(),
        sitio_web: ''
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar empresa.')
    }

    // También creamos la cuenta en la tabla de usuarios con el rol "empresa" para permitir el inicio de sesión
    await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombre.value.trim(),
        email: email.value.trim(),
        contrasenia: password.value,
        rol: 'empresa'
      })
    })

    esError.value = false
    mensajeEstado.value = '¡Empresa registrada con éxito! Redirigiendo...'
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (err) {
    console.error(err)
    esError.value = true
    mensajeEstado.value = err.message || 'No se pudo conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
</style>
