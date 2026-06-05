<template>
  <div class="resources-page">
    <NavbarCandidate />
    
    <main class="resources-main">
      <div class="resources-header">
        <h1 class="resources-title">Recursos</h1>
        <p class="resources-subtitle">Herramientas y guías para potenciar tu carrera profesional</p>
      </div>

      <section class="resources-grid">
        <!-- Recurso Activo: CV Harvard -->
        <div @click="irARecurso" class="resource-card resource-card-active">
          <div class="resource-icon">
            <i class="fa-solid fa-file-lines"></i>
          </div>
          <div class="resource-content">
            <h3 class="resource-title">Cómo crear un CV (Formato Harvard)</h3>
            <p class="resource-description">
              Aprende a crear un currículum impactante que comunique tus habilidades y experiencia de manera eficaz ante los reclutadores siguiendo el estándar de Harvard.
            </p>
            <div class="resource-footer">
              <span class="resource-link">
                Leer guía completa <i class="fa-solid fa-arrow-right"></i>
              </span>
              <span class="resource-badge">
                <i class="fa-solid fa-check-circle"></i>
                Disponible
              </span>
            </div>
          </div>
        </div>

        <!-- Próximamente: Más Recursos -->
        <div class="resource-card resource-card-coming">
          <div class="resource-icon">
            <i class="fa-solid fa-person-digging"></i>
          </div>
          <div class="resource-content">
            <h3 class="resource-title">Creando más recursos para ti...</h3>
            <p class="resource-description">
              Estamos trabajando arduamente en nuevas plantillas, guías de entrevistas y simuladores de pruebas técnicas.
            </p>
            <div class="resource-footer">
              <span class="resource-status">
                <i class="fa-solid fa-clock"></i>
                Próximamente
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de recursos adicionales próximamente -->
      <section class="coming-soon-section">
        <div class="coming-soon-header">
          <i class="fa-solid fa-rocket"></i>
          <h2>Próximos Recursos en Desarrollo</h2>
        </div>
        <div class="features-grid">
          <div class="feature-item">
            <i class="fa-solid fa-clipboard-list"></i>
            <span>Guías de Entrevistas</span>
          </div>
          <div class="feature-item">
            <i class="fa-solid fa-code"></i>
            <span>Simuladores Técnicos</span>
          </div>
          <div class="feature-item">
            <i class="fa-solid fa-chart-line"></i>
            <span>Plantillas de Cartas</span>
          </div>
          <div class="feature-item">
            <i class="fa-solid fa-video"></i>
            <span>Webinars Exclusivos</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import NavbarCandidate from '../components/NavbarCandidate.vue'

const router = useRouter()

const irARecurso = () => {
  router.push('/recursos/cv-harvard')
}
</script>

<style scoped>
.resources-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.resources-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

.resources-header {
  text-align: center;
  margin-bottom: 50px;
  animation: fadeInUp 0.6s ease-out;
}

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

.resources-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
}

.resources-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.resource-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.resource-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.resource-card-active::before {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.resource-card-active {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.resource-card-active:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
}

.resource-card-active:hover::before {
  transform: scaleX(1);
}

.resource-card-coming {
  background: #fafbfc;
  border: 2px dashed #ddd;
  cursor: default;
  box-shadow: none;
  opacity: 0.7;
}

.resource-card-coming:hover {
  transform: translateY(-4px);
  opacity: 0.8;
}

.resource-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.resource-icon i {
  font-size: 1.8rem;
  color: #667eea;
}

.resource-card-coming .resource-icon {
  background: #f0f0f0;
}

.resource-card-coming .resource-icon i {
  color: #999;
}

.resource-content {
  flex: 1;
}

.resource-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.resource-card-coming .resource-title {
  color: #666;
}

.resource-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.resource-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.resource-link {
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.resource-card-active:hover .resource-link {
  gap: 10px;
}

.resource-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.resource-badge i {
  font-size: 0.7rem;
}

.resource-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff3e0;
  color: #ed6c02;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Coming Soon Section */
.coming-soon-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.coming-soon-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
}

.coming-soon-header i {
  font-size: 2rem;
  color: #667eea;
}

.coming-soon-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: #f0f3ff;
  transform: translateY(-3px);
}

.feature-item i {
  font-size: 1.3rem;
  color: #667eea;
}

.feature-item span {
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 968px) {
  .resources-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .resources-main {
    padding: 20px 15px;
  }
  
  .resources-title {
    font-size: 1.8rem;
  }
  
  .resources-subtitle {
    font-size: 0.9rem;
  }
  
  .resource-card {
    padding: 25px;
  }
  
  .resource-title {
    font-size: 1.1rem;
  }
  
  .resource-description {
    font-size: 0.85rem;
  }
  
  .coming-soon-section {
    padding: 25px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .coming-soon-header h2 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .resource-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .resource-icon {
    width: 50px;
    height: 50px;
  }
  
  .resource-icon i {
    font-size: 1.4rem;
  }
}
</style>