<template>
  <div>
    <NavbarCandidate />
    
    <main>
      <section class="search-section">
        <div class="search-container" style="max-width: 800px; margin: 0 auto;">
          <div style="position: relative; flex: 1.5; display: flex; align-items: center;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 15px; color: #888;"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Buscar por cargo o palabra clave" 
              style="padding-left: 45px; width: 100%;"
            >
          </div>
          <div style="position: relative; flex: 1; display: flex; align-items: center;">
            <i class="fa-solid fa-location-dot" style="position: absolute; left: 15px; color: #888; z-index: 10;"></i>
            <select 
              v-model="selectedLocation" 
              style="padding: 15px 40px 15px 45px; width: 100%; border: 1px solid var(--gris-borde); border-radius: 8px; outline: none; font-size: 1rem; color: #333; background: white; cursor: pointer; appearance: none; -webkit-appearance: none;"
            >
              <option value="">Todas las ubicaciones</option>
              <option v-for="dept in departamentos" :key="dept" :value="dept">{{ dept }}</option>
            </select>
            <i class="fa-solid fa-chevron-down" style="position: absolute; right: 15px; color: #888; pointer-events: none; z-index: 10;"></i>
          </div>
        </div>
      </section>

      <!-- Stats Bar (Hidden when searching) -->
      <section v-if="!showResults" class="stats-bar">
        <div class="stat-item" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 15px; min-width: 200px;">
          <i class="fa-solid fa-users" style="font-size: 2rem; color: #333;"></i>
          <div style="text-align: left;">
            <small style="color: #777;">Activos</small><br>
            <strong>{{ estadisticas.activos.toLocaleString() }}</strong>
          </div>
        </div>
        <div class="stat-item" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 15px; min-width: 200px;">
          <i class="fa-solid fa-briefcase" style="font-size: 2rem; color: #333;"></i>
          <div style="text-align: left;">
            <small style="color: #777;">Empleos</small><br>
            <strong>{{ estadisticas.empleos.toLocaleString() }}</strong>
          </div>
        </div>
        <div class="stat-item" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 15px; min-width: 200px;">
          <i class="fa-solid fa-building" style="font-size: 2rem; color: #333;"></i>
          <div style="text-align: left;">
            <small style="color: #777;">Empresas</small><br>
            <strong>{{ estadisticas.empresas.toLocaleString() }}</strong>
          </div>
        </div>
      </section>

      <!-- Search Results -->
      <section v-else class="container" style="padding-top: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">Resultados de Búsqueda</h2>
        <div style="display: flex; flex-direction: column; gap: 20px; max-width: 900px; margin: 0 auto;">
          <JobCard 
            v-for="vacante in vacantesFiltradas" 
            :key="vacante.id_vacante" 
            :vacante="vacante" 
          />
        </div>
        <p v-if="vacantesFiltradas.length === 0" style="color: #888; text-align: center; margin-top: 20px;">
          No se encontraron vacantes que coincidan con la búsqueda.
        </p>
      </section>

      <!-- Onboarding Steps (Hidden when searching) -->
      <section v-if="!showResults" class="container">
        <div class="steps-grid">
          <div class="step">
            <span style="background: #e0e7ff; color: #4338ca; width: 60px; height: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 1.8rem; font-weight: bold; border-radius: 4px;">1</span>
            <h3>Crea tu cuenta</h3>
            <p>Ingresa tu nombre y un correo electrónico para poder crear tu cuenta.</p>
          </div>
          <div class="step">
            <span style="background: #e0e7ff; color: #4338ca; width: 60px; height: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 1.8rem; font-weight: bold; border-radius: 4px;">2</span>
            <h3>Completa tu CV</h3>
            <p>Completa la información solicitada: datos personales, experiencia y formación.</p>
          </div>
          <div class="step">
            <span style="background: #e0e7ff; color: #4338ca; width: 60px; height: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 1.8rem; font-weight: bold; border-radius: 4px;">3</span>
            <h3>Explora ofertas</h3>
            <p>Encuentra ofertas de empleo que se ajusten perfectamente a tu perfil profesional.</p>
          </div>
          <div class="step">
            <span style="background: #e0e7ff; color: #4338ca; width: 60px; height: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 1.8rem; font-weight: bold; border-radius: 4px;">4</span>
            <h3>Postúlate en oferta</h3>
            <p>Aplica a las vacantes de tu interés de forma rápida y sencilla con un solo clic.</p>
          </div>
          <div class="step">
            <span style="background: #e0e7ff; color: #4338ca; width: 60px; height: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 1.8rem; font-weight: bold; border-radius: 4px;">5</span>
            <h3>Retroalimentación</h3>
            <p>Recibe seguimiento directo de un gestor de empleo sobre tu proceso de selección.</p>
          </div>
          <div class="step">
            <span style="background: #e0e7ff; color: #4338ca; width: 60px; height: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 1.8rem; font-weight: bold; border-radius: 4px;">6</span>
            <h3>Fase de selección</h3>
            <p>La empresa se contactará contigo para las entrevistas y pruebas finales.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavbarCandidate from '../components/NavbarCandidate.vue'
import JobCard from '../components/JobCard.vue'

const searchQuery = ref('')
const selectedLocation = ref('')
const todasLasVacantes = ref([])
const estadisticas = ref({ activos: 0, empleos: 0, empresas: 0 })

const departamentos = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad',
  'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador',
  'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután'
]

const showResults = computed(() => {
  return searchQuery.value.trim() !== '' || selectedLocation.value !== ''
})

const vacantesFiltradas = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const loc = selectedLocation.value.toLowerCase()
  
  return todasLasVacantes.value.filter(v => {
    const matchQuery = !query || 
      (v.titulo && v.titulo.toLowerCase().includes(query)) || 
      (v.descripcion && v.descripcion.toLowerCase().includes(query))
      
    const matchLoc = !loc || 
      (v.ubicacion && v.ubicacion.toLowerCase().includes(loc))
      
    return matchQuery && matchLoc
  })
})

const cargarVacantes = async () => {
  try {
    const response = await fetch('http://localhost:3000/vacantes')
    if (response.ok) {
      todasLasVacantes.value = await response.json()
    }
  } catch (err) {
    console.error('Error al cargar vacantes para el dashboard:', err)
  }
}

const cargarEstadisticas = async () => {
  try {
    const response = await fetch('http://localhost:3000/estadisticas')
    if (response.ok) {
      estadisticas.value = await response.json()
    }
  } catch (err) {
    console.error('Error al cargar estadísticas:', err)
  }
}

const cargarMisPostulaciones = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) return
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return
  }
  if (!user || !user.id_usuario) return
  
  try {
    const response = await fetch('http://localhost:3000/postulaciones')
    if (response.ok) {
      const postulaciones = await response.json()
      const misPostulacionesIds = postulaciones
        .filter(p => p.id_usuario === user.id_usuario)
        .map(p => p.id_vacante)
      localStorage.setItem(`aplicaciones_${user.id_usuario}`, JSON.stringify(misPostulacionesIds))
    }
  } catch (err) {
    console.error('Error al cargar postulaciones del usuario:', err)
  }
}

const filtrar = () => {
  // En Vue, la reactividad filtra automáticamente mediante vacantesFiltradas.
}

onMounted(() => {
  cargarVacantes()
  cargarEstadisticas()
  cargarMisPostulaciones()
})
</script>

<style scoped>
</style>
