<template>
  <div class="vacancies-page">
    <NavbarCandidate />
    
    <main class="vacancies-main">
      <div class="vacancies-header">
        <h1 class="vacancies-title">Vacantes Disponibles</h1>
        <p class="vacancies-subtitle">Encuentra la oportunidad laboral que estás buscando</p>
      </div>

      <div class="search-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              @keydown.enter="buscarVacantes" 
              placeholder="Buscar por título, empresa o palabra clave..." 
              class="search-input"
            >
          </div>
          <button @click="buscarVacantes" class="btn-search">
            <i class="fa-solid fa-magnifying-glass"></i>
            Buscar
          </button>
        </div>
      </div>

      <div v-if="estadoCarga" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>{{ estadoCarga }}</p>
      </div>

      <div v-else class="vacancies-list">
        <JobCard 
          v-for="vacante in listaVacantes" 
          :key="vacante.id_vacante" 
          :vacante="vacante" 
        />
        
        <div v-if="listaVacantes.length === 0" class="empty-state">
          <i class="fa-solid fa-briefcase-slash"></i>
          <p>No se encontraron vacantes</p>
          <small>Intenta con otros términos de búsqueda</small>
        </div>
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
  estadoCarga.value = 'Buscando vacantes...'
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
.vacancies-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.vacancies-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

.vacancies-header {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out;
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

.vacancies-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
}

.vacancies-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.search-section {
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.search-container {
  display: flex;
  gap: 15px;
  background: white;
  border-radius: 60px;
  padding: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.search-container:focus-within {
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 20px;
  color: #999;
  font-size: 1rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 50px;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  color: #333;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  background: white;
}

.search-input::placeholder {
  color: #bbb;
}

.btn-search {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0 30px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.loading-state i {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 15px;
}

.loading-state p {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.vacancies-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.empty-state i {
  font-size: 3.5rem;
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 1rem;
}

.empty-state small {
  color: #999;
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 768px) {
  .vacancies-main {
    padding: 20px 15px;
  }
  
  .vacancies-title {
    font-size: 1.5rem;
  }
  
  .vacancies-subtitle {
    font-size: 0.85rem;
  }
  
  .search-container {
    flex-direction: column;
    border-radius: 20px;
    padding: 15px;
  }
  
  .search-input-wrapper {
    width: 100%;
  }
  
  .search-input {
    padding: 12px 20px 12px 45px;
    font-size: 0.85rem;
  }
  
  .btn-search {
    padding: 12px;
    justify-content: center;
  }
  
  .empty-state {
    padding: 50px 20px;
  }
  
  .empty-state i {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .vacancies-title {
    font-size: 1.3rem;
  }
  
  .search-icon {
    left: 15px;
    font-size: 0.85rem;
  }
  
  .search-input {
    padding: 10px 15px 10px 40px;
  }
  
  .btn-search {
    font-size: 0.85rem;
  }
}
</style>