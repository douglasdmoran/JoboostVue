<template>
  <div class="admin-layout">
    
<SidebarAdmin />

    <main style="margin-left: 250px; flex: 1; padding: 30px;">
      
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <h1 style="font-size: 2rem; font-weight: bold; color: #333;">Usuarios</h1>
          <button @click="abrirModal" style="background: #0033ff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
            <i class="fa-solid fa-plus"></i> Crear Usuario
          </button>
        </div>
        
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="text-align: right;">
            <span style="display: block; font-weight: bold; font-size: 0.9rem;">Nombre</span>
            <span style="font-size: 0.8rem; color: #888;">Admin</span>
          </div>
          <div class="avatar-circle" style="background: #ffcdd2; width: 45px; height: 45px;"></div>
        </div>
      </header>

      <section style="background: white; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); overflow: hidden; border: 1px solid #eee;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #fafbfc; border-bottom: 1px solid #eee;">
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">ID</th>
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">Nombre</th>
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">Correo</th>
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">Rol</th>
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">Acciones</th>
            </tr>
          </thead>
          <tbody style="color: #666; font-size: 0.85rem;">
            <tr v-for="usuario in listaUsuarios" :key="usuario.id_usuario" style="border-bottom: 1px solid #eee;">
              <td style="padding: 15px 20px;">{{ usuario.id_usuario }}</td>
              <td style="padding: 15px 20px;">{{ usuario.nombre }}</td>
              <td style="padding: 15px 20px;">{{ usuario.correo }}</td>
              <td style="padding: 15px 20px; text-transform: capitalize;">{{ usuario.rol }}</td>
              <td style="padding: 15px 20px;">
                <button @click="abrirEditar(usuario)" style="margin-right: 10px; color: #0033ff; background: none; border: none; cursor: pointer;">Editar</button>
                <button @click="eliminarUsuario(usuario.id_usuario)" style="color: red; background: none; border: none; cursor: pointer;">Eliminar</button>
              </td>
            </tr>
            <tr v-if="listaUsuarios.length === 0">
              <td colspan="5" style="padding: 20px; text-align: center;">No hay usuarios registrados.</td>
            </tr>
          </tbody>
        </table>
      </section>

    </main>

    <div v-if="mostrarModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
      <div style="background: white; padding: 30px; border-radius: 12px; width: 400px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
        <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">Crear Usuario</h2>
        
        <form @submit.prevent="guardarUsuario">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Nombre Completo</label>
            <input type="text" v-model="formulario.nombre" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Correo Electrónico</label>
            <input type="email" v-model="formulario.email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Rol</label>
            <select v-model="formulario.rol" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
              <option value="postulante">Postulante</option>
              <option value="gestor">Gestor</option>
              <option value="empresa">Empresa</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Contraseña</label>
            <input type="password" v-model="formulario.password" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
            <small style="color: #888; font-size: 0.8rem;">Dejar en blanco para no cambiar (al editar)</small>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" @click="cerrarModal" style="padding: 10px 15px; border: none; background: #eee; color: #333; border-radius: 6px; cursor: pointer;">Cancelar</button>
            <button type="submit" style="padding: 10px 15px; border: none; background: #0033ff; color: white; border-radius: 6px; cursor: pointer;">Guardar</button>
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
  background-color: #f8faff;
  margin: 0;
  min-height: 100vh;
}
</style>