<template>
  <div class="admin-layout">
    
<SidebarAdmin />

    <main style="margin-left: 250px; flex: 1; padding: 30px;">
      
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <h1 style="font-size: 2rem; font-weight: bold; color: #333;">Vacantes</h1>
          <button @click="abrirModal" style="background: #0033ff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
            <i class="fa-solid fa-plus"></i> Crear Vacante
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
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">Título</th>
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">Empresa</th>
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">Fecha</th>
              <th style="padding: 20px; font-size: 0.9rem; color: #333; font-weight: bold;">Acciones</th>
            </tr>
          </thead>
          <tbody style="color: #666; font-size: 0.9rem;">
            <tr v-for="vacante in listaVacantes" :key="vacante.id_vacante" style="border-bottom: 1px solid #eee;">
              <td style="padding: 15px 20px;">{{ vacante.id_vacante }}</td>
              <td style="padding: 15px 20px;">{{ vacante.titulo }}</td>
              <td style="padding: 15px 20px;">{{ vacante.empresa_nombre || 'N/A' }}</td>
              <td style="padding: 15px 20px;">{{ vacante.fecha_publicacion ? new Date(vacante.fecha_publicacion).toLocaleDateString() : 'N/A' }}</td>
              <td style="padding: 15px 20px;">
                <button @click="abrirEditar(vacante)" style="margin-right: 10px; color: #0033ff; background: none; border: none; cursor: pointer;">Editar</button>
                <button @click="eliminarVacante(vacante.id_vacante)" style="color: red; background: none; border: none; cursor: pointer;">Eliminar</button>
              </td>
            </tr>
            <tr v-if="listaVacantes.length === 0">
              <td colspan="5" style="padding: 20px; text-align: center;">No hay vacantes registradas.</td>
            </tr>
          </tbody>
        </table>
      </section>

    </main>

    <div v-if="mostrarModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
      <div style="background: white; padding: 30px; border-radius: 12px; width: 500px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
        <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">Crear Vacante</h2>
        
        <form @submit.prevent="guardarVacante">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Título</label>
            <input type="text" v-model="formulario.titulo" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Empresa</label>
            <select v-model="formulario.id_empresa" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
              <option value="">Seleccione una empresa...</option>
              <option v-for="empresa in listaEmpresas" :key="empresa.id_empresa" :value="empresa.id_empresa">
                {{ empresa.nombre }}
              </option>
            </select>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Ubicación</label>
            <select v-model="formulario.ubicacion" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
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
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Descripción</label>
            <textarea v-model="formulario.descripcion" rows="3" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;"></textarea>
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
  formulario.id_empresa = ''
  formulario.ubicacion = ''
  formulario.descripcion = ''
  mostrarModal.value = true
}

const abrirEditar = (vacante) => {
  editandoId.value = vacante.id_vacante
  formulario.titulo = vacante.titulo
  formulario.id_empresa = vacante.id_empresa || ''
  formulario.ubicacion = vacante.ubicacion || ''
  formulario.descripcion = vacante.descripcion || ''
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  editandoId.value = null
  formulario.titulo = ''
  formulario.id_empresa = ''
  formulario.ubicacion = ''
  formulario.descripcion = ''
}

const formulario = reactive({
  titulo: '',
  id_empresa: '',
  ubicacion: '',
  descripcion: ''
})

const listaVacantes = ref([])
const listaEmpresas = ref([])

const cargarVacantes = async () => {
  try {
    const response = await fetch('http://localhost:3000/vacantes')
    if (response.ok) {
      listaVacantes.value = await response.json()
    }
  } catch (err) {
    console.error('Error al cargar vacantes:', err)
  }
}

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
  cargarVacantes()
  cargarEmpresas()
})

const guardarVacante = async () => {
  try {
    const isEdit = editandoId.value !== null
    const url = isEdit 
      ? `http://localhost:3000/vacantes/${editandoId.value}`
      : 'http://localhost:3000/vacantes'
    const method = isEdit ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo: formulario.titulo,
        id_empresa: formulario.id_empresa,
        ubicacion: formulario.ubicacion,
        descripcion: formulario.descripcion
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al guardar vacante')
    }

    alert(isEdit ? '¡Vacante actualizada con éxito!' : '¡Vacante creada con éxito!')
    cerrarModal()
    cargarVacantes()
  } catch (err) {
    alert('Error al guardar vacante: ' + err.message)
  }
}

const eliminarVacante = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta vacante?')) return

  try {
    const response = await fetch(`http://localhost:3000/vacantes/${id}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar vacante')
    }

    alert('Vacante eliminada exitosamente')
    cargarVacantes()
  } catch (err) {
    alert('Error al eliminar vacante: ' + err.message)
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