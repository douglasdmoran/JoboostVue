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
        <button class="btn-primary" style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-magnifying-glass"></i> Buscar Empresa
        </button>
      </section>

      <section class="companies-grid" id="valorar-companies-grid">
        <article 
          v-for="company in filteredCompanies" 
          :key="company.key"
          @click="irADetalle(company.key)" 
          class="company-card"
        >
          <div class="company-logo-box" :style="{ backgroundColor: company.color }">{{ company.logo }}</div>
          <div class="company-info">
            <h3 style="font-weight: bold; color: #333;">{{ company.nombre }}</h3>
            <div class="stars-yellow">
              <i v-for="n in 5" :key="n" :class="getStarClass(n, company.stars)"></i>
            </div>
            <small>{{ company.evaluacionesCount }} evaluaciones</small>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavbarCandidate from '../components/NavbarCandidate.vue'

const router = useRouter()
const searchQuery = ref('')

const companies = [
  {
    key: 'diana',
    nombre: 'Diana',
    logo: 'DIANA',
    color: '#f39c12',
    stars: 4.0,
    evaluacionesCount: 300
  },
  {
    key: 'siman',
    nombre: 'Siman',
    logo: 'SIMAN',
    color: '#c8102e',
    stars: 4.5,
    evaluacionesCount: 450
  },
  {
    key: 'dollarcity',
    nombre: 'Dollarcity',
    logo: 'D-CITY',
    color: '#005a32',
    stars: 4.0,
    evaluacionesCount: 120
  },
  {
    key: 'selectos',
    nombre: 'Súper Selectos',
    logo: 'S. SELECTOS',
    color: '#004a99',
    stars: 3.0,
    evaluacionesCount: 500
  }
]

const filteredCompanies = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return companies
  return companies.filter(c => c.nombre.toLowerCase().includes(query))
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

const irADetalle = (key) => {
  router.push(`/empresas/detalle/${key}`)
}
</script>

<style scoped>
</style>
