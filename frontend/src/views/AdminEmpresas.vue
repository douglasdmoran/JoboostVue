<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <main class="main-content">
      <header class="page-header">
        <div class="header-left">
          <h1 class="page-title">Empresas</h1>
          <button @click="abrirModal" class="btn-create">
            <i class="fa-solid fa-plus"></i>
            <span>Crear Empresa</span>
          </button>
        </div>
        
        <div class="user-info">
          <div class="user-text">
            <span class="user-name">Administrador</span>
            <span class="user-role">Panel de Empresas</span>
          </div>
          <div class="avatar-circle">
            <i class="fa-solid fa-building"></i>
          </div>
        </div>
      </header>

      <section class="table-container">
        <div class="table-header">
          <div class="table-title">
            <i class="fa-solid fa-building"></i>
            <span>Listado de Empresas</span>
          </div>
          <div class="table-stats">
            <span class="stats-badge">{{ listaEmpresas.length }} empresas registradas</span>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Sitio Web</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="empresa in listaEmpresas" :key="empresa.id_empresa">
                <td class="id-cell">{{ empresa.id_empresa }}</td>
                <td class="name-cell">{{ empresa.nombre }}</td>
                <td>{{ empresa.ubicacion || 'No especificada' }}</td>
                <td class="website-cell">
                  <a v-if="empresa.sitio_web" :href="empresa.sitio_web" target="_blank" class="website-link">
                    {{ empresa.sitio_web }}
                  </a>
                  <span v-else class="text-muted">N/A</span>
                </td>
                <td class="actions-cell">
                  <button @click="abrirEditar(empresa)" class="btn-edit" title="Editar empresa">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button @click="eliminarEmpresa(empresa.id_empresa)" class="btn-delete" title="Eliminar empresa">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="listaEmpresas.length === 0">
                <td colspan="5" class="empty-state">
                  <i class="fa-solid fa-building-circle-xmark"></i>
                  <p>No hay empresas registradas aún</p>
                  <button @click="abrirModal" class="btn-create-mini">Crear primera empresa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Modal -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fa-solid" :class="editandoId ? 'fa-pen' : 'fa-plus-circle'"></i>
            {{ editandoId ? 'Editar Empresa' : 'Crear Nueva Empresa' }}
          </h2>
          <button @click="cerrarModal" class="modal-close" title="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <form @submit.prevent="guardarEmpresa" class="modal-form">
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-building"></i>
              Nombre de la empresa *
            </label>
            <input 
              type="text" 
              v-model="formulario.nombre" 
              required 
              placeholder="Ej: Tech Solutions S.A."
              class="form-input"
            >
          </div>

          <div v-if="!editandoId" class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-id-card"></i>
                NIT *
              </label>
              <input 
                type="text" 
                v-model="formulario.nit" 
                required 
                placeholder="0000-000000-000-0"
                class="form-input"
              >
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-industry"></i>
                Sector o Industria *
              </label>
              <input 
                type="text" 
                v-model="formulario.sector" 
                required 
                placeholder="Ej: Tecnología, Alimentos, Textil"
                class="form-input"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-location-dot"></i>
              Ubicación (Departamento) *
            </label>
            <select v-model="formulario.ubicacion" required class="form-select">
              <option value="">Seleccione un departamento</option>
              <option value="Ahuachapán">Ahuachapán</option>
              <option value="Cabañas">Cabañas</option>
              <option value="Chalatenango">Chalatenango</option>
              <option value="Cuscatlán">Cuscatlán</option>
              <option value="La Libertad">La Libertad</option>
              <option value="La Paz">La Paz</option>
              <option value="La Unión">La Unión</option>
              <option value="Morazán">Morazán</option>
              <option value="San Miguel">San Miguel</option>
              <option value="San Salvador">San Salvador</option>
              <option value="San Vicente">San Vicente</option>
              <option value="Santa Ana">Santa Ana</option>
              <option value="Sonsonate">Sonsonate</option>
              <option value="Usulután">Usulután</option>
            </select>
          </div>

          <div v-if="!editandoId" class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-phone"></i>
                Teléfono de Contacto *
              </label>
              <input 
                type="tel" 
                v-model="formulario.telefono" 
                required 
                placeholder="2200-0000"
                class="form-input"
              >
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-clock"></i>
                Horario Laboral *
              </label>
              <input 
                type="text" 
                v-model="formulario.horario" 
                required 
                placeholder="Ej: Lunes a Viernes 8:00 AM - 5:00 PM"
                class="form-input"
              >
            </div>
          </div>
          
          <div v-if="editandoId" class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-globe"></i>
              Sitio Web
            </label>
            <input 
              type="url" 
              v-model="formulario.sitio_web" 
              placeholder="https://www.ejemplo.com"
              class="form-input"
            >
          </div>
          
          <div v-if="editandoId" class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-file-lines"></i>
              Descripción
            </label>
            <textarea 
              v-model="formulario.descripcion" 
              rows="4" 
              placeholder="Describe la empresa, su misión, visión, valores, etc."
              class="form-textarea"
            ></textarea>
          </div>

          <div v-if="!editandoId" class="form-divider">
            <span>Credenciales de acceso</span>
          </div>

          <div v-if="!editandoId" class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-envelope"></i>
                Correo Corporativo *
              </label>
              <input 
                type="email" 
                v-model="formulario.email" 
                required 
                placeholder="rrhh@empresa.com"
                class="form-input"
              >
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-lock"></i>
                Contraseña *
              </label>
              <input 
                type="password" 
                v-model="formulario.password" 
                required 
                placeholder="Mínimo 6 caracteres"
                class="form-input"
              >
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="cerrarModal" class="btn-cancel">
              <i class="fa-solid fa-times"></i>
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              <i class="fa-solid" :class="editandoId ? 'fa-save' : 'fa-check'"></i>
              {{ editandoId ? 'Actualizar Empresa' : 'Guardar Empresa' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const mostrarModal = ref(false)
const editandoId = ref(null)

const limpiarFormulario = () => {
  formulario.nombre = ''
  formulario.ubicacion = ''
  formulario.sitio_web = ''
  formulario.descripcion = ''
  formulario.nit = ''
  formulario.sector = ''
  formulario.telefono = ''
  formulario.horario = ''
  formulario.email = ''
  formulario.password = ''
}

const abrirModal = () => {
  editandoId.value = null
  limpiarFormulario()
  mostrarModal.value = true
}

const abrirEditar = (empresa) => {
  editandoId.value = empresa.id_empresa
  formulario.nombre = empresa.nombre
  formulario.ubicacion = empresa.ubicacion || ''
  formulario.sitio_web = empresa.sitio_web || ''
  formulario.descripcion = empresa.descripcion || ''
  // Los campos de creación no aplican en edición
  formulario.nit = ''
  formulario.sector = ''
  formulario.telefono = ''
  formulario.horario = ''
  formulario.email = ''
  formulario.password = ''
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  editandoId.value = null
  limpiarFormulario()
}

const formulario = reactive({
  nombre: '',
  ubicacion: '',
  sitio_web: '',
  descripcion: '',
  nit: '',
  sector: '',
  telefono: '',
  horario: '',
  email: '',
  password: ''
})

const listaEmpresas = ref([])

const cargarEmpresas = async () => {
  try {
    const response = await fetch('http://localhost:3000/empresas')
    if (response.ok) {
      listaEmpresas.value = await response.json()
    }
  } catch (err) {
    console.error('Error al cargar empresas:', err)
  }
}

onMounted(() => {
  cargarEmpresas()
})

const guardarEmpresa = async () => {
  try {
    const isEdit = editandoId.value !== null
    const url = isEdit 
      ? `http://localhost:3000/empresas/${editandoId.value}`
      : 'http://localhost:3000/empresas'
    const method = isEdit ? 'PUT' : 'POST'

    // Si es creación, construir descripción con los campos extra (como RegistroEmpresa.vue)
    let descripcionFinal = formulario.descripcion
    if (!isEdit && formulario.sector) {
      descripcionFinal = `Sector: ${formulario.sector}. NIT: ${formulario.nit}. Email: ${formulario.email}. Horario: ${formulario.horario}. Tel: ${formulario.telefono}`
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: formulario.nombre,
        ubicacion: formulario.ubicacion,
        sitio_web: formulario.sitio_web,
        descripcion: descripcionFinal
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al guardar empresa')
    }

    // Si es creación, también crear el usuario con rol "empresa" (como RegistroEmpresa.vue)
    if (!isEdit && formulario.email && formulario.password) {
      try {
        await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre: formulario.nombre.trim(),
            email: formulario.email.trim(),
            contrasenia: formulario.password,
            rol: 'empresa'
          })
        })
      } catch (userErr) {
        console.error('Error al crear usuario de empresa:', userErr)
      }
    }

    alert(isEdit ? '¡Empresa actualizada con éxito!' : '¡Empresa creada con éxito!')
    cerrarModal()
    cargarEmpresas()
  } catch (err) {
    alert('Error al guardar empresa: ' + err.message)
  }
}

const eliminarEmpresa = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta empresa?')) return

  try {
    const response = await fetch(`http://localhost:3000/empresas/${id}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar empresa')
    }

    alert('Empresa eliminada exitosamente')
    cargarEmpresas()
  } catch (err) {
    alert('Error al eliminar empresa: ' + err.message)
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
  min-height: 100vh;
}

.main-content {
  margin-left: 250px;
  flex: 1;
  padding: 40px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 8px 20px 8px 25px;
  border-radius: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.user-text {
  text-align: right;
}

.user-name {
  display: block;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.75rem;
  color: #888;
}

.avatar-circle {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.table-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.table-container:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
  border-bottom: 1px solid #eef2f6;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.table-title i {
  color: #667eea;
  font-size: 1.2rem;
}

.table-stats {
  background: #f0f3ff;
  padding: 5px 12px;
  border-radius: 20px;
}

.stats-badge {
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #fafbfc;
}

.data-table th {
  padding: 18px 20px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #eef2f6;
}

.data-table td {
  padding: 16px 20px;
  color: #555;
  font-size: 0.85rem;
  border-bottom: 1px solid #f0f0f0;
}

.data-table tbody tr:hover {
  background: #fafbfc;
  transition: background 0.3s ease;
}

.id-cell {
  font-weight: 600;
  color: #667eea;
  font-family: monospace;
}

.name-cell {
  font-weight: 500;
  color: #333;
}

.website-cell {
  max-width: 200px;
}

.website-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.website-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.text-muted {
  color: #bbb;
}

.actions-cell {
  display: flex;
  gap: 10px;
}

.btn-edit, .btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-edit {
  color: #667eea;
}

.btn-edit:hover {
  background: #f0f3ff;
  transform: scale(1.1);
}

.btn-delete {
  color: #e53e3e;
}

.btn-delete:hover {
  background: #fff5f5;
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 60px 20px !important;
  color: #999;
}

.empty-state i {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 15px;
}

.empty-state p {
  margin: 10px 0 20px;
  font-size: 0.9rem;
}

.btn-create-mini {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-create-mini:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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

.modal-container {
  background: white;
  border-radius: 20px;
  width: 650px;
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
  border-bottom: 1px solid #eef2f6;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
  border-radius: 20px 20px 0 0;
}

.modal-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title i {
  color: #667eea;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: all 0.3s ease;
}

.modal-close:hover {
  color: #333;
  transform: rotate(90deg);
}

.modal-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-divider {
  text-align: center;
  margin: 10px 0 20px;
  position: relative;
}

.form-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e5e9;
}

.form-divider span {
  background: white;
  padding: 0 15px;
  position: relative;
  color: #667eea;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 0.85rem;
}

.form-label i {
  color: #667eea;
  font-size: 0.9rem;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
}

.btn-cancel, .btn-submit {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e8e8e8;
  transform: translateY(-1px);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-left {
    width: 100%;
    justify-content: space-between;
  }
  
  .user-info {
    align-self: flex-end;
  }
  
  .data-table th, .data-table td {
    padding: 12px 15px;
  }
  
  .actions-cell {
    flex-direction: column;
    gap: 5px;
  }
  
  .modal-container {
    width: 95%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-cancel, .btn-submit {
    justify-content: center;
  }
}
</style>