<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <main class="main-content">
      <header class="page-header">
        <div class="header-left">
          <h1 class="page-title">Usuarios</h1>
          <button @click="abrirModal" class="btn-create">
            <i class="fa-solid fa-plus"></i>
            <span>Crear Usuario</span>
          </button>
        </div>
        
        <div class="user-info">
          <div class="user-text">
            <span class="user-name">Administrador</span>
            <span class="user-role">Panel de Usuarios</span>
          </div>
          <div class="avatar-circle">
            <i class="fa-solid fa-user-shield"></i>
          </div>
        </div>
      </header>

      <section class="table-container">
        <div class="table-header">
          <div class="table-title">
            <i class="fa-solid fa-users"></i>
            <span>Listado de Usuarios</span>
          </div>
          <div class="table-stats">
            <span class="stats-badge">{{ listaUsuarios.length }} usuarios registrados</span>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in listaUsuarios" :key="usuario.id_usuario">
                <td class="id-cell">{{ usuario.id_usuario }}</td>
                <td class="name-cell">
                  <div class="user-name-display">
                    <i class="fa-solid fa-user-circle"></i>
                    {{ usuario.nombre }}
                  </div>
                </td>
                <td class="email-cell">
                  <i class="fa-solid fa-envelope"></i>
                  {{ usuario.correo }}
                </td>
                <td class="role-cell">
                  <span :class="['role-badge', getRoleClass(usuario.rol)]">
                    <i :class="getRoleIcon(usuario.rol)"></i>
                    {{ usuario.rol }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button @click="abrirEditar(usuario)" class="btn-edit" title="Editar usuario">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button @click="eliminarUsuario(usuario.id_usuario)" class="btn-delete" title="Eliminar usuario">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="listaUsuarios.length === 0">
                <td colspan="5" class="empty-state">
                  <i class="fa-solid fa-user-slash"></i>
                  <p>No hay usuarios registrados aún</p>
                  <button @click="abrirModal" class="btn-create-mini">Crear primer usuario</button>
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
            <i class="fa-solid" :class="editandoId ? 'fa-user-pen' : 'fa-user-plus'"></i>
            {{ editandoId ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
          </h2>
          <button @click="cerrarModal" class="modal-close" title="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <form @submit.prevent="guardarUsuario" class="modal-form">
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-user"></i>
              Nombre Completo *
            </label>
            <input 
              type="text" 
              v-model="formulario.nombre" 
              required 
              placeholder="Ej: Juan Pérez"
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-envelope"></i>
              Correo Electrónico *
            </label>
            <input 
              type="email" 
              v-model="formulario.email" 
              required 
              placeholder="ejemplo@correo.com"
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-tag"></i>
              Rol *
            </label>
            <select v-model="formulario.rol" required class="form-select">
              <option value="postulante">Postulante</option>
              <option value="gestor">Gestor</option>
              <option value="empresa">Empresa</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-lock"></i>
              Contraseña
              <span v-if="editandoId" class="optional-badge">Opcional</span>
            </label>
            <input 
              type="password" 
              v-model="formulario.password" 
              :placeholder="editandoId ? 'Dejar en blanco para mantener actual' : 'Contraseña (mínimo 6 caracteres)'"
              class="form-input"
            >
            <small v-if="editandoId" class="form-hint">
              <i class="fa-solid fa-info-circle"></i>
              Dejar en blanco para no cambiar la contraseña actual
            </small>
            <small v-else class="form-hint">
              <i class="fa-solid fa-info-circle"></i>
              Si no se especifica, se usará "123456" por defecto
            </small>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="cerrarModal" class="btn-cancel">
              <i class="fa-solid fa-times"></i>
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              <i class="fa-solid" :class="editandoId ? 'fa-save' : 'fa-check'"></i>
              {{ editandoId ? 'Actualizar Usuario' : 'Guardar Usuario' }}
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
  formulario.nombre = ''
  formulario.email = ''
  formulario.rol = 'postulante'
  formulario.password = ''
  mostrarModal.value = true
}

const abrirEditar = (usuario) => {
  editandoId.value = usuario.id_usuario
  formulario.nombre = usuario.nombre
  formulario.email = usuario.correo
  formulario.rol = usuario.rol
  formulario.password = ''
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  editandoId.value = null
  formulario.nombre = ''
  formulario.email = ''
  formulario.rol = 'postulante'
  formulario.password = ''
}

const formulario = reactive({
  nombre: '',
  email: '',
  rol: 'postulante',
  password: ''
})

const listaUsuarios = ref([])

// Cargar usuarios al montar la vista
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
  cargarUsuarios()
})

const getRoleClass = (rol) => {
  const roles = {
    admin: 'role-admin',
    gestor: 'role-gestor',
    empresa: 'role-empresa',
    postulante: 'role-postulante'
  }
  return roles[rol] || 'role-default'
}

const getRoleIcon = (rol) => {
  const icons = {
    admin: 'fa-solid fa-crown',
    gestor: 'fa-solid fa-chart-line',
    empresa: 'fa-solid fa-building',
    postulante: 'fa-solid fa-user'
  }
  return icons[rol] || 'fa-solid fa-user'
}

const guardarUsuario = async () => {
  try {
    const isEdit = editandoId.value !== null
    const url = isEdit 
      ? `http://localhost:3000/users/${editandoId.value}`
      : 'http://localhost:3000/users'
    const method = isEdit ? 'PUT' : 'POST'

    const bodyData = {
      nombre: formulario.nombre,
      email: formulario.email,
      rol: formulario.rol
    }

    if (formulario.password) {
      bodyData.contrasenia = formulario.password
    } else if (!isEdit) {
      // Si es creación, la contraseña es obligatoria. Asignamos una por defecto si no se digita
      bodyData.contrasenia = '123456'
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
      throw new Error(data.message || 'Error al guardar usuario')
    }

    alert(isEdit ? '¡Usuario actualizado con éxito!' : '¡Usuario creado con éxito!')
    cerrarModal()
    cargarUsuarios()
  } catch (err) {
    alert('Error al guardar usuario: ' + err.message)
  }
}

const eliminarUsuario = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return

  try {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar usuario')
    }

    alert('Usuario eliminado correctamente')
    cargarUsuarios()
  } catch (err) {
    alert('Error al eliminar usuario: ' + err.message)
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

.user-name-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name-display i {
  color: #667eea;
  font-size: 1rem;
}

.email-cell i {
  margin-right: 6px;
  color: #999;
  font-size: 0.8rem;
}

.role-cell {
  text-transform: capitalize;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-admin {
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #667eea;
}

.role-gestor {
  background: #e3f2fd;
  color: #1976d2;
}

.role-empresa {
  background: #fff3e0;
  color: #f57c00;
}

.role-postulante {
  background: #e8f5e9;
  color: #388e3c;
}

.role-default {
  background: #f5f5f5;
  color: #666;
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
  width: 500px;
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

.optional-badge {
  margin-left: 8px;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: normal;
  color: #666;
}

.form-input, .form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  color: #888;
  font-size: 0.7rem;
}

.form-hint i {
  font-size: 0.7rem;
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
}
</style>