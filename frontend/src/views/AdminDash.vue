<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <main class="main-content">
      <header class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Dashboard</h1>
          <p class="dashboard-subtitle">Bienvenido al panel de administración</p>
        </div>
        
        <div class="user-info">
          <div class="user-text">
            <span class="user-name">Administrador</span>
            <span class="user-role">Panel de Control</span>
          </div>
          <div class="avatar-circle">
            <i class="fa-solid fa-user"></i>
          </div>
        </div>
      </header>

      <section class="stats-grid">
        <div class="stat-card stat-card-users">
          <div class="stat-info">
            <p class="stat-label">Usuarios totales</p>
            <h2 class="stat-value">{{ totalUsuarios }}</h2>
          </div>
          <div class="stat-icon">
            <i class="fa-solid fa-users"></i>
          </div>
        </div>

        <div class="stat-card stat-card-companies">
          <div class="stat-info">
            <p class="stat-label">Empresas</p>
            <h2 class="stat-value">{{ totalEmpresas }}</h2>
          </div>
          <div class="stat-icon">
            <i class="fa-solid fa-building"></i>
          </div>
        </div>

        <div class="stat-card stat-card-forums">
          <div class="stat-info">
            <p class="stat-label">Foros</p>
            <h2 class="stat-value">{{ totalForos }}</h2>
          </div>
          <div class="stat-icon">
            <i class="fa-solid fa-list-check"></i>
          </div>
        </div>
      </section>

      <section class="vacancies-section">
        <div class="section-header">
          <h3 class="section-title">Vacantes publicadas</h3>
          <select class="month-selector">
            <option>Enero</option>
            <option>Febrero</option>
            <option selected>Marzo</option>
            <option>Abril</option>
            <option>Mayo</option>
            <option>Junio</option>
          </select>
        </div>
        
        <div class="chart-container">
          <div class="chart-wrapper">
            <svg viewBox="0 0 500 100" class="chart-svg">
              <path d="M0,80 L50,75 L100,60 L150,70 L200,40 L250,55 L300,20 L350,45 L400,30 L450,50 L500,35" 
                    fill="none" 
                    stroke="#667eea" 
                    stroke-width="3" 
                    stroke-linecap="round"
                    stroke-linejoin="round" />
              <circle cx="0" cy="80" r="3" fill="#667eea" />
              <circle cx="50" cy="75" r="3" fill="#667eea" />
              <circle cx="100" cy="60" r="3" fill="#667eea" />
              <circle cx="150" cy="70" r="3" fill="#667eea" />
              <circle cx="200" cy="40" r="3" fill="#667eea" />
              <circle cx="250" cy="55" r="3" fill="#667eea" />
              <circle cx="300" cy="20" r="3" fill="#667eea" />
              <circle cx="350" cy="45" r="3" fill="#667eea" />
              <circle cx="400" cy="30" r="3" fill="#667eea" />
              <circle cx="450" cy="50" r="3" fill="#667eea" />
              <circle cx="500" cy="35" r="3" fill="#667eea" />
            </svg>
          </div>
          <p class="chart-note">Tendencia de vacantes en los últimos meses</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const totalUsuarios = ref(0)
const totalEmpresas = ref(0)
const totalForos = ref(0)

onMounted(async () => {
  try {
    // Consultamos en paralelo los endpoints para obtener los conteos reales
    const [resUsers, resEmpresas, resForos] = await Promise.all([
      fetch('http://localhost:3000/users'),
      fetch('http://localhost:3000/empresas'),
      fetch('http://localhost:3000/foros')
    ])

    if (resUsers.ok) {
      const users = await resUsers.json()
      totalUsuarios.value = users.length
    }
    if (resEmpresas.ok) {
      const empresas = await resEmpresas.json()
      totalEmpresas.value = empresas.length
    }
    if (resForos.ok) {
      const foros = await resForos.json()
      totalForos.value = foros.length
    }
  } catch (err) {
    console.error('Error al cargar estadísticas del dashboard:', err)
  }
})
</script>

<style scoped>
/* Layout principal */
.admin-layout {
  display: flex;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
  min-height: 100vh;
}

/* Contenido principal */
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

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.dashboard-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
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

/* Grid de estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-card:hover::before {
  transform: scaleX(1);
}

.stat-info {
  flex: 1;
}

.stat-label {
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.stat-icon {
  width: 55px;
  height: 55px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-card-users .stat-icon {
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #667eea;
}

.stat-card-companies .stat-icon {
  background: linear-gradient(135deg, #f39c1220 0%, #e67e2220 100%);
  color: #f39c12;
}

.stat-card-forums .stat-icon {
  background: linear-gradient(135deg, #38b2ac20 0%, #31979520 100%);
  color: #38b2ac;
}

/* Sección de vacantes */
.vacancies-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.vacancies-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.month-selector {
  padding: 8px 20px;
  border-radius: 10px;
  border: 1px solid #e1e5e9;
  background: white;
  color: #555;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.month-selector:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.month-selector:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Gráfico */
.chart-container {
  width: 100%;
  background: #fafbfc;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
}

.chart-wrapper {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  margin-bottom: 15px;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.chart-note {
  text-align: center;
  color: #888;
  font-size: 0.8rem;
  margin: 15px 0 0 0;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .user-info {
    align-self: flex-end;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .vacancies-section {
    padding: 20px;
  }
}
</style>