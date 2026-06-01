<template>
  <div class="admin-layout">
    
<SidebarAdmin />

    <main style="margin-left: 250px; flex: 1; padding: 30px;">
      
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <h1 style="font-size: 2rem; font-weight: bold; color: #333;">Empresas</h1>
          <button @click="abrirModal" style="background: #0033ff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
            <i class="fa-solid fa-plus"></i> Crear Empresa
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
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">Ubicación</th>
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">Sitio Web</th>
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">Acciones</th>
            </tr>
          </thead>
          <tbody style="color: #666; font-size: 0.85rem;">
            <tr v-for="empresa in listaEmpresas" :key="empresa.id_empresa" style="border-bottom: 1px solid #eee;">
              <td style="padding: 15px 20px;">{{ empresa.id_empresa }}</td>
              <td style="padding: 15px 20px;">{{ empresa.nombre }}</td>
              <td style="padding: 15px 20px;">{{ empresa.ubicacion }}</td>
              <td style="padding: 15px 20px;">{{ empresa.sitio_web || 'N/A' }}</td>
              <td style="padding: 15px 20px;">
                <button @click="abrirEditar(empresa)" style="margin-right: 10px; color: #0033ff; background: none; border: none; cursor: pointer;">Editar</button>
                <button @click="eliminarEmpresa(empresa.id_empresa)" style="color: red; background: none; border: none; cursor: pointer;">Eliminar</button>
              </td>
            </tr>
            <tr v-if="listaEmpresas.length === 0">
              <td colspan="5" style="padding: 20px; text-align: center;">No hay empresas registradas aún.</td>
            </tr>
          </tbody>
        </table>
      </section>

    </main>

    <div v-if="mostrarModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
      <div style="background: white; padding: 30px; border-radius: 12px; width: 500px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
        <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">Crear Empresa</h2>
        
        <form @submit.prevent="guardarEmpresa">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Nombre</label>
            <input type="text" v-model="formulario.nombre" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
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
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Sitio Web</label>
            <input type="text" v-model="formulario.sitioWeb" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Descripción</label>
            <textarea v-model="formulario.descripcion" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;"></textarea>
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
  formulario.nombre = ''
  formulario.ubicacion = ''
  formulario.sitio_web = ''
  formulario.descripcion = ''
  mostrarModal.value = true
}

const abrirEditar = (empresa) => {
  editandoId.value = empresa.id_empresa
  formulario.nombre = empresa.nombre
  formulario.ubicacion = empresa.ubicacion || ''
  formulario.sitio_web = empresa.sitio_web || ''
  formulario.descripcion = empresa.descripcion || ''
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  editandoId.value = null
  formulario.nombre = ''
  formulario.ubicacion = ''
  formulario.sitio_web = ''
  formulario.descripcion = ''
}

const formulario = reactive({
  nombre: '',
  ubicacion: '',
  sitio_web: '',
  descripcion: ''
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

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: formulario.nombre,
        ubicacion: formulario.ubicacion,
        sitio_web: formulario.sitio_web,
        descripcion: formulario.descripcion
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al guardar empresa')
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
  background-color: #f8faff;
  margin: 0;
  min-height: 100vh;
}
</style>