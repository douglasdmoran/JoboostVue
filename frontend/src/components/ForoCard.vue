<template>
  <router-link :to="'/foros/detalle/' + foro.id_foro" class="forum-card">
    <div class="forum-card-content">
      <div class="forum-header">
        <h3 class="forum-title">{{ foro.titulo || '—' }}</h3>
        <div class="forum-badge" :class="foro.cerrado ? 'badge-closed' : 'badge-open'">
          <i :class="foro.cerrado ? 'fa-solid fa-lock' : 'fa-solid fa-message'"></i>
          {{ foro.cerrado ? 'Cerrado' : 'Activo' }}
        </div>
      </div>
      
      <div class="forum-meta">
        <div class="meta-item" v-if="foro.usuario_nombre">
          <i class="fa-solid fa-user-circle"></i>
          <span>{{ foro.usuario_nombre }}</span>
        </div>
        <div class="meta-item" v-if="foro.fecha_creacion">
          <i class="fa-regular fa-calendar"></i>
          <span>{{ formatearFecha(foro.fecha_creacion) }}</span>
        </div>
        <div class="meta-item" v-if="foro.comentarios_count !== undefined">
          <i class="fa-regular fa-comment"></i>
          <span>{{ foro.comentarios_count }} comentarios</span>
        </div>
      </div>
      
      <div class="forum-footer">
        <span class="read-more">
          Ver discusión
          <i class="fa-solid fa-arrow-right"></i>
        </span>
      </div>
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
.forum-card {
  display: block;
  text-decoration: none;
  background: white;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.forum-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.forum-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.12);
  border-color: rgba(102, 126, 234, 0.2);
}

.forum-card:hover::before {
  transform: scaleY(1);
}

.forum-card-content {
  position: relative;
  z-index: 1;
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.forum-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.forum-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-open {
  background: #dcfce7;
  color: #166534;
}

.badge-closed {
  background: #fee2e2;
  color: #dc2626;
}

.forum-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #64748b;
}

.meta-item i {
  color: #667eea;
  font-size: 0.7rem;
}

.forum-footer {
  text-align: right;
  border-top: 1px solid #eef2f6;
  padding-top: 15px;
  margin-top: 5px;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #667eea;
  transition: all 0.3s ease;
}

.forum-card:hover .read-more {
  gap: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .forum-card {
    padding: 18px;
  }
  
  .forum-title {
    font-size: 1rem;
  }
  
  .forum-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .forum-meta {
    gap: 12px;
    margin-bottom: 15px;
  }
  
  .meta-item {
    font-size: 0.7rem;
  }
  
  .read-more {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .forum-card {
    padding: 15px;
  }
  
  .forum-title {
    font-size: 0.95rem;
  }
  
  .forum-meta {
    gap: 10px;
  }
  
  .meta-item {
    font-size: 0.65rem;
  }
}
</style>