<template>
  <div>
    <NavbarCompany />
    
    <main class="container">
        <h1 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 40px;">Solicitudes recibidas</h1>

        <section class="requests-list">
            
            <article 
              v-for="solicitud in listaSolicitudes" 
              :key="solicitud.id_postulacion"
              class="job-card" 
              style="display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; padding: 30px; background: white; border: 1px solid #eee; margin-bottom: 25px;"
            >
                <div class="candidate-info" style="flex: 1;">
                    <h4 style="font-size: 1.1rem; margin-bottom: 15px; font-weight: bold; color: #333;">{{ solicitud.usuario_nombre }}</h4>
                    <p style="margin-bottom: 10px; color: #555;"><i class="fa-solid fa-location-dot"></i> {{ solicitud.ubicacion || 'San Salvador, El Salvador' }}</p>
                    <p style="color: #555;"><i class="fa-solid fa-briefcase"></i> {{ solicitud.tipo_contrato_label || 'Tiempo completo' }}</p>
                    <p style="color: #666; font-size: 0.85rem; margin-top: 10px;">Postulación para: <strong>{{ solicitud.vacante_titulo }}</strong></p>
                </div>

                <div class="candidate-functions" style="flex: 2; text-align: center; padding: 0 20px; border-left: 1px solid #eee;">
                    <h4 style="font-weight: bold; margin-bottom: 15px; color: #333;">Funciones de la Vacante</h4>
                    <p style="font-size: 0.9rem; color: #444; line-height: 1.5; margin-bottom: 20px; text-align: left;">
                        {{ solicitud.vacante_descripcion }}
                    </p>
                    
                    <div v-if="solicitud.estado === 'postulado'" class="action-buttons" style="display: flex; justify-content: center; gap: 20px;">
                        <button @click="actualizarEstado(solicitud.id_postulacion, 'aceptado')" class="btn-primary" style="background-color: #00ff00; color: white; border: none; padding: 10px 35px; border-radius: 4px; font-weight: bold; cursor: pointer;">Aceptar</button>
                        <button @click="actualizarEstado(solicitud.id_postulacion, 'denegado')" class="btn-primary" style="background-color: #ff0000; color: white; border: none; padding: 10px 35px; border-radius: 4px; font-weight: bold; cursor: pointer;">Denegar</button>
                    </div>
                    
                    <div v-else style="margin-top: 15px;">
                      <span 
                        :style="{ 
                          backgroundColor: solicitud.estado === 'aceptado' ? '#dcfce7' : '#fee2e2', 
                          color: solicitud.estado === 'aceptado' ? '#166534' : '#dc2626' 
                        }" 
                        style="padding: 10px 40px; border-radius: 4px; font-weight: bold; text-transform: uppercase; display: inline-block; font-size: 0.9rem;"
                      >
                        {{ solicitud.estado === 'aceptado' ? 'Solicitud Aceptada' : 'Solicitud Denegada' }}
                      </span>
                    </div>
                </div>
            </article>

            <p v-if="listaSolicitudes.length === 0" style="color: #888; text-align: center; padding: 50px; font-size: 1.1rem;">
              No se han recibido solicitudes para tus vacantes en este momento.
            </p>

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
    // 1. Cargar todas las vacantes de la empresa
    const resVac = await fetch('http://localhost:3000/vacantes')
    if (!resVac.ok) throw new Error('Error al cargar vacantes')
    const vacantes = await resVac.json()
    const misVacantes = vacantes.filter(v => v.id_empresa === idEmpresa)
    const misVacantesIds = misVacantes.map(v => v.id_vacante)
    const vacantesMap = {}
    misVacantes.forEach(v => {
      vacantesMap[v.id_vacante] = v
    })

    // 2. Cargar todas las postulaciones
    const resPost = await fetch('http://localhost:3000/postulaciones')
    if (!resPost.ok) throw new Error('Error al cargar postulaciones')
    const postulaciones = await resPost.json()
    
    // Filtrar postulaciones que pertenezcan a mis vacantes
    const misPostulaciones = postulaciones.filter(p => misVacantesIds.includes(p.id_vacante))

    // 3. Cargar todos los usuarios para obtener los nombres de los postulantes
    const resUsers = await fetch('http://localhost:3000/users')
    if (!resUsers.ok) throw new Error('Error al cargar usuarios')
    const usuarios = await resUsers.json()
    const usuariosMap = {}
    usuarios.forEach(u => {
      usuariosMap[u.id_usuario] = u
    })

    // 4. Cruzar datos
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
</style>
