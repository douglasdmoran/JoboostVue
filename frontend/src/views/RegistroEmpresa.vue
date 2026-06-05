<template>
  <main class="register-company-container">
    <div class="register-company-box">
      <div class="register-header">
        <h1 class="logo"><span class="logo-dot">●</span> JobBoost</h1>
        <h2>Empieza en JobBoost</h2>
        <p>Registra tu empresa para encontrar al mejor talento</p>
      </div>

      <form @submit.prevent="registrarEmpresa" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-building"></i>
              Nombre de la empresa
            </label>
            <input 
              type="text" 
              v-model="nombre" 
              placeholder="Nombre legal de la compañía" 
              class="form-input"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-id-card"></i>
              NIT
            </label>
            <input 
              type="text" 
              v-model="nit" 
              placeholder="0000-000000-000-0" 
              class="form-input"
              required
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-industry"></i>
              Sector o Industria
            </label>
            <input 
              type="text" 
              v-model="sector" 
              placeholder="Ej. Tecnología, Alimentos, Textil" 
              class="form-input"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-location-dot"></i>
              Ubicación
            </label>
            <input 
              type="text" 
              v-model="ubicacion" 
              placeholder="Dirección de la oficina central" 
              class="form-input"
              required
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-envelope"></i>
              Correo Electrónico Corporativo
            </label>
            <input 
              type="email" 
              v-model="email" 
              placeholder="rrhh@empresa.com" 
              class="form-input"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-phone"></i>
              Teléfono de Contacto
            </label>
            <input 
              type="tel" 
              v-model="telefono" 
              placeholder="2200-0000" 
              class="form-input"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <i class="fa-solid fa-clock"></i>
            Horario Laboral
          </label>
          <input 
            type="text" 
            v-model="horario" 
            placeholder="Ej. Lunes a Viernes 8:00 AM - 5:00 PM" 
            class="form-input"
            required
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-lock"></i>
              Contraseña
            </label>
            <input 
              type="password" 
              v-model="password" 
              placeholder="Crea una contraseña segura" 
              class="form-input"
              required
            >
            <span class="form-hint">Mínimo 6 caracteres</span>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-check-circle"></i>
              Confirmar Contraseña
            </label>
            <input 
              type="password" 
              v-model="confirmPassword" 
              placeholder="Repite tu contraseña" 
              class="form-input"
              required
            >
          </div>
        </div>

        <div v-if="mensajeEstado" class="status-message" :class="esError ? 'status-error' : 'status-success'">
          <i :class="esError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'"></i>
          {{ mensajeEstado }}
        </div>

        <button type="submit" :disabled="cargando" class="btn-register">
          <i class="fa-solid" :class="cargando ? 'fa-spinner fa-spin' : 'fa-building'"></i>
          {{ cargando ? 'Registrando...' : 'Registrar Empresa' }}
        </button>
      </form>

      <footer class="register-footer">
        <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
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

  if (password.value.length < 6) {
    esError.value = true
    mensajeEstado.value = 'La contraseña debe tener al menos 6 caracteres.'
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
      router.push('/login')
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
.register-company-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-company-box {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 40px;
  width: 100%;
  max-width: 700px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
}

.register-company-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-dot {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-size: 32px;
  margin-right: 5px;
}

.register-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.register-header p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.register-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 0.85rem;
}

.form-label i {
  color: #667eea;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #b0b3b8;
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 0.7rem;
  color: #999;
}

.status-message {
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.status-success {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.status-error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.btn-register {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-register:active:not(:disabled) {
  transform: translateY(0);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eef2f6;
}

.register-footer p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.register-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-footer a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .register-company-box {
    padding: 30px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .logo {
    font-size: 24px;
  }
  
  .register-header h2 {
    font-size: 1.4rem;
  }
  
  .register-header p {
    font-size: 0.85rem;
  }
  
  .form-input {
    font-size: 0.85rem;
    padding: 10px 12px;
  }
  
  .btn-register {
    padding: 12px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .register-company-box {
    padding: 25px 15px;
  }
  
  .form-label {
    font-size: 0.8rem;
  }
  
  .status-message {
    font-size: 0.75rem;
    padding: 10px 12px;
  }
}
</style>