<template>
  <div class="vacancy-detail-page">
    <NavbarCandidate />
    
    <main class="vacancy-main">
      <section class="vacancy-detail-section">
        <div class="vacancy-card">
          
          <div class="vacancy-header">
            <h1 class="vacancy-title">
              {{ vacante ? vacante.titulo : 'Cargando...' }}
            </h1>
            
            <div class="vacancy-meta" v-if="vacante">
              <div class="meta-item">
                <i class="fa-solid fa-location-dot"></i>
                <span><strong>Ubicación:</strong> {{ vacante.ubicacion || 'No especificada' }}</span>
              </div>
              <div class="meta-item">
                <i class="fa-solid fa-briefcase"></i>
                <span><strong>Contrato:</strong> {{ vacante.tipo_contrato || 'No especificado' }}</span>
              </div>
              <div class="meta-item">
                <i class="fa-solid fa-building"></i>
                <span><strong>Modalidad:</strong> {{ vacante.modalidad || 'No especificada' }}</span>
              </div>
            </div>
          </div>

          <div class="vacancy-divider"></div>

          <div class="vacancy-description">
            <div class="description-header">
              <i class="fa-solid fa-file-alt"></i>
              <h2>Descripción y Requisitos</h2>
            </div>
            <div class="description-content">
              <p>{{ vacante ? vacante.descripcion || 'Sin descripción detallada.' : 'Cargando información...' }}</p>
            </div>
          </div>

          <div class="vacancy-actions">
            <div v-if="!aplicado" class="action-button-wrapper">
              <button 
                id="btn-aplicar-vacante" 
                class="btn-apply" 
                @click="aplicarVacante" 
                :disabled="cargando"
              >
                <i class="fa-solid" :class="cargando ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
                {{ cargando ? 'Procesando...' : 'Aplicar a esta vacante' }}
              </button>
            </div>
            
            <div v-else class="applied-success">
              <div class="applied-badge">
                <i class="fa-solid fa-circle-check"></i>
                <span>¡Ya has aplicado a este empleo!</span>
              </div>
              <p v-if="recienAplicado" class="redirect-message">
                <i class="fa-solid fa-hourglass-half"></i>
                Redirigiendo al listado de vacantes...
              </p>
            </div>
            
            <div class="back-link">
              <router-link to="/vacantes" class="back-button">
                <i class="fa-solid fa-arrow-left"></i>
                Volver al listado
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
.vacancy-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.vacancy-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px;
}

.vacancy-detail-section {
  animation: fadeInUp 0.5s ease-out;
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

.vacancy-card {
  background: white;
  border-radius: 24px;
  padding: 50px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.vacancy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

/* Header */
.vacancy-header {
  text-align: center;
  margin-bottom: 30px;
}

.vacancy-title {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.vacancy-meta {
  display: flex;
  justify-content: center;
  gap: 25px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.95rem;
  background: #f8f9fa;
  padding: 6px 15px;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.meta-item:hover {
  background: #f0f3ff;
  transform: translateY(-2px);
}

.meta-item i {
  color: #667eea;
  font-size: 1rem;
}

.meta-item strong {
  color: #333;
  font-weight: 600;
}

/* Divider */
.vacancy-divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  margin: 35px auto;
  border-radius: 2px;
}

/* Description */
.vacancy-description {
  margin-bottom: 40px;
}

.description-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 25px;
}

.description-header i {
  font-size: 1.8rem;
  color: #667eea;
}

.description-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.description-content {
  max-width: 700px;
  margin: 0 auto;
}

.description-content p {
  font-size: 1rem;
  line-height: 1.8;
  color: #555;
  text-align: left;
  white-space: pre-wrap;
  margin: 0;
}

/* Actions */
.vacancy-actions {
  text-align: center;
  margin-top: 30px;
}

.action-button-wrapper {
  margin-bottom: 25px;
}

.btn-apply {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 48px;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-apply:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-apply:active:not(:disabled) {
  transform: translateY(0);
}

.btn-apply:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Applied Success */
.applied-success {
  margin-bottom: 25px;
}

.applied-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #e8f8f0 0%, #d4f5e6 100%);
  border: 2px solid #27ae60;
  border-radius: 60px;
  font-size: 1rem;
  font-weight: 600;
  color: #27ae60;
  margin-bottom: 12px;
  animation: pulse 0.5s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.applied-badge i {
  font-size: 1.3rem;
}

.redirect-message {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.85rem;
  background: #f8f9fa;
  padding: 8px 20px;
  border-radius: 20px;
  margin: 0;
}

.redirect-message i {
  color: #f39c12;
}

/* Back Link */
.back-link {
  margin-top: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: #667eea;
  background: #f0f3ff;
  transform: translateX(-5px);
}

/* Responsive */
@media (max-width: 768px) {
  .vacancy-main {
    padding: 30px 15px;
  }
  
  .vacancy-card {
    padding: 30px 25px;
  }
  
  .vacancy-title {
    font-size: 1.6rem;
  }
  
  .vacancy-meta {
    gap: 12px;
  }
  
  .meta-item {
    font-size: 0.85rem;
    padding: 4px 12px;
  }
  
  .description-header h2 {
    font-size: 1.2rem;
  }
  
  .description-header i {
    font-size: 1.4rem;
  }
  
  .btn-apply {
    padding: 12px 35px;
    font-size: 0.95rem;
  }
  
  .applied-badge {
    padding: 12px 25px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .vacancy-card {
    padding: 20px;
  }
  
  .vacancy-title {
    font-size: 1.3rem;
  }
  
  .vacancy-meta {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .meta-item {
    width: 100%;
    justify-content: center;
  }
  
  .description-content p {
    font-size: 0.9rem;
  }
  
  .btn-apply {
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
  }
  
  .applied-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>