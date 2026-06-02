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
      <span class="btn-primary" style="padding: 6px 15px; font-size: 0.85rem; border-radius: 4px; pointer-events: none;">Ver Detalle</span>
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
