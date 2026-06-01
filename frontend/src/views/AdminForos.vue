<template>
  <div class="admin-layout">
    
<SidebarAdmin />

    <main style="margin-left: 250px; flex: 1; padding: 30px;">
      
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <h1 style="font-size: 2rem; font-weight: bold; color: #333;">Foros</h1>
          <button @click="abrirModal" style="background: #0033ff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
            <i class="fa-solid fa-plus"></i> Crear Foro
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
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">ID</th>
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">Título de foro</th>
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">Usuario publicador</th>
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">Fecha</th>
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">Estado</th>
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">Acciones</th>
            </tr>
          </thead>
          <tbody style="color: #666; font-size: 0.9rem;">
            <tr v-for="foro in listaForos" :key="foro.id_foro" style="border-bottom: 1px solid #eee;">
              <td style="padding: 15px 20px;">{{ foro.id_foro }}</td>
              <td style="padding: 15px 20px;">{{ foro.titulo }}</td>
              <td style="padding: 15px 20px;">{{ foro.usuario_nombre || 'Desconocido' }}</td>
              <td style="padding: 15px 20px;">{{ foro.fecha_creacion ? new Date(foro.fecha_creacion).toLocaleDateString() : 'N/A' }}</td>
              <td style="padding: 15px 20px;">
                <span :style="{ color: foro.cerrado ? 'red' : 'green', fontWeight: 'bold' }">
                  {{ foro.cerrado ? 'Cerrado' : 'Activo' }}
                </span>
              </td>
              <td style="padding: 15px 20px;">
                <button @click="abrirEditar(foro)" style="margin-right: 10px; color: #0033ff; background: none; border: none; cursor: pointer;">Editar</button>
                <button @click="eliminarForo(foro.id_foro)" style="color: red; background: none; border: none; cursor: pointer;">Eliminar</button>
              </td>
            </tr>
            <tr v-if="listaForos.length === 0">
              <td colspan="6" style="padding: 20px; text-align: center;">No hay foros registrados.</td>
            </tr>
          </tbody>
        </table>
      </section>

    </main>

    <div v-if="mostrarModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
      <div style="background: white; padding: 30px; border-radius: 12px; width: 500px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
        <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">Crear Foro</h2>
        
        <form @submit.prevent="guardarForo">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Título</label>
            <input type="text" v-model="formulario.titulo" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Usuario (Autor)</label>
            <select v-model="formulario.id_usuario" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
              <option value="">Seleccione un usuario...</option>
              <option v-for="usuario in listaUsuarios" :key="usuario.id_usuario" :value="usuario.id_usuario">
                {{ usuario.nombre }} ({{ usuario.rol }})
              </option>
            </select>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Contenido</label>
            <textarea v-model="formulario.contenido" rows="4" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;"></textarea>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: flex; align-items: center; gap: 10px; color: #666; font-size: 0.9rem; cursor: pointer;">
              <input type="checkbox" v-model="formulario.cerrado"> Foro Cerrado (No admite comentarios)
            </label>
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
  background-color: #f8faff;
  margin: 0;
  min-height: 100vh;
}
</style>