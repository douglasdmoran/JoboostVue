<template>
  <div>
    <NavbarCandidate />
    
    <main class="container profile-layout">
      <!-- Columna Izquierda: Formulario e Historiales -->
      <section class="form-side" style="display: flex; flex-direction: column; gap: 40px;">
        <div>
          <h1 style="font-size: 2.2rem; font-weight: bold; color: #333; margin-bottom: 10px;">Configuración de Perfil</h1>
          <p style="color: #666; margin-bottom: 25px;">Administra tus datos de contacto y credenciales.</p>
          
          <form @submit.prevent="guardarCambios" class="profile-form" style="display: flex; flex-direction: column; gap: 15px;">
            <div class="input-group">
              <label for="nombre">Nombre Completo</label>
              <input type="text" v-model="nombre" id="nombre" required>
            </div>

            <div class="input-group">
              <label for="correo">Correo Electrónico</label>
              <input type="email" v-model="correo" id="correo" required>
            </div>

            <button type="submit" class="btn-primary" style="align-self: flex-start; cursor: pointer;">
              Guardar Cambios de Cuenta
            </button>
          </form>
        </div>

        <!-- Trabajos Aplicados -->
        <div>
          <h2 style="font-size: 1.6rem; font-weight: bold; color: #333; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            Trabajos Aplicados
          </h2>
          <div id="perfil-postulaciones-lista" style="display: flex; flex-direction: column; gap: 20px;">
            <div 
              v-for="post in misPostulaciones" 
              :key="post.id_postulacion" 
              class="job-card" 
              style="display: block; text-decoration: none; color: inherit; padding: 25px;"
            >
              <div class="job-header-info">
                <h4 style="color: #333; font-weight: bold;">{{ post.vacante_titulo || 'Cargando título de vacante...' }}</h4>
                <p style="color: #666;"><i class="fa-solid fa-location-dot"></i> {{ post.vacante_ubicacion || '—' }}</p>
                <p style="color: #666;"><i class="fa-solid fa-building"></i> {{ post.empresa_nombre || '—' }}</p>
              </div>
              <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.85rem; padding: 4px 8px; border-radius: 4px; background: #e0e7ff; color: #4338ca; text-transform: capitalize; font-weight: bold;">
                  Estado: {{ post.estado || 'postulado' }}
                </span>
                <small style="color: #999;">{{ formatearFecha(post.fecha_postulacion) }}</small>
              </div>
            </div>
            <p v-if="misPostulaciones.length === 0" style="color: #888;">
              Aún no has aplicado a ninguna vacante.
            </p>
          </div>
        </div>

        <!-- Mis Foros -->
        <div>
          <h2 style="font-size: 1.6rem; font-weight: bold; color: #333; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            Mis Foros Creados
          </h2>
          <div id="perfil-foros-lista" style="display: flex; flex-direction: column; gap: 20px;">
            <router-link 
              v-for="foro in misForos" 
              :key="foro.id_foro" 
              :to="'/foros/detalle/' + foro.id_foro" 
              class="forum-box" 
              style="text-decoration: none; display: block; color: inherit; padding: 20px;"
            >
              <p style="font-size: 1.2rem; color: #333; margin: 0 0 8px; font-weight: bold;">{{ foro.titulo || '—' }}</p>
              <small style="color: #aaa;"><i class="fa-solid fa-calendar"></i> {{ formatearFecha(foro.fecha_creacion) }}</small>
              <span v-if="foro.cerrado" style="margin-left: 10px; font-size: 0.75rem; background: #fee2e2; color: #dc2626; padding: 2px 8px; border-radius: 999px; font-weight: bold;">
                Cerrado
              </span>
            </router-link>
            <p v-if="misForos.length === 0" style="color: #888;">
              Aún no has creado ningún foro.
            </p>
          </div>
        </div>

        <!-- Mis Comentarios -->
        <div>
          <h2 style="font-size: 1.6rem; font-weight: bold; color: #333; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            Comentarios en Foros
          </h2>
          <div id="perfil-comentarios-lista" style="display: flex; flex-direction: column; gap: 15px;">
            <div 
              v-for="com in misComentarios" 
              :key="com.id_comentario" 
              style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea;"
            >
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center;">
                <strong style="color: var(--azul-jobboost);">
                  <router-link :to="'/foros/detalle/' + com.id_foro" style="color: inherit; text-decoration: none;">
                    <i class="fa-solid fa-comments"></i> {{ com.foro_titulo || 'Ir al Foro' }}
                  </router-link>
                </strong>
                <span style="color: #888; font-size: 0.9rem;">{{ formatearFecha(com.fecha_comentario) }}</span>
              </div>
              <p style="margin: 0; color: #444; white-space: pre-line;">"{{ com.mensaje }}"</p>
            </div>
            <p v-if="misComentarios.length === 0" style="color: #888;">
              No has realizado comentarios en ningún foro.
            </p>
          </div>
        </div>

        <!-- Mis Evaluaciones -->
        <div>
          <h2 style="font-size: 1.6rem; font-weight: bold; color: #333; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            Evaluaciones Publicadas
          </h2>
          <div id="perfil-evaluaciones-lista" style="display: flex; flex-direction: column; gap: 15px;">
            <div 
              v-for="val in misEvaluaciones" 
              :key="val.id_valoracion" 
              style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; display: flex; flex-direction: column; gap: 10px;"
            >
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <strong style="color: var(--azul-jobboost); font-size: 1.1rem;">
                  <i class="fa-solid fa-building"></i> {{ val.empresa_nombre || 'Empresa' }}
                </strong>
                <span style="color: #999; font-size: 0.85rem;">{{ formatearFecha(val.fecha_valoracion) }}</span>
              </div>
              <div>
                <i v-for="n in 5" :key="n" :class="n <= val.calificacion ? 'fa-solid fa-star' : 'fa-regular fa-star'" style="color: #ffcc00; margin-right: 2px;"></i>
              </div>
              <p style="margin: 0; color: #444; font-size: 0.95rem; line-height: 1.5; font-style: italic;">"{{ val.comentario }}"</p>
            </div>
            <p v-if="misEvaluaciones.length === 0" style="color: #888;">
              No has publicado ninguna evaluación a empresas.
            </p>
          </div>
        </div>
      </section>

      <!-- Columna Derecha: Foto de Perfil -->
      <section class="image-side">
        <div class="img-placeholder-container" style="text-align: center;">
          <h3 style="margin-bottom: 20px; font-size: 1.1rem; color: #1e293b;">Foto de Perfil</h3>
          <div class="img-placeholder-box" style="display: flex; align-items: center; justify-content: center; width: 200px; height: 200px; border-radius: 50%; margin: 0 auto 20px; border: 1px solid #ccc; overflow: hidden; background: #e2e8f0;">
            <img v-if="fotoUrl" :src="fotoUrl" alt="Foto de perfil" style="width: 100%; height: 100%; object-fit: cover;" />
            <span v-else style="font-size: 4rem; color: #aaa;">{{ iniciales }}</span>
          </div>
          <input type="file" ref="fileInputRef" @change="handlePhotoUpload" accept="image/*" style="display: none;">
          <button @click="triggerFileInput" type="button" class="btn-secondary" style="cursor: pointer;">
            <i class="fa-solid fa-upload"></i> Actualizar Foto
          </button>
        </div>
      </section>
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
  try {
    const response = await fetch(`http://localhost:3000/users/${idUsuario.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombre.value.trim(),
        email: correo.value.trim(),
        foto_url: fotoUrl.value
      })
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Error al guardar cambios.')
    }

    const updatedUser = await response.json()
    localStorage.setItem('usuario', JSON.stringify(updatedUser))
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    
    // Disparar evento storage de forma artificial para sincronizar navbars
    window.dispatchEvent(new Event('storage'))

    alert('¡Información de perfil actualizada con éxito!')
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
    
    // Obtener información adicional de las vacantes correspondientes
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
</style>
