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
                    <label style="font-weight: 500; margin-bottom: 8px; display: block;">Departamento</label>
                    <select v-model="departamentoSeleccionado" id="pub-departamento" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem;" required>
                        <option value="" disabled>Seleccione un departamento</option>
                        <option v-for="dept in departamentos" :key="dept" :value="dept">{{ dept }}</option>
                    </select>
                </div>

                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="font-weight: 500; margin-bottom: 8px; display: block;">Dirección de la tienda</label>
                    <input type="text" v-model="direccionDetalle" id="pub-direccion-detalle" placeholder="Ej: Bypass, frente a gasolinera" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem;" required>
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
import { resolveEmpresaId } from '../utils/empresaUtils'

const route = useRoute()
const router = useRouter()

const titulo = ref('')
const idEmpresaInput = ref(null)
const departamentoSeleccionado = ref('')
const direccionDetalle = ref('')
const descripcion = ref('')
const requisitos = ref('')
const tipoContrato = ref('tiempo_completo')
const modalidad = ref('presencial')

const departamentos = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad',
  'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador',
  'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután'
]

const mensajeEstado = ref('')
const esError = ref(false)
const cargando = ref(false)

const editId = computed(() => route.query.edit)
const editMode = computed(() => !!editId.value)

const cargarDatos = async () => {
  const idEmpresa = await resolveEmpresaId()
  if (!idEmpresa) {
    router.push('/')
    return
  }
  idEmpresaInput.value = idEmpresa

  // Si estamos en modo edición, cargar la vacante
  if (editMode.value) {
    try {
      const res = await fetch(`http://localhost:3000/vacantes/buscarPorId/${editId.value}`)
      if (res.ok) {
        const v = await res.json()
        if (v) {
          titulo.value = v.titulo || ''
          idEmpresaInput.value = v.id_empresa || idEmpresa
          const rawUbicacion = v.ubicacion || ''
          const parts = rawUbicacion.split(',')
          if (parts.length > 1) {
            const dep = parts[0].trim()
            if (departamentos.includes(dep)) {
              departamentoSeleccionado.value = dep
              direccionDetalle.value = parts.slice(1).join(',').trim()
            } else {
              departamentoSeleccionado.value = ''
              direccionDetalle.value = rawUbicacion
            }
          } else {
            const cleanLoc = rawUbicacion.trim()
            if (departamentos.includes(cleanLoc)) {
              departamentoSeleccionado.value = cleanLoc
              direccionDetalle.value = ''
            } else {
              departamentoSeleccionado.value = ''
              direccionDetalle.value = rawUbicacion
            }
          }
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

  const combinedUbicacion = `${departamentoSeleccionado.value.trim()}, ${direccionDetalle.value.trim()}`

  const bodyData = {
    id_empresa: parseInt(idEmpresaInput.value),
    titulo: titulo.value.trim(),
    descripcion: descripcion.value.trim(),
    requisitos: requisitos.value.trim(),
    ubicacion: combinedUbicacion,
    tipo_contrato: tipoContrato.value,
    modalidad: modalidad.value,
    salario_oferta: null,
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
    
    if (editMode.value) {
      setTimeout(() => {
        router.push('/empresa/gestion')
      }, 1500)
    } else {
      // Limpiar formulario para permitir crear otra vacante
      titulo.value = ''
      departamentoSeleccionado.value = ''
      direccionDetalle.value = ''
      descripcion.value = ''
      requisitos.value = ''
      tipoContrato.value = 'tiempo_completo'
      modalidad.value = 'presencial'
      
      setTimeout(() => {
        mensajeEstado.value = ''
      }, 4500)
    }

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
