<template>
  <div>
    <NavbarCandidate />
    
    <main>
      <section class="search-section">
        <div class="search-container">
          <div style="position: relative; flex: 2; display: flex; align-items: center;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 15px; color: #888;"></i>
            <input type="text" placeholder="Buscar por cargo o palabra clave" style="padding-left: 45px; width: 100%;">
          </div>
          <div style="position: relative; flex: 1; display: flex; align-items: center;">
            <i class="fa-solid fa-location-dot" style="position: absolute; left: 15px; color: #888;"></i>
            <input type="text" placeholder="Ubicación" style="padding-left: 45px; width: 100%; border: none; outline: none; font-size: 1rem; color: #333; background: transparent;">
          </div>
          <button class="btn-primary" @click="advertirLogin">
            Buscar
          </button>
        </div>
      </section>

      <section class="stats-bar">
        <div class="stat-item" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
          <i class="fa-solid fa-users" style="font-size: 2rem; color: #333;"></i>
          <div style="text-align: left;">
            <small>Activos</small><br>
            <strong>50,000,080</strong>
          </div>
        </div>
        <div class="stat-item" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
          <i class="fa-solid fa-briefcase" style="font-size: 2rem; color: #333;"></i>
          <div style="text-align: left;">
            <small>Empleos</small><br>
            <strong>8,000</strong>
          </div>
        </div>
        <div class="stat-item" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
          <i class="fa-solid fa-building" style="font-size: 2rem; color: #333;"></i>
          <div style="text-align: left;">
            <small>Empresas</small><br>
            <strong>44,000</strong>
          </div>
        </div>
      </section>

      <section class="container">
        <div class="steps-grid">
          <div class="step">
            <span style="background: #dbeafe; color: #1e40af; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; border-radius: 4px; font-weight: bold;">1</span>
            <h3>Crea tu cuenta</h3>
            <p>Ingresa tu nombre y un correo electrónico para poder crear tu cuenta.</p>
          </div>
          <div class="step">
            <span style="background: #dbeafe; color: #1e40af; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; border-radius: 4px; font-weight: bold;">2</span>
            <h3>Completa tu CV</h3>
            <p>Completa la información que se te solicita, como datos personales, formación académica, entre otros.</p>
          </div>
          <div class="step">
            <span style="background: #dbeafe; color: #1e40af; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; border-radius: 4px; font-weight: bold;">3</span>
            <h3>Explora ofertas</h3>
            <p>Encuentra ofertas de empleo acorde a tu perfil ocupacional.</p>
          </div>
          <div class="step">
            <span style="background: #dbeafe; color: #1e40af; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; border-radius: 4px; font-weight: bold;">4</span>
            <h3>Postúlate en oferta</h3>
            <p>Envía tu información a las vacantes que más te interesen con un solo clic.</p>
          </div>
          <div class="step">
            <span style="background: #dbeafe; color: #1e40af; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; border-radius: 4px; font-weight: bold;">5</span>
            <h3>Retroalimentación</h3>
            <p>Un Gestor de Empleo se comunicará contigo para el respectivo seguimiento a tu proceso.</p>
          </div>
          <div class="step">
            <span style="background: #dbeafe; color: #1e40af; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; border-radius: 4px; font-weight: bold;">6</span>
            <h3>Fase de selección</h3>
            <p>La empresa interesada se pondrá en contacto contigo para realizar los respectivos procesos antes de tu contratación.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import NavbarCandidate from '../components/NavbarCandidate.vue'

const advertirLogin = () => {
  alert('Debes iniciar sesión para realizar búsquedas')
}
</script>

<style scoped>
</style>
