<template>
  <router-link :to="'/foros/detalle/' + foro.id_foro" class="forum-box" style="cursor: pointer; transition: transform 0.2s; text-decoration: none; display: block; color: inherit; padding: 25px; border-radius: 8px;">
    <p style="font-size: 1.4rem; color: #333; margin: 0 0 8px; font-weight: 500;">
      {{ foro.titulo || '—' }}
    </p>
    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
      <small v-if="foro.usuario_nombre" style="color: #888; display: flex; align-items: center; gap: 5px;">
        <i class="fa-solid fa-user"></i> {{ foro.usuario_nombre }}
      </small>
      <small v-if="foro.fecha_creacion" style="color: #aaa; display: flex; align-items: center; gap: 5px;">
        <i class="fa-solid fa-calendar"></i> {{ formatearFecha(foro.fecha_creacion) }}
      </small>
      <span v-if="foro.cerrado" style="font-size: 0.75rem; background: #fee2e2; color: #dc2626; padding: 2px 8px; border-radius: 999px; font-weight: bold;">
        Cerrado
      </span>
      <span v-else style="font-size: 0.75rem; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 999px; font-weight: bold;">
        Activo
      </span>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  foro: {
    type: Object,
    required: true
  }
})

const formatearFecha = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
/* Hereda clases del style.css global */
</style>
