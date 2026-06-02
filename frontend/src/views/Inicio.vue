<template>
  <div>
    <NavbarCandidate />
    
    <main>
      <section class="search-section">
        <div class="search-container">
          <div style="position: relative; flex: 2; display: flex; align-items: center;">
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
              style="padding-left: 45px; width: 100%; border: none; outline: none; font-size: 1rem; color: #333; background: transparent; cursor: pointer; appearance: none; -webkit-appearance: none;"
            >
              <option value="">Todas las ubicaciones</option>
              <option v-for="dept in departamentos" :key="dept" :value="dept">{{ dept }}</option>
            </select>
            <i class="fa-solid fa-chevron-down" style="position: absolute; right: 15px; color: #888; pointer-events: none;"></i>
          </div>
          <button class="btn-primary" @click="filtrar">Buscar</button>
        </div>
      </section>

      <!-- Stats Bar (Hidden when searching) -->
      <section v-if="!showResults" class="stats-bar">
        <div class="stat-item" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 15px; min-width: 200px;">
          <i class="fa-solid fa-users" style="font-size: 2rem; color: #333;"></i>
          <div style="text-align: left;">
            <small style="color: #777;">Activos</small><br>
            <strong>50,000,080</strong>
          </div>
        </div>
        <div class="stat-item" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 15px; min-width: 200px;">
          <i class="fa-solid fa-briefcase" style="font-size: 2rem; color: #333;"></i>
          <div style="text-align: left;">
            <small style="color: #777;">Empleos</small><br>
            <strong>8,000</strong>
          </div>
        </div>
        <div class="stat-item" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 15px; min-width: 200px;">
          <i class="fa-solid fa-building" style="font-size: 2rem; color: #333;"></i>
          <div style="text-align: left;">
            <small style="color: #777;">Empresas</small><br>
            <strong>44,000</strong>
          </div>
        </div>
      </section>

      <!-- Search Results -->
      <section v-else class="container" style="padding-top: 20px;">
        <h2 style="margin-bottom: 20px;">Resultados de Búsqueda</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
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

const filtrar = () => {
  // En Vue, la reactividad filtra automáticamente mediante vacantesFiltradas.
}

onMounted(() => {
  cargarVacantes()
})
</script>

<style scoped>
</style>
