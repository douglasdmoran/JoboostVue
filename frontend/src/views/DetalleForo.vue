<template>
  <div>
    <NavbarCandidate />
    
    <main class="container">
      <!-- Foro Detalle -->
      <section v-if="foro" id="detalle-foro-container">
        <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
          {{ foro.titulo }}
        </h1>
        <div style="color: #666; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid #eee; display: flex; gap: 20px; flex-wrap: wrap;">
          <span><i class="fa-solid fa-user"></i> {{ foro.usuario_nombre || 'Usuario Desconocido' }}</span>
          <span><i class="fa-solid fa-calendar"></i> {{ formatearFecha(foro.fecha_creacion) }}</span>
          <span v-if="foro.cerrado" style="color: #dc2626; font-weight: bold;"><i class="fa-solid fa-lock"></i> Cerrado</span>
        </div>
        <div style="font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 40px; white-space: pre-line;">
          {{ foro.contenido }}
        </div>
      </section>
      <div v-else-if="estadoCarga" style="padding: 20px; font-size: 1.1rem; color: #666;">
        {{ estadoCarga }}
      </div>

      <!-- Comentarios -->
      <section v-if="foro" id="comentarios-seccion" style="margin-top: 40px;">
        <h2 style="font-size: 1.6rem; font-weight: bold; color: #333; margin-bottom: 25px;">Comentarios</h2>
        
        <div id="comentarios-lista" style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px;">
          <div 
            v-for="c in comentarios" 
            :key="c.id_comentario" 
            style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea;"
          >
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem;">
              <strong style="color: #1e3a8a;"><i class="fa-solid fa-user-circle"></i> Usuario #{{ c.id_usuario }}</strong>
              <span style="color: #888;">{{ formatearFecha(c.fecha_comentario) }}</span>
            </div>
            <p style="margin: 0; color: #333; white-space: pre-line;">{{ c.mensaje }}</p>
          </div>
          <p v-if="comentarios.length === 0" style="color: #888;">
            No hay comentarios todavía. ¡Sé el primero en participar!
          </p>
        </div>

        <!-- Formulario Comentario -->
        <div v-if="!foro.cerrado">
          <form @submit.prevent="publicarComentario" id="form-comentario" class="login-form" style="margin-top: 0; display: flex; flex-direction: column; gap: 15px;">
            <div class="input-group">
              <label for="comentario-mensaje">Añadir un comentario</label>
              <textarea 
                v-model="nuevoMensaje" 
                id="comentario-mensaje" 
                rows="4" 
                placeholder="Escribe tu opinión, respuesta o consejo..." 
                style="padding: 12px; border: 1px solid var(--gris-borde); border-radius: 6px; font-family: inherit;"
                required
              ></textarea>
            </div>
            <p v-if="estadoComentario" style="font-size: 0.9rem; font-weight: bold; color: #1e3a8a;">
              {{ estadoComentario }}
            </p>
            <button type="submit" class="btn-primary" style="align-self: flex-start; padding: 10px 30px; cursor: pointer;">
              Publicar Comentario
            </button>
          </form>
        </div>
        <div v-else style="background-color: #fee2e2; border: 1px solid #fca5a5; padding: 15px; border-radius: 8px; color: #b91c1c; font-weight: bold;">
          <i class="fa-solid fa-lock"></i> Este foro está cerrado a nuevos comentarios.
        </div>
      </section>

      <div style="margin-top: 40px;">
        <router-link to="/foros" style="text-decoration: none; color: #666; font-size: 0.9rem;">
          <i class="fa-solid fa-arrow-left"></i> Volver a foros
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
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })
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
</style>
