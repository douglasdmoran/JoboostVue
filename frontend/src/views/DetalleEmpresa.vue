<template>
  <div class="company-detail-page">
    <NavbarCandidate />
    
    <main class="company-main" v-if="companyData">
      <!-- Banner -->
      <section class="company-banner-section">
        <div class="company-banner">
          <div class="company-logo-container">
            <div class="company-logo-box" :style="{ backgroundColor: companyData.logo_url ? 'white' : companyData.color }">
              <img v-if="companyData.logo_url" :src="companyData.logo_url" alt="Logo de empresa" />
              <span v-else class="logo-text">{{ companyData.logo }}</span>
            </div>
          </div>
          <div class="company-info">
            <h1 class="company-name">{{ companyData.nombre }}</h1>
            <p class="company-industry">{{ companyData.rubro }}</p>
            <div class="company-rating" v-if="promedioCalificacion > 0">
              <div class="stars-container">
                <i v-for="n in 5" :key="n" :class="getStarClass(n, promedioCalificacion)" class="star-icon"></i>
                <span class="rating-value">{{ promedioCalificacion.toFixed(1) }}</span>
              </div>
              <span class="rating-count">({{ listaEvaluaciones.length }} evaluaciones)</span>
            </div>
            <div v-else class="no-rating">
              <i class="fa-regular fa-star"></i>
              <span>Sin valoraciones aún</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabs Navigation -->
      <div class="tabs-container">
        <div class="tabs-wrapper">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'empresa' }"
            @click="activeTab = 'empresa'"
          >
            <i class="fa-solid fa-building"></i>
            Empresa
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'ofertas' }"
            @click="activeTab = 'ofertas'"
          >
            <i class="fa-solid fa-briefcase"></i>
            Ofertas de Empleo
            <span v-if="listaOfertas.length" class="tab-badge">{{ listaOfertas.length }}</span>
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'evaluaciones' }"
            @click="activeTab = 'evaluaciones'"
          >
            <i class="fa-solid fa-star"></i>
            Evaluaciones
            <span v-if="listaEvaluaciones.length" class="tab-badge">{{ listaEvaluaciones.length }}</span>
          </button>
        </div>
      </div>

      <!-- Tab Content: Empresa -->
      <div v-if="activeTab === 'empresa'" class="tab-content fade-in">
        <div class="company-description">
          <h3 class="section-title">
            <i class="fa-solid fa-info-circle"></i>
            Acerca de {{ companyData.nombre }}
          </h3>
          <p class="description-text">{{ companyData.info }}</p>
        </div>
        
        <div class="work-experience-section">
          <label class="work-checkbox">
            <input type="checkbox" v-model="heTrabajado">
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">
              <i class="fa-solid fa-briefcase"></i>
              ¿Has trabajado en esta empresa? ¡Queremos conocer tu opinión!
            </span>
          </label>
        </div>

        <!-- Rating Form -->
        <div v-if="heTrabajado" class="rating-form slide-down">
          <h4 class="form-title">
            <i class="fa-solid fa-pen-fancy"></i>
            Deja tu evaluación
          </h4>
          <form @submit.prevent="publicarEvaluacion" class="rating-form-content">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-star"></i>
                Calificación
              </label>
              <div class="star-rating-select">
                <select v-model="ratingStars" class="star-select" required>
                  <option value="5">⭐⭐⭐⭐⭐ - Excelente</option>
                  <option value="4">⭐⭐⭐⭐ - Buena</option>
                  <option value="3">⭐⭐⭐ - Regular</option>
                  <option value="2">⭐⭐ - Mala</option>
                  <option value="1">⭐ - Pésima</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-comment"></i>
                Comentario
              </label>
              <textarea 
                v-model="ratingComment" 
                rows="4" 
                placeholder="Comparte tu experiencia trabajando en esta empresa..."
                class="form-textarea"
                required
              ></textarea>
            </div>

            <div v-if="estadoEvaluacion" class="status-message" :class="{ success: estadoEvaluacion.includes('publicada') }">
              <i :class="estadoEvaluacion.includes('publicada') ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info'"></i>
              {{ estadoEvaluacion }}
            </div>

            <button type="submit" class="btn-submit-rating">
              <i class="fa-solid fa-paper-plane"></i>
              Publicar Evaluación
            </button>
          </form>
        </div>
      </div>

      <!-- Tab Content: Ofertas -->
      <div v-if="activeTab === 'ofertas'" class="tab-content fade-in">
        <div class="offers-header">
          <h3 class="section-title">
            <i class="fa-solid fa-briefcase"></i>
            Ofertas de Empleo en {{ companyData.nombre }}
          </h3>
          <span class="offers-count">{{ listaOfertas.length }} vacante(s) disponible(s)</span>
        </div>
        
        <div class="offers-grid">
          <JobCard 
            v-for="vacante in listaOfertas" 
            :key="vacante.id_vacante" 
            :vacante="vacante" 
          />
          <div v-if="listaOfertas.length === 0" class="empty-state">
            <i class="fa-solid fa-briefcase-slash"></i>
            <p>No hay vacantes publicadas en este momento.</p>
            <small>Revisa más tarde para nuevas oportunidades</small>
          </div>
        </div>
      </div>

      <!-- Tab Content: Evaluaciones -->
      <div v-if="activeTab === 'evaluaciones'" class="tab-content fade-in">
        <div class="reviews-header">
          <div>
            <h3 class="section-title">
              <i class="fa-solid fa-star"></i>
              Opiniones de Empleados
            </h3>
            <p class="reviews-subtitle">Lo que dicen los empleados sobre {{ companyData.nombre }}</p>
          </div>
          <div v-if="promedioCalificacion > 0" class="rating-summary">
            <div class="summary-stars">
              <i v-for="n in 5" :key="n" :class="getStarClass(n, promedioCalificacion)" class="star-icon"></i>
            </div>
            <div class="summary-score">{{ promedioCalificacion.toFixed(1) }}</div>
            <div class="summary-count">{{ listaEvaluaciones.length }} evaluaciones</div>
          </div>
        </div>
        
        <div class="reviews-grid">
          <div 
            v-for="evaluacion in listaEvaluaciones" 
            :key="evaluacion.id_valoracion" 
            class="review-card"
          >
            <div class="review-header">
              <div class="review-stars">
                <i v-for="n in 5" :key="n" :class="n <= evaluacion.calificacion ? 'fa-solid fa-star' : 'fa-regular fa-star'" class="star-icon"></i>
              </div>
              <small class="review-date">{{ formatearFecha(evaluacion.fecha_valoracion) }}</small>
            </div>
            <div class="review-content">
              <i class="fa-solid fa-quote-left quote-icon"></i>
              <p>"{{ evaluacion.comentario }}"</p>
            </div>
          </div>
          <div v-if="listaEvaluaciones.length === 0" class="empty-state">
            <i class="fa-regular fa-comment-dots"></i>
            <p>Aún no hay evaluaciones para esta empresa.</p>
            <small>Sé el primero en compartir tu experiencia</small>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarCandidate from '../components/NavbarCandidate.vue'
import JobCard from '../components/JobCard.vue'
import { generarLogo, generarColor } from '../utils/empresaUtils'

const route = useRoute()
const router = useRouter()

const activeTab = ref('empresa')
const heTrabajado = ref(false)
const ratingStars = ref('5')
const ratingComment = ref('')
const estadoEvaluacion = ref('')

const listaOfertas = ref([])
const listaEvaluaciones = ref([])

const promedioCalificacion = computed(() => {
  if (listaEvaluaciones.value.length === 0) return 0
  const total = listaEvaluaciones.value.reduce((sum, item) => sum + item.calificacion, 0)
  return parseFloat((total / listaEvaluaciones.value.length).toFixed(1))
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

const companyKey = computed(() => {
  return route.params.key || route.query.empresa || 'diana'
})

const companyData = ref(null)

const loadCompany = async () => {
  const key = companyKey.value
  try {
    const response = await fetch('http://localhost:3000/empresas')
    if (response.ok) {
      const empresas = await response.json()
      let empresa = null
      
      const parsedId = parseInt(key, 10)
      if (!isNaN(parsedId)) {
        empresa = empresas.find(e => e.id_empresa === parsedId)
      } else {
        // Fallback para claves string antiguas como 'diana', 'siman', etc.
        empresa = empresas.find(e => e.nombre.toLowerCase().includes(key.toLowerCase()))
      }
      
      if (empresa) {
        // Parsear rubro y descripción limpia
        let rubro = 'Empresa'
        let info = empresa.descripcion || ''
        
        // Si tiene la estructura [CULTURA] ... [PROPOSITO]
        const culturaMatch = info.match(/\[CULTURA\]([\s\S]*?)(?:\[PROPOSITO\]|$)/)
        const propositoMatch = info.match(/\[PROPOSITO\]([\s\S]*?)$/)
        
        if (culturaMatch || propositoMatch) {
          info = ''
          if (culturaMatch && culturaMatch[1].trim()) {
            info += `Nuestra cultura:\n${culturaMatch[1].trim()}\n\n`
          }
          if (propositoMatch && propositoMatch[1].trim()) {
            info += `Nuestro propósito:\n${propositoMatch[1].trim()}`
          }
        } else {
          const sectorMatch = info.match(/Sector:\s*([^.\n]+)/i)
          if (sectorMatch) {
            rubro = sectorMatch[1].trim()
          }
          info = info.replace(/Sector:\s*[^.\n]+(?:[.\n]|$)/i, '')
          info = info.replace(/Email:\s*[^\s.]+(?:\s|$)/i, '')
          info = info.replace(/Tel:\s*[^\s.]+(?:\s|$)/i, '')
          info = info.trim() || 'Sin descripción disponible.'
        }
        
        companyData.value = {
          id_db: empresa.id_empresa,
          nombre: empresa.nombre,
          rubro: rubro,
          color: generarColor(empresa.nombre),
          logo: generarLogo(empresa.nombre),
          logo_url: empresa.logo_url || '',
          info: info
        }
      }
    }
  } catch (e) {
    console.error('Error cargando detalle de empresa:', e)
  }
}

const formatearFecha = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })
}

const cargarOfertas = async () => {
  if (!companyData.value) return
  try {
    const response = await fetch('http://localhost:3000/vacantes')
    if (response.ok) {
      const all = await response.json()
      listaOfertas.value = all.filter(v => v.id_empresa === companyData.value.id_db)
    }
  } catch (e) {
    console.error(e)
  }
}

const cargarEvaluaciones = async () => {
  if (!companyData.value) return
  try {
    const response = await fetch(`http://localhost:3000/valoraciones/buscarPorIdEmpresa/${companyData.value.id_db}`)
    if (response.ok) {
      listaEvaluaciones.value = await response.json()
    }
  } catch (e) {
    console.error(e)
  }
}

const publicarEvaluacion = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    alert('Debes iniciar sesión para publicar una evaluación.')
    router.push('/')
    return
  }
  
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return
  }
  
  if (!user || !user.id_usuario) return

  estadoEvaluacion.value = 'Publicando...'

  try {
    const response = await fetch('http://localhost:3000/valoraciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_empresa: companyData.value.id_db,
        calificacion: parseInt(ratingStars.value),
        comentario: ratingComment.value.trim()
      })
    })

    if (!response.ok) throw new Error('Error al publicar')
    
    estadoEvaluacion.value = '¡Evaluación publicada!'
    setTimeout(() => {
      ratingComment.value = ''
      heTrabajado.value = false
      estadoEvaluacion.value = ''
      cargarEvaluaciones()
    }, 1500)
  } catch (err) {
    console.error(err)
    estadoEvaluacion.value = 'Error al publicar evaluación.'
  }
}

const loadAll = async () => {
  await loadCompany()
  if (companyData.value) {
    cargarOfertas()
    cargarEvaluaciones()
  }
}

onMounted(() => {
  loadAll()
})

watch(companyKey, () => {
  loadAll()
})
</script>

<style scoped>
.company-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.company-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Banner Section */
.company-banner-section {
  background: white;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.company-banner-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.company-banner {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.company-logo-container {
  flex-shrink: 0;
}

.company-logo-box {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.company-logo-box:hover {
  transform: scale(1.05);
}

.company-logo-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-text {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
}

.company-industry {
  color: #666;
  font-size: 1rem;
  margin: 0 0 12px 0;
}

.company-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stars-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-icon {
  color: #ffcc00;
  font-size: 1rem;
}

.rating-value {
  font-weight: 700;
  color: #333;
  margin-left: 8px;
  font-size: 1.1rem;
}

.rating-count {
  color: #888;
  font-size: 0.85rem;
}

.no-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 0.9rem;
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.tabs-wrapper {
  display: flex;
  gap: 8px;
  padding: 8px;
  min-width: max-content;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.tab-btn i {
  font-size: 1rem;
}

.tab-btn:hover {
  background: #f0f3ff;
  color: #667eea;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.tab-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Tab Content */
.tab-content {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #667eea;
}

/* Company Description */
.company-description {
  margin-bottom: 30px;
}

.description-text {
  color: #555;
  line-height: 1.8;
  font-size: 1rem;
  white-space: pre-line;
}

/* Work Experience Section */
.work-experience-section {
  border-top: 1px solid #eef2f6;
  padding-top: 30px;
}

.work-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.work-checkbox input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 6px;
  display: inline-block;
  position: relative;
  transition: all 0.3s ease;
}

.work-checkbox input:checked + .checkbox-custom {
  background: #667eea;
  border-color: #667eea;
}

.work-checkbox input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

.checkbox-text {
  color: #555;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Rating Form */
.rating-form {
  margin-top: 25px;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #eef2f6;
}

.slide-down {
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-weight: 500;
  font-size: 0.85rem;
}

.form-label i {
  color: #667eea;
}

.star-select {
  padding: 10px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.star-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  padding: 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.status-message {
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e3f2fd;
  color: #1976d2;
}

.status-message.success {
  background: #e8f5e9;
  color: #388e3c;
}

.btn-submit-rating {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  transition: all 0.3s ease;
}

.btn-submit-rating:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Offers Section */
.offers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.offers-count {
  background: #f0f3ff;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
}

.offers-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Reviews Section */
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.reviews-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}

.rating-summary {
  text-align: center;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
  padding: 15px 25px;
  border-radius: 16px;
  border: 1px solid #eef2f6;
}

.summary-stars {
  margin-bottom: 5px;
}

.summary-score {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.summary-count {
  font-size: 0.75rem;
  color: #888;
}

.reviews-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  background: #fafbfc;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 25px;
  transition: all 0.3s ease;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.review-stars {
  display: flex;
  gap: 2px;
}

.review-date {
  color: #999;
  font-size: 0.75rem;
}

.review-content {
  position: relative;
  padding-left: 30px;
}

.quote-icon {
  position: absolute;
  left: 0;
  top: 0;
  color: #667eea;
  opacity: 0.5;
  font-size: 1rem;
}

.review-content p {
  margin: 0;
  color: #555;
  line-height: 1.6;
  font-style: italic;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 15px;
}

.empty-state p {
  margin: 10px 0 8px;
  font-size: 0.9rem;
}

.empty-state small {
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 768px) {
  .company-main {
    padding: 20px 15px;
  }
  
  .company-banner-section {
    padding: 25px;
  }
  
  .company-banner {
    flex-direction: column;
    text-align: center;
  }
  
  .company-info {
    text-align: center;
  }
  
  .company-rating {
    justify-content: center;
  }
  
  .tab-content {
    padding: 25px;
  }
  
  .offers-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .reviews-header {
    flex-direction: column;
  }
  
  .rating-summary {
    width: 100%;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .btn-submit-rating {
    width: 100%;
    justify-content: center;
  }
}
</style>