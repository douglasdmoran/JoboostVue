<template>
  <div class="company-config-page">
    <NavbarCompany />
    
    <main class="config-main">
      <div class="config-layout">
        <!-- Columna Izquierda: Formulario -->
        <div class="config-form-side">
          <div class="config-header">
            <h1 class="config-title">Configuración de Empresa</h1>
            <p class="config-subtitle">Administra los datos de contacto y credenciales de tu cuenta corporativa</p>
          </div>
          
          <form @submit.prevent="guardarCambios" class="config-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-user-tie"></i>
                  Nombre del Administrador
                </label>
                <input 
                  type="text" 
                  v-model="adminNombre" 
                  placeholder="Ej. Irving Orellana" 
                  class="form-input"
                  required
                >
                <span class="form-hint">Nombre completo del responsable de la cuenta</span>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-phone"></i>
                  Teléfono de Oficina
                </label>
                <input 
                  type="tel" 
                  v-model="telOficina" 
                  placeholder="2400-0000" 
                  class="form-input"
                  required
                >
                <span class="form-hint">Número de contacto para los candidatos</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-envelope"></i>
                Correo de Soporte Técnico
              </label>
              <input 
                type="email" 
                v-model="emailSoporte" 
                placeholder="soporte@empresa.com" 
                class="form-input"
              >
              <span class="form-hint">Correo para consultas y soporte técnico</span>
            </div>

            <div class="form-section-divider">
              <i class="fa-solid fa-shield-halved"></i>
              <span>Seguridad y Contraseña</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-key"></i>
                  Nueva Contraseña (Opcional)
                </label>
                <input 
                  type="password" 
                  v-model="passwordNueva" 
                  placeholder="••••••••" 
                  class="form-input"
                >
                <span class="form-hint">Solo si deseas cambiar tu contraseña actual</span>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-lock"></i>
                  Contraseña Actual *
                </label>
                <input 
                  type="password" 
                  v-model="passwordActual" 
                  placeholder="••••••••" 
                  class="form-input"
                  required
                >
                <span class="form-hint">Ingresa tu contraseña actual para confirmar y guardar cualquier cambio</span>
              </div>
            </div>

            <div v-if="mensajeEstado" class="status-message" :class="{ 'status-error': esError, 'status-success': !esError && mensajeEstado.includes('éxito') }">
              <i :class="esError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'"></i>
              {{ mensajeEstado }}
            </div>

            <button type="submit" :disabled="cargando" class="btn-save">
              <i class="fa-solid" :class="cargando ? 'fa-spinner fa-spin' : 'fa-save'"></i>
              {{ cargando ? 'Guardando...' : 'Guardar Cambios de Cuenta' }}
            </button>
          </form>
        </div>

        <!-- Columna Derecha: Logo y Verificación -->
        <div class="config-logo-side">
          <div class="logo-card">
            <h3 class="logo-title">
              <i class="fa-solid fa-image"></i>
              Logo Corporativo
            </h3>
            
            <div class="logo-container">
              <div class="logo-box">
                <img v-if="logoUrl" :src="logoUrl" alt="Logo corporativo" class="logo-image" />
                <div v-else class="logo-placeholder" :style="{ backgroundColor: logoColor }">
                  <span class="logo-placeholder-text">{{ logoTexto }}</span>
                </div>
              </div>
            </div>
            
            <input type="file" ref="fileInputRef" @change="handleLogoUpload" accept="image/*" style="display: none;">
            <button type="button" @click="triggerFileInput" class="btn-upload">
              <i class="fa-solid fa-upload"></i>
              Actualizar Logo
            </button>
            <p class="upload-hint">Formatos permitidos: JPG, PNG (Máx. 2MB)</p>
          </div>

          <div class="verification-card">
            <div class="verification-badge">
              <i class="fa-solid fa-circle-check"></i>
              <strong>Empresa Verificada</strong>
            </div>
            <p class="verification-text">
              Tu perfil es visible para todos los postulantes y cuenta con verificación oficial de JobBoost.
            </p>
            <div class="verification-benefits">
              <span class="benefit-item">
                <i class="fa-solid fa-chart-line"></i>
                Mayor visibilidad
              </span>
              <span class="benefit-item">
                <i class="fa-solid fa-shield-alt"></i>
                Confianza garantizada
              </span>
              <span class="benefit-item">
                <i class="fa-solid fa-trophy"></i>
                Perfil destacado
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarCompany from '../components/NavbarCompany.vue'
import { resolveEmpresaId, generarLogo, generarColor } from '../utils/empresaUtils'

const router = useRouter()

const adminNombre = ref('')
const telOficina = ref('')
const emailSoporte = ref('')
const passwordActual = ref('')
const passwordNueva = ref('')

const logoTexto = ref('DIANA')
const logoColor = ref('#e30613')
const logoUrl = ref('')
const fileInputRef = ref(null)

const mensajeEstado = ref('')
const esError = ref(false)
const cargando = ref(false)

let idUsuario = null
let idEmpresa = null

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('La imagen es demasiado grande. El límite es de 2MB.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    logoUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const cargarDatos = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    router.push('/')
    return
  }
  
  let user
  try {
    user = JSON.parse(userJson)
    idUsuario = user.id_usuario
    adminNombre.value = user.nombre || ''
  } catch (e) {
    router.push('/')
    return
  }

  const resolved = await resolveEmpresaId()
  if (!resolved) {
    router.push('/')
    return
  }
  idEmpresa = resolved

  try {
    const res = await fetch(`http://localhost:3000/empresas`)
    if (res.ok) {
      const empresas = await res.json()
      const empresa = empresas.find(e => e.id_empresa === idEmpresa)
      if (empresa) {
        logoTexto.value = generarLogo(empresa.nombre)
        logoColor.value = generarColor(empresa.nombre)
        logoUrl.value = empresa.logo_url || ''

        const desc = empresa.descripcion || ''
        const telMatch = desc.match(/Tel:\s*([^\s.]+)/)
        const emailMatch = desc.match(/Email:\s*([^\s.]+)/)
        
        telOficina.value = telMatch ? telMatch[1] : '2400-0000'
        emailSoporte.value = emailMatch ? emailMatch[1] : 'soporte@empresa.com'
      }
    }
  } catch (err) {
    console.error('Error cargando datos de empresa:', err)
  }
}

const guardarCambios = async () => {
  if (!passwordActual.value) {
    esError.value = true
    mensajeEstado.value = 'Por favor, ingresa tu contraseña actual para confirmar los cambios.'
    return
  }

  cargando.value = true
  esError.value = false
  mensajeEstado.value = 'Verificando credenciales...'

  try {
    const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
    const user = JSON.parse(userJson)
    const originalEmail = user.correo || user.email

    // 1. Verificar contraseña actual con el endpoint de login
    const verifyRes = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: originalEmail,
        contrasenia: passwordActual.value,
      }),
    })

    if (!verifyRes.ok) {
      throw new Error('La contraseña actual es incorrecta. No se pueden guardar los cambios.')
    }

    mensajeEstado.value = 'Guardando cambios...'
    
    const userBody = {
      nombre: adminNombre.value.trim(),
      email: user.correo || user.email,
      rol: 'empresa'
    }
    if (passwordNueva.value) {
      userBody.contrasenia = passwordNueva.value
    }

    const resUser = await fetch(`http://localhost:3000/users/${idUsuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userBody)
    })

    if (!resUser.ok) {
      const errData = await resUser.json()
      throw new Error(errData.message || 'Error al actualizar usuario.')
    }

    const updatedUser = await resUser.json()
    localStorage.setItem('usuario', JSON.stringify(updatedUser))
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))

    const resEmp = await fetch(`http://localhost:3000/empresas`)
    if (resEmp.ok) {
      const empresas = await resEmp.json()
      const empresa = empresas.find(e => e.id_empresa === idEmpresa)
      if (empresa) {
        const nuevaDesc = `Sector: Reclutamiento. Email: ${emailSoporte.value.trim()}. Tel: ${telOficina.value.trim()}`
        
        await fetch(`http://localhost:3000/empresas/${idEmpresa}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre: empresa.nombre,
            descripcion: nuevaDesc,
            ubicacion: empresa.ubicacion,
            sitio_web: empresa.sitio_web,
            calificacion_promedio: empresa.calificacion_promedio,
            logo_url: logoUrl.value
          })
        })
      }
    }

    window.dispatchEvent(new Event('storage'))

    esError.value = false
    mensajeEstado.value = '¡Cambios guardados con éxito!'
    passwordActual.value = ''
    passwordNueva.value = ''
    setTimeout(() => {
      mensajeEstado.value = ''
    }, 3000)
  } catch (err) {
    console.error(err)
    esError.value = true
    mensajeEstado.value = err.message || 'Error al guardar los cambios.'
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.company-config-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.config-main {
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 20px;
}

.config-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
}

/* Form Side */
.config-form-side {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.config-form-side:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.config-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eef2f6;
}

.config-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 10px 0;
}

.config-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-section-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 30px 0 15px 0;
  color: #764ba2;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 2px solid #f0f3ff;
  padding-bottom: 8px;
}

.form-section-divider i {
  color: #667eea;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-weight: 600;
  font-size: 0.85rem;
}

.form-label i {
  color: #667eea;
  font-size: 0.9rem;
}

.form-input {
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #bbb;
}

.form-hint {
  font-size: 0.7rem;
  color: #999;
  margin-top: -4px;
}

.status-message {
  padding: 12px 15px;
  border-radius: 12px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
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

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Logo Side */
.config-logo-side {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.logo-card {
  background: white;
  border-radius: 24px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.logo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.logo-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logo-title i {
  color: #667eea;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.logo-box {
  width: 180px;
  height: 180px;
  border-radius: 20px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e1e5e9;
  transition: all 0.3s ease;
}

.logo-box:hover {
  border-color: #667eea;
  transform: scale(1.02);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
}

.logo-placeholder-text {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  font-style: italic;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-upload {
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  margin-bottom: 12px;
}

.btn-upload:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
}

.upload-hint {
  font-size: 0.7rem;
  color: #999;
  margin: 0;
}

/* Verification Card */
.verification-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid #bbf7d0;
  text-align: center;
}

.verification-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #166534;
  color: white;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  margin-bottom: 15px;
}

.verification-badge i {
  font-size: 1rem;
}

.verification-text {
  font-size: 0.85rem;
  color: #166534;
  margin-bottom: 20px;
  line-height: 1.5;
}

.verification-benefits {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #166534;
}

.benefit-item i {
  color: #22c55e;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 968px) {
  .config-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .config-form-side {
    order: 2;
  }
  
  .config-logo-side {
    order: 1;
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .config-main {
    padding: 20px 15px;
  }
  
  .config-form-side {
    padding: 25px;
  }
  
  .config-title {
    font-size: 1.5rem;
  }
  
  .config-subtitle {
    font-size: 0.85rem;
  }
  
  .logo-box {
    width: 150px;
    height: 150px;
  }
  
  .logo-placeholder-text {
    font-size: 1.5rem;
  }
  
  .btn-save {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .verification-benefits {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .config-form-side {
    padding: 20px;
  }
  
  .form-input {
    font-size: 0.85rem;
  }
  
  .logo-box {
    width: 130px;
    height: 130px;
  }
  
  .verification-benefits {
    flex-direction: column;
  }
}
</style>