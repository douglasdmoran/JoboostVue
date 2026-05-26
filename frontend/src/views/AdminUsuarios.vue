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
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">Documento</th>
              <th style="padding: 20px; font-size: 0.8rem; color: #333; font-weight: bold; text-transform: uppercase;">Acciones</th>
            </tr>
          </thead>
          <tbody style="color: #666; font-size: 0.85rem;">
            <tr v-for="usuario in listaUsuarios" :key="usuario.id" style="border-bottom: 1px solid #eee;">
              <td style="padding: 15px 20px;">{{ usuario.id }}</td>
              <td style="padding: 15px 20px;">{{ usuario.nombre }}</td>
              <td style="padding: 15px 20px;">{{ usuario.email }}</td>
              <td style="padding: 15px 20px;">{{ usuario.documento }}</td>
              <td style="padding: 15px 20px;">
                <button style="margin-right: 10px; color: #0033ff; background: none; border: none; cursor: pointer;">Editar</button>
                <button style="color: red; background: none; border: none; cursor: pointer;">Eliminar</button>
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
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Documento</label>
            <input type="text" v-model="formulario.documento" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
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
import { ref, reactive } from 'vue'

// 1. Control de visualización del Modal
const mostrarModal = ref(false)

const abrirModal = () => {
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  // Limpiamos los campos del formulario
  formulario.nombre = ''
  formulario.email = ''
  formulario.rol = 'postulante' // Valor por defecto
  formulario.documento = ''
  formulario.password = ''
}

// 2. Estado reactivo para los datos del formulario
const formulario = reactive({
  nombre: '',
  email: '',
  rol: 'postulante', // Inicializado con el primer option
  documento: '',
  password: ''
})

// 3. Arreglo reactivo para simular los usuarios de la base de datos
const listaUsuarios = ref([
  { id: 1, nombre: 'Ana López', email: 'ana@example.com', rol: 'postulante', documento: '05489721-5' },
  { id: 2, nombre: 'Carlos Ruiz', email: 'cruiz@empresa.com', rol: 'empresa', documento: '03158962-1' }
])

// 4. Funciones
const guardarUsuario = () => {
  console.log('Datos del usuario a guardar:', formulario)
  // Aquí se implementará la llamada a tu API (ej. Axios a tu backend Node.js)
  
  cerrarModal()
}

const cerrarSesion = () => {
  console.log('Cerrando sesión...')
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