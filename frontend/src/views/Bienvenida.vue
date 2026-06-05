<template>
  <div class="candidate-home">
    <NavbarCandidate />
    
    <main>
      <!-- Hero Section con búsqueda -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Encuentra tu oportunidad laboral ideal</h1>
          <p class="hero-subtitle">Conectamos talento con las mejores empresas del país</p>
        </div>
        
        <div class="search-section">
          <div class="search-container">
            <div class="search-input-wrapper">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                placeholder="Buscar por cargo o palabra clave" 
                class="search-input"
              >
            </div>
            <div class="search-input-wrapper">
              <i class="fa-solid fa-location-dot search-icon"></i>
              <input 
                type="text" 
                placeholder="Ubicación" 
                class="search-input location-input"
              >
            </div>
            <button class="btn-search" @click="advertirLogin">
              <i class="fa-solid fa-magnifying-glass"></i>
              Buscar
            </button>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon activos-icon">
              <i class="fa-solid fa-users"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Usuarios Activos</span>
              <strong class="stat-number">{{ estadisticas.activos.toLocaleString() }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon empleos-icon">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Vacantes Disponibles</span>
              <strong class="stat-number">{{ estadisticas.empleos.toLocaleString() }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon empresas-icon">
              <i class="fa-solid fa-building"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Empresas Asociadas</span>
              <strong class="stat-number">{{ estadisticas.empresas.toLocaleString() }}</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- Steps Section -->
      <section class="steps-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">¿Cómo funciona JobBoost?</h2>
            <p class="section-subtitle">Sigue estos simples pasos para encontrar el trabajo de tus sueños</p>
          </div>
          
          <div class="steps-grid">
            <div class="step-card" v-for="(step, index) in steps" :key="index">
              <div class="step-number">{{ step.number }}</div>
              <div class="step-content">
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-description">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavbarCandidate from '../components/NavbarCandidate.vue'

const estadisticas = ref({ activos: 0, empleos: 0, empresas: 0 })

const steps = [
  {
    number: 1,
    title: 'Crea tu cuenta',
    description: 'Ingresa tu nombre y un correo electrónico para poder crear tu cuenta.'
  },
  {
    number: 2,
    title: 'Completa tu CV',
    description: 'Completa la información que se te solicita, como datos personales, formación académica, entre otros.'
  },
  {
    number: 3,
    title: 'Explora ofertas',
    description: 'Encuentra ofertas de empleo acorde a tu perfil ocupacional.'
  },
  {
    number: 4,
    title: 'Postúlate en oferta',
    description: 'Envía tu información a las vacantes que más te interesen con un solo clic.'
  },
  {
    number: 5,
    title: 'Retroalimentación',
    description: 'Un Gestor de Empleo se comunicará contigo para el respectivo seguimiento a tu proceso.'
  },
  {
    number: 6,
    title: 'Fase de selección',
    description: 'La empresa interesada se pondrá en contacto contigo para realizar los respectivos procesos antes de tu contratación.'
  }
]

const cargarEstadisticas = async () => {
  try {
    const response = await fetch('http://localhost:3000/estadisticas')
    if (response.ok) {
      estadisticas.value = await response.json()
    }
  } catch (err) {
    console.error('Error al cargar estadísticas:', err)
  }
}

const advertirLogin = () => {
  alert('Debes iniciar sesión para realizar búsquedas')
}

onMounted(() => {
  cargarEstadisticas()
})
</script>

<style scoped>
.candidate-home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
  background-size: cover;
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.search-section {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-container {
  background: white;
  border-radius: 60px;
  padding: 8px;
  display: flex;
  gap: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.search-input-wrapper {
  position: relative;
  flex: 2;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 20px;
  color: #999;
  font-size: 1.1rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  color: #333;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.location-input {
  flex: 1;
}

.btn-search {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0 30px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Stats Section */
.stats-section {
  padding: 60px 20px;
  background: white;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  padding: 30px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.activos-icon {
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #667eea;
}

.empleos-icon {
  background: linear-gradient(135deg, #f39c1220 0%, #e67e2220 100%);
  color: #f39c12;
}

.empresas-icon {
  background: linear-gradient(135deg, #38b2ac20 0%, #31979520 100%);
  color: #38b2ac;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

/* Steps Section */
.steps-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
}

.section-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.step-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  display: flex;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.step-description {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .search-container {
    flex-direction: column;
    border-radius: 20px;
    padding: 15px;
  }
  
  .search-input-wrapper {
    flex: auto;
  }
  
  .btn-search {
    padding: 14px;
    justify-content: center;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
  }
  
  .step-card {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-icon {
    width: 55px;
    height: 55px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 20px 80px;
  }
  
  .stats-section, .steps-section {
    padding: 40px 20px;
  }
  
  .step-card {
    flex-direction: column;
    text-align: center;
  }
  
  .step-number {
    margin: 0 auto;
  }
}
</style>
