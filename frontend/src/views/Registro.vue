<template>
  <main class="register-container">
    <div class="register-box">
      
      <div class="register-header">
        <h1 class="logo"><span class="logo-dot">●</span> JobBoost</h1>
        <h2>Crear Cuenta</h2>
        <p>Únete a la mejor plataforma de empleo</p>
      </div>

      <form class="register-form" @submit.prevent="crearCuenta">
        
        <div class="form-group">
          <label class="form-label">
            <i class="fa-solid fa-user-tag"></i>
            Registrarme como
          </label>
          <div class="role-selector">
            <button 
              type="button" 
              @click="rol = 'postulante'" 
              class="role-btn" 
              :class="{ active: rol === 'postulante' }"
            >
              <i class="fa-solid fa-user-graduate"></i>
              <span>Postulante</span>
              <small>Busco empleo</small>
            </button>
            <button 
              type="button" 
              @click="rol = 'empresa'" 
              class="role-btn" 
              :class="{ active: rol === 'empresa' }"
            >
              <i class="fa-solid fa-building"></i>
              <span>Empresa</span>
              <small>Reclutador</small>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <i :class="rol === 'empresa' ? 'fa-solid fa-building' : 'fa-solid fa-user'"></i>
            {{ rol === 'empresa' ? 'Nombre de la empresa' : 'Nombre completo' }}
          </label>
          <input 
            type="text" 
            v-model="nombre" 
            :placeholder="rol === 'empresa' ? 'Nombre legal de la compañía' : 'Juan Pérez'" 
            class="form-input"
            required
          >
        </div>

        <!-- Campos adicionales para Empresa -->
        <transition name="slide-fade">
          <div v-if="rol === 'empresa'" class="company-fields">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-id-card"></i>
                  NIT
                </label>
                <input type="text" v-model="nit" placeholder="0000-000000-000-0" class="form-input" required>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-industry"></i>
                  Sector
                </label>
                <input type="text" v-model="sector" placeholder="Ej. Tecnología, Alimentos" class="form-input" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-location-dot"></i>
                  Ubicación
                </label>
                <input type="text" v-model="ubicacion" placeholder="Dirección de la oficina central" class="form-input" required>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-phone"></i>
                  Teléfono
                </label>
                <input type="tel" v-model="telefono" placeholder="2200-0000" class="form-input" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-clock"></i>
                Horario Laboral
              </label>
              <input type="text" v-model="horario" placeholder="Ej. Lunes a Viernes 8:00 AM - 5:00 PM" class="form-input" required>
            </div>
          </div>
        </transition>

        <div class="form-group">
          <label class="form-label">
            <i class="fa-solid fa-envelope"></i>
            Correo electrónico{{ rol === 'empresa' ? ' corporativo' : '' }}
          </label>
          <input 
            type="email" 
            v-model="email" 
            :placeholder="rol === 'empresa' ? 'rrhh@empresa.com' : 'ejemplo@correo.com'" 
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
              placeholder="••••••••" 
              class="form-input"
              required
            >
          </div>

          <div v-if="rol === 'empresa'" class="form-group">
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
          <i class="fa-solid" :class="cargando ? 'fa-spinner fa-spin' : 'fa-user-plus'"></i>
          {{ cargando ? 'Registrando...' : 'Registrarme' }}
        </button>
      </form>

      <footer class="register-footer">
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-box {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 40px;
  width: 100%;
  max-width: 600px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
}

.register-box:hover {
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
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.register-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.register-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* Role Selector */
.role-selector {
  display: flex;
  gap: 15px;
}

.role-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background: #f8f9fa;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.role-btn i {
  font-size: 1.5rem;
  color: #999;
  transition: all 0.3s ease;
}

.role-btn span {
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
}

.role-btn small {
  font-size: 0.7rem;
  color: #999;
  transition: all 0.3s ease;
}

.role-btn:hover {
  background: #f0f3ff;
  border-color: #667eea;
  transform: translateY(-2px);
}

.role-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

.role-btn.active i,
.role-btn.active span,
.role-btn.active small {
  color: white;
}

/* Company Fields Animation */
.company-fields {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Status Message */
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
  .register-box {
    padding: 30px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .role-selector {
    flex-direction: column;
  }
  
  .logo {
    font-size: 24px;
  }
  
  .register-header h2 {
    font-size: 20px;
  }
}
</style>