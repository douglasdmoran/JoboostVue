<template>
  <div class="forums-page">
    <NavbarCandidate />
    
    <main class="forums-main">
      <div class="forums-header">
        <div class="header-content">
          <h1 class="page-title">Foro de Discusión</h1>
          <p class="page-subtitle">Comparte experiencias, consejos y dudas con la comunidad de JobBoost</p>
        </div>
        <button @click="intentarAbrirModal" class="btn-create-forum">
          <i class="fa-solid fa-plus"></i>
          <span>Crear un Foro</span>
        </button>
      </div>

      <div v-if="estadoCarga" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>{{ estadoCarga }}</p>
      </div>

      <div v-else class="forums-grid">
        <ForoCard 
          v-for="foro in listaForos" 
          :key="foro.id_foro" 
          :foro="foro" 
        />
      </div>

      <!-- Modal Crear Foro -->
      <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              <i class="fa-solid fa-comments"></i>
              Crear un nuevo foro
            </h2>
            <button @click="cerrarModal" class="modal-close" title="Cerrar">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <form @submit.prevent="crearForo" class="modal-form">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-heading"></i>
                Título del Foro
              </label>
              <input 
                type="text" 
                v-model="tituloForo" 
                placeholder="Ej. Consejos para entrevistas de trabajo"
                class="form-input"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-file-alt"></i>
                Contenido del Foro
              </label>
              <textarea 
                v-model="contenidoForo" 
                rows="5" 
                placeholder="Escribe aquí tu duda, aporte o experiencia..."
                class="form-textarea"
                required
              ></textarea>
            </div>

            <div v-if="estadoCrear" class="status-message" :class="{ success: estadoCrear.includes('éxito') }">
              <i :class="estadoCrear.includes('éxito') ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info'"></i>
              {{ estadoCrear }}
            </div>

            <button type="submit" class="btn-submit-forum">
              <i class="fa-solid fa-paper-plane"></i>
              Publicar Foro
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarCandidate from '../components/NavbarCandidate.vue'
import ForoCard from '../components/ForoCard.vue'

const router = useRouter()
const listaForos = ref([])
const mostrarModal = ref(false)
const estadoCarga = ref('')
const estadoCrear = ref('')

const tituloForo = ref('')
const contenidoForo = ref('')

const cargarForos = async () => {
  estadoCarga.value = 'Cargando foros...'
  try {
    const response = await fetch('http://localhost:3000/foros')
    if (response.ok) {
      listaForos.value = await response.json()
    }
    estadoCarga.value = ''
  } catch (err) {
    console.error('Error al cargar los foros:', err)
    estadoCarga.value = 'Error al cargar los foros.'
  }
}

const intentarAbrirModal = () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    alert('Debes iniciar sesión para crear un foro.')
    router.push('/')
    return
  }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  tituloForo.value = ''
  contenidoForo.value = ''
  estadoCrear.value = ''
}

const crearForo = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) return
  
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return
  }
  
  if (!user || !user.id_usuario) return

  estadoCrear.value = 'Publicando...'

  try {
    const response = await fetch('http://localhost:3000/foros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo: tituloForo.value.trim(),
        contenido: contenidoForo.value.trim(),
        id_usuario: user.id_usuario
      })
    })

    if (!response.ok) throw new Error('Error al publicar')

    estadoCrear.value = '¡Foro publicado con éxito!'
    setTimeout(() => {
      cerrarModal()
      cargarForos()
    }, 1500)
  } catch (err) {
    console.error(err)
    estadoCrear.value = 'Error al publicar. Inténtalo de nuevo.'
  }
}

onMounted(() => {
  cargarForos()
})
</script>

<style scoped>
.forums-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.forums-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header Section */
.forums-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 50px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
  gap: 20px;
  flex-wrap: wrap;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 10px 0;
}

.page-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

.btn-create-forum {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.btn-create-forum:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
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
  font-size: 1rem;
}

/* Forums Grid */
.forums-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: white;
  border-radius: 24px;
  width: 550px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 2px solid #eef2f6;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
  border-radius: 24px 24px 0 0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title i {
  color: #667eea;
  font-size: 1.4rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #999;
  transition: all 0.3s ease;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.modal-close:hover {
  color: #333;
  background: #f0f0f0;
  transform: rotate(90deg);
}

/* Modal Form */
.modal-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-label i {
  color: #667eea;
  font-size: 0.9rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder, .form-textarea::placeholder {
  color: #bbb;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.status-message {
  padding: 12px 15px;
  border-radius: 12px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #e3f2fd;
  color: #1976d2;
  margin-bottom: 20px;
}

.status-message.success {
  background: #e8f5e9;
  color: #388e3c;
}

.btn-submit-forum {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  transition: all 0.3s ease;
}

.btn-submit-forum:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit-forum:active {
  transform: translateY(0);
}

/* Scrollbar personalizada */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}

/* Responsive */
@media (max-width: 768px) {
  .forums-main {
    padding: 20px 15px;
  }
  
  .forums-header {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 30px;
  }
  
  .page-title {
    font-size: 1.6rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
  
  .btn-create-forum {
    justify-content: center;
  }
  
  .modal-container {
    width: 95%;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .modal-form {
    padding: 20px;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.3rem;
  }
  
  .btn-create-forum {
    padding: 10px 20px;
    font-size: 0.85rem;
  }
  
  .form-input, .form-textarea {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
  
  .btn-submit-forum {
    padding: 12px 20px;
    font-size: 0.85rem;
  }
}
</style>