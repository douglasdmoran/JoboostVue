<template>
  <div>
    <NavbarCandidate />
    
    <main class="container">
      <h1 style="font-size: 2.2rem; margin-bottom: 10px; font-weight: bold; color: #333;">Encuentra las mejores empresas para trabajar</h1>
      <p style="color: #666; margin-bottom: 30px;">Explora opiniones y calificaciones de empleados reales en El Salvador.</p>

      <section class="search-bar-container" style="display: flex; gap: 20px; margin-bottom: 40px;">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Nombre de la empresa (ej. Diana, Siman...)" 
          style="flex: 1; padding: 15px; border: 1px solid #ddd; border-radius: 8px; outline: none; font-size: 1rem;"
        >
      </section>

      <!-- Loading state -->
      <p v-if="cargando" style="text-align: center; color: #888; font-size: 1.1rem; padding: 40px 0;">
        <i class="fa-solid fa-spinner fa-spin"></i> Cargando empresas...
      </p>

      <section v-else class="companies-grid" id="valorar-companies-grid">
        <article 
          v-for="company in filteredCompanies" 
          :key="company.id_empresa"
          @click="irADetalle(company.id_empresa)" 
          class="company-card"
        >
          <div class="company-logo-box" :style="{ backgroundColor: company.logo_url ? 'transparent' : generarColor(company.nombre) }">
            <img v-if="company.logo_url" :src="company.logo_url" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />
            <span v-else>{{ generarLogo(company.nombre) }}</span>
          </div>
          <div class="company-info">
            <h3>{{ company.nombre }}</h3>
            <div class="stars-yellow" v-if="parseFloat(company.calificacion_promedio || 0) > 0">
              <i v-for="n in 5" :key="n" :class="getStarClass(n, parseFloat(company.calificacion_promedio || 0))" style="color: #ffcc00; margin-right: 2px;"></i>
              <strong>{{ parseFloat(company.calificacion_promedio).toFixed(1) }}</strong>
            </div>
            <p v-else class="no-ratings">Sin valoraciones aún</p>
            <small><i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i>{{ company.ubicacion || 'Sin ubicación' }}</small>
          </div>
        </article>

        <p v-if="filteredCompanies.length === 0" style="color:#888; grid-column: 1 / -1; text-align: center; padding: 20px; font-size: 1.1rem;">
          No se encontraron empresas con ese nombre.
        </p>
      </section>
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
</style>
