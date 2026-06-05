<template>
  <div class="companies-page">
    <NavbarCandidate />
    
    <main class="companies-main">
      <div class="companies-header">
        <h1 class="companies-title">Encuentra las mejores empresas para trabajar</h1>
        <p class="companies-subtitle">Explora opiniones y calificaciones de empleados reales en El Salvador</p>
      </div>

      <div class="search-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Buscar empresa por nombre (ej. Diana, Siman, Grupo Roble...)" 
              class="search-input"
            >
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="cargando" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Cargando empresas...</p>
      </div>

      <div v-else class="companies-grid">
        <div 
          v-for="company in filteredCompanies" 
          :key="company.id_empresa"
          @click="irADetalle(company.id_empresa)" 
          class="company-card"
        >
          <div class="company-logo-box" :style="{ backgroundColor: company.logo_url ? 'transparent' : generarColor(company.nombre) }">
            <img v-if="company.logo_url" :src="company.logo_url" alt="Logo de empresa" />
            <span v-else class="logo-text">{{ generarLogo(company.nombre) }}</span>
          </div>
          <div class="company-info">
            <h3 class="company-name">{{ company.nombre }}</h3>
            <div class="company-rating" v-if="parseFloat(company.calificacion_promedio || 0) > 0">
              <div class="stars-container">
                <i v-for="n in 5" :key="n" :class="getStarClass(n, parseFloat(company.calificacion_promedio || 0))" class="star-icon"></i>
              </div>
              <strong class="rating-value">{{ parseFloat(company.calificacion_promedio).toFixed(1) }}</strong>
            </div>
            <div v-else class="no-rating">
              <i class="fa-regular fa-star"></i>
              <span>Sin valoraciones aún</span>
            </div>
            <div class="company-location">
              <i class="fa-solid fa-location-dot"></i>
              <span>{{ company.ubicacion || 'Ubicación no especificada' }}</span>
            </div>
          </div>
          <div class="card-overlay">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <div v-if="filteredCompanies.length === 0" class="empty-state">
          <i class="fa-solid fa-building-circle-xmark"></i>
          <p>No se encontraron empresas con ese nombre</p>
          <small>Intenta con otros términos de búsqueda</small>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarCandidate from '../components/NavbarCandidate.vue'
import { generarLogo, generarColor } from '../utils/empresaUtils'

const router = useRouter()
const searchQuery = ref('')
const companies = ref([])
const cargando = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/empresas')
    if (response.ok) {
      companies.value = await response.json()
    }
  } catch (err) {
    console.error('Error cargando empresas:', err)
  } finally {
    cargando.value = false
  }
})

const filteredCompanies = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return companies.value
  return companies.value.filter(c => c.nombre.toLowerCase().includes(query))
})

const getStarClass = (n, stars) => {
  if (n <= Math.floor(stars)) {
    return 'fa-solid fa-star'
  } else if (n - 0.5 === stars) {
    return 'fa-solid fa-star-half-stroke'
  } else {
    return 'fa-regular fa-star'
  }
}

const irADetalle = (id) => {
  router.push(`/empresas/detalle/${id}`)
}
</script>

<style scoped>
.companies-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.companies-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.companies-header {
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

.companies-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
}

.companies-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.search-section {
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 18px;
  color: #999;
  font-size: 1rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 50px;
  border: 2px solid #e1e5e9;
  border-radius: 50px;
  font-size: 0.95rem;
  color: #333;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #bbb;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
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

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.company-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.company-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.company-card:hover .card-overlay {
  opacity: 1;
  transform: translateX(0);
}

.company-logo-box {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.company-logo-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.company-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stars-container {
  display: flex;
  gap: 2px;
}

.star-icon {
  color: #ffcc00;
  font-size: 0.85rem;
}

.rating-value {
  font-size: 0.9rem;
  color: #333;
}

.no-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #999;
  font-size: 0.8rem;
}

.company-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #888;
}

.company-location i {
  color: #667eea;
}

.card-overlay {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%) translateX(10px);
  opacity: 0;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  grid-column: 1 / -1;
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
  .companies-main {
    padding: 20px 15px;
  }
  
  .companies-title {
    font-size: 1.5rem;
  }
  
  .companies-subtitle {
    font-size: 0.85rem;
  }
  
  .companies-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .company-card {
    padding: 20px;
  }
  
  .company-logo-box {
    width: 65px;
    height: 65px;
  }
  
  .logo-text {
    font-size: 1.4rem;
  }
  
  .company-name {
    font-size: 1rem;
  }
  
  .card-overlay {
    display: none;
  }
}

@media (max-width: 480px) {
  .search-input {
    padding: 12px 15px 12px 45px;
    font-size: 0.85rem;
  }
  
  .search-icon {
    left: 15px;
    font-size: 0.85rem;
  }
  
  .company-card {
    flex-direction: column;
    text-align: center;
  }
  
  .company-logo-box {
    margin: 0 auto;
  }
  
  .company-rating {
    justify-content: center;
  }
  
  .company-location {
    justify-content: center;
  }
  
  .empty-state {
    padding: 50px 20px;
  }
  
  .empty-state i {
    font-size: 2.5rem;
  }
}
</style>