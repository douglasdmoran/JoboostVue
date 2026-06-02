<template>
  <div>
    <NavbarCompany />
    <main class="container profile-layout">
        
        <section class="form-side">
            <h1 class="main-title" style="font-size: 2.2rem; margin-bottom: 10px;">Configuración de Empresa</h1>
            <p style="color: #64748b; margin-bottom: 30px;">Administra los datos de contacto y credenciales de tu cuenta corporativa.</p>
            
            <form @submit.prevent="guardarCambios" class="profile-form">
                <div class="input-group">
                    <label for="admin-nombre">Nombre del Administrador</label>
                    <input type="text" id="admin-nombre" v-model="adminNombre" placeholder="Ej. Irving Orellana" required>
                </div>

                <div class="input-group">
                    <label for="emp-tel-oficina">Teléfono de Oficina</label>
                    <input type="tel" id="emp-tel-oficina" v-model="telOficina" placeholder="2400-0000" required>
                </div>

                <div class="input-group">
                    <label for="emp-email-soporte">Correo de Soporte Técnico</label>
                    <input type="email" id="emp-email-soporte" v-model="emailSoporte" placeholder="soporte@empresa.com">
                </div>

                <div class="input-group">
                    <label for="emp-pass-actual">Contraseña Actual (Para cambios)</label>
                    <input type="password" id="emp-pass-actual" v-model="password" placeholder="••••••••">
                </div>

                <p v-if="mensajeEstado" :style="{ color: esError ? 'red' : 'green' }" style="text-align: center; margin-bottom: 10px; font-weight: bold;">
                  {{ mensajeEstado }}
                </p>

                <button type="submit" :disabled="cargando" class="btn-primary" style="margin-top: 15px; width: 100%;">
                    <i class="fa-solid fa-save"></i> {{ cargando ? 'Guardando...' : 'Guardar Cambios de Cuenta' }}
                </button>
            </form>
        </section>

        <section class="image-side">
            <div class="img-placeholder-container" style="text-align: center;">
                <h3 style="margin-bottom: 20px; font-size: 1.1rem; color: #1e293b;">Logo Corporativo</h3>
                
                <div class="img-placeholder-box" :style="{ border: '2px dashed var(--azul-jobboost)', background: '#f0f4ff' }">
                    <div :style="{ backgroundColor: logoColor, padding: '15px', borderRadius: '8px', border: '3px solid #fecb00', color: 'white', fontWeight: 'bold', fontStyle: 'italic' }">
                        {{ logoTexto }}
                    </div>
                </div>
                
                <button type="button" @click="actualizarLogoSimulado" class="btn-secondary" style="margin-bottom: 20px;">
                    <i class="fa-solid fa-upload"></i> Actualizar Logo
                </button>

                <div style="background: #dcfce7; color: #166534; padding: 15px; border-radius: 8px; font-size: 0.9rem; border: 1px solid #bbf7d0;">
                    <i class="fa-solid fa-circle-check"></i> <strong>Empresa Verificada</strong>
                    <p style="font-size: 0.8rem; margin-top: 5px;">Tu perfil es visible para todos los postulantes.</p>
                </div>
            </div>
        </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarCompany from '../components/NavbarCompany.vue'

const router = useRouter()

const adminNombre = ref('')
const telOficina = ref('')
const emailSoporte = ref('')
const password = ref('')

const logoTexto = ref('DIANA')
const logoColor = ref('#e30613')

const mensajeEstado = ref('')
const esError = ref(false)
const cargando = ref(false)

let idUsuario = null
let idEmpresa = 2 // por defecto Diana

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

  // Mapear según correo/nombre
  const email = (user.correo || user.email || '').toLowerCase()
  const name = (user.nombre || '').toLowerCase()
  
  if (email.includes('siman') || name.includes('siman')) {
    idEmpresa = 4
    logoTexto.value = 'SIMAN'
    logoColor.value = '#c8102e'
  } else if (email.includes('dollarcity') || name.includes('dollarcity') || email.includes('d-city')) {
    idEmpresa = 5
    logoTexto.value = 'D-CITY'
    logoColor.value = '#005a32'
  } else if (email.includes('selectos') || name.includes('selectos')) {
    idEmpresa = 6
    logoTexto.value = 'S. SELECTOS'
    logoColor.value = '#004a99'
  } else {
    idEmpresa = 2
    logoTexto.value = 'DIANA'
    logoColor.value = '#e30613'
  }

  try {
    const res = await fetch(`http://localhost:3000/empresas`)
    if (res.ok) {
      const empresas = await res.json()
      const empresa = empresas.find(e => e.id_empresa === idEmpresa)
      if (empresa) {
        // Intentar parsear teléfono y correo soporte de la descripción
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
  cargando.value = true
  esError.value = false
  mensajeEstado.value = 'Guardando cambios...'

  try {
    // 1. Actualizar usuario en /users/:id
    const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
    const user = JSON.parse(userJson)
    
    const userBody = {
      nombre: adminNombre.value.trim(),
      email: user.correo || user.email,
      rol: 'empresa'
    }
    if (password.value) {
      userBody.contrasenia = password.value
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
    // Actualizar localStorage
    localStorage.setItem('usuario', JSON.stringify(updatedUser))
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))

    // 2. Actualizar empresa en /empresas/:id_empresa
    const resEmp = await fetch(`http://localhost:3000/empresas`)
    if (resEmp.ok) {
      const empresas = await resEmp.json()
      const empresa = empresas.find(e => e.id_empresa === idEmpresa)
      if (empresa) {
        // Regenerar la descripción con los nuevos datos
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
            calificacion_promedio: empresa.calificacion_promedio
          })
        })
      }
    }

    esError.value = false
    mensajeEstado.value = '¡Cambios guardados con éxito!'
    password.value = ''
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

const actualizarLogoSimulado = () => {
  alert('Funcionalidad de actualización de logo simulada con éxito.')
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
</style>
