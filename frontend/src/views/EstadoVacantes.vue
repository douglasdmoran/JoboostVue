<template>
  <div>
    <NavbarCompany />
    
    <main class="container">
      <section class="welcome-section" style="text-align: center; margin-top: 40px; margin-bottom: 50px;">
        <h1 style="font-size: 2.5rem; color: #1e293b; font-weight: bold;">Estado de mis Vacantes Publicadas</h1>
        <p style="color: #64748b; font-size: 1.1rem; margin-top: 10px;">Consulta las vacantes activas y el número de solicitudes recibidas.</p>
      </section>

      <!-- Vacancies & Solicitudes Summary -->
      <section style="margin-bottom: 60px;">
        <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
          <div 
            v-for="vacante in listaVacantesResumen" 
            :key="vacante.id_vacante" 
            style="background: white; padding: 25px 30px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);"
          >
            <div>
              <h3 style="font-size: 1.2rem; font-weight: bold; color: #1e293b; margin-bottom: 8px;">{{ vacante.titulo }}</h3>
              <div style="display: flex; gap: 15px; color: #64748b; font-size: 0.9rem;">
                <span><i class="fa-solid fa-location-dot"></i> {{ vacante.ubicacion || 'Sin especificar' }}</span>
                <span>·</span>
                <span><i class="fa-solid fa-briefcase"></i> {{ vacante.tipo_contrato }} · {{ vacante.modalidad }}</span>
              </div>
            </div>
            <div style="text-align: right; display: flex; align-items: center; gap: 20px;">
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px 20px; border-radius: 8px; text-align: center;">
                <span style="display: block; font-size: 1.5rem; font-weight: bold; color: #15803d;">{{ vacante.cantidad_solicitudes }}</span>
                <span style="font-size: 0.75rem; color: #166534; font-weight: bold; text-transform: uppercase;">Solicitudes</span>
              </div>
              <router-link to="/empresa/solicitudes" class="btn-primary" style="padding: 10px 18px; font-size: 0.9rem; border-radius: 6px; text-decoration: none;">
                Ver Postulados
              </router-link>
            </div>
          </div>
          <p v-if="listaVacantesResumen.length === 0" style="color: #888; text-align: center; padding: 40px; border: 1px dashed #ccc; border-radius: 8px; background: #fafafa;">
            Aún no has publicado ninguna vacante. ¡Comienza creando una nueva oportunidad laboral!
          </p>
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
const listaVacantesResumen = ref([])

const cargarDatos = async () => {
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
</style>
