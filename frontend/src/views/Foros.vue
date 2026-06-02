<template>
  <div>
    <NavbarCandidate />
    
    <main class="container">
      <div class="forum-top-bar" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 40px;">
        <div>
          <h1 style="font-size: 2rem; font-weight: bold; color: #333; margin-bottom: 10px;">Foro de Discusión</h1>
          <p style="color: #666; font-size: 1rem;">Comparte experiencias, consejos y dudas con la comunidad de JobBoost.</p>
        </div>
        <button @click="intentarAbrirModal" id="btn-abrir-modal-foro" class="btn-primary" style="padding: 12px 24px; cursor: pointer;">
          Crear un Foro
        </button>
      </div>

      <div v-if="estadoCarga" style="text-align: center; color: #666; margin-bottom: 20px; font-size: 1.1rem;">
        {{ estadoCarga }}
      </div>

      <div id="foros-lista" style="display: flex; flex-direction: column; gap: 20px;">
        <ForoCard 
          v-for="foro in listaForos" 
          :key="foro.id_foro" 
          :foro="foro" 
        />
      </div>

      <!-- Modal Crear Foro -->
      <div v-if="mostrarModal" class="modal" @click.self="cerrarModal" style="display: flex;">
        <div class="modal-content" style="max-width: 500px; width: 90%;">
          <span class="close-modal" @click="cerrarModal">&times;</span>
          <h2 style="font-size: 1.5rem; font-weight: bold; color: #333; margin-bottom: 20px;">Crear un nuevo foro</h2>
          
          <form @submit.prevent="crearForo" id="form-crear-foro" class="login-form" style="margin-top: 0;">
            <div class="input-group">
              <label for="foro-titulo">Título del Foro</label>
              <input type="text" v-model="tituloForo" id="foro-titulo" placeholder="Ej. Consejos para entrevistas de trabajo" required>
            </div>

            <div class="input-group">
              <label for="foro-contenido">Contenido del Foro</label>
              <textarea v-model="contenidoForo" id="foro-contenido" rows="5" placeholder="Escribe aquí tu duda, aporte o experiencia..." style="padding: 10px; border: 1px solid var(--gris-borde); border-radius: 4px; font-family: inherit;" required></textarea>
            </div>

            <p v-if="estadoCrear" style="text-align: center; font-size: 0.9rem; margin-bottom: 10px; font-weight: bold; color: #1e3a8a;">
              {{ estadoCrear }}
            </p>

            <button type="submit" class="btn-primary btn-block" style="margin-top: 10px; cursor: pointer;">
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
  estadoCarga.value = 'Cargando foros…'
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
</style>
