<template>
  <div class="admin-layout">
    
<SidebarAdmin />

    <main style="margin-left: 250px; flex: 1; padding: 30px;">
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
        <h1 style="font-size: 2rem; font-weight: bold; color: #333;">Dashboard</h1>
        
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="text-align: right;">
            <span style="display: block; font-weight: bold; font-size: 0.9rem;">Admin</span>
            <span style="font-size: 0.8rem; color: #888;">Panel de Empresa</span>
          </div>
          <div class="avatar-circle" style="background: #ffcdd2; width: 45px; height: 45px;"></div>
        </div>
      </header>

      <section style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 40px;">
        <div style="background: white; padding: 30px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
          <div>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 10px;">Usuarios totales</p>
            <h2 style="font-size: 2rem; font-weight: bold;">{{ totalUsuarios }}</h2>
          </div>
          <div style="background: #f0f3ff; color: #0033ff; padding: 15px; border-radius: 12px;">
            <i class="fa-solid fa-users" style="font-size: 1.5rem;"></i>
          </div>
        </div>

        <div style="background: white; padding: 30px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
          <div>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 10px;">Empresas</p>
            <h2 style="font-size: 2rem; font-weight: bold;">{{ totalEmpresas }}</h2>
          </div>
          <div style="background: #fff8f0; color: #f39c12; padding: 15px; border-radius: 12px;">
            <i class="fa-solid fa-building" style="font-size: 1.5rem;"></i>
          </div>
        </div>

        <div style="background: white; padding: 30px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
          <div>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 10px;">Foros</p>
            <h2 style="font-size: 2rem; font-weight: bold;">{{ totalForos }}</h2>
          </div>
          <div style="background: #e6fffa; color: #38b2ac; padding: 15px; border-radius: 12px;">
            <i class="fa-solid fa-list-check" style="font-size: 1.5rem;"></i>
          </div>
        </div>
      </section>

      <section style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 1.2rem; font-weight: bold;">Vacantes publicadas</h3>
          <select style="padding: 5px 15px; border-radius: 5px; border: 1px solid #ddd; color: #888; font-size: 0.8rem;">
            <option>Marzo</option>
          </select>
        </div>
        
        <div style="width: 100%; height: 300px; background: #fdfdfd; display: flex; align-items: center; justify-content: center; border: 1px dashed #eee; position: relative;">
          <div style="position: absolute; bottom: 40px; width: 90%; height: 150px; border-bottom: 1px solid #eee;">
            <svg viewBox="0 0 500 100" style="width: 100%; height: 100%;">
              <path d="M0,80 L50,75 L100,60 L150,70 L200,40 L250,55 L300,20 L350,45 L400,30 L450,50 L500,35" fill="none" stroke="#0033ff" stroke-width="2" />
            </svg>
          </div>
        </div>
      </section>
    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// Estas variables manejarán los datos del dashboard. 
// Por ahora inician en 0, luego los conectaremos a tu backend.
const totalUsuarios = ref(0)
const totalEmpresas = ref(0)
const totalForos = ref(0)

// Función para manejar el cierre de sesión
const cerrarSesion = () => {
  console.log('Cerrando sesión de administrador...')
  // Aquí agregaremos la lógica para limpiar el token y redirigir al login
}
</script>

<style scoped>
/* Movemos las propiedades del body aquí para no afectar otras pantallas */
.admin-layout {
  display: flex;
  background-color: #f8faff;
  margin: 0;
  min-height: 100vh;
}
</style>