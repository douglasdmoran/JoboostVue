<template>
  <div class="company-vacancies-page">
    <NavbarCompany />
    
    <main class="vacancies-main">
      <section class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">Estado de mis Vacantes Publicadas</h1>
          <p class="welcome-subtitle">Consulta las vacantes activas y el número de solicitudes recibidas</p>
        </div>
      </section>

      <!-- Vacancies & Solicitudes Summary -->
      <section class="vacancies-summary">
        <div class="vacancies-container">
          <div 
            v-for="vacante in listaVacantesResumen" 
            :key="vacante.id_vacante" 
            class="vacancy-card"
          >
            <div class="vacancy-info">
              <div class="vacancy-header">
                <h3 class="vacancy-title">{{ vacante.titulo }}</h3>
                <div class="vacancy-badge" :class="getStatusClass(vacante)">
                  <i class="fa-solid fa-circle"></i>
                  {{ getStatusText(vacante) }}
                </div>
              </div>
              <div class="vacancy-details">
                <span class="detail-item">
                  <i class="fa-solid fa-location-dot"></i>
                  {{ vacante.ubicacion || 'Sin especificar' }}
                </span>
                <span class="detail-separator">•</span>
                <span class="detail-item">
                  <i class="fa-solid fa-briefcase"></i>
                  {{ vacante.tipo_contrato || 'No especificado' }}
                </span>
                <span class="detail-separator">•</span>
                <span class="detail-item">
                  <i class="fa-solid fa-building"></i>
                  {{ vacante.modalidad || 'No especificada' }}
                </span>
              </div>
            </div>
            
            <div class="vacancy-stats">
              <div class="applications-count">
                <div class="count-number">{{ vacante.cantidad_solicitudes }}</div>
                <div class="count-label">
                  <i class="fa-solid fa-users"></i>
                  Solicitudes
                </div>
              </div>
              <router-link to="/empresa/solicitudes" class="btn-view-applicants">
                <i class="fa-solid fa-eye"></i>
                Ver Postulados
              </router-link>
            </div>
          </div>
          
          <div v-if="listaVacantesResumen.length === 0" class="empty-state">
            <i class="fa-solid fa-briefcase-slash"></i>
            <p>Aún no has publicado ninguna vacante</p>
            <small>¡Comienza creando una nueva oportunidad laboral!</small>
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
import { resolveEmpresaId } from '../utils/empresaUtils'

const router = useRouter()
const listaVacantesResumen = ref([])

const getStatusClass = (vacante) => {
  if (vacante.cantidad_solicitudes === 0) return 'status-low'
  if (vacante.cantidad_solicitudes < 10) return 'status-medium'
  return 'status-high'
}

const getStatusText = (vacante) => {
  if (vacante.cantidad_solicitudes === 0) return 'Sin solicitudes'
  if (vacante.cantidad_solicitudes < 10) return 'Pocas solicitudes'
  return 'Alta demanda'
}

const cargarDatos = async () => {
  const idEmpresa = await resolveEmpresaId()
  if (!idEmpresa) {
    router.push('/')
    return
  }

  try {
    // 1. Cargar vacantes de la empresa
    const resVac = await fetch('http://localhost:3000/vacantes')
    if (resVac.ok) {
      const vacantes = await resVac.json()
      const misVacantes = vacantes.filter(v => v.id_empresa === idEmpresa)
      
      const idsMisVacantes = misVacantes.map(v => v.id_vacante)
      
      // 2. Cargar solicitudes/postulaciones vinculadas a esas vacantes
      const resPost = await fetch('http://localhost:3000/postulaciones')
      if (resPost.ok) {
        const postulaciones = await resPost.json()
        const misPostulaciones = postulaciones.filter(p => idsMisVacantes.includes(p.id_vacante))
        
        // Calcular solicitudes por cada vacante
        listaVacantesResumen.value = misVacantes.map(v => {
          const solicitudesParaVacante = misPostulaciones.filter(p => p.id_vacante === v.id_vacante).length
          return {
            ...v,
            cantidad_solicitudes: solicitudesParaVacante
          }
        })
      }
    }
  } catch (err) {
    console.error('Error al cargar estado de vacantes:', err)
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.company-vacancies-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.vacancies-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Welcome Section */
.welcome-section {
  text-align: center;
  margin-bottom: 60px;
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

.welcome-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50px 30px;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

/* Vacancies Summary */
.vacancies-summary {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.vacancies-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vacancy-card {
  background: white;
  border-radius: 20px;
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;
}

.vacancy-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.vacancy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.15);
}

.vacancy-card:hover::before {
  width: 6px;
}

/* Vacancy Info */
.vacancy-info {
  flex: 2;
}

.vacancy-header {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.vacancy-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

.vacancy-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.vacancy-badge i {
  font-size: 0.6rem;
}

.status-low {
  background: #fef3c7;
  color: #d97706;
}

.status-medium {
  background: #dbeafe;
  color: #2563eb;
}

.status-high {
  background: #dcfce7;
  color: #16a34a;
}

.vacancy-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.detail-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.85rem;
}

.detail-item i {
  color: #667eea;
  font-size: 0.8rem;
}

.detail-separator {
  color: #cbd5e1;
}

/* Vacancy Stats */
.vacancy-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.applications-count {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 12px 20px;
  text-align: center;
  min-width: 100px;
  transition: all 0.3s ease;
}

.vacancy-card:hover .applications-count {
  background: linear-gradient(135deg, #f0f3ff 0%, #e8edff 100%);
}

.count-number {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 5px;
}

.count-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.count-label i {
  font-size: 0.7rem;
  color: #667eea;
}

.btn-view-applicants {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-view-applicants:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
  background: #fafbfc;
}

.empty-state i {
  font-size: 3.5rem;
  color: #cbd5e1;
  margin-bottom: 15px;
}

.empty-state p {
  margin: 10px 0 8px;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}

.empty-state small {
  color: #94a3b8;
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 768px) {
  .vacancies-main {
    padding: 20px 15px;
  }
  
  .welcome-title {
    font-size: 1.6rem;
  }
  
  .welcome-subtitle {
    font-size: 0.95rem;
  }
  
  .welcome-content {
    padding: 35px 20px;
  }
  
  .vacancy-card {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }
  
  .vacancy-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .vacancy-stats {
    justify-content: space-between;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e2e8f0;
  }
  
  .btn-view-applicants {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
  
  .applications-count {
    min-width: 80px;
    padding: 8px 15px;
  }
  
  .count-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .vacancy-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .detail-separator {
    display: none;
  }
  
  .vacancy-stats {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-view-applicants {
    width: 100%;
    justify-content: center;
  }
  
  .applications-count {
    width: 100%;
  }
}
</style>
