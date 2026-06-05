<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <main class="main-content">
      <header class="page-header">
        <div class="header-left">
          <h1 class="page-title">Foros</h1>
          <button @click="abrirModal" class="btn-create">
            <i class="fa-solid fa-plus"></i>
            <span>Crear Foro</span>
          </button>
        </div>
        
        <div class="user-info">
          <div class="user-text">
            <span class="user-name">Administrador</span>
            <span class="user-role">Panel de Foros</span>
          </div>
          <div class="avatar-circle">
            <i class="fa-solid fa-comments"></i>
          </div>
        </div>
      </header>

      <section class="table-container">
        <div class="table-header">
          <div class="table-title">
            <i class="fa-solid fa-message"></i>
            <span>Listado de Foros</span>
          </div>
          <div class="table-stats">
            <span class="stats-badge">{{ listaForos.length }} foros creados</span>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título del Foro</th>
                <th>Usuario Publicador</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="foro in listaForos" :key="foro.id_foro">
                <td class="id-cell">{{ foro.id_foro }}</td>
                <td class="title-cell">
                  <div class="title-content">
                    <i class="fa-solid fa-comment"></i>
                    {{ foro.titulo }}
                  </div>
                </td>
                <td class="user-cell">
                  <div class="user-badge">
                    <i class="fa-solid fa-user"></i>
                    {{ foro.usuario_nombre || 'Desconocido' }}
                  </div>
                </td>
                <td class="date-cell">
                  <i class="fa-solid fa-calendar"></i>
                  {{ foro.fecha_creacion ? new Date(foro.fecha_creacion).toLocaleDateString() : 'N/A' }}
                </td>
                <td class="status-cell">
                  <span :class="['status-badge', foro.cerrado ? 'status-closed' : 'status-active']">
                    <i :class="foro.cerrado ? 'fa-solid fa-lock' : 'fa-solid fa-unlock-alt'"></i>
                    {{ foro.cerrado ? 'Cerrado' : 'Activo' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button @click="abrirEditar(foro)" class="btn-edit" title="Editar foro">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button @click="eliminarForo(foro.id_foro)" class="btn-delete" title="Eliminar foro">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="listaForos.length === 0">
                <td colspan="6" class="empty-state">
                  <i class="fa-solid fa-comment-slash"></i>
                  <p>No hay foros creados aún</p>
                  <button @click="abrirModal" class="btn-create-mini">Crear primer foro</button>
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
            {{ editandoId ? 'Editar Foro' : 'Crear Nuevo Foro' }}
          </h2>
          <button @click="cerrarModal" class="modal-close" title="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <form @submit.prevent="guardarForo" class="modal-form">
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-heading"></i>
              Título del Foro *
            </label>
            <input 
              type="text" 
              v-model="formulario.titulo" 
              required 
              placeholder="Ej: Ayuda con búsqueda de empleo"
              class="form-input"
            >
          </div>
          
          <div v-if="!editandoId" class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-user"></i>
              Usuario Autor *
            </label>
            <select v-model="formulario.id_usuario" required class="form-select">
              <option value="">Seleccione un usuario...</option>
              <option v-for="usuario in listaUsuarios" :key="usuario.id_usuario" :value="usuario.id_usuario">
                {{ usuario.nombre }} ({{ usuario.rol || 'usuario' }})
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-file-alt"></i>
              Contenido del Foro *
            </label>
            <textarea 
              v-model="formulario.contenido" 
              rows="5" 
              required
              placeholder="Describe el tema del foro, comparte información o haz una pregunta..."
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formulario.cerrado">
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">
                <i class="fa-solid fa-lock"></i>
                Foro Cerrado (No admite nuevos comentarios)
              </span>
            </label>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="cerrarModal" class="btn-cancel">
              <i class="fa-solid fa-times"></i>
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              <i class="fa-solid" :class="editandoId ? 'fa-save' : 'fa-check'"></i>
              {{ editandoId ? 'Actualizar Foro' : 'Guardar Foro' }}
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

const abrirModal = () => {
  editandoId.value = null
  formulario.titulo = ''
  formulario.id_usuario = ''
  formulario.contenido = ''
  formulario.cerrado = false
  mostrarModal.value = true
}

const abrirEditar = (foro) => {
  editandoId.value = foro.id_foro
  formulario.titulo = foro.titulo
  formulario.id_usuario = foro.id_usuario || ''
  formulario.contenido = foro.contenido || ''
  formulario.cerrado = foro.cerrado || false
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  editandoId.value = null
  formulario.titulo = ''
  formulario.id_usuario = ''
  formulario.contenido = ''
  formulario.cerrado = false
}

const formulario = reactive({
  titulo: '',
  id_usuario: '',
  contenido: '',
  cerrado: false
})

const listaForos = ref([])
const listaUsuarios = ref([])

const cargarForos = async () => {
  try {
    const response = await fetch('http://localhost:3000/foros')
    if (response.ok) {
      listaForos.value = await response.json()
    }
  } catch (err) {
    console.error('Error al cargar foros:', err)
  }
}

const cargarUsuarios = async () => {
  try {
    const response = await fetch('http://localhost:3000/users')
    if (response.ok) {
      listaUsuarios.value = await response.json()
    }
  } catch (err) {
    console.error('Error al cargar usuarios:', err)
  }
}

onMounted(() => {
  cargarForos()
  cargarUsuarios()
})

const guardarForo = async () => {
  try {
    const isEdit = editandoId.value !== null
    const url = isEdit 
      ? `http://localhost:3000/foros/${editandoId.value}`
      : 'http://localhost:3000/foros'
    const method = isEdit ? 'PUT' : 'POST'

    const bodyData = {
      titulo: formulario.titulo,
      contenido: formulario.contenido,
      cerrado: formulario.cerrado
    }

    if (!isEdit) {
      bodyData.id_usuario = formulario.id_usuario
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al guardar foro')
    }

    alert(isEdit ? '¡Foro actualizado con éxito!' : '¡Foro creado con éxito!')
    cerrarModal()
    cargarForos()
  } catch (err) {
    alert('Error al guardar foro: ' + err.message)
  }
}

const eliminarForo = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este foro?')) return

  try {
    const response = await fetch(`http://localhost:3000/foros/${id}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar foro')
    }

    alert('Foro eliminado exitosamente')
    cargarForos()
  } catch (err) {
    alert('Error al eliminar foro: ' + err.message)
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

.title-cell {
  font-weight: 500;
  color: #333;
}

.title-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-content i {
  color: #667eea;
}

.user-cell .user-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0f3ff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.user-badge i {
  color: #667eea;
}

.date-cell {
  font-family: monospace;
  font-size: 0.8rem;
}

.date-cell i {
  margin-right: 6px;
  color: #999;
}

.status-cell {
  text-align: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active {
  background: #e6f7e6;
  color: #2e7d32;
}

.status-closed {
  background: #ffebee;
  color: #c62828;
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
  border-bottom: 1px solid #eef2f6;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
  border-radius: 20px 20px 0 0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
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
  min-height: 100px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input:checked + .checkbox-custom {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

.checkbox-text {
  color: #555;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
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

/* Scrollbar personalizada */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #555;
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
  
  .user-cell .user-badge {
    font-size: 0.7rem;
  }
  
  .status-badge {
    font-size: 0.7rem;
  }
}
</style>