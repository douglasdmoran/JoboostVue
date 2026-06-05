<template>
  <div class="publish-job-page">
    <NavbarCompany />
    
    <main class="publish-main">
      <div class="publish-header">
        <h1 class="publish-title">
          {{ editMode ? 'Editar Empleo' : 'Publicar Empleo' }}
        </h1>
        <p class="publish-subtitle">
          {{ editMode ? 'Modifica los detalles de tu vacante existente' : 'Completa el formulario para crear una nueva oportunidad laboral' }}
        </p>
      </div>

      <section class="form-container">
        <form @submit.prevent="guardarVacante" class="publish-form">
          
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-heading"></i>
              Título de la Vacante *
            </label>
            <input 
              type="text" 
              v-model="titulo" 
              placeholder="Ej: Desarrollador Full Stack, Asesor de Ventas, Diseñador Gráfico"
              class="form-input"
              required
            >
            <span class="form-hint">Especifica el cargo o puesto a ofrecer</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-location-dot"></i>
                Departamento *
              </label>
              <div class="select-wrapper">
                <select v-model="departamentoSeleccionado" class="form-select" required>
                  <option value="" disabled>Seleccione un departamento</option>
                  <option v-for="dept in departamentos" :key="dept" :value="dept">{{ dept }}</option>
                </select>
                <i class="fa-solid fa-chevron-down select-arrow"></i>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-map-pin"></i>
                Dirección detallada *
              </label>
              <input 
                type="text" 
                v-model="direccionDetalle" 
                placeholder="Ej: Bypass, frente a gasolinera, Centro Comercial X"
                class="form-input"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-file-alt"></i>
              Descripción del Puesto *
            </label>
            <textarea 
              rows="5" 
              v-model="descripcion" 
              placeholder="Describe las responsabilidades principales del puesto, el ambiente laboral, beneficios, etc."
              class="form-textarea"
              required
            ></textarea>
            <span class="form-hint">Incluye información relevante sobre el día a día en el puesto</span>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-list-check"></i>
              Requisitos del Puesto *
            </label>
            <textarea 
              rows="5" 
              v-model="requisitos" 
              placeholder="Lista los requisitos: formación académica, experiencia, habilidades técnicas y blandas..."
              class="form-textarea"
              required
            ></textarea>
            <span class="form-hint">Especifica los requisitos mínimos y deseables</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-briefcase"></i>
                Tipo de Contrato *
              </label>
              <div class="select-wrapper">
                <select v-model="tipoContrato" class="form-select">
                  <option value="tiempo_completo">📋 Tiempo Completo</option>
                  <option value="medio_tiempo">🕐 Medio Tiempo</option>
                  <option value="contrato">📄 Contrato</option>
                  <option value="practicas">🎓 Prácticas</option>
                </select>
                <i class="fa-solid fa-chevron-down select-arrow"></i>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-building"></i>
                Modalidad de Trabajo *
              </label>
              <div class="select-wrapper">
                <select v-model="modalidad" class="form-select">
                  <option value="presencial">🏢 Presencial</option>
                  <option value="remoto">🏠 Remoto</option>
                  <option value="hibrido">🔄 Híbrido</option>
                </select>
                <i class="fa-solid fa-chevron-down select-arrow"></i>
              </div>
            </div>
          </div>

          <div v-if="mensajeEstado" class="status-message" :class="esError ? 'status-error' : 'status-success'">
            <i :class="esError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'"></i>
            {{ mensajeEstado }}
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelar" class="btn-cancel">
              <i class="fa-solid fa-times"></i>
              Cancelar
            </button>
            <button type="submit" :disabled="cargando" class="btn-submit">
              <i class="fa-solid" :class="cargando ? 'fa-spinner fa-spin' : (editMode ? 'fa-save' : 'fa-paper-plane')"></i>
              {{ cargando ? 'Procesando...' : (editMode ? 'Guardar Cambios' : 'Publicar Vacante') }}
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

const cancelar = () => {
  if (editMode.value) {
    router.push('/empresa/gestion')
  } else {
    // Limpiar formulario
    titulo.value = ''
    departamentoSeleccionado.value = ''
    direccionDetalle.value = ''
    descripcion.value = ''
    requisitos.value = ''
    tipoContrato.value = 'tiempo_completo'
    modalidad.value = 'presencial'
    mensajeEstado.value = ''
  }
}

const cargarDatos = async () => {
  const idEmpresa = await resolveEmpresaId()
  if (!idEmpresa) {
    router.push('/')
    return
  }
  idEmpresaInput.value = idEmpresa

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
      setTimeout(() => {
        titulo.value = ''
        departamentoSeleccionado.value = ''
        direccionDetalle.value = ''
        descripcion.value = ''
        requisitos.value = ''
        tipoContrato.value = 'tiempo_completo'
        modalidad.value = 'presencial'
        mensajeEstado.value = ''
      }, 3000)
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
.publish-job-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.publish-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.publish-header {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.publish-title {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
}

.publish-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.form-container {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

.form-container:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
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

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-weight: 600;
  font-size: 0.85rem;
}

.form-label i {
  color: #667eea;
  font-size: 0.9rem;
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #bbb;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.form-select {
  width: 100%;
  appearance: none;
  cursor: pointer;
  background: white;
}

.select-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
  font-size: 0.8rem;
}

.form-hint {
  font-size: 0.7rem;
  color: #999;
  margin-top: -4px;
}

.status-message {
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-success {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.status-error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 15px;
}

.btn-cancel,
.btn-submit {
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background: #f5f5f5;
  border: 1px solid #e1e5e9;
  color: #666;
}

.btn-cancel:hover {
  background: #e8e8e8;
  transform: translateY(-2px);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .publish-main {
    padding: 20px 15px;
  }
  
  .publish-title {
    font-size: 1.6rem;
  }
  
  .publish-subtitle {
    font-size: 0.85rem;
  }
  
  .form-container {
    padding: 25px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 20px;
  }
  
  .publish-title {
    font-size: 1.3rem;
  }
  
  .form-input,
  .form-textarea,
  .form-select {
    font-size: 0.85rem;
  }
}
</style>