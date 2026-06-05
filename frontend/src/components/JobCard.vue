<template>
  <router-link :to="'/vacantes/detalle/' + vacante.id_vacante" class="job-card">
    <div class="job-card-container">
      <!-- Logo de la empresa -->
      <div class="job-logo">
        <div class="logo-box" :style="{ backgroundColor: logoColor }">
          <img v-if="vacante.empresa_logo_url" :src="vacante.empresa_logo_url" alt="Logo de empresa" />
          <span v-else class="logo-initials">{{ logoInitials }}</span>
        </div>
      </div>

      <!-- Información principal -->
      <div class="job-info">
        <h4 class="job-title">{{ vacante.titulo || '—' }}</h4>
        <div class="job-details">
          <span class="detail-item">
            <i class="fa-solid fa-location-dot"></i>
            {{ vacante.ubicacion || 'Sin especificar' }}
          </span>
          <span class="detail-separator">•</span>
          <span class="detail-item">
            <i class="fa-solid fa-briefcase"></i>
            {{ vacante.tipo_contrato || '—' }}
          </span>
          <span class="detail-separator">•</span>
          <span class="detail-item">
            <i class="fa-solid fa-building"></i>
            {{ vacante.modalidad || '—' }}
          </span>
        </div>
        <div v-if="vacante.empresa_nombre" class="company-name">
          <i class="fa-solid fa-building"></i>
          {{ vacante.empresa_nombre }}
        </div>
      </div>

      <!-- Descripción y acción -->
      <div class="job-action">
        <div class="description-section">
          <h5 class="description-title">Descripción</h5>
          <p class="description-text">{{ descripcionTruncada }}</p>
        </div>
        <div class="action-buttons">
          <span class="btn-view">Ver Detalle</span>
          <span 
            v-if="yaAplicado" 
            class="applied-badge"
          >
            <i class="fa-solid fa-circle-check"></i>
            Ya has aplicado
          </span>
        </div>
      </div>
      
      <div class="card-arrow">
        <i class="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { generarLogo, generarColor } from '../utils/empresaUtils'

const props = defineProps({
  vacante: {
    type: Object,
    required: true
  }
})

const logoInitials = computed(() => generarLogo(props.vacante.empresa_nombre || 'Empresa'))
const logoColor = computed(() => generarColor(props.vacante.empresa_nombre || 'Empresa'))

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
  if (desc.length > 120) {
    return desc.substring(0, 120) + '…'
  }
  return desc
})
</script>

<style scoped>
.job-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.job-card-container {
  display: flex;
  align-items: stretch;
  background: white;
  border-radius: 20px;
  padding: 24px;
  gap: 24px;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.job-card-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.job-card:hover .job-card-container {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.12);
  border-color: rgba(102, 126, 234, 0.2);
}

.job-card:hover .job-card-container::before {
  opacity: 1;
}

.job-card:hover .card-arrow {
  transform: translateX(5px);
  opacity: 1;
}

/* Logo Section */
.job-logo {
  flex-shrink: 0;
}

.logo-box {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.job-card:hover .logo-box {
  transform: scale(1.05);
}

.logo-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-initials {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Job Info */
.job-info {
  flex: 1;
  min-width: 0;
}

.job-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.detail-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #64748b;
}

.detail-item i {
  color: #667eea;
  font-size: 0.8rem;
}

.detail-separator {
  color: #cbd5e1;
  font-size: 0.75rem;
}

.company-name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #667eea;
  background: #f0f3ff;
  padding: 4px 12px;
  border-radius: 20px;
  margin-top: 8px;
}

/* Job Action */
.job-action {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 1px solid #eef2f6;
  padding-left: 24px;
}

.description-section {
  flex: 1;
}

.description-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
}

.description-text {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.btn-view {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 20px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  width: fit-content;
}

.job-card:hover .btn-view {
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.applied-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e8f8f0;
  color: #27ae60;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid #27ae60;
  white-space: nowrap;
}

/* Card Arrow */
.card-arrow {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.3s ease;
  color: #667eea;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .job-card-container {
    flex-direction: column;
    padding: 20px;
    gap: 16px;
  }
  
  .job-logo {
    display: flex;
    justify-content: center;
  }
  
  .logo-box {
    width: 80px;
    height: 80px;
  }
  
  .job-info {
    text-align: center;
  }
  
  .job-details {
    justify-content: center;
  }
  
  .company-name {
    justify-content: center;
  }
  
  .job-action {
    border-left: none;
    padding-left: 0;
    border-top: 1px solid #eef2f6;
    padding-top: 16px;
  }
  
  .action-buttons {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .card-arrow {
    display: none;
  }
  
  .description-text {
    text-align: center;
  }
  
  .btn-view {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .job-card-container {
    padding: 16px;
  }
  
  .job-title {
    font-size: 1rem;
  }
  
  .detail-item {
    font-size: 0.75rem;
  }
  
  .description-text {
    font-size: 0.8rem;
    -webkit-line-clamp: 2;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-view {
    width: 100%;
    justify-content: center;
  }
}
</style>