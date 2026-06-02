<template>
  <div>
    <NavbarCompany />
    
    <main class="container">
        <h1 style="text-align: center; font-size: 2.5rem; font-weight: bold; margin-bottom: 40px;">
          {{ editMode ? 'Editar Empleo' : 'Publicar Empleo' }}
        </h1>

        <section style="background: white; padding: 50px; border: 1px solid #eee; border-radius: 4px; max-width: 900px; margin: 0 auto;">
            
            <form @submit.prevent="guardarVacante" id="form-publicar" class="profile-form">
                
                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="font-weight: 500; margin-bottom: 8px; display: block;">Título</label>
                    <input type="text" v-model="titulo" id="pub-titulo" placeholder="Desarrollador BackEnd" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem;" required>
                </div>

                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="font-weight: 500; margin-bottom: 8px; display: block;">ID Empresa</label>
                    <input type="number" v-model="idEmpresaInput" id="pub-id-empresa" placeholder="ID numérico de la empresa" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem;" required>
                </div>

                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="font-weight: 500; margin-bottom: 8px; display: block;">Ubicación</label>
                    <input type="text" v-model="ubicacion" id="pub-ubicacion" placeholder="Santa Ana, Bypass" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem;" required>
                </div>

                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="font-weight: 500; margin-bottom: 8px; display: block;">Descripción</label>
                    <textarea rows="4" v-model="descripcion" id="pub-descripcion" placeholder="Justo sodales nunc proin dictumst est quam..." style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem; font-family: inherit; resize: vertical;" required></textarea>
                </div>

                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="font-weight: 500; margin-bottom: 8px; display: block;">Requisitos</label>
                    <textarea rows="4" v-model="requisitos" id="pub-requisitos" placeholder="Justo sodales nunc proin dictumst est quam" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem; font-family: inherit; resize: vertical;" required></textarea>
                </div>

                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="font-weight: 500; margin-bottom: 8px; display: block;">Tipo de Contrato</label>
                    <select v-model="tipoContrato" id="pub-tipo-contrato" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem;">
                        <option value="tiempo_completo">Tiempo Completo</option>
                        <option value="medio_tiempo">Medio Tiempo</option>
                        <option value="contrato">Contrato</option>
                        <option value="practicas">Prácticas</option>
                    </select>
                </div>

                <div class="input-group" style="margin-bottom: 40px;">
                    <label style="font-weight: 500; margin-bottom: 8px; display: block;">Modalidad</label>
                    <select v-model="modalidad" id="pub-modalidad" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem;">
                        <option value="presencial">Presencial</option>
                        <option value="remoto">Remoto</option>
                        <option value="hibrido">Híbrido</option>
                    </select>
                </div>

                <div id="pub-mensaje" :style="{ color: esError ? 'red' : 'green' }" style="text-align:center; margin-bottom: 15px; font-weight: 500;">
                  {{ mensajeEstado }}
                </div>

                <div style="text-align: center;">
                    <button type="submit" id="btn-publicar" :disabled="cargando" class="btn-primary" style="width: 300px; padding: 12px; font-size: 1.2rem; border-radius: 8px; cursor: pointer;">
                        {{ cargando ? 'Guardando...' : (editMode ? 'Guardar Cambios' : 'Publicar') }}
                    </button>
                </div>

            </form>
        </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarCompany from '../components/NavbarCompany.vue'

const route = useRoute()
const router = useRouter()

const titulo = ref('')
const idEmpresaInput = ref(2)
const ubicacion = ref('')
const descripcion = ref('')
const requisitos = ref('')
const tipoContrato = ref('tiempo_completo')
const modalidad = ref('presencial')

const mensajeEstado = ref('')
const esError = ref(false)
const cargando = ref(false)

const editId = computed(() => route.query.edit)
const editMode = computed(() => !!editId.value)

const cargarDatos = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    router.push('/')
    return
  }
  
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    router.push('/')
    return
  }

  // Pre-llenar ID Empresa según el usuario corporativo logueado
  const email = (user.correo || user.email || '').toLowerCase()
  const name = (user.nombre || '').toLowerCase()
  
  let mappedId = 2
  if (email.includes('siman') || name.includes('siman')) {
    mappedId = 4
  } else if (email.includes('dollarcity') || name.includes('dollarcity') || email.includes('d-city')) {
    mappedId = 5
  } else if (email.includes('selectos') || name.includes('selectos')) {
    mappedId = 6
  }
  idEmpresaInput.value = mappedId

  // Si estamos en modo edición, cargar la vacante
  if (editMode.value) {
    try {
      const res = await fetch(`http://localhost:3000/vacantes/buscarPorId/${editId.value}`)
      if (res.ok) {
        const v = await res.json()
        if (v) {
          titulo.value = v.titulo || ''
          idEmpresaInput.value = v.id_empresa || mappedId
          ubicacion.value = v.ubicacion || ''
          descripcion.value = v.descripcion || ''
          requisitos.value = v.requisitos || ''
          tipoContrato.value = v.tipo_contrato || 'tiempo_completo'
          modalidad.value = v.modalidad || 'presencial'
        }
      }
    } catch (err) {
      console.error('Error al cargar vacante para editar:', err)
    }
  }
}

const guardarVacante = async () => {
  cargando.value = true
  esError.value = false
  mensajeEstado.value = 'Procesando...'

  const url = editMode.value 
    ? `http://localhost:3000/vacantes/${editId.value}`
    : 'http://localhost:3000/vacantes'
    
  const method = editMode.value ? 'PUT' : 'POST'

  const bodyData = {
    id_empresa: parseInt(idEmpresaInput.value),
    titulo: titulo.value.trim(),
    descripcion: descripcion.value.trim(),
    requisitos: requisitos.value.trim(),
    ubicacion: ubicacion.value.trim(),
    tipo_contrato: tipoContrato.value,
    modalidad: modalidad.value,
    salario_oferta: 'A convenir',
    fecha_limite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    activa: true
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.message || 'Error al guardar la vacante.')
    }

    esError.value = false
    mensajeEstado.value = editMode.value ? '¡Vacante actualizada con éxito!' : '¡Vacante publicada con éxito!'
    
    setTimeout(() => {
      router.push('/empresa/gestion')
    }, 1500)

  } catch (err) {
    console.error(err)
    esError.value = true
    mensajeEstado.value = err.message || 'Ocurrió un error al procesar la vacante.'
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
</style>
