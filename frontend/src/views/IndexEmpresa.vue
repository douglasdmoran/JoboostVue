<template>
  <div>
    <NavbarCompany />
    
    <main class="container">
      <section class="welcome-section" style="text-align: center; margin-top: 40px; margin-bottom: 50px;">
        <h1 style="font-size: 2.5rem; color: #1e293b; font-weight: bold;">Bienvenido al Panel de Reclutamiento</h1>
        <p style="color: #64748b; font-size: 1.1rem; margin-top: 10px;">Gestiona tus vacantes y encuentra al mejor talento para tu equipo.</p>
      </section>

      <!-- Stats Grid -->
      <section class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 50px;">
        <div class="stat-card" style="background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; color: #1d4ed8; margin-bottom: 10px;"><i class="fa-solid fa-briefcase"></i></div>
          <h3 style="font-size: 2rem; margin: 0; font-weight: bold;">{{ totalVacantesActivas }}</h3>
          <p style="color: #64748b; font-weight: 500;">Vacantes Activas</p>
        </div>
        <div class="stat-card" style="background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; color: #2ecc71; margin-bottom: 10px;"><i class="fa-solid fa-users"></i></div>
          <h3 style="font-size: 2rem; margin: 0; font-weight: bold;">{{ totalSolicitudes }}</h3>
          <p style="color: #64748b; font-weight: 500;">Solicitudes Recibidas</p>
        </div>
        <div class="stat-card" style="background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; color: #fecb00; margin-bottom: 10px;"><i class="fa-solid fa-star"></i></div>
          <h3 style="font-size: 2rem; margin: 0; font-weight: bold;">{{ promedioCalificacion }}</h3>
          <p style="color: #64748b; font-weight: 500;">Calificación Empresa</p>
        </div>
      </section>

      <!-- Options -->
      <section class="steps-section">
        <h2 style="text-align: center; margin-bottom: 40px; color: #1e293b; font-weight: bold; font-size: 1.8rem;">¿Qué deseas hacer hoy?</h2>
        
        <div class="steps-container" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
          <div @click="irAPublicar" class="step-card" style="flex: 1; min-width: 280px; background: white; padding: 30px; border-radius: 15px; border-bottom: 5px solid #1d4ed8; cursor: pointer; transition: transform 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background: #eff6ff; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1d4ed8; font-weight: bold; margin-bottom: 20px;">1</div>
            <h3 style="font-weight: bold; font-size: 1.1rem; color: #333;">Publicar Vacante</h3>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">Crea nuevas oportunidades laborales y llega a miles de candidatos.</p>
          </div>

          <div @click="irASolicitudes" class="step-card" style="flex: 1; min-width: 280px; background: white; padding: 30px; border-radius: 15px; border-bottom: 5px solid #2ecc71; cursor: pointer; transition: transform 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background: #f0fdf4; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2ecc71; font-weight: bold; margin-bottom: 20px;">2</div>
            <h3 style="font-weight: bold; font-size: 1.1rem; color: #333;">Revisar Solicitudes</h3>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">Evalúa los perfiles de los aplicantes y gestiona sus estados.</p>
          </div>

          <div @click="irAGestion" class="step-card" style="flex: 1; min-width: 280px; background: white; padding: 30px; border-radius: 15px; border-bottom: 5px solid #fecb00; cursor: pointer; transition: transform 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background: #fefce8; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fecb00; font-weight: bold; margin-bottom: 20px;">3</div>
            <h3 style="font-weight: bold; font-size: 1.1rem; color: #333;">Actualizar Perfil</h3>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">Mejora tu marca empleadora editando tu cultura y propósito.</p>
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

const router = useRouter()

const totalVacantesActivas = ref(0)
const totalSolicitudes = ref(0)
const promedioCalificacion = ref('4.5')

const irAPublicar = () => router.push('/empresa/publicar')
const irASolicitudes = () => router.push('/empresa/solicitudes')
const irAGestion = () => router.push('/empresa/gestion')

const cargarEstadisticas = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    router.push('/')
    return
  }
  
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return
  }
  
  // Mapear el usuario a la empresa correspondiente según nombre o correo
  let idEmpresa = 2 // Por defecto: Diana
  const email = (user.correo || user.email || '').toLowerCase()
  const name = (user.nombre || '').toLowerCase()
  if (email.includes('siman') || name.includes('siman')) {
    idEmpresa = 4
  } else if (email.includes('dollarcity') || name.includes('dollarcity') || email.includes('d-city')) {
    idEmpresa = 5
  } else if (email.includes('selectos') || name.includes('selectos')) {
    idEmpresa = 6
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
.step-card:hover {
  transform: translateY(-5px);
}
</style>
