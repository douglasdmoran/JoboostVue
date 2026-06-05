<template>
  <div class="candidate-home-page">
    <NavbarCandidate />
    
    <main>
      <!-- Hero Search Section -->
      <section class="hero-search-section">
        <div class="hero-content">
          <h1 class="hero-title">Encuentra tu próxima oportunidad laboral</h1>
          <p class="hero-subtitle">Miles de vacantes te esperan en las mejores empresas del país</p>
        </div>
        
        <div class="search-container">
          <div class="search-wrapper">
            <div class="search-input-group">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar por cargo, empresa o palabra clave" 
                class="search-input"
              >
            </div>
            
            <div class="search-input-group">
              <i class="fa-solid fa-location-dot location-icon"></i>
              <select 
                v-model="selectedLocation" 
                class="location-select"
              >
                <option value="">Todas las ubicaciones</option>
                <option v-for="dept in departamentos" :key="dept" :value="dept">{{ dept }}</option>
              </select>
              <i class="fa-solid fa-chevron-down select-arrow"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Bar (Hidden when searching) -->
      <section v-if="!showResults" class="stats-section">
        <div class="stats-container">
          <div class="stat-card stats-users">
            <div class="stat-icon">
              <i class="fa-solid fa-users"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Usuarios Activos</span>
              <strong class="stat-number">{{ estadisticas.activos.toLocaleString() }}</strong>
            </div>
          </div>
          
          <div class="stat-card stats-jobs">
            <div class="stat-icon">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Vacantes Disponibles</span>
              <strong class="stat-number">{{ estadisticas.empleos.toLocaleString() }}</strong>
            </div>
          </div>
          
          <div class="stat-card stats-companies">
            <div class="stat-icon">
              <i class="fa-solid fa-building"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Empresas Asociadas</span>
              <strong class="stat-number">{{ estadisticas.empresas.toLocaleString() }}</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- Search Results -->
      <section v-if="showResults" class="results-section">
        <div class="results-header">
          <h2 class="results-title">
            <i class="fa-solid fa-magnifying-glass"></i>
            Resultados de Búsqueda
          </h2>
          <p class="results-count">{{ vacantesFiltradas.length }} vacante(s) encontrada(s)</p>
        </div>
        
        <div class="results-grid">
          <JobCard 
            v-for="vacante in vacantesFiltradas" 
            :key="vacante.id_vacante" 
            :vacante="vacante" 
          />
        </div>
        
        <div v-if="vacantesFiltradas.length === 0" class="empty-results">
          <i class="fa-solid fa-briefcase-slash"></i>
          <p>No se encontraron vacantes que coincidan con tu búsqueda</p>
          <small>Intenta con otros términos o elimina algunos filtros</small>
        </div>
      </section>

      <!-- Onboarding Steps (Hidden when searching) -->
      <section v-if="!showResults" class="steps-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">¿Cómo funciona JobBoost?</h2>
            <p class="section-subtitle">Sigue estos simples pasos para encontrar el trabajo de tus sueños</p>
          </div>
          
          <div class="steps-grid">
            <div class="step-card" v-for="(step, index) in steps" :key="index">
              <div class="step-number">{{ step.number }}</div>
              <div class="step-content">
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-description">{{ step.description }}</p>
              </div>
            </div>
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

const steps = [
  { number: 1, title: 'Crea tu cuenta', description: 'Ingresa tu nombre y un correo electrónico para poder crear tu cuenta.' },
  { number: 2, title: 'Completa tu CV', description: 'Completa la información solicitada: datos personales, experiencia y formación.' },
  { number: 3, title: 'Explora ofertas', description: 'Encuentra ofertas de empleo que se ajusten perfectamente a tu perfil profesional.' },
  { number: 4, title: 'Postúlate en oferta', description: 'Aplica a las vacantes de tu interés de forma rápida y sencilla con un solo clic.' },
  { number: 5, title: 'Retroalimentación', description: 'Recibe seguimiento directo de un gestor de empleo sobre tu proceso de selección.' },
  { number: 6, title: 'Fase de selección', description: 'La empresa se contactará contigo para las entrevistas y pruebas finales.' }
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

onMounted(() => {
  cargarVacantes()
  cargarEstadisticas()
  cargarMisPostulaciones()
})
</script>

<style scoped>
.candidate-home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
}

/* Hero Search Section */
.hero-search-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-search-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
  background-size: cover;
  opacity: 0.2;
}

.hero-content {
  position: relative;
  z-index: 1;
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

.search-container {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.search-wrapper {
  background: white;
  border-radius: 60px;
  padding: 8px;
  display: flex;
  gap: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
}

.search-input-group {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon, .location-icon {
  position: absolute;
  left: 20px;
  color: #999;
  font-size: 1rem;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 45px;
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
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.location-select {
  width: 100%;
  padding: 14px 40px 14px 45px;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  color: #333;
  background: #f8f9fa;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s ease;
}

.location-select:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.select-arrow {
  position: absolute;
  right: 20px;
  color: #999;
  font-size: 0.8rem;
  pointer-events: none;
}

/* Stats Section */
.stats-section {
  padding: 50px 20px;
  background: white;
}

.stats-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  padding: 25px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.stat-icon {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.stats-users .stat-icon {
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #667eea;
}

.stats-jobs .stat-icon {
  background: linear-gradient(135deg, #f39c1220 0%, #e67e2220 100%);
  color: #f39c12;
}

.stats-companies .stat-icon {
  background: linear-gradient(135deg, #38b2ac20 0%, #31979520 100%);
  color: #38b2ac;
}

.stat-info {
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

/* Results Section */
.results-section {
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-header {
  text-align: center;
  margin-bottom: 30px;
}

.results-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.results-count {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-results {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.empty-results i {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 15px;
}

.empty-results p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 1rem;
}

.empty-results small {
  color: #999;
  font-size: 0.85rem;
}

/* Steps Section */
.steps-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
}

.section-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.step-card {
  background: white;
  padding: 25px;
  border-radius: 20px;
  display: flex;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.step-description {
  color: #666;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
}

/* Animations */
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

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-subtitle {
    font-size: 0.95rem;
  }
  
  .search-wrapper {
    flex-direction: column;
    border-radius: 20px;
    padding: 15px;
  }
  
  .search-input-group {
    width: 100%;
  }
  
  .search-input, .location-select {
    border-radius: 40px;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .results-title {
    font-size: 1.4rem;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
  }
  
  .step-card {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .hero-search-section {
    padding: 40px 20px 60px;
  }
  
  .hero-title {
    font-size: 1.4rem;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon {
    width: 55px;
    height: 55px;
    font-size: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.4rem;
  }
  
  .step-card {
    flex-direction: column;
    text-align: center;
  }
  
  .step-number {
    margin: 0 auto;
  }
}
</style>