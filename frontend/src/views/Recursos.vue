<template>
  <div>
    <NavbarCandidate />
    
    <main class="container">
      <div class="forum-top-bar" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 40px;">
        <h1 style="font-size: 2.5rem; font-weight: bold; color: #333;">Recursos</h1>
        <a href="#" @click.prevent style="color: var(--azul-jobboost); text-decoration: none; font-weight: 500;">
          <i class="fa-solid fa-file-circle-plus"></i> Publicar recursos
        </a>
      </div>

      <section class="resources-list" style="display: flex; flex-direction: column; gap: 30px;">
        <article @click="irARecurso" class="resource-box" style="cursor: pointer; transition: transform 0.2s;">
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 10px;">
            <i class="fa-solid fa-file-lines" style="font-size: 2rem; color: var(--azul-jobboost);"></i>
            <h3 style="font-size: 1.6rem; color: #333; font-weight: bold;">Cómo crear un CV (Formato Harvard)</h3>
          </div>
          <p style="color: #666; font-size: 1.1rem; line-height: 1.6;">
            Aprende a crear un currículum impactante que comunique tus habilidades y experiencia de manera eficaz ante los reclutadores siguiendo el estándar de Harvard.
          </p>
          <div style="margin-top: 15px;">
            <router-link to="/recursos/cv-harvard" style="color: var(--azul-jobboost); font-size: 0.9rem; font-weight: bold; text-decoration: none;">
              Leer guía completa <i class="fa-solid fa-arrow-right"></i>
            </router-link>
          </div>
        </article>

        <!-- Placeholder Próximamente -->
        <article class="resource-box" style="background: #fafafa; border: 2px dashed #ccc; cursor: default; box-shadow: none;">
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 10px;">
            <i class="fa-solid fa-person-digging" style="font-size: 2rem; color: #999;"></i>
            <h3 style="font-size: 1.6rem; color: #666; font-weight: bold;">Creando más recursos para ti...</h3>
          </div>
          <p style="color: #888; font-size: 1.1rem; line-height: 1.6;">
            Estamos trabajando arduamente en nuevas plantillas, guías de entrevistas y simuladores de pruebas técnicas.
          </p>
          <div style="margin-top: 15px;">
            <span style="color: #999; font-size: 0.9rem; font-weight: bold; font-style: italic;">
              ¡Próximamente disponibles para descargar!
            </span>
          </div>
        </article>
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
</style>
