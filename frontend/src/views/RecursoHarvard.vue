<template>
  <div class="guide-page">
    <NavbarCandidate />
    
    <main class="guide-main">
      <div class="back-nav">
        <router-link to="/recursos" class="back-link">
          <i class="fa-solid fa-arrow-left"></i>
          Volver a Recursos
        </router-link>
      </div>

      <div class="guide-header">
        <h1 class="guide-title">Guía Definitiva: CV Formato Harvard</h1>
        <p class="guide-subtitle">Aprende a redactar un currículum profesional, limpio y orientado a resultados siguiendo los estándares de la Universidad de Harvard</p>
      </div>

      <div class="guide-content">
        <section class="guide-section">
          <h2 class="section-title">1. ¿Qué es el formato Harvard?</h2>
          <p>El "Formato Harvard" no es un diseño extravagante, sino todo lo contrario. Se trata de un estilo de currículum altamente estandarizado, minimalista y enfocado puramente en el <strong>contenido y los resultados</strong>. Los reclutadores prefieren este formato porque es muy fácil de leer, profesional y pasa sin problemas los sistemas de seguimiento de candidatos (ATS).</p>
          
          <div class="alert-box">
            <i class="fa-solid fa-crown"></i>
            <div>
              <strong>La Regla de Oro:</strong>
              <p>Tu CV debe caber en <strong>una sola página</strong> (a menos que tengas más de 10 años de experiencia relevante). Menos es más.</p>
            </div>
          </div>
        </section>

        <section class="guide-section">
          <h2 class="section-title">2. Reglas Generales de Formato</h2>
          <ul class="rules-list">
            <li><i class="fa-solid fa-camera-slash"></i> <strong>Sin Fotos:</strong> En mercados como EE.UU. o empresas multinacionales, la foto se omite para evitar sesgos discriminatorios.</li>
            <li><i class="fa-solid fa-font"></i> <strong>Tipografía Clásica:</strong> Usa fuentes con serifa como <em>Times New Roman</em>, <em>Garamond</em> o <em>Cambria</em> en tamaño 10 u 11 puntos.</li>
            <li><i class="fa-solid fa-arrows-alt"></i> <strong>Márgenes:</strong> Ajusta los márgenes a 1 pulgada (o un poco menos si necesitas espacio, pero sin que se vea saturado).</li>
            <li><i class="fa-solid fa-palette"></i> <strong>Sin Colores ni Gráficos:</strong> Todo el texto debe ser negro. No uses barras de progreso para tus habilidades.</li>
            <li><i class="fa-solid fa-bolt"></i> <strong>Verbos de Acción:</strong> Empieza cada punto (bullet) de tus experiencias con un verbo fuerte (Ej: "Lideré", "Desarrollé", "Optimicé").</li>
          </ul>
        </section>

        <section class="guide-section">
          <h2 class="section-title">3. Estructura del CV</h2>
          
          <div class="structure-item">
            <h3 class="structure-subtitle">
              <i class="fa-solid fa-heading"></i>
              Encabezado
            </h3>
            <p>Debe contener tu Nombre (el más grande en el documento), ciudad y país, teléfono, correo profesional y enlace a tu LinkedIn o portafolio.</p>
          </div>

          <div class="structure-item">
            <h3 class="structure-subtitle">
              <i class="fa-solid fa-graduation-cap"></i>
              Educación (Education)
            </h3>
            <p>Si eres estudiante o recién graduado, esta sección va primero. Enumera tu universidad, título, fecha esperada de graduación y promedio (si es sobresaliente).</p>
          </div>

          <div class="structure-item">
            <h3 class="structure-subtitle">
              <i class="fa-solid fa-briefcase"></i>
              Experiencia (Experience)
            </h3>
            <p>La sección más importante. Orden cronológico inverso (lo más reciente arriba). Usa el método <strong>CAR (Contexto, Acción, Resultado)</strong> o <strong>STAR</strong> para redactar los viñetas. Cuantifica tus logros con números o porcentajes.</p>
          </div>

          <div class="structure-item">
            <h3 class="structure-subtitle">
              <i class="fa-solid fa-trophy"></i>
              Liderazgo y Actividades (Leadership & Activities)
            </h3>
            <p>Menciona voluntariados, clubes universitarios, proyectos extracurriculares donde hayas tenido un rol activo. Es fundamental para personas con poca experiencia laboral.</p>
          </div>

          <div class="structure-item">
            <h3 class="structure-subtitle">
              <i class="fa-solid fa-code"></i>
              Habilidades (Skills & Interests)
            </h3>
            <p>Lista dura de tecnologías, idiomas y programas de software. Omite "habilidades blandas" como "Trabajo en equipo"; esas debes demostrarlas en las viñetas de tu experiencia.</p>
          </div>
        </section>

        <section class="guide-section example-section">
          <h2 class="section-title">4. Ejemplo Práctico (Plantilla Harvard)</h2>
          <p>A continuación, puedes ver cómo se distribuye visualmente el formato Harvard:</p>

          <div class="cv-example">
            <h4>JUAN PÉREZ GARCÍA</h4>
            <div class="contact-info">
              <span><i class="fa-solid fa-location-dot"></i> San Salvador, El Salvador</span>
              <span><i class="fa-solid fa-phone"></i> +503 7000-0000</span>
              <span><i class="fa-solid fa-envelope"></i> juan.perez@email.com</span>
              <span><i class="fa-brands fa-linkedin"></i> linkedin.com/in/juanperez</span>
            </div>

            <div class="cv-section">
              <div class="cv-section-title">Educación</div>
              <div class="cv-entry">
                <div class="cv-entry-header">
                  <span class="cv-org">Universidad Don Bosco</span>
                  <span class="cv-date">Soyapango, El Salvador</span>
                </div>
                <div class="cv-entry-subheader">
                  <span class="cv-role">Ingeniería en Ciencias de la Computación</span>
                  <span class="cv-date">May 2026</span>
                </div>
                <ul class="cv-list">
                  <li>Promedio Acumulado (CUM): 8.5/10</li>
                  <li>Logros: Beca al Mérito Académico (2022-2024).</li>
                </ul>
              </div>
            </div>

            <div class="cv-section">
              <div class="cv-section-title">Experiencia</div>
              <div class="cv-entry">
                <div class="cv-entry-header">
                  <span class="cv-org">Empresa Tecnológica S.A.</span>
                  <span class="cv-date">San Salvador, El Salvador</span>
                </div>
                <div class="cv-entry-subheader">
                  <span class="cv-role">Desarrollador Frontend (Prácticas)</span>
                  <span class="cv-date">Jun 2023 - Presente</span>
                </div>
                <ul class="cv-list">
                  <li>Desarrollé la interfaz de usuario de una plataforma de gestión interna utilizando React y Tailwind CSS, mejorando el tiempo de carga en un 30%.</li>
                  <li>Colaboré con un equipo de 5 ingenieros para migrar una base de datos legacy a PostgreSQL, asegurando 0 pérdida de datos.</li>
                  <li>Implementé pruebas automatizadas reduciendo los bugs reportados en producción en un 15%.</li>
                </ul>
              </div>
            </div>

            <div class="cv-section">
              <div class="cv-section-title">Proyectos Académicos y Liderazgo</div>
              <div class="cv-entry">
                <div class="cv-entry-header">
                  <span class="cv-org">Club de Robótica UDB</span>
                  <span class="cv-date">San Salvador, El Salvador</span>
                </div>
                <div class="cv-entry-subheader">
                  <span class="cv-role">Presidente / Líder de Proyecto</span>
                  <span class="cv-date">Ene 2023 - Dic 2023</span>
                </div>
                <ul class="cv-list">
                  <li>Lideré un equipo de 10 estudiantes para diseñar y programar un robot evasor de obstáculos para la feria de tecnología universitaria.</li>
                  <li>Gestioné un presupuesto de $500, logrando reducir los costos de materiales un 20% mediante alianzas con proveedores locales.</li>
                </ul>
              </div>
            </div>

            <div class="cv-section">
              <div class="cv-section-title">Habilidades</div>
              <ul class="cv-list">
                <li><strong>Lenguajes y Tecnologías:</strong> JavaScript, Python, HTML/CSS, React, Node.js, SQL.</li>
                <li><strong>Herramientas:</strong> Git, GitHub, Docker, Figma.</li>
                <li><strong>Idiomas:</strong> Español (Nativo), Inglés (Avanzado - C1).</li>
              </ul>
            </div>
          </div>
          
          <div class="download-section">
            <button 
              @click="descargarPlantilla"
              class="btn-download"
            >
              <i class="fa-solid fa-file-word"></i>
              Descargar Plantilla Word (.docx)
            </button>
            <p class="download-hint">
              <i class="fa-solid fa-cloud-upload-alt"></i>
              Compatible con Microsoft Word, Google Docs y LibreOffice. Puedes subir el archivo a Google Drive para editarlo en línea.
            </p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import NavbarCandidate from '../components/NavbarCandidate.vue'
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, TabStopPosition, TabStopType } from 'docx'
import { saveAs } from 'file-saver'

function descargarPlantilla() {
  const FONT = 'Times New Roman'
  const SIZE_NAME = 28
  const SIZE_NORMAL = 22
  const SIZE_SECTION = 22

  const sectionDivider = () => new Paragraph({
    spacing: { before: 200, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
    },
    children: []
  })

  const sectionTitle = (text) => new Paragraph({
    spacing: { before: 200, after: 60 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
    },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: SIZE_SECTION })
    ]
  })

  const entryHeader = (left, right) => new Paragraph({
    spacing: { before: 80, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: left, bold: true, font: FONT, size: SIZE_NORMAL }),
      new TextRun({ text: '\t', font: FONT, size: SIZE_NORMAL }),
      new TextRun({ text: right, font: FONT, size: SIZE_NORMAL })
    ]
  })

  const entrySubheader = (left, right) => new Paragraph({
    spacing: { before: 0, after: 40 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: left, italics: true, font: FONT, size: SIZE_NORMAL }),
      new TextRun({ text: '\t', font: FONT, size: SIZE_NORMAL }),
      new TextRun({ text: right, italics: true, font: FONT, size: SIZE_NORMAL })
    ]
  })

  const bulletPoint = (text) => new Paragraph({
    spacing: { before: 20, after: 20 },
    bullet: { level: 0 },
    children: [
      new TextRun({ text, font: FONT, size: SIZE_NORMAL })
    ]
  })

  const skillLine = (label, value) => new Paragraph({
    spacing: { before: 20, after: 20 },
    bullet: { level: 0 },
    children: [
      new TextRun({ text: label, bold: true, font: FONT, size: SIZE_NORMAL }),
      new TextRun({ text: ' ' + value, font: FONT, size: SIZE_NORMAL })
    ]
  })

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 1080, right: 1080 }
        }
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'TU NOMBRE COMPLETO', bold: true, font: FONT, size: SIZE_NAME })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
          },
          children: [
            new TextRun({ text: 'Tu Ciudad, País | +503 0000-0000 | tu.correo@email.com | linkedin.com/in/tuperfil', font: FONT, size: SIZE_NORMAL })
          ]
        }),

        sectionTitle('Educación'),
        entryHeader('Nombre de tu Universidad', 'Ciudad, País'),
        entrySubheader('Tu Carrera o Título', 'Mes Año - Mes Año'),
        bulletPoint('Promedio Acumulado (CUM): X.X/10'),
        bulletPoint('Logros relevantes: Becas, reconocimientos, etc.'),

        sectionTitle('Experiencia'),
        entryHeader('Nombre de la Empresa', 'Ciudad, País'),
        entrySubheader('Tu Cargo / Puesto', 'Mes Año - Mes Año'),
        bulletPoint('Describe tu logro principal con un verbo de acción. Ejemplo: "Desarrollé un sistema de reportes que redujo el tiempo de procesamiento en un 40%."'),
        bulletPoint('Describe otra responsabilidad o logro cuantificable.'),
        bulletPoint('Incluye métricas y resultados concretos siempre que sea posible.'),

        sectionDivider(),
        entryHeader('Otra Empresa o Experiencia', 'Ciudad, País'),
        entrySubheader('Otro Cargo', 'Mes Año - Mes Año'),
        bulletPoint('Describe tus responsabilidades y logros usando el método CAR (Contexto, Acción, Resultado).'),
        bulletPoint('Cuantifica tus aportes con números, porcentajes o montos.'),

        sectionTitle('Proyectos Académicos y Liderazgo'),
        entryHeader('Nombre del Proyecto o Organización', 'Ciudad, País'),
        entrySubheader('Tu Rol / Posición', 'Mes Año - Mes Año'),
        bulletPoint('Describe tu rol de liderazgo y los resultados obtenidos.'),
        bulletPoint('Menciona el impacto: personas lideradas, presupuesto gestionado, etc.'),

        sectionTitle('Habilidades'),
        skillLine('Lenguajes y Tecnologías:', 'Escribe tus tecnologías separadas por comas (ej: JavaScript, Python, SQL).'),
        skillLine('Herramientas:', 'Escribe las herramientas que dominas (ej: Git, Docker, Figma).'),
        skillLine('Idiomas:', 'Español (Nativo), Inglés (Nivel - ej: B2, C1).'),
      ]
    }]
  })

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, 'Plantilla_CV_Harvard.docx')
  })
}
</script>

<style scoped>
.guide-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8faff 100%);
}

.guide-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.back-nav {
  margin-bottom: 30px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-link:hover {
  background: #f0f3ff;
  transform: translateX(-3px);
}

.guide-header {
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

.guide-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 15px 0;
}

.guide-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.guide-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.guide-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eef2f6;
}

.alert-box {
  background: linear-gradient(135deg, #f0f3ff 0%, #e8edff 100%);
  border-left: 4px solid #667eea;
  padding: 20px;
  margin-top: 20px;
  border-radius: 12px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.alert-box i {
  font-size: 1.5rem;
  color: #667eea;
}

.alert-box strong {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.alert-box p {
  margin: 0;
  color: #555;
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rules-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eef2f6;
  color: #444;
  font-size: 1rem;
  line-height: 1.6;
}

.rules-list li:last-child {
  border-bottom: none;
}

.rules-list li i {
  color: #667eea;
  width: 20px;
  margin-top: 2px;
}

.rules-list li strong {
  color: #333;
}

.structure-item {
  margin-bottom: 25px;
}

.structure-subtitle {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.structure-subtitle i {
  color: #667eea;
}

.structure-item p {
  color: #555;
  line-height: 1.7;
  margin-left: 30px;
}

/* CV Example */
.example-section {
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
}

.cv-example {
  background: white;
  border: 1px solid #e1e5e9;
  padding: 40px;
  margin: 30px auto;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.cv-example h4 {
  text-align: center;
  font-size: 1.8rem;
  text-transform: uppercase;
  margin-bottom: 10px;
  color: #333;
  font-weight: 800;
}

.cv-example .contact-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  text-align: center;
  font-size: 0.85rem;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #333;
}

.cv-example .contact-info span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #555;
}

.cv-section {
  margin-bottom: 20px;
}

.cv-section-title {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1rem;
  border-bottom: 1px solid #333;
  margin-bottom: 12px;
  padding-bottom: 3px;
  letter-spacing: 0.5px;
}

.cv-entry {
  margin-bottom: 15px;
}

.cv-entry-header {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 3px;
  flex-wrap: wrap;
  gap: 10px;
}

.cv-entry-subheader {
  display: flex;
  justify-content: space-between;
  font-style: italic;
  margin-bottom: 8px;
  color: #555;
  flex-wrap: wrap;
  gap: 10px;
}

.cv-list {
  margin-left: 20px;
  margin-bottom: 10px;
}

.cv-list li {
  margin-bottom: 5px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #444;
}

/* Download Section */
.download-section {
  text-align: center;
  margin-top: 30px;
}

.btn-download {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(46, 125, 50, 0.3);
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
}

.download-hint {
  margin-top: 15px;
  color: #888;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .guide-main {
    padding: 20px 15px;
  }
  
  .guide-title {
    font-size: 1.8rem;
  }
  
  .guide-subtitle {
    font-size: 0.95rem;
  }
  
  .guide-section {
    padding: 25px;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .cv-example {
    padding: 20px;
  }
  
  .cv-example h4 {
    font-size: 1.3rem;
  }
  
  .cv-example .contact-info {
    flex-direction: column;
    gap: 5px;
    align-items: center;
  }
  
  .cv-entry-header,
  .cv-entry-subheader {
    flex-direction: column;
    gap: 5px;
  }
  
  .btn-download {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .guide-title {
    font-size: 1.4rem;
  }
  
  .guide-section {
    padding: 20px;
  }
  
  .alert-box {
    flex-direction: column;
  }
  
  .structure-item p {
    margin-left: 0;
  }
  
  .rules-list li {
    font-size: 0.85rem;
  }
}
</style>