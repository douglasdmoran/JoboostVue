<template>
  <div>
    <NavbarCandidate />
    
    <main class="container" v-if="companyData">
      <!-- Banner -->
      <section class="company-banner" style="display: flex; align-items: center;">
        <div class="company-logo-box" :style="{ backgroundColor: companyData.logo_url ? 'transparent' : companyData.color, fontSize: '1.2rem', width: '90px', height: '90px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #eee' }">
          <img v-if="companyData.logo_url" :src="companyData.logo_url" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />
          <span v-else>{{ companyData.logo }}</span>
        </div>
        <div class="banner-details">
          <h2 style="font-size: 2rem; font-weight: bold; color: #333; margin-bottom: 5px;">{{ companyData.nombre }}</h2>
          <p style="color: #666; margin-bottom: 5px;">{{ companyData.rubro }}</p>
          <div class="stars-yellow" v-if="promedioCalificacion > 0">
            <i v-for="n in 5" :key="n" :class="getStarClass(n, promedioCalificacion)" style="color: #ffcc00; margin-right: 2px;"></i>
            <strong style="color: #333; margin-left: 10px;">{{ promedioCalificacion.toFixed(1) }}</strong>
          </div>
          <p v-else style="color: #888; font-size: 0.9rem; margin: 5px 0 0 0;">Sin valoraciones aún</p>
        </div>
      </section>

      <!-- Tabs Navigation -->
      <nav class="company-tabs" style="margin-top: 30px;">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'empresa' }"
          @click="activeTab = 'empresa'"
        >
          Empresa
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'ofertas' }"
          @click="activeTab = 'ofertas'"
        >
          Ofertas de Empleo
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'evaluaciones' }"
          @click="activeTab = 'evaluaciones'"
        >
          Evaluaciones
        </button>
      </nav>

      <!-- Tab Content: Empresa -->
      <div v-if="activeTab === 'empresa'" class="tab-content">
        <h3 style="font-weight: bold; font-size: 1.3rem; margin-bottom: 15px; color: #333;">Acerca de {{ companyData.nombre }}</h3>
        <p style="color: #555; line-height: 1.7; margin-bottom: 30px;">{{ companyData.info }}</p>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px;">
          <label style="display: flex; align-items: center; gap: 10px; font-weight: 500; color: #333; cursor: pointer;">
            <input type="checkbox" v-model="heTrabajado" id="check-trabajado"> ¿Has trabajado en esta empresa? ¡Queremos conocer tu opinión!
          </label>
        </div>

        <!-- Rating Form -->
        <div v-if="heTrabajado" style="margin-top: 20px; background: #fafafa; padding: 25px; border-radius: 8px; border: 1px solid #eee;">
          <h4 style="font-weight: bold; margin-bottom: 15px; color: #333;">Deja tu evaluación</h4>
          <form @submit.prevent="publicarEvaluacion" id="form-evaluacion" class="login-form" style="margin-top:0;">
            <div class="input-group">
              <label for="evaluacion-estrellas">Calificación (Estrellas)</label>
              <select v-model="ratingStars" id="evaluacion-estrellas" style="padding: 10px; border: 1px solid var(--gris-borde); border-radius: 4px;" required>
                <option value="5">5 estrellas - Excelente</option>
                <option value="4">4 estrellas - Buena</option>
                <option value="3">3 estrellas - Regular</option>
                <option value="2">2 estrellas - Mala</option>
                <option value="1">1 estrella - Pésima</option>
              </select>
            </div>
            
            <div class="input-group">
              <label for="evaluacion-comentario">Comentario</label>
              <textarea v-model="ratingComment" id="evaluacion-comentario" rows="4" placeholder="Escribe detalles de tu experiencia trabajando aquí..." style="padding: 10px; border: 1px solid var(--gris-borde); border-radius: 4px; font-family: inherit;" required></textarea>
            </div>

            <p v-if="estadoEvaluacion" style="font-size: 0.9rem; font-weight: bold; color: #1e3a8a; margin-bottom: 10px;">
              {{ estadoEvaluacion }}
            </p>

            <button type="submit" class="btn-primary" style="padding: 10px 30px; cursor: pointer; align-self: flex-start;">
              Publicar Evaluación
            </button>
          </form>
        </div>
      </div>

      <!-- Tab Content: Ofertas -->
      <div v-if="activeTab === 'ofertas'" class="tab-content">
        <h3 style="font-weight: bold; font-size: 1.3rem; margin-bottom: 20px; color: #333;">Ofertas de Empleo en {{ companyData.nombre }}</h3>
        
        <div id="lista-ofertas-empresa" style="display: flex; flex-direction: column; gap: 20px;">
          <JobCard 
            v-for="vacante in listaOfertas" 
            :key="vacante.id_vacante" 
            :vacante="vacante" 
          />
          <p v-if="listaOfertas.length === 0" style="color: #888;">
            No hay vacantes publicadas en este momento.
          </p>
        </div>
      </div>

      <!-- Tab Content: Evaluaciones -->
      <div v-if="activeTab === 'evaluaciones'" class="tab-content">
        <h3 style="font-weight: bold; font-size: 1.3rem; margin-bottom: 20px; color: #333;">Opiniones de Empleados</h3>
        
        <div id="lista-evaluaciones-empresa" style="display: flex; flex-direction: column; gap: 15px;">
          <div 
            v-for="evaluacion in listaEvaluaciones" 
            :key="evaluacion.id_valoracion" 
            style="background: white; border: 1px solid #eee; padding: 25px; border-radius: 8px;"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <div class="stars-yellow">
                <i v-for="n in 5" :key="n" :class="n <= evaluacion.calificacion ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
              </div>
              <small style="color: #999;">{{ formatearFecha(evaluacion.fecha_valoracion) }}</small>
            </div>
            <p style="margin: 0; color: #444; font-style: italic;">"{{ evaluacion.comentario }}"</p>
          </div>
          <p v-if="listaEvaluaciones.length === 0" style="color: #888;">
            Aún no hay evaluaciones para esta empresa.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarCandidate from '../components/NavbarCandidate.vue'
import JobCard from '../components/JobCard.vue'
import { generarLogo, generarColor } from '../utils/empresaUtils'

const route = useRoute()
const router = useRouter()

const activeTab = ref('empresa')
const heTrabajado = ref(false)
const ratingStars = ref('5')
const ratingComment = ref('')
const estadoEvaluacion = ref('')

const listaOfertas = ref([])
const listaEvaluaciones = ref([])

const promedioCalificacion = computed(() => {
  if (listaEvaluaciones.value.length === 0) return 0
  const total = listaEvaluaciones.value.reduce((sum, item) => sum + item.calificacion, 0)
  return parseFloat((total / listaEvaluaciones.value.length).toFixed(1))
})

const getStarClass = (n, stars) => {
  if (n <= Math.floor(stars)) {
    return 'fa-solid fa-star'
  } else if (n - 0.5 === stars) {
    return 'fa-solid fa-star-half-stroke'
  } else {
    return 'fa-regular fa-star'
  }
}

const companyKey = computed(() => {
  return route.params.key || route.query.empresa || 'diana'
})

const companyData = ref(null)

const loadCompany = async () => {
  const key = companyKey.value
  try {
    const response = await fetch('http://localhost:3000/empresas')
    if (response.ok) {
      const empresas = await response.json()
      let empresa = null
      
      const parsedId = parseInt(key, 10)
      if (!isNaN(parsedId)) {
        empresa = empresas.find(e => e.id_empresa === parsedId)
      } else {
        // Fallback para claves string antiguas como 'diana', 'siman', etc.
        empresa = empresas.find(e => e.nombre.toLowerCase().includes(key.toLowerCase()))
      }
      
      if (empresa) {
        // Parsear rubro y descripción limpia
        let rubro = 'Empresa'
        let info = empresa.descripcion || ''
        
        // Si tiene la estructura [CULTURA] ... [PROPOSITO]
        const culturaMatch = info.match(/\[CULTURA\]([\s\S]*?)(?:\[PROPOSITO\]|$)/)
        const propositoMatch = info.match(/\[PROPOSITO\]([\s\S]*?)$/)
        
        if (culturaMatch || propositoMatch) {
          info = ''
          if (culturaMatch && culturaMatch[1].trim()) {
            info += `Nuestra cultura:\n${culturaMatch[1].trim()}\n\n`
          }
          if (propositoMatch && propositoMatch[1].trim()) {
            info += `Nuestro propósito:\n${propositoMatch[1].trim()}`
          }
        } else {
          const sectorMatch = info.match(/Sector:\s*([^.\n]+)/i)
          if (sectorMatch) {
            rubro = sectorMatch[1].trim()
          }
          info = info.replace(/Sector:\s*[^.\n]+(?:[.\n]|$)/i, '')
          info = info.replace(/Email:\s*[^\s.]+(?:\s|$)/i, '')
          info = info.replace(/Tel:\s*[^\s.]+(?:\s|$)/i, '')
          info = info.trim() || 'Sin descripción disponible.'
        }
        
        companyData.value = {
          id_db: empresa.id_empresa,
          nombre: empresa.nombre,
          rubro: rubro,
          color: generarColor(empresa.nombre),
          logo: generarLogo(empresa.nombre),
          logo_url: empresa.logo_url || '',
          info: info
        }
      }
    }
  } catch (e) {
    console.error('Error cargando detalle de empresa:', e)
  }
}

const formatearFecha = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })
}

const cargarOfertas = async () => {
  if (!companyData.value) return
  try {
    const response = await fetch('http://localhost:3000/vacantes')
    if (response.ok) {
      const all = await response.json()
      listaOfertas.value = all.filter(v => v.id_empresa === companyData.value.id_db)
    }
  } catch (e) {
    console.error(e)
  }
}

const cargarEvaluaciones = async () => {
  if (!companyData.value) return
  try {
    const response = await fetch(`http://localhost:3000/valoraciones/buscarPorIdEmpresa/${companyData.value.id_db}`)
    if (response.ok) {
      listaEvaluaciones.value = await response.json()
    }
  } catch (e) {
    console.error(e)
  }
}

const publicarEvaluacion = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    alert('Debes iniciar sesión para publicar una evaluación.')
    router.push('/')
    return
  }
  
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return
  }
  
  if (!user || !user.id_usuario) return

  estadoEvaluacion.value = 'Publicando...'

  try {
    const response = await fetch('http://localhost:3000/valoraciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_empresa: companyData.value.id_db,
        calificacion: parseInt(ratingStars.value),
        comentario: ratingComment.value.trim()
      })
    })

    if (!response.ok) throw new Error('Error al publicar')
    
    estadoEvaluacion.value = '¡Evaluación publicada!'
    setTimeout(() => {
      ratingComment.value = ''
      heTrabajado.value = false
      estadoEvaluacion.value = ''
      cargarEvaluaciones()
    }, 1500)
  } catch (err) {
    console.error(err)
    estadoEvaluacion.value = 'Error al publicar evaluación.'
  }
}

const loadAll = async () => {
  await loadCompany()
  if (companyData.value) {
    cargarOfertas()
    cargarEvaluaciones()
  }
}

onMounted(() => {
  loadAll()
})

watch(companyKey, () => {
  loadAll()
})
</script>

<style scoped>
</style>
