<template>
  <div class="requests-page">
    <NavbarCompany />
    
    <main class="requests-main">
      <div class="requests-header">
        <h1 class="requests-title">Solicitudes Recibidas</h1>
        <p class="requests-subtitle">Gestiona las postulaciones de los candidatos a tus vacantes</p>
      </div>

      <section class="requests-list">
        
        <article 
          v-for="solicitud in listaSolicitudes" 
          :key="solicitud.id_postulacion"
          class="request-card"
        >
          <div class="request-header">
            <div class="candidate-avatar">
              <i class="fa-solid fa-user-circle"></i>
            </div>
            <div class="candidate-basic-info">
              <h4 class="candidate-name">{{ solicitud.usuario_nombre }}</h4>
              <div class="candidate-details">
                <span class="detail-item">
                  <i class="fa-solid fa-location-dot"></i>
                  {{ solicitud.ubicacion || 'San Salvador, El Salvador' }}
                </span>
                <span class="detail-item">
                  <i class="fa-solid fa-briefcase"></i>
                  {{ solicitud.tipo_contrato_label || 'Tiempo completo' }}
                </span>
              </div>
            </div>
            <div class="vacancy-badge">
              <i class="fa-solid fa-tag"></i>
              {{ solicitud.vacante_titulo }}
            </div>
          </div>

          <div class="request-body">
            <div class="functions-section">
              <h5 class="section-subtitle">
                <i class="fa-solid fa-file-alt"></i>
                Descripción del Puesto
              </h5>
              <p class="functions-text">{{ solicitud.vacante_descripcion }}</p>
            </div>

            <div class="actions-section">
              <div v-if="solicitud.estado === 'postulado'" class="action-buttons">
                <button 
                  @click="actualizarEstado(solicitud.id_postulacion, 'aceptado')" 
                  class="btn-accept"
                >
                  <i class="fa-solid fa-check-circle"></i>
                  Aceptar Solicitud
                </button>
                <button 
                  @click="actualizarEstado(solicitud.id_postulacion, 'denegado')" 
                  class="btn-reject"
                >
                  <i class="fa-solid fa-times-circle"></i>
                  Denegar Solicitud
                </button>
              </div>
              
              <div v-else class="status-container">
                <div 
                  class="status-badge"
                  :class="solicitud.estado === 'aceptado' ? 'status-accepted' : 'status-rejected'"
                >
                  <i :class="solicitud.estado === 'aceptado' ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i>
                  {{ solicitud.estado === 'aceptado' ? 'Solicitud Aceptada' : 'Solicitud Denegada' }}
                </div>
              </div>
            </div>
          </div>

          <div class="request-footer">
            <small class="request-date">
              <i class="fa-regular fa-calendar"></i>
              Postulación recibida
            </small>
          </div>
        </article>

        <div v-if="listaSolicitudes.length === 0" class="empty-state">
          <i class="fa-solid fa-inbox"></i>
          <p>No se han recibido solicitudes para tus vacantes en este momento</p>
          <small>Las postulaciones aparecerán aquí cuando los candidatos apliquen a tus ofertas</small>
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

const listaSolicitudes = ref([])

const cargarSolicitudes = async () => {
  const idEmpresa = await resolveEmpresaId()
  if (!idEmpresa) {
    router.push('/')
    return
  }

  try {
    const resVac = await fetch('http://localhost:3000/vacantes')
    if (!resVac.ok) throw new Error('Error al cargar vacantes')
    const vacantes = await resVac.json()
    const misVacantes = vacantes.filter(v => v.id_empresa === idEmpresa)
    const misVacantesIds = misVacantes.map(v => v.id_vacante)
    const vacantesMap = {}
    misVacantes.forEach(v => {
      vacantesMap[v.id_vacante] = v
    })

    const resPost = await fetch('http://localhost:3000/postulaciones')
    if (!resPost.ok) throw new Error('Error al cargar postulaciones')
    const postulaciones = await resPost.json()
    
    const misPostulaciones = postulaciones.filter(p => misVacantesIds.includes(p.id_vacante))

    const resUsers = await fetch('http://localhost:3000/users')
    if (!resUsers.ok) throw new Error('Error al cargar usuarios')
    const usuarios = await resUsers.json()
    const usuariosMap = {}
    usuarios.forEach(u => {
      usuariosMap[u.id_usuario] = u
    })

    listaSolicitudes.value = misPostulaciones.map(p => {
      const v = vacantesMap[p.id_vacante] || {}
      const u = usuariosMap[p.id_usuario] || {}
      
      let contractLabel = 'Tiempo completo'
      if (v.tipo_contrato === 'medio_tiempo') contractLabel = 'Medio tiempo'
      else if (v.tipo_contrato === 'contrato') contractLabel = 'Por contrato'
      else if (v.tipo_contrato === 'practicas') contractLabel = 'Prácticas'

      return {
        id_postulacion: p.id_postulacion,
        id_vacante: p.id_vacante,
        id_usuario: p.id_usuario,
        estado: p.estado || 'postulado',
        usuario_nombre: u.nombre || 'Candidato Anónimo',
        ubicacion: v.ubicacion || 'San Salvador, El Salvador',
        tipo_contrato_label: contractLabel,
        vacante_titulo: v.titulo || 'Vacante Desconocida',
        vacante_descripcion: v.descripcion || 'Sin descripción de funciones.'
      }
    })

  } catch (err) {
    console.error('Error al cargar solicitudes:', err)
  }
}

const actualizarEstado = async (idPostulacion, nuevoEstado) => {
  try {
    const solicitud = listaSolicitudes.value.find(s => s.id_postulacion === idPostulacion)
    if (!solicitud) return

    const res = await fetch(`http://localhost:3000/postulaciones/${idPostulacion}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_vacante: solicitud.id_vacante,
        id_usuario: solicitud.id_usuario,
        estado: nuevoEstado
      })
    })

    if (!res.ok) throw new Error('Error al actualizar postulación')
    
    solicitud.estado = nuevoEstado

  } catch (err) {
    console.error('Error al actualizar estado:', err)
    alert('Ocurrió un error al cambiar el estado de la solicitud.')
  }
}

onMounted(() => {
  cargarSolicitudes()
})
</script>

<style scoped>
.requests-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.requests-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

.requests-header {
  text-align: center;
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

.requests-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
}

.requests-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.request-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.request-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.request-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eef2f6;
  flex-wrap: wrap;
}

.candidate-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.candidate-avatar i {
  font-size: 2rem;
  color: #667eea;
}

.candidate-basic-info {
  flex: 1;
}

.candidate-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.candidate-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.detail-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #666;
}

.detail-item i {
  color: #667eea;
}

.vacancy-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0f3ff;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #667eea;
}

.request-body {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.functions-section {
  flex: 2;
}

.section-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-subtitle i {
  color: #667eea;
}

.functions-text {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.actions-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-accept, .btn-reject {
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-accept {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-accept:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.btn-reject {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.btn-reject:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.status-container {
  text-align: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-accepted {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-rejected {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.request-footer {
  text-align: right;
  padding-top: 15px;
  border-top: 1px solid #eef2f6;
}

.request-date {
  color: #999;
  font-size: 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
  .requests-main {
    padding: 20px 15px;
  }
  
  .requests-title {
    font-size: 1.5rem;
  }
  
  .requests-subtitle {
    font-size: 0.85rem;
  }
  
  .request-card {
    padding: 20px;
  }
  
  .request-header {
    flex-direction: column;
    text-align: center;
  }
  
  .candidate-details {
    justify-content: center;
  }
  
  .request-body {
    flex-direction: column;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .btn-accept, .btn-reject {
    flex: 1;
    justify-content: center;
  }
  
  .vacancy-badge {
    align-self: center;
  }
}

@media (max-width: 480px) {
  .candidate-name {
    font-size: 1rem;
  }
  
  .detail-item {
    font-size: 0.75rem;
  }
  
  .functions-text {
    font-size: 0.8rem;
  }
  
  .btn-accept, .btn-reject {
    padding: 8px 16px;
    font-size: 0.75rem;
  }
  
  .status-badge {
    padding: 8px 16px;
    font-size: 0.75rem;
  }
}
</style>