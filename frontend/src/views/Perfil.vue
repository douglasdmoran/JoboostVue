<template>
  <div class="profile-page">
    <NavbarCandidate />
    
    <main class="profile-main">
      <div class="profile-layout">
        <!-- Columna Izquierda: Formulario e Historiales -->
        <div class="profile-content">
          <!-- Configuración de Perfil -->
          <div class="profile-section">
            <div class="section-header">
              <h1 class="section-title">Configuración de Perfil</h1>
              <p class="section-subtitle">Administra tus datos de contacto y credenciales</p>
            </div>
            
            <form @submit.prevent="guardarCambios" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-user"></i>
                    Nombre Completo
                  </label>
                  <input type="text" v-model="nombre" class="form-input" required>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-envelope"></i>
                    Correo Electrónico
                  </label>
                  <input type="email" v-model="correo" class="form-input" required>
                </div>
              </div>

              <div class="form-section-divider">
                <i class="fa-solid fa-shield-halved"></i>
                <span>Seguridad y Contraseña</span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-key"></i>
                    Nueva Contraseña (Opcional)
                  </label>
                  <input 
                    type="password" 
                    v-model="passwordNueva" 
                    placeholder="••••••••" 
                    class="form-input"
                  >
                  <span class="form-hint">Solo si deseas cambiar tu contraseña actual</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-lock"></i>
                    Contraseña Actual *
                  </label>
                  <input 
                    type="password" 
                    v-model="passwordActual" 
                    placeholder="••••••••" 
                    class="form-input"
                    required
                  >
                  <span class="form-hint">Ingresa tu contraseña actual para confirmar y guardar cualquier cambio</span>
                </div>
              </div>

              <button type="submit" class="btn-save">
                <i class="fa-solid fa-save"></i>
                Guardar Cambios de Cuenta
              </button>
            </form>
          </div>

          <!-- Trabajos Aplicados -->
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-subtitle">
                <i class="fa-solid fa-briefcase"></i>
                Trabajos Aplicados
              </h2>
              <span class="section-count">{{ misPostulaciones.length }} aplicación(es)</span>
            </div>
            
            <div class="applications-list">
              <div 
                v-for="post in misPostulaciones" 
                :key="post.id_postulacion" 
                class="application-card"
              >
                <div class="application-header">
                  <h4 class="application-title">{{ post.vacante_titulo || 'Cargando título...' }}</h4>
                  <span class="application-status" :class="getStatusClass(post.estado)">
                    <i class="fa-solid" :class="getStatusIcon(post.estado)"></i>
                    Estado: {{ post.estado || 'postulado' }}
                  </span>
                </div>
                <div class="application-details">
                  <span class="detail-item">
                    <i class="fa-solid fa-location-dot"></i>
                    {{ post.vacante_ubicacion || 'Ubicación no especificada' }}
                  </span>
                  <span class="detail-item">
                    <i class="fa-solid fa-building"></i>
                    {{ post.empresa_nombre || 'Empresa no especificada' }}
                  </span>
                </div>
                <div class="application-footer">
                  <small class="application-date">
                    <i class="fa-regular fa-calendar"></i>
                    {{ formatearFecha(post.fecha_postulacion) }}
                  </small>
                </div>
              </div>
              
              <div v-if="misPostulaciones.length === 0" class="empty-state">
                <i class="fa-solid fa-briefcase-slash"></i>
                <p>Aún no has aplicado a ninguna vacante</p>
                <small>Explora las oportunidades y comienza tu camino profesional</small>
              </div>
            </div>
          </div>

          <!-- Mis Foros -->
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-subtitle">
                <i class="fa-solid fa-comments"></i>
                Mis Foros Creados
              </h2>
              <span class="section-count">{{ misForos.length }} foro(s)</span>
            </div>
            
            <div class="forums-list">
              <router-link 
                v-for="foro in misForos" 
                :key="foro.id_foro" 
                :to="'/foros/detalle/' + foro.id_foro" 
                class="forum-card"
              >
                <div class="forum-header">
                  <h4 class="forum-title">{{ foro.titulo || 'Sin título' }}</h4>
                  <span v-if="foro.cerrado" class="forum-badge closed">
                    <i class="fa-solid fa-lock"></i>
                    Cerrado
                  </span>
                  <span v-else class="forum-badge open">
                    <i class="fa-solid fa-message"></i>
                    Activo
                  </span>
                </div>
                <div class="forum-footer">
                  <small class="forum-date">
                    <i class="fa-regular fa-calendar"></i>
                    {{ formatearFecha(foro.fecha_creacion) }}
                  </small>
                </div>
              </router-link>
              
              <div v-if="misForos.length === 0" class="empty-state">
                <i class="fa-solid fa-comment-slash"></i>
                <p>Aún no has creado ningún foro</p>
                <small>Comparte tus dudas y experiencias con la comunidad</small>
              </div>
            </div>
          </div>

          <!-- Mis Comentarios -->
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-subtitle">
                <i class="fa-solid fa-reply-all"></i>
                Comentarios en Foros
              </h2>
              <span class="section-count">{{ misComentarios.length }} comentario(s)</span>
            </div>
            
            <div class="comments-list">
              <div 
                v-for="com in misComentarios" 
                :key="com.id_comentario" 
                class="comment-card"
              >
                <div class="comment-header">
                  <router-link :to="'/foros/detalle/' + com.id_foro" class="comment-link">
                    <i class="fa-solid fa-comments"></i>
                    {{ com.foro_titulo || 'Ver Conversación' }}
                  </router-link>
                  <small class="comment-date">
                    <i class="fa-regular fa-calendar"></i>
                    {{ formatearFecha(com.fecha_comentario) }}
                  </small>
                </div>
                <div class="comment-content">
                  <i class="fa-solid fa-quote-left quote-icon"></i>
                  <p>{{ com.mensaje }}</p>
                </div>
              </div>
              
              <div v-if="misComentarios.length === 0" class="empty-state">
                <i class="fa-regular fa-comment-dots"></i>
                <p>No has realizado comentarios en ningún foro</p>
                <small>Participa en las discusiones de la comunidad</small>
              </div>
            </div>
          </div>

          <!-- Mis Evaluaciones -->
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-subtitle">
                <i class="fa-solid fa-star"></i>
                Evaluaciones Publicadas
              </h2>
              <span class="section-count">{{ misEvaluaciones.length }} evaluación(es)</span>
            </div>
            
            <div class="reviews-list">
              <div 
                v-for="val in misEvaluaciones" 
                :key="val.id_valoracion" 
                class="review-card"
              >
                <div class="review-header">
                  <div class="review-company">
                    <i class="fa-solid fa-building"></i>
                    <strong>{{ val.empresa_nombre || 'Empresa' }}</strong>
                  </div>
                  <small class="review-date">
                    <i class="fa-regular fa-calendar"></i>
                    {{ formatearFecha(val.fecha_valoracion) }}
                  </small>
                </div>
                <div class="review-stars">
                  <i v-for="n in 5" :key="n" :class="n <= val.calificacion ? 'fa-solid fa-star' : 'fa-regular fa-star'" class="star-icon"></i>
                </div>
                <div class="review-content">
                  <i class="fa-solid fa-quote-left quote-icon"></i>
                  <p>{{ val.comentario }}</p>
                </div>
              </div>
              
              <div v-if="misEvaluaciones.length === 0" class="empty-state">
                <i class="fa-regular fa-star"></i>
                <p>No has publicado ninguna evaluación a empresas</p>
                <small>Comparte tu experiencia laboral con otros candidatos</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Foto de Perfil -->
        <div class="profile-sidebar">
          <div class="avatar-section">
            <h3 class="avatar-title">
              <i class="fa-solid fa-camera"></i>
              Foto de Perfil
            </h3>
            <div class="avatar-container">
              <div class="avatar-circle">
                <img v-if="fotoUrl" :src="fotoUrl" alt="Foto de perfil" />
                <span v-else class="avatar-initials">{{ iniciales }}</span>
              </div>
            </div>
            <input type="file" ref="fileInputRef" @change="handlePhotoUpload" accept="image/*" style="display: none;">
            <button @click="triggerFileInput" type="button" class="btn-upload">
              <i class="fa-solid fa-upload"></i>
              Actualizar Foto
            </button>
            <p class="upload-hint">Formatos permitidos: JPG, PNG (Máx. 2MB)</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarCandidate from '../components/NavbarCandidate.vue'

const router = useRouter()

const nombre = ref('')
const correo = ref('')
const idUsuario = ref(null)
const fotoUrl = ref('')
const passwordActual = ref('')
const passwordNueva = ref('')
const fileInputRef = ref(null)

const misPostulaciones = ref([])
const misForos = ref([])
const misComentarios = ref([])
const misEvaluaciones = ref([])

const iniciales = computed(() => {
  if (!nombre.value) return 'P'
  const parts = nombre.value.split(' ')
  if (parts.length > 1) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  }
  return parts[0].charAt(0).toUpperCase()
})

const getStatusClass = (estado) => {
  const statusMap = {
    'postulado': 'status-postulado',
    'revisado': 'status-revisado',
    'entrevista': 'status-entrevista',
    'rechazado': 'status-rechazado',
    'contratado': 'status-contratado'
  }
  return statusMap[estado?.toLowerCase()] || 'status-postulado'
}

const getStatusIcon = (estado) => {
  const iconMap = {
    'postulado': 'fa-hourglass-half',
    'revisado': 'fa-eye',
    'entrevista': 'fa-calendar-check',
    'rechazado': 'fa-times-circle',
    'contratado': 'fa-check-circle'
  }
  return iconMap[estado?.toLowerCase()] || 'fa-hourglass-half'
}

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('La imagen es demasiado grande. El límite es de 2MB.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    fotoUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const checkSession = () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    alert('Por favor, inicia sesión para ver tu perfil.')
    router.push('/')
    return false
  }
  
  try {
    const user = JSON.parse(userJson)
    nombre.value = user.nombre
    correo.value = user.correo || user.email
    idUsuario.value = user.id_usuario
    fotoUrl.value = user.foto_url || ''
    return true
  } catch (e) {
    router.push('/')
    return false
  }
}

const formatearFecha = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })
}

const guardarCambios = async () => {
  if (!passwordActual.value) {
    alert('Por favor, ingresa tu contraseña actual para confirmar los cambios.')
    return
  }

  try {
    const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
    const user = JSON.parse(userJson)
    const originalEmail = user.correo || user.email

    // 1. Verificar contraseña actual con el endpoint de login
    const verifyRes = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: originalEmail,
        contrasenia: passwordActual.value,
      }),
    })

    if (!verifyRes.ok) {
      throw new Error('La contraseña actual es incorrecta. No se pueden guardar los cambios.')
    }

    const bodyObj = {
      nombre: nombre.value.trim(),
      email: correo.value.trim(),
      foto_url: fotoUrl.value
    }
    if (passwordNueva.value) {
      bodyObj.contrasenia = passwordNueva.value
    }

    const response = await fetch(`http://localhost:3000/users/${idUsuario.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyObj)
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Error al guardar cambios.')
    }

    const updatedUser = await response.json()
    localStorage.setItem('usuario', JSON.stringify(updatedUser))
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    
    window.dispatchEvent(new Event('storage'))

    alert('¡Información de perfil actualizada con éxito!')
    passwordActual.value = ''
    passwordNueva.value = ''
    checkSession()
  } catch (err) {
    alert(err.message)
  }
}

const cargarPostulaciones = async () => {
  try {
    const resPost = await fetch('http://localhost:3000/postulaciones')
    if (!resPost.ok) return
    const todas = await resPost.json()
    const filtradas = todas.filter(p => p.id_usuario === idUsuario.value)
    
    const resVac = await fetch('http://localhost:3000/vacantes')
    if (resVac.ok) {
      const vacantes = await resVac.json()
      filtradas.forEach(p => {
        const found = vacantes.find(v => v.id_vacante === p.id_vacante)
        if (found) {
          p.vacante_titulo = found.titulo
          p.vacante_ubicacion = found.ubicacion
          p.empresa_nombre = found.empresa_nombre
        }
      })
    }
    
    misPostulaciones.value = filtradas
  } catch (e) {
    console.error(e)
  }
}

const cargarForos = async () => {
  try {
    const resForos = await fetch('http://localhost:3000/foros')
    if (!resForos.ok) return
    const todos = await resForos.json()
    misForos.value = todos.filter(f => f.id_usuario === idUsuario.value)
  } catch (e) {
    console.error(e)
  }
}

const cargarComentarios = async () => {
  try {
    const resCom = await fetch(`http://localhost:3000/comentarios/buscarPorUsuario/${idUsuario.value}`)
    if (resCom.ok) {
      misComentarios.value = await resCom.json()
    }
  } catch (e) {
    console.error(e)
  }
}

const cargarEvaluaciones = async () => {
  try {
    const resEval = await fetch(`http://localhost:3000/valoraciones/buscarPorIdUsuario/${idUsuario.value}`)
    if (resEval.ok) {
      misEvaluaciones.value = await resEval.json()
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  if (checkSession()) {
    cargarPostulaciones()
    cargarForos()
    cargarComentarios()
    cargarEvaluaciones()
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.profile-main {
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 40px;
}

/* Profile Content */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.profile-section {
  background: white;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.profile-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eef2f6;
  flex-wrap: wrap;
  gap: 10px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.section-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-subtitle i {
  color: #667eea;
}

.section-count {
  background: #f0f3ff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
}

/* Profile Form */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-section-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 30px 0 15px 0;
  color: #764ba2;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 2px solid #f0f3ff;
  padding-bottom: 8px;
}

.form-section-divider i {
  color: #667eea;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-weight: 500;
  font-size: 0.85rem;
}

.form-label i {
  color: #667eea;
}

.form-input {
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  font-size: 0.7rem;
  color: #999;
  margin-top: -4px;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  transition: all 0.3s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Application Cards */
.applications-list,
.forums-list,
.comments-list,
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.application-card {
  background: #fafbfc;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.application-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.application-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.application-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-postulado {
  background: #e0e7ff;
  color: #4338ca;
}

.status-revisado {
  background: #fef3c7;
  color: #d97706;
}

.status-entrevista {
  background: #dbeafe;
  color: #2563eb;
}

.status-rechazado {
  background: #fee2e2;
  color: #dc2626;
}

.status-contratado {
  background: #dcfce7;
  color: #16a34a;
}

.application-details {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 10px;
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

.application-footer {
  text-align: right;
}

.application-date {
  color: #999;
  font-size: 0.7rem;
}

/* Forum Cards */
.forum-card {
  display: block;
  text-decoration: none;
  background: #fafbfc;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.forum-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.forum-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.forum-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
}

.forum-badge.closed {
  background: #fee2e2;
  color: #dc2626;
}

.forum-badge.open {
  background: #dcfce7;
  color: #16a34a;
}

.forum-footer {
  text-align: right;
}

.forum-date {
  color: #999;
  font-size: 0.7rem;
}

/* Comment Cards */
.comment-card {
  background: #fafbfc;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.comment-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.comment-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.comment-link:hover {
  text-decoration: underline;
}

.comment-date {
  color: #999;
  font-size: 0.7rem;
}

.comment-content {
  position: relative;
  padding-left: 25px;
}

.comment-content .quote-icon {
  position: absolute;
  left: 0;
  top: 0;
  color: #667eea;
  opacity: 0.4;
  font-size: 0.8rem;
}

.comment-content p {
  margin: 0;
  color: #555;
  line-height: 1.5;
  font-size: 0.9rem;
}

/* Review Cards */
.review-card {
  background: #fafbfc;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.review-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.review-company {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #667eea;
  font-size: 0.9rem;
}

.review-date {
  color: #999;
  font-size: 0.7rem;
}

.review-stars {
  margin-bottom: 12px;
}

.star-icon {
  color: #ffcc00;
  margin-right: 2px;
  font-size: 0.85rem;
}

.review-content {
  position: relative;
  padding-left: 25px;
}

.review-content .quote-icon {
  position: absolute;
  left: 0;
  top: 0;
  color: #667eea;
  opacity: 0.4;
  font-size: 0.8rem;
}

.review-content p {
  margin: 0;
  color: #555;
  line-height: 1.5;
  font-size: 0.9rem;
  font-style: italic;
}

/* Profile Sidebar */
.profile-sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.avatar-section {
  background: white;
  border-radius: 24px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.avatar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.avatar-title i {
  color: #667eea;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  border: 4px solid white;
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-upload {
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.btn-upload:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
}

.upload-hint {
  font-size: 0.7rem;
  color: #999;
  margin: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-state i {
  font-size: 2.5rem;
  color: #ddd;
  margin-bottom: 15px;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
}

.empty-state small {
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 968px) {
  .profile-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .profile-sidebar {
    position: static;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .profile-main {
    padding: 20px 15px;
  }
  
  .profile-section {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .application-header,
  .forum-header,
  .comment-header,
  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .application-details {
    flex-direction: column;
    gap: 8px;
  }
  
  .avatar-circle {
    width: 140px;
    height: 140px;
  }
  
  .avatar-initials {
    font-size: 2.5rem;
  }
  
  .btn-save {
    width: 100%;
    justify-content: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>