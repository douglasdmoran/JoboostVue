<template>
  <div class="company-dashboard-page">
    <NavbarCompany />
    
    <main class="dashboard-main">
      <section class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">¡Bienvenido al Panel de Reclutamiento!</h1>
          <p class="welcome-subtitle">Gestiona tus vacantes y encuentra al mejor talento para tu equipo.</p>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card stat-card-primary">
            <div class="stat-icon">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ totalVacantesActivas }}</h3>
              <p class="stat-label">Vacantes Activas</p>
            </div>
          </div>

          <div class="stat-card stat-card-success">
            <div class="stat-icon">
              <i class="fa-solid fa-users"></i>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ totalSolicitudes }}</h3>
              <p class="stat-label">Solicitudes Recibidas</p>
            </div>
          </div>

          <div class="stat-card stat-card-warning">
            <div class="stat-icon">
              <i class="fa-solid fa-star"></i>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ promedioCalificacion }}</h3>
              <p class="stat-label">Calificación Empresa</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Options -->
      <section class="actions-section">
        <div class="section-header">
          <h2 class="section-title">¿Qué deseas hacer hoy?</h2>
          <p class="section-subtitle">Selecciona una opción para comenzar</p>
        </div>
        
        <div class="actions-grid">
          <div @click="irAPublicar" class="action-card action-card-primary">
            <div class="action-number">1</div>
            <div class="action-content">
              <h3 class="action-title">Publicar Vacante</h3>
              <p class="action-description">Crea nuevas oportunidades laborales y llega a miles de candidatos.</p>
            </div>
            <div class="action-arrow">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>

          <div @click="irASolicitudes" class="action-card action-card-success">
            <div class="action-number">2</div>
            <div class="action-content">
              <h3 class="action-title">Revisar Solicitudes</h3>
              <p class="action-description">Evalúa los perfiles de los aplicantes y gestiona sus estados.</p>
            </div>
            <div class="action-arrow">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>

          <div @click="irAGestion" class="action-card action-card-warning">
            <div class="action-number">3</div>
            <div class="action-content">
              <h3 class="action-title">Actualizar Perfil</h3>
              <p class="action-description">Mejora tu marca empleadora editando tu cultura y propósito.</p>
            </div>
            <div class="action-arrow">
              <i class="fa-solid fa-arrow-right"></i>
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
import { resolveEmpresaId } from '../utils/empresaUtils'

const router = useRouter()

const totalVacantesActivas = ref(0)
const totalSolicitudes = ref(0)
const promedioCalificacion = ref('4.5')

const irAPublicar = () => router.push('/empresa/publicar')
const irASolicitudes = () => router.push('/empresa/solicitudes')
const irAGestion = () => router.push('/empresa/gestion')

const cargarEstadisticas = async () => {
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
      totalVacantesActivas.value = misVacantes.length
      
      const idsMisVacantes = misVacantes.map(v => v.id_vacante)
      
      // 2. Cargar solicitudes/postulaciones vinculadas a esas vacantes
      const resPost = await fetch('http://localhost:3000/postulaciones')
      if (resPost.ok) {
        const postulaciones = await resPost.json()
        const misPostulaciones = postulaciones.filter(p => idsMisVacantes.includes(p.id_vacante))
        totalSolicitudes.value = misPostulaciones.length
      }
    }

    // 3. Cargar calificaciones/valoraciones de la empresa para calcular promedio
    const resVal = await fetch(`http://localhost:3000/valoraciones/buscarPorIdEmpresa/${idEmpresa}`)
    if (resVal.ok) {
      const valoraciones = await resVal.json()
      if (valoraciones.length > 0) {
        const sum = valoraciones.reduce((acc, curr) => acc + curr.calificacion, 0)
        promedioCalificacion.value = (sum / valoraciones.length).toFixed(1)
      } else {
        promedioCalificacion.value = '—'
      }
    }
  } catch (err) {
    console.error('Error al cargar estadísticas en dashboard empresa:', err)
  }
}

onMounted(() => {
  cargarEstadisticas()
})
</script>

<style scoped>
.company-dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 50px;
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
  padding: 50px 40px;
  border-radius: 30px;
  text-align: center;
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

/* Stats Section */
.stats-section {
  margin-bottom: 60px;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--color);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card:hover::before {
  transform: scaleX(1);
}

.stat-card-primary {
  --color: #667eea;
}

.stat-card-success {
  --color: #10b981;
}

.stat-card-warning {
  --color: #f59e0b;
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.stat-card-primary .stat-icon {
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #667eea;
}

.stat-card-success .stat-icon {
  background: linear-gradient(135deg, #10b98120 0%, #05966920 100%);
  color: #10b981;
}

.stat-card-warning .stat-icon {
  background: linear-gradient(135deg, #f59e0b20 0%, #d9770620 100%);
  color: #f59e0b;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 5px 0;
  color: #333;
}

.stat-card-primary .stat-number {
  color: #667eea;
}

.stat-card-success .stat-number {
  color: #10b981;
}

.stat-card-warning .stat-number {
  color: #f59e0b;
}

.stat-label {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Actions Section */
.actions-section {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 10px 0;
}

.section-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.action-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color) 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.action-card:hover::before {
  opacity: 0.05;
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.action-card-primary {
  --color: #667eea;
}

.action-card-success {
  --color: #10b981;
}

.action-card-warning {
  --color: #f59e0b;
}

.action-number {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.action-card-primary .action-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-card-success .action-number {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.action-card-warning .action-number {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.action-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.action-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.action-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.action-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.action-card-primary .action-arrow {
  color: #667eea;
}

.action-card-success .action-arrow {
  color: #10b981;
}

.action-card-warning .action-arrow {
  color: #f59e0b;
}

.action-card:hover .action-arrow {
  transform: translateX(5px);
  background: rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-main {
    padding: 20px 15px;
  }
  
  .welcome-title {
    font-size: 1.6rem;
  }
  
  .welcome-subtitle {
    font-size: 0.95rem;
  }
  
  .welcome-content {
    padding: 35px 25px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .action-card {
    padding: 25px;
  }
  
  .action-number {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
  
  .action-title {
    font-size: 1rem;
  }
  
  .action-description {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon {
    width: 55px;
    height: 55px;
    font-size: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .action-card {
    flex-wrap: wrap;
  }
  
  .action-arrow {
    width: 100%;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 0;
  }
  
  .action-card:hover .action-arrow {
    transform: translateX(0);
  }
}
</style>