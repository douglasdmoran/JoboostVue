<template>
  <div class="forum-detail-page">
    <NavbarCandidate />
    
    <main class="forum-main">
      <!-- Foro Detalle -->
      <section v-if="foro" class="forum-detail-section">
        <div class="forum-header">
          <h1 class="forum-title">{{ foro.titulo }}</h1>
          <div class="forum-meta">
            <span class="meta-item">
              <i class="fa-solid fa-user"></i>
              {{ foro.usuario_nombre || 'Usuario Desconocido' }}
            </span>
            <span class="meta-item">
              <i class="fa-solid fa-calendar"></i>
              {{ formatearFecha(foro.fecha_creacion) }}
            </span>
            <span v-if="foro.cerrado" class="meta-status closed">
              <i class="fa-solid fa-lock"></i>
              Cerrado
            </span>
            <span v-else class="meta-status open">
              <i class="fa-solid fa-message"></i>
              Abierto
            </span>
          </div>
        </div>
        
        <div class="forum-content">
          <div class="content-text">
            {{ foro.contenido }}
          </div>
        </div>
      </section>
      
      <div v-else-if="estadoCarga" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>{{ estadoCarga }}</p>
      </div>

      <!-- Comentarios -->
      <section v-if="foro" class="comments-section">
        <div class="comments-header">
          <h2 class="comments-title">
            <i class="fa-solid fa-comments"></i>
            Comentarios
          </h2>
          <span class="comments-count">{{ comentarios.length }} comentario(s)</span>
        </div>
        
        <div class="comments-list">
          <div 
            v-for="comentario in comentarios" 
            :key="comentario.id_comentario" 
            class="comment-card"
          >
            <div class="comment-header">
              <div class="comment-author">
                <i class="fa-solid fa-user-circle"></i>
                <strong>Usuario #{{ comentario.id_usuario }}</strong>
              </div>
              <span class="comment-date">
                <i class="fa-regular fa-clock"></i>
                {{ formatearFecha(comentario.fecha_comentario) }}
              </span>
            </div>
            <div class="comment-body">
              <i class="fa-solid fa-quote-left quote-icon"></i>
              <p>{{ comentario.mensaje }}</p>
            </div>
          </div>
          
          <div v-if="comentarios.length === 0" class="empty-comments">
            <i class="fa-regular fa-comment-dots"></i>
            <p>No hay comentarios todavía.</p>
            <small>¡Sé el primero en participar en esta conversación!</small>
          </div>
        </div>

        <!-- Formulario Comentario -->
        <div v-if="!foro.cerrado" class="comment-form-container">
          <h3 class="form-title">
            <i class="fa-solid fa-pen-fancy"></i>
            Deja tu comentario
          </h3>
          <form @submit.prevent="publicarComentario" class="comment-form">
            <div class="form-group">
              <textarea 
                v-model="nuevoMensaje" 
                rows="4" 
                placeholder="Escribe tu opinión, respuesta o consejo..."
                class="form-textarea"
                required
              ></textarea>
            </div>
            
            <div v-if="estadoComentario" class="status-message" :class="{ success: estadoComentario.includes('publicado') }">
              <i :class="estadoComentario.includes('publicado') ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info'"></i>
              {{ estadoComentario }}
            </div>
            
            <button type="submit" class="btn-submit-comment">
              <i class="fa-solid fa-paper-plane"></i>
              Publicar Comentario
            </button>
          </form>
        </div>
        
        <div v-else class="closed-forum-message">
          <i class="fa-solid fa-lock"></i>
          <div>
            <strong>Foro Cerrado</strong>
            <p>Este foro está cerrado a nuevos comentarios.</p>
          </div>
        </div>
      </section>

      <div class="back-link">
        <router-link to="/foros" class="back-button">
          <i class="fa-solid fa-arrow-left"></i>
          Volver a foros
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarCandidate from '../components/NavbarCandidate.vue'

const route = useRoute()
const router = useRouter()
const idForo = parseInt(route.params.id, 10)

const foro = ref(null)
const comentarios = ref([])
const nuevoMensaje = ref('')
const estadoCarga = ref('')
const estadoComentario = ref('')

const formatearFecha = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-SV', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cargarDatos = async () => {
  estadoCarga.value = 'Cargando información del foro...'
  try {
    // 1. Cargar el foro buscándolo en la lista de foros
    const resForos = await fetch('http://localhost:3000/foros')
    if (!resForos.ok) throw new Error('Error al cargar foros')
    const foros = await resForos.json()
    
    const found = foros.find(f => f.id_foro === idForo)
    if (!found) {
      estadoCarga.value = 'El foro solicitado no existe.'
      return
    }
    foro.value = found
    estadoCarga.value = ''

    // 2. Cargar comentarios
    const resCom = await fetch('http://localhost:3000/comentarios')
    if (resCom.ok) {
      const todosComentarios = await resCom.json()
      comentarios.value = todosComentarios.filter(c => c.id_foro === idForo)
    }
  } catch (err) {
    console.error(err)
    estadoCarga.value = 'Error al cargar el foro.'
  }
}

const publicarComentario = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    alert('Debes iniciar sesión para comentar.')
    router.push('/')
    return
  }
  
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return
  }
  
  if (!user || !user.id_usuario) return

  estadoComentario.value = 'Enviando...'

  try {
    const response = await fetch('http://localhost:3000/comentarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_foro: idForo,
        id_usuario: user.id_usuario,
        mensaje: nuevoMensaje.value.trim()
      })
    })

    if (!response.ok) throw new Error('Error al comentar')

    nuevoMensaje.value = ''
    estadoComentario.value = 'Comentario publicado.'
    setTimeout(() => {
      estadoComentario.value = ''
      cargarDatos()
    }, 1000)
  } catch (err) {
    console.error(err)
    estadoComentario.value = 'Ocurrió un error. Intenta de nuevo.'
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.forum-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.forum-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Forum Detail Section */
.forum-detail-section {
  background: white;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.forum-detail-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.forum-header {
  border-bottom: 2px solid #eef2f6;
  padding-bottom: 20px;
  margin-bottom: 25px;
}

.forum-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 15px 0;
}

.forum-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.85rem;
}

.meta-item i {
  color: #667eea;
}

.meta-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.meta-status.closed {
  background: #fee2e2;
  color: #c62828;
}

.meta-status.open {
  background: #e8f5e9;
  color: #2e7d32;
}

.forum-content {
  margin-top: 25px;
}

.content-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #444;
  white-space: pre-line;
}

/* Loading State */
.loading-state {
  background: white;
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.loading-state i {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 15px;
}

.loading-state p {
  color: #666;
  margin: 0;
}

/* Comments Section */
.comments-section {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.comments-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.comments-title i {
  color: #667eea;
}

.comments-count {
  background: #f0f3ff;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 35px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.comment-card {
  background: #fafbfc;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.comment-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.comment-author i {
  color: #667eea;
  font-size: 1.1rem;
}

.comment-date {
  font-size: 0.75rem;
  color: #999;
  display: flex;
  align-items: center;
  gap: 5px;
}

.comment-body {
  position: relative;
  padding-left: 30px;
}

.quote-icon {
  position: absolute;
  left: 0;
  top: 0;
  color: #667eea;
  opacity: 0.4;
  font-size: 0.9rem;
}

.comment-body p {
  margin: 0;
  color: #555;
  line-height: 1.6;
  white-space: pre-line;
}

/* Empty Comments */
.empty-comments {
  text-align: center;
  padding: 50px 20px;
  background: #fafbfc;
  border-radius: 16px;
  border: 1px dashed #e1e5e9;
}

.empty-comments i {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 15px;
}

.empty-comments p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.95rem;
}

.empty-comments small {
  color: #999;
  font-size: 0.8rem;
}

/* Comment Form */
.comment-form-container {
  border-top: 2px solid #eef2f6;
  padding-top: 30px;
  margin-top: 10px;
}

.form-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-title i {
  color: #667eea;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  width: 100%;
}

.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea::placeholder {
  color: #bbb;
}

.status-message {
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e3f2fd;
  color: #1976d2;
}

.status-message.success {
  background: #e8f5e9;
  color: #388e3c;
}

.btn-submit-comment {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  transition: all 0.3s ease;
}

.btn-submit-comment:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit-comment:active {
  transform: translateY(0);
}

/* Closed Forum Message */
.closed-forum-message {
  background: linear-gradient(135deg, #fee2e2 0%, #ffebee 100%);
  border: 1px solid #fca5a5;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #b91c1c;
}

.closed-forum-message i {
  font-size: 2rem;
}

.closed-forum-message strong {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
}

.closed-forum-message p {
  margin: 0;
  font-size: 0.85rem;
}

/* Back Link */
.back-link {
  margin-top: 30px;
  text-align: left;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: #667eea;
  background: #f0f3ff;
  transform: translateX(-3px);
}

/* Responsive */
@media (max-width: 768px) {
  .forum-main {
    padding: 20px 15px;
  }
  
  .forum-detail-section {
    padding: 25px;
  }
  
  .forum-title {
    font-size: 1.5rem;
  }
  
  .forum-meta {
    gap: 12px;
  }
  
  .comments-section {
    padding: 25px;
  }
  
  .comments-title {
    font-size: 1.2rem;
  }
  
  .comment-card {
    padding: 15px;
  }
  
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .btn-submit-comment {
    width: 100%;
    justify-content: center;
  }
  
  .content-text {
    font-size: 0.95rem;
  }
  
  .closed-forum-message {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .forum-detail-section {
    padding: 20px;
  }
  
  .comments-section {
    padding: 20px;
  }
  
  .comment-body {
    padding-left: 20px;
  }
}
</style>