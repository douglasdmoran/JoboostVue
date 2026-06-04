<template>
  <div>
    <NavbarCandidate />
    
    <main class="container">
      <h1 style="margin-bottom: 20px; font-size: 2rem; font-weight: bold; color: #333;">Vacantes Disponibles</h1>

      <div style="display: flex; gap: 10px; margin-bottom: 30px;" class="search-bar-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          @keydown.enter="buscarVacantes" 
          placeholder="Buscar por título..." 
          style="flex: 1; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;"
        >
        <button @click="buscarVacantes" class="btn-primary" style="padding: 12px 24px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-magnifying-glass"></i> Buscar
        </button>
      </div>

      <div v-if="estadoCarga" style="text-align: center; color: #666; margin-bottom: 20px; font-size: 1.1rem;">
        {{ estadoCarga }}
      </div>

      <div class="vacantes-lista" style="display: flex; flex-direction: column; gap: 20px;">
        <JobCard 
          v-for="vacante in listaVacantes" 
          :key="vacante.id_vacante" 
          :vacante="vacante" 
        />
        <p v-if="listaVacantes.length === 0 && !estadoCarga" style="color: #888; text-align: center; font-size: 1.1rem; padding: 40px 0;">
          No se encontraron vacantes.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavbarCandidate from '../components/NavbarCandidate.vue'
import JobCard from '../components/JobCard.vue'

const searchQuery = ref('')
const listaVacantes = ref([])
const estadoCarga = ref('')

const buscarVacantes = async () => {
  estadoCarga.value = 'Buscando vacantes…'
  const query = searchQuery.value.trim()
  
  try {
    let url = 'http://localhost:3000/vacantes'
    if (query !== '') {
      url = `http://localhost:3000/vacantes/buscarPorTitulo/${encodeURIComponent(query)}`
    }
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error en respuesta del servidor')
    
    const data = await response.json()
    listaVacantes.value = data
    estadoCarga.value = ''
  } catch (err) {
    console.error('Error al realizar búsqueda de vacantes:', err)
    
    // Fallback de contingencia: buscar todo localmente si el endpoint específico da error
    try {
      const response = await fetch('http://localhost:3000/vacantes')
      if (response.ok) {
        const all = await response.json()
        if (query !== '') {
          listaVacantes.value = all.filter(v => 
            v.titulo && v.titulo.toLowerCase().includes(query.toLowerCase())
          )
        } else {
          listaVacantes.value = all
        }
      }
      estadoCarga.value = ''
    } catch (fallbackErr) {
      estadoCarga.value = ''
      alert('Error al cargar vacantes de empleo.')
    }
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

onMounted(() => {
  buscarVacantes()
  cargarMisPostulaciones()
})
</script>

<style scoped>
</style>
