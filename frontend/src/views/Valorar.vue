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
          <div class="company-logo-box" :style="{ backgroundColor: generarColor(company.nombre) }">{{ generarLogo(company.nombre) }}</div>
          <div class="company-info">
            <h3 style="font-weight: bold; color: #333;">{{ company.nombre }}</h3>
            <div class="stars-yellow">
              <i v-for="n in 5" :key="n" :class="getStarClass(n, parseFloat(company.calificacion_promedio || 0))"></i>
            </div>
            <small>{{ company.ubicacion || 'Sin ubicación' }}</small>
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

// Genera un color determinístico basado en el nombre de la empresa
const generarColor = (nombre) => {
  const colores = ['#1e3a8a', '#c8102e', '#005a32', '#004a99', '#f39c12', '#6b21a8', '#0d6efd', '#dc3545', '#198754', '#e85d04']
  let hash = 0
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colores[Math.abs(hash) % colores.length]
}

// Genera un logo (iniciales o abreviatura) basado en el nombre
const generarLogo = (nombre) => {
  const words = nombre.trim().split(/\s+/)
  if (words.length === 1) {
    return nombre.substring(0, 3).toUpperCase()
  }
  return words.map(w => w[0]).join('').toUpperCase().substring(0, 4)
}

const irADetalle = (id) => {
  router.push(`/empresas/detalle/${id}`)
}
</script>

<style scoped>
</style>
