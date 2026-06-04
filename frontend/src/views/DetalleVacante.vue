<template>
  <div>
    <NavbarCandidate />
    
    <main class="container">
      <section class="vacancy-detail-card" style="text-align: center;">
        <div style="background: white; padding: 50px; border-radius: 12px; border: 1px solid #ddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <h1 id="detalle-titulo" style="font-size: 2.2rem; color: #333; font-weight: bold; margin-bottom: 15px;">
            {{ vacante ? vacante.titulo : 'Cargando...' }}
          </h1>
          
          <div style="margin-top: 15px; color: #666; font-size: 1.1rem; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;" id="detalle-metadata">
            <template v-if="vacante">
              <p><i class="fa-solid fa-location-dot"></i> <strong>Ubicación:</strong> {{ vacante.ubicacion || 'N/A' }}</p>
              <p><i class="fa-solid fa-briefcase"></i> <strong>Contrato:</strong> {{ vacante.tipo_contrato || 'N/A' }}</p>
              <p><i class="fa-solid fa-building"></i> <strong>Modalidad:</strong> {{ vacante.modalidad || 'N/A' }}</p>
            </template>
          </div>

          <hr style="width: 100px; margin: 30px auto; border: 2px solid var(--azul-jobboost); border-radius: 2px; opacity: 1;">

          <div class="functions-content">
            <h2 style="margin-bottom: 20px; font-size: 1.5rem; font-weight: bold; color: #333;">Descripción y Requisitos</h2>
            <p id="detalle-descripcion" style="max-width: 600px; margin: 0 auto 40px; font-size: 1.1rem; color: #555; line-height: 1.8; white-space: pre-wrap; text-align: left;">
              {{ vacante ? vacante.descripcion || 'Sin descripción detallada.' : 'Cargando información...' }}
            </p>
          </div>

          <div class="action-area">
            <button 
              v-if="!aplicado" 
              id="btn-aplicar-vacante" 
              class="btn-primary" 
              @click="aplicarVacante" 
              :disabled="cargando"
              style="padding: 15px 60px; font-size: 1.1rem; cursor: pointer;"
            >
              {{ cargando ? 'Aplicando...' : 'Aplicar a esta vacante' }}
            </button>
            <div v-else>
              <div 
                style="padding: 15px 30px; font-size: 1.1rem; color: #27ae60; font-weight: bold; background-color: #e8f8f0; border: 1px solid #27ae60; border-radius: 8px; display: inline-block; margin-bottom: 10px;"
              >
                <i class="fa-solid fa-circle-check"></i> Ya has aplicado a este empleo
              </div>
              <p v-if="recienAplicado" style="color: #666; font-size: 0.95rem; margin-top: 8px; font-style: italic;">
                Redirigiendo al listado de vacantes...
              </p>
            </div>
            
            <div style="margin-top: 25px;">
              <router-link to="/vacantes" style="text-decoration: none; color: #666; font-size: 0.9rem;">
                <i class="fa-solid fa-arrow-left"></i> Volver al listado
              </router-link>
            </div>
          </div>

        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarCandidate from '../components/NavbarCandidate.vue'

const route = useRoute()
const router = useRouter()

const idVacante = route.params.id
const vacante = ref(null)
const cargando = ref(false)
const aplicado = ref(false)
const recienAplicado = ref(false)

const verificarPostulacion = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) return
  
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return
  }
  
  if (!user || !user.id_usuario) return

  const aplicadasJson = localStorage.getItem(`aplicaciones_${user.id_usuario}`)
  if (aplicadasJson) {
    try {
      const aplicadasIds = JSON.parse(aplicadasJson)
      if (aplicadasIds.includes(parseInt(idVacante))) {
        aplicado.value = true
        return
      }
    } catch (e) {}
  }

  try {
    const response = await fetch('http://localhost:3000/postulaciones')
    if (response.ok) {
      const postulaciones = await response.json()
      const yaPostulado = postulaciones.some(p => 
        p.id_usuario === user.id_usuario && 
        p.id_vacante === parseInt(idVacante)
      )
      if (yaPostulado) {
        aplicado.value = true
        
        // Actualizar cache local
        let aplicadasIds = []
        try {
          if (aplicadasJson) aplicadasIds = JSON.parse(aplicadasJson)
        } catch (e) {}
        if (!aplicadasIds.includes(parseInt(idVacante))) {
          aplicadasIds.push(parseInt(idVacante))
          localStorage.setItem(`aplicaciones_${user.id_usuario}`, JSON.stringify(aplicadasIds))
        }
      }
    }
  } catch (err) {
    console.error('Error al verificar postulación:', err)
  }
}

const cargarDetalle = async () => {
  try {
    const response = await fetch(`http://localhost:3000/vacantes/buscarPorId/${idVacante}`)
    if (!response.ok) throw new Error('Error al cargar la vacante')
    vacante.value = await response.json()
  } catch (err) {
    console.error('Error al cargar detalle vacante:', err)
    
    // Fallback: si falla por id_vacante, cargar todas y buscar localmente
    try {
      const response = await fetch('http://localhost:3000/vacantes')
      if (response.ok) {
        const all = await response.json()
        const found = all.find(v => v.id_vacante === parseInt(idVacante))
        if (found) {
          vacante.value = found
          return
        }
      }
    } catch (e) {
      console.error(e)
    }
    
    alert('No se pudieron obtener los detalles de la oferta.')
  }
}

const aplicarVacante = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    alert('Debes iniciar sesión para aplicar a una vacante.')
    router.push('/')
    return
  }
  
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return
  }
  
  if (!user || !user.id_usuario) {
    alert('Sesión inválida.')
    router.push('/')
    return
  }

  cargando.value = true

  try {
    const response = await fetch('http://localhost:3000/postulaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_vacante: parseInt(idVacante),
        id_usuario: user.id_usuario
      })
    })

    if (!response.ok) throw new Error('Error al enviar postulación')
    
    aplicado.value = true
    recienAplicado.value = true
    
    // Guardar en cache local de aplicaciones
    const aplicadasJson = localStorage.getItem(`aplicaciones_${user.id_usuario}`)
    let aplicadasIds = []
    try {
      if (aplicadasJson) aplicadasIds = JSON.parse(aplicadasJson)
    } catch (e) {}
    if (!aplicadasIds.includes(parseInt(idVacante))) {
      aplicadasIds.push(parseInt(idVacante))
      localStorage.setItem(`aplicaciones_${user.id_usuario}`, JSON.stringify(aplicadasIds))
    }

    // Redirigir al listado automáticamente después de 2.5 segundos
    setTimeout(() => {
      router.push('/vacantes')
    }, 2500)
  } catch (err) {
    console.error(err)
    alert('Ocurrió un error al aplicar. Inténtalo de nuevo.')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarDetalle()
  verificarPostulacion()
})
</script>

<style scoped>
</style>
