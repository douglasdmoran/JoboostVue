<template>
  <div class="company-management-page">
    <NavbarCompany />
    
    <main class="management-main">
      <section class="company-banner">
        <div class="banner-content">
          <div class="logo-container" :style="{ backgroundColor: logoColor }">
            <span class="logo-text">{{ logoTexto }}</span>
          </div>
          <div class="company-info">
            <h1 class="company-name">
              {{ nombreEmpresa }}
              <span class="rating-badge">
                <i class="fa-solid fa-star"></i>
                {{ promedioCalificacion }}
              </span>
            </h1>
            <p class="company-id">ID: {{ idEmpresa }}</p>
          </div>
        </div>
      </section>

      <nav class="tabs-container">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'tab-empresa' }" 
          @click="activeTab = 'tab-empresa'"
        >
          <i class="fa-solid fa-building"></i>
          Empresa
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'tab-ofertas' }" 
          @click="activeTab = 'tab-ofertas'"
        >
          <i class="fa-solid fa-briefcase"></i>
          Ofertas
          <span v-if="listaOfertas.length" class="tab-badge">{{ listaOfertas.length }}</span>
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'tab-evaluaciones' }" 
          @click="activeTab = 'tab-evaluaciones'"
        >
          <i class="fa-solid fa-star"></i>
          Evaluaciones
          <span v-if="listaEvaluaciones.length" class="tab-badge">{{ listaEvaluaciones.length }}</span>
        </button>
      </nav>

      <section class="content-container">
        <!-- Tab: Empresa -->
        <div v-if="activeTab === 'tab-empresa'" class="tab-panel fade-in">
          <div class="info-card">
            <div class="card-header">
              <div class="header-icon">
                <i class="fa-solid fa-users"></i>
              </div>
              <h3 class="card-title">Cultura Organizacional</h3>
              <button class="btn-edit-icon" @click="editarCultura" title="Editar cultura">
                <i class="fa-solid fa-pen"></i>
              </button>
            </div>
            <div class="card-content">
              <p class="info-text">{{ textoCultura }}</p>
              <div class="info-label">
                <i class="fa-solid fa-quote-left"></i>
                <span>¿Cómo es trabajar en {{ nombreEmpresa }}?</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="card-header">
              <div class="header-icon">
                <i class="fa-solid fa-bullseye"></i>
              </div>
              <h3 class="card-title">Propósito Corporativo</h3>
              <button class="btn-edit-icon" @click="editarProposito" title="Editar propósito">
                <i class="fa-solid fa-pen"></i>
              </button>
            </div>
            <div class="card-content">
              <p class="info-text">{{ textoProposito }}</p>
              <div class="info-label">
                <i class="fa-solid fa-flag-checkered"></i>
                <span>Nuestro Propósito</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Ofertas -->
        <div v-if="activeTab === 'tab-ofertas'" class="tab-panel fade-in">
          <div class="offers-header">
            <h3 class="section-title">
              <i class="fa-solid fa-briefcase"></i>
              Mis Vacantes Publicadas
            </h3>
            <span class="offers-count">{{ listaOfertas.length }} vacante(s) activa(s)</span>
          </div>
          
          <div class="offers-list">
            <div 
              v-for="vacante in listaOfertas" 
              :key="vacante.id_vacante" 
              class="offer-card"
            >
              <div class="offer-main-info">
                <h4 class="offer-title">{{ vacante.titulo }}</h4>
                <div class="offer-details">
                  <span class="detail-tag">
                    <i class="fa-solid fa-location-dot"></i>
                    {{ vacante.ubicacion || 'Sin especificar' }}
                  </span>
                  <span class="detail-tag">
                    <i class="fa-solid fa-briefcase"></i>
                    {{ vacante.tipo_contrato || 'No especificado' }}
                  </span>
                  <span class="detail-tag">
                    <i class="fa-solid fa-building"></i>
                    {{ vacante.modalidad || 'No especificada' }}
                  </span>
                </div>
                <div class="offer-status" :class="vacante.activa ? 'status-active' : 'status-inactive'">
                  <i class="fa-solid" :class="vacante.activa ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
                  {{ vacante.activa ? 'VACANTE ACTIVA' : 'VACANTE INACTIVA' }}
                </div>
              </div>
              
              <div class="offer-description">
                <h5 class="description-title">
                  <i class="fa-solid fa-file-alt"></i>
                  Descripción del Puesto
                </h5>
                <p class="description-text">{{ vacante.descripcion || 'Sin descripción disponible.' }}</p>
              </div>
              
              <div class="offer-actions">
                <button class="btn-edit-offer" @click="editarVacante(vacante)">
                  <i class="fa-solid fa-pen"></i>
                  Editar
                </button>
                <button class="btn-delete-offer" @click="eliminarVacante(vacante.id_vacante)">
                  <i class="fa-solid fa-trash"></i>
                  Eliminar
                </button>
              </div>
            </div>
            
            <div v-if="listaOfertas.length === 0" class="empty-state">
              <i class="fa-solid fa-briefcase-slash"></i>
              <p>No tienes vacantes publicadas en este momento.</p>
              <small>Comienza creando una nueva oportunidad laboral</small>
            </div>
          </div>
        </div>

        <!-- Tab: Evaluaciones -->
        <div v-if="activeTab === 'tab-evaluaciones'" class="tab-panel fade-in">
          <div class="reviews-header">
            <div>
              <h3 class="section-title">
                <i class="fa-solid fa-star"></i>
                Evaluaciones de Empleados
              </h3>
              <p class="reviews-subtitle">Opiniones y comentarios de quienes han trabajado aquí</p>
            </div>
            <div class="rating-summary" v-if="listaEvaluaciones.length > 0">
              <div class="summary-stars">
                <i v-for="n in 5" :key="n" :class="n <= Math.floor(promedioCalificacion) ? 'fa-solid fa-star' : (n - 0.5 === promedioCalificacion ? 'fa-solid fa-star-half-stroke' : 'fa-regular fa-star')" class="star-icon"></i>
              </div>
              <div class="summary-score">{{ promedioCalificacion }}</div>
              <div class="summary-count">{{ listaEvaluaciones.length }} evaluaciones</div>
            </div>
          </div>
          
          <div class="reviews-list">
            <div 
              v-for="evaluacion in listaEvaluaciones" 
              :key="evaluacion.id_valoracion" 
              class="review-card"
            >
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="review-stars">
                    <i v-for="n in 5" :key="n" :class="n <= evaluacion.calificacion ? 'fa-solid fa-star' : 'fa-regular fa-star'" class="star-icon"></i>
                  </div>
                  <span class="reviewer-role">{{ getCargoSimulado(evaluacion) }}</span>
                </div>
                <small class="review-date">
                  <i class="fa-regular fa-calendar"></i>
                  {{ formatearFecha(evaluacion.fecha_valoracion) }}
                </small>
              </div>
              <div class="review-content">
                <i class="fa-solid fa-quote-left quote-icon"></i>
                <p>{{ evaluacion.comentario }}</p>
              </div>
            </div>
            
            <div v-if="listaEvaluaciones.length === 0" class="empty-state">
              <i class="fa-regular fa-comment-dots"></i>
              <p>Aún no hay evaluaciones para tu empresa.</p>
              <small>Las evaluaciones aparecerán aquí cuando los empleados compartan su experiencia</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarCompany from '../components/NavbarCompany.vue'
import { resolveEmpresaId, generarLogo, generarColor } from '../utils/empresaUtils'

const router = useRouter()

const activeTab = ref('tab-empresa')

const logoTexto = ref('')
const logoColor = ref('#667eea')
const nombreEmpresa = ref('')
const promedioCalificacion = ref('0')
let idEmpresa = null
let empresaRecord = null

const textoCultura = ref('Nuestra cultura se basa en el trabajo en equipo, la innovación constante y el desarrollo profesional de nuestros colaboradores. Buscamos siempre la excelencia en cada acción.')
const textoProposito = ref('Nuestro propósito es generar valor para nuestros clientes, colaboradores y la sociedad, impulsando el crecimiento sostenible y el bienestar de la comunidad.')

const listaOfertas = ref([])
const listaEvaluaciones = ref([])

const formatearFecha = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getCargoSimulado = (evaluacion) => {
  const comentariosCargos = {
    'programador': 'Programador BackEnd',
    'backend': 'Programador BackEnd',
    'frontend': 'Programador FrontEnd',
    'montacargas': 'Montacarguista',
    'montacarguista': 'Montacarguista',
    'rrhh': 'Analista de Reclutamiento',
    'recursos humanos': 'Analista de Reclutamiento',
    'ventas': 'Asesor de Ventas',
    'marketing': 'Especialista en Marketing',
    'contabilidad': 'Contador',
    'administracion': 'Asistente Administrativo'
  }
  const comment = (evaluacion.comentario || '').toLowerCase()
  for (const [key, val] of Object.entries(comentariosCargos)) {
    if (comment.includes(key)) return val
  }
  return 'Colaborador'
}

const cargarDatos = async () => {
  const resolved = await resolveEmpresaId()
  if (!resolved) {
    router.push('/')
    return
  }
  idEmpresa = resolved

  try {
    // 1. Cargar datos de la empresa (cultura, proposito)
    const resEmp = await fetch(`http://localhost:3000/empresas`)
    if (resEmp.ok) {
      const empresas = await resEmp.json()
      empresaRecord = empresas.find(e => e.id_empresa === idEmpresa)
      if (empresaRecord) {
        nombreEmpresa.value = empresaRecord.nombre
        logoTexto.value = generarLogo(empresaRecord.nombre)
        logoColor.value = generarColor(empresaRecord.nombre)

        const desc = empresaRecord.descripcion || ''
        
        const culturaMatch = desc.match(/\[CULTURA\]([\s\S]*?)(?:\[PROPOSITO\]|$)/)
        const propositoMatch = desc.match(/\[PROPOSITO\]([\s\S]*?)$/)
        
        if (culturaMatch && culturaMatch[1].trim()) {
          textoCultura.value = culturaMatch[1].trim()
        }
        if (propositoMatch && propositoMatch[1].trim()) {
          textoProposito.value = propositoMatch[1].trim()
        }
      }
    }

    // 2. Cargar calificaciones y calcular promedio
    const resVal = await fetch(`http://localhost:3000/valoraciones/buscarPorIdEmpresa/${idEmpresa}`)
    if (resVal.ok) {
      listaEvaluaciones.value = await resVal.json()
      if (listaEvaluaciones.value.length > 0) {
        const sum = listaEvaluaciones.value.reduce((acc, curr) => acc + curr.calificacion, 0)
        promedioCalificacion.value = (sum / listaEvaluaciones.value.length).toFixed(1)
      } else {
        promedioCalificacion.value = '0'
      }
    }

    // 3. Cargar vacantes de la empresa
    const resVac = await fetch(`http://localhost:3000/vacantes`)
    if (resVac.ok) {
      const vacantes = await resVac.json()
      listaOfertas.value = vacantes.filter(v => v.id_empresa === idEmpresa)
    }

  } catch (err) {
    console.error('Error cargando gestión de empresa:', err)
  }
}

const guardarCulturaProposito = async () => {
  if (!empresaRecord) return
  try {
    const nuevaDesc = `[CULTURA] ${textoCultura.value} [PROPOSITO] ${textoProposito.value}`
    const res = await fetch(`http://localhost:3000/empresas/${idEmpresa}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: empresaRecord.nombre,
        descripcion: nuevaDesc,
        ubicacion: empresaRecord.ubicacion,
        sitio_web: empresaRecord.sitio_web,
        calificacion_promedio: parseFloat(promedioCalificacion.value) || 0
      })
    })
    if (res.ok) {
      const data = await res.json()
      empresaRecord = data
    }
  } catch (err) {
    console.error('Error al guardar cultura y propósito:', err)
  }
}

const editarCultura = () => {
  const nuevoText = prompt(`Edita la cultura organizacional de ${nombreEmpresa.value}:`, textoCultura.value)
  if (nuevoText !== null && nuevoText.trim() !== '') {
    textoCultura.value = nuevoText.trim()
    guardarCulturaProposito()
  }
}

const editarProposito = () => {
  const nuevoText = prompt('Edita el propósito corporativo:', textoProposito.value)
  if (nuevoText !== null && nuevoText.trim() !== '') {
    textoProposito.value = nuevoText.trim()
    guardarCulturaProposito()
  }
}

const editarVacante = (vacante) => {
  router.push({ path: '/empresa/publicar', query: { edit: vacante.id_vacante } })
}

const eliminarVacante = async (idVacante) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta vacante?')) return
  try {
    const res = await fetch(`http://localhost:3000/vacantes/${idVacante}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      alert('Vacante eliminada con éxito.')
      cargarDatos()
    } else {
      alert('Error al eliminar la vacante.')
    }
  } catch (err) {
    console.error('Error al eliminar vacante:', err)
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.company-management-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.management-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Banner */
.company-banner {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.logo-container {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 3px solid #fecb00;
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  font-style: italic;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 1rem;
  color: #d97706;
  -webkit-text-fill-color: #d97706;
}

.rating-badge i {
  color: #fecb00;
}

.company-id {
  color: #666;
  font-size: 0.85rem;
  margin: 0;
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 8px;
  padding: 8px;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
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

/* Content Container */
.content-container {
  background: white;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.tab-panel {
  animation: fadeIn 0.4s ease-out;
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

/* Info Cards */
.info-card {
  background: #fafbfc;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  border: 1px solid #eef2f6;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.header-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon i {
  color: #667eea;
  font-size: 1.2rem;
}

.card-title {
  flex: 1;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.btn-edit-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #666;
}

.btn-edit-icon:hover {
  background: #e8e8e8;
  color: #667eea;
  transform: scale(1.05);
}

.card-content {
  padding-left: 52px;
}

.info-text {
  color: #555;
  line-height: 1.7;
  margin: 0 0 15px 0;
  white-space: pre-wrap;
}

.info-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  color: #667eea;
  border: 1px solid #e1e5e9;
}

.info-label i {
  font-size: 0.7rem;
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

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #667eea;
}

.offers-count {
  background: #f0f3ff;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
}

.offers-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.offer-card {
  background: #fafbfc;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 25px;
  transition: all 0.3s ease;
}

.offer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.offer-main-info {
  margin-bottom: 20px;
}

.offer-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.offer-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.detail-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #666;
}

.detail-tag i {
  color: #667eea;
}

.offer-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.status-active {
  background: #dcfce7;
  color: #16a34a;
}

.status-inactive {
  background: #fee2e2;
  color: #dc2626;
}

.offer-description {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  border-left: 3px solid #667eea;
}

.description-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #667eea;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.description-text {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.offer-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-edit-offer, .btn-delete-offer {
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.btn-edit-offer {
  background: white;
  border: 1px solid #667eea;
  color: #667eea;
}

.btn-edit-offer:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.btn-delete-offer {
  background: white;
  border: 1px solid #dc2626;
  color: #dc2626;
}

.btn-delete-offer:hover {
  background: #dc2626;
  color: white;
  transform: translateY(-2px);
}

/* Reviews Section */
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 20px;
}

.reviews-subtitle {
  color: #666;
  font-size: 0.85rem;
  margin: 5px 0 0 0;
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
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.summary-count {
  font-size: 0.75rem;
  color: #888;
}

.reviews-list {
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
  transform: translateX(5px);
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

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-stars {
  display: flex;
  gap: 2px;
}

.reviewer-role {
  font-size: 0.85rem;
  font-weight: 600;
  color: #667eea;
  background: #f0f3ff;
  padding: 4px 12px;
  border-radius: 20px;
}

.review-date {
  color: #999;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 5px;
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
  opacity: 0.4;
  font-size: 0.9rem;
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

/* Star Icons */
.star-icon {
  color: #fecb00;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .management-main {
    padding: 20px 15px;
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .company-name {
    justify-content: center;
  }
  
  .tabs-container {
    flex-direction: column;
  }
  
  .content-container {
    padding: 20px;
  }
  
  .card-content {
    padding-left: 0;
  }
  
  .offer-card {
    padding: 20px;
  }
  
  .offer-actions {
    justify-content: center;
  }
  
  .reviews-header {
    flex-direction: column;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .company-name {
    font-size: 1.5rem;
  }
  
  .logo-container {
    width: 80px;
    height: 80px;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
  
  .offer-details {
    flex-direction: column;
    gap: 8px;
  }
  
  .offer-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-edit-offer, .btn-delete-offer {
    width: 100%;
    text-align: center;
  }
}
</style>