<template>
  <div>
    <NavbarCandidate />
    
    <main class="container" style="max-width: 1000px; margin: 0 auto;">
      <div style="margin-bottom: 30px;">
        <router-link to="/recursos" style="color: var(--azul-jobboost); text-decoration: none; font-weight: bold;">
          <i class="fa-solid fa-arrow-left"></i> Volver a Recursos
        </router-link>
      </div>

      <h1 style="font-size: 2.8rem; font-weight: bold; margin-bottom: 10px; color: #1e3a8a;">Guía Definitiva: CV Formato Harvard</h1>
      <p style="font-size: 1.2rem; color: #666; margin-bottom: 40px;">Aprende a redactar un currículum profesional, limpio y orientado a resultados siguiendo los estándares de la Universidad de Harvard.</p>

      <section class="guide-section">
        <h2>1. ¿Qué es el formato Harvard?</h2>
        <p>El "Formato Harvard" no es un diseño extravagante, sino todo lo contrario. Se trata de un estilo de currículum altamente estandarizado, minimalista y enfocado puramente en el <strong>contenido y los resultados</strong>. Los reclutadores prefieren este formato porque es muy fácil de leer, profesional y pasa sin problemas los sistemas de seguimiento de candidatos (ATS).</p>
        
        <div class="alert-box">
          <strong>La Regla de Oro:</strong> Tu CV debe caber en <strong>una sola página</strong> (a menos que tengas más de 10 años de experiencia relevante). Menos es más.
        </div>
      </section>

      <section class="guide-section">
        <h2>2. Reglas Generales de Formato</h2>
        <ul>
          <li><strong>Sin Fotos:</strong> En mercados como EE.UU. o empresas multinacionales, la foto se omite para evitar sesgos discriminatorios.</li>
          <li><strong>Tipografía Clásica:</strong> Usa fuentes con serifa como <em>Times New Roman</em>, <em>Garamond</em> o <em>Cambria</em> en tamaño 10 u 11 puntos.</li>
          <li><strong>Márgenes:</strong> Ajusta los márgenes a 1 pulgada (o un poco menos si necesitas espacio, pero sin que se vea saturado).</li>
          <li><strong>Sin Colores ni Gráficos:</strong> Todo el texto debe ser negro. No uses barras de progreso para tus habilidades.</li>
          <li><strong>Verbos de Acción:</strong> Empieza cada punto (bullet) de tus experiencias con un verbo fuerte (Ej: "Lideré", "Desarrollé", "Optimicé").</li>
        </ul>
      </section>

      <section class="guide-section">
        <h2>3. Estructura del CV</h2>
        
        <h3>Encabezado</h3>
        <p>Debe contener tu Nombre (el más grande en el documento), ciudad y país, teléfono, correo profesional y enlace a tu LinkedIn o portafolio.</p>

        <h3>Educación (Education)</h3>
        <p>Si eres estudiante o recién graduado, esta sección va primero. Enumera tu universidad, título, fecha esperada de graduación y promedio (si es sobresaliente).</p>

        <h3>Experiencia (Experience)</h3>
        <p>La sección más importante. Orden cronológico inverso (lo más reciente arriba). Usa el método <strong>CAR (Contexto, Acción, Resultado)</strong> o <strong>STAR</strong> para redactar los viñetas. Cuantifica tus logros con números o porcentajes.</p>

        <h3>Liderazgo y Actividades (Leadership & Activities)</h3>
        <p>Menciona voluntariados, clubes universitarios, proyectos extracurriculares donde hayas tenido un rol activo. Es fundamental para personas con poca experiencia laboral.</p>

        <h3>Habilidades (Skills & Interests)</h3>
        <p>Lista dura de tecnologías, idiomas y programas de software. Omite "habilidades blandas" como "Trabajo en equipo"; esas debes demostrarlas en las viñetas de tu experiencia.</p>
      </section>

      <section class="guide-section" style="background: #fdfdfd;">
        <h2>4. Ejemplo Práctico (Plantilla Harvard)</h2>
        <p>A continuación, puedes ver cómo se distribuye visualmente el formato Harvard:</p>

        <div class="cv-example">
          <h4>JUAN PÉREZ GARCÍA</h4>
          <div class="contact-info">
            San Salvador, El Salvador | +503 7000-0000 | juan.perez@email.com | linkedin.com/in/juanperez
          </div>

          <div class="section-title">Educación</div>
          <div class="entry-header">
            <span>Universidad Don Bosco</span>
            <span>Soyapango, El Salvador</span>
          </div>
          <div class="entry-subheader">
            <span>Ingeniería en Ciencias de la Computación</span>
            <span>May 2026</span>
          </div>
          <ul>
            <li>Promedio Acumulado (CUM): 8.5/10</li>
            <li>Logros: Beca al Mérito Académico (2022-2024).</li>
          </ul>

          <div class="section-title">Experiencia</div>
          <div class="entry-header">
            <span>Empresa Tecnológica S.A.</span>
            <span>San Salvador, El Salvador</span>
          </div>
          <div class="entry-subheader">
            <span>Desarrollador Frontend (Prácticas)</span>
            <span>Jun 2023 - Presente</span>
          </div>
          <ul>
            <li>Desarrollé la interfaz de usuario de una plataforma de gestión interna utilizando React y Tailwind CSS, mejorando el tiempo de carga en un 30%.</li>
            <li>Colaboré con un equipo de 5 ingenieros para migrar una base de datos legacy a PostgreSQL, asegurando 0 pérdida de datos.</li>
            <li>Implementé pruebas automatizadas reduciendo los bugs reportados en producción en un 15%.</li>
          </ul>

          <div class="section-title">Proyectos Académicos y Liderazgo</div>
          <div class="entry-header">
            <span>Club de Robótica UDB</span>
            <span>San Salvador, El Salvador</span>
          </div>
          <div class="entry-subheader">
            <span>Presidente / Líder de Proyecto</span>
            <span>Ene 2023 - Dic 2023</span>
          </div>
          <ul>
            <li>Lideré un equipo de 10 estudiantes para diseñar y programar un robot evasor de obstáculos para la feria de tecnología universitaria.</li>
            <li>Gentioné un presupuesto de $500, logrando reducir los costos de materiales un 20% mediante alianzas con proveedores locales.</li>
          </ul>

          <div class="section-title">Habilidades</div>
          <ul>
            <li><strong>Lenguajes y Tecnologías:</strong> JavaScript, Python, HTML/CSS, React, Node.js, SQL.</li>
            <li><strong>Herramientas:</strong> Git, GitHub, Docker, Figma.</li>
            <li><strong>Idiomas:</strong> Español (Nativo), Inglés (Avanzado - C1).</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <button class="btn-primary" @click="descargarPlantilla" style="cursor: pointer;"><i class="fa-solid fa-download"></i> Descargar Plantilla Word</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import NavbarCandidate from '../components/NavbarCandidate.vue'

const descargarPlantilla = () => {
  alert('Funcionalidad de descarga de plantilla en desarrollo.')
}
</script>

<style scoped>
.guide-section {
    background: var(--blanco);
    padding: 40px;
    border-radius: 8px;
    border: 1px solid var(--gris-borde);
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    margin-bottom: 40px;
}

.guide-section h2 {
    color: var(--azul-jobboost);
    margin-bottom: 20px;
    font-size: 1.8rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
    font-weight: bold;
}

.guide-section h3 {
    color: #333;
    margin-top: 25px;
    margin-bottom: 10px;
    font-size: 1.3rem;
    font-weight: bold;
}

.guide-section p, .guide-section li {
    color: #444;
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 15px;
}

.guide-section ul {
    margin-left: 20px;
    margin-bottom: 20px;
}

.cv-example {
    background: #fff;
    border: 1px solid #ccc;
    padding: 40px;
    font-family: "Times New Roman", Times, serif;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    margin: 30px auto;
    max-width: 800px;
    text-align: left;
}

.cv-example h4 {
    text-align: center;
    font-size: 1.8rem;
    text-transform: uppercase;
    margin-bottom: 5px;
    font-weight: bold;
}

.cv-example .contact-info {
    text-align: center;
    font-size: 0.9rem;
    margin-bottom: 20px;
    border-bottom: 1px solid #000;
    padding-bottom: 10px;
}

.cv-example .section-title {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.1rem;
    border-bottom: 1px solid #000;
    margin-top: 15px;
    margin-bottom: 10px;
    padding-bottom: 2px;
}

.cv-example .entry-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
}

.cv-example .entry-subheader {
    display: flex;
    justify-content: space-between;
    font-style: italic;
    margin-bottom: 5px;
}

.cv-example ul {
    margin-left: 15px;
    margin-bottom: 15px;
    list-style-type: disc;
}

.cv-example li {
    margin-bottom: 5px;
    font-size: 1rem;
}

.alert-box {
    background: #f0f4ff;
    border-left: 4px solid var(--azul-jobboost);
    padding: 15px 20px;
    margin: 20px 0;
    border-radius: 0 4px 4px 0;
}
</style>
