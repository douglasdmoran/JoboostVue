<template>
  <router-link :to="'/vacantes/detalle/' + vacante.id_vacante" class="job-card" style="display: flex; text-decoration: none; color: inherit;">
    <div class="job-header-info" style="flex: 1;">
      <h4 style="margin-bottom: 15px; font-size: 1.1rem; font-weight: bold; color: #333;">{{ vacante.titulo || '—' }}</h4>
      <p style="margin-bottom: 10px; color: #555; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-location-dot"></i> {{ vacante.ubicacion || 'Sin especificar' }}
      </p>
      <p style="margin-bottom: 10px; color: #555; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-briefcase"></i> {{ vacante.tipo_contrato || '—' }} · {{ vacante.modalidad || '—' }}
      </p>
      <p v-if="vacante.empresa_nombre" style="margin-bottom: 10px; color: #555; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-building"></i> {{ vacante.empresa_nombre }}
      </p>
    </div>
    <div class="job-details-content" style="flex: 2; text-align: center; border-left: 1px solid #eee; padding-left: 20px;">
      <h5 style="margin-bottom: 10px; font-weight: bold; color: #333; font-size: 1rem;">Descripción</h5>
      <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">
        {{ descripcionTruncada }}
      </p>
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
        <span class="btn-primary" style="padding: 6px 15px; font-size: 0.85rem; border-radius: 4px; pointer-events: none; display: inline-block;">Ver Detalle</span>
        <span 
          v-if="yaAplicado" 
          style="color: #27ae60; font-weight: bold; font-size: 0.85rem; background-color: #e8f8f0; padding: 4px 10px; border-radius: 4px; border: 1px solid #27ae60; display: inline-block;"
        >
          <i class="fa-solid fa-circle-check"></i> Ya has aplicado a este empleo
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  vacante: {
    type: Object,
    required: true
  }
})

const yaAplicado = computed(() => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) return false
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return false
  }
  if (!user || !user.id_usuario) return false
  
  const aplicadasJson = localStorage.getItem(`aplicaciones_${user.id_usuario}`)
  if (!aplicadasJson) return false
  try {
    const aplicadasIds = JSON.parse(aplicadasJson)
    return Array.isArray(aplicadasIds) && aplicadasIds.includes(props.vacante.id_vacante)
  } catch (e) {
    return false
  }
})

const descripcionTruncada = computed(() => {
  const desc = props.vacante.descripcion || 'Sin descripción.'
  if (desc.length > 150) {
    return desc.substring(0, 150) + '…'
  }
  return desc
})
</script>

<style scoped>
/* Las clases de job-card heredan del style.css global */
</style>
