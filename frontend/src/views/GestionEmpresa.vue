<template>
  <div>
    <NavbarCompany />
    
    <main class="container">
        
        <section class="company-admin-banner" style="display: flex; align-items: center; gap: 30px; margin-bottom: 40px;">
            <div :style="{ backgroundColor: logoColor, padding: '15px', borderRadius: '8px', border: '4px solid #fecb00' }">
                <h1 style="color: white; font-family: 'Arial Black', sans-serif; margin: 0; font-style: italic; font-size: 1.5rem;">{{ logoTexto }}</h1>
            </div>
            <div>
                <h2 style="font-size: 1.8rem; font-weight: bold;">
                  {{ nombreEmpresa }} 
                  <span style="font-size: 1.2rem; color: #333; margin-left: 10px;">
                    <i class="fa-solid fa-star" style="color: #fecb00;"></i> {{ promedioCalificacion }}
                  </span>
                </h2>
            </div>
        </section>

        <nav class="company-tabs" style="display: flex; gap: 10px; margin-bottom: 40px;">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'tab-empresa' }" 
              @click="activeTab = 'tab-empresa'" 
              :style="{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'tab-empresa' ? '#1d4ed8' : '#a5b4fc', color: 'white' }"
            >
              Empresa
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'tab-ofertas' }" 
              @click="activeTab = 'tab-ofertas'" 
              :style="{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'tab-ofertas' ? '#1d4ed8' : '#a5b4fc', color: 'white' }"
            >
              Ofertas
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'tab-evaluaciones' }" 
              @click="activeTab = 'tab-evaluaciones'" 
              :style="{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'tab-evaluaciones' ? '#1d4ed8' : '#a5b4fc', color: 'white' }"
            >
              Evaluaciones
            </button>
        </nav>

        <section class="admin-content">
            
            <!-- Tab: Empresa -->
            <div v-if="activeTab === 'tab-empresa'" id="tab-empresa" class="tab-content-admin" style="display: block;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div style="flex: 1; padding-right: 40px;">
                        <h4 style="color: #666; margin-bottom: 10px;">¿Cómo es trabajar en {{ logoTexto }}?</h4>
                        <p style="line-height: 1.6; color: #444; white-space: pre-wrap;">{{ textoCultura }}</p>
                    </div>
                    <button class="btn-edit" @click="editarCultura" style="font-weight: bold; cursor: pointer; background: none; border: none; color: #333; display: flex; align-items: center; gap: 5px;">
                      <i class="fa-solid fa-pen"></i> Editar
                    </button>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <div style="flex: 1; padding-right: 40px;">
                        <h4 style="color: #666; margin-bottom: 10px;">Nuestro Propósito</h4>
                        <p style="line-height: 1.6; color: #444; white-space: pre-wrap;">{{ textoProposito }}</p>
                    </div>
                    <button class="btn-edit" @click="editarProposito" style="font-weight: bold; cursor: pointer; background: none; border: none; color: #333; display: flex; align-items: center; gap: 5px;">
                      <i class="fa-solid fa-pen"></i> Editar
                    </button>
                </div>
            </div>

            <!-- Tab: Ofertas -->
            <div v-if="activeTab === 'tab-ofertas'" id="tab-ofertas" class="tab-content-admin" style="display: block;">
                <article 
                  v-for="vacante in listaOfertas" 
                  :key="vacante.id_vacante" 
                  class="job-card" 
                  style="display: flex; border: 1px solid #eee; padding: 25px; border-radius: 8px; margin-bottom: 20px;"
                >
                    <div style="flex: 1;">
                        <h4 style="font-size: 1.1rem; margin-bottom: 10px; font-weight: bold; color: #333;">{{ vacante.titulo }}</h4>
                        <p style="color: #555; font-size: 0.9rem; margin-bottom: 5px;"><i class="fa-solid fa-location-dot"></i> {{ vacante.ubicacion || 'Sin especificar' }}</p>
                        <p style="color: #555; font-size: 0.9rem;"><i class="fa-solid fa-briefcase"></i> {{ vacante.tipo_contrato }} · {{ vacante.modalidad }}</p>
                        <p style="color: #2ecc71; font-weight: bold; font-size: 0.8rem; margin-top: 10px; text-transform: uppercase;">
                          {{ vacante.activa ? 'VACANTE ACTIVA' : 'VACANTE INACTIVA' }}
                        </p>
                    </div>
                    <div style="flex: 2; text-align: center; padding: 0 20px; border-left: 1px solid #eee; border-right: 1px solid #eee;">
                        <h4 style="font-weight: bold; margin-bottom: 10px; color: #333;">Funciones / Descripción</h4>
                        <p style="font-size: 0.85rem; color: #666; text-align: left; line-height: 1.5;">{{ vacante.descripcion }}</p>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; justify-content: center; padding-left: 20px;">
                        <button @click="editarVacante(vacante)" style="width: 100px; padding: 8px; border-radius: 4px; border: 1px solid #ddd; background: white; cursor: pointer; font-weight: bold;">Editar</button>
                        <button @click="eliminarVacante(vacante.id_vacante)" style="width: 100px; padding: 8px; border-radius: 4px; border: 1px solid #ff4d4d; color: #ff4d4d; background: none; cursor: pointer; font-weight: bold;">Eliminar</button>
                    </div>
                </article>
                <p v-if="listaOfertas.length === 0" style="color: #888; text-align: center; padding: 30px;">
                  No tienes vacantes publicadas en este momento.
                </p>
            </div>

            <!-- Tab: Evaluaciones -->
            <div v-if="activeTab === 'tab-evaluaciones'" id="tab-evaluaciones" class="tab-content-admin" style="display: block;">
                <div 
                  v-for="evaluacion in listaEvaluaciones" 
                  :key="evaluacion.id_valoracion" 
                  style="background: white; border: 1px solid #eee; padding: 25px; border-radius: 8px; margin-bottom: 20px;"
                >
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="color: #fecb00;">
                            <i v-for="n in 5" :key="n" :class="n <= evaluacion.calificacion ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
                            <strong style="color: #333; margin-left: 10px;">{{ getCargoSimulado(evaluacion) }}</strong>
                        </div>
                        <small style="color: #999;">{{ formatearFecha(evaluacion.fecha_valoracion) }}</small>
                    </div>
                    <p style="color: #666; font-style: italic; font-size: 0.95rem; margin: 0;">"{{ evaluacion.comentario }}"</p>
                </div>
                <p v-if="listaEvaluaciones.length === 0" style="color: #888; text-align: center; padding: 30px;">
                  Aún no hay evaluaciones para tu empresa.
                </p>
            </div>

        </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarCompany from '../components/NavbarCompany.vue'

const router = useRouter()

const activeTab = ref('tab-empresa')

const logoTexto = ref('DIANA')
const logoColor = ref('#e30613')
const nombreEmpresa = ref('PRODUCTOS ALIMENTICIOS DIANA, S.A. DE C.V.')
const promedioCalificacion = ref('4.5')

const textoCultura = ref('Nuestra convicción de crecer con equipos ganadores nos impulsa a buscar líderes como tú, comprometidos con el resultado final, persiguiendo la excelencia en cada acción...')
const textoProposito = ref('En Diana nacimos para estar cerca de ti. Y esa frase, que parece tan simple, nos mueve a los más de 4,000 colaboradores en la región...')

const listaOfertas = ref([])
const listaEvaluaciones = ref([])

let idEmpresa = 2
let empresaRecord = null

const formatearFecha = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getCargoSimulado = (evaluacion) => {
  const comentariosCargos = {
    'programador': 'Programador BackEnd',
    'backend': 'Programador BackEnd',
    'montacargas': 'Montacarguista',
    'montacarguista': 'Montacarguista',
    'rrhh': 'Analista de Reclutamiento',
    'ventas': 'Asesor de Ventas'
  }
  const comment = (evaluacion.comentario || '').toLowerCase()
  for (const [key, val] of Object.entries(comentariosCargos)) {
    if (comment.includes(key)) return val
  }
  return 'Colaborador'
}

const cargarDatos = async () => {
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) {
    router.push('/')
    return
  }
  
  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    router.push('/')
    return
  }

  const email = (user.correo || user.email || '').toLowerCase()
  const name = (user.nombre || '').toLowerCase()

  if (email.includes('siman') || name.includes('siman')) {
    idEmpresa = 4
    logoTexto.value = 'SIMAN'
    logoColor.value = '#c8102e'
    nombreEmpresa.value = 'ALMACENES SIMAN, S.A. DE C.V.'
  } else if (email.includes('dollarcity') || name.includes('dollarcity') || email.includes('d-city')) {
    idEmpresa = 5
    logoTexto.value = 'D-CITY'
    logoColor.value = '#005a32'
    nombreEmpresa.value = 'DOLLARCITY EL SALVADOR'
  } else if (email.includes('selectos') || name.includes('selectos')) {
    idEmpresa = 6
    logoTexto.value = 'S. SELECTOS'
    logoColor.value = '#004a99'
    nombreEmpresa.value = 'SÚPER SELECTOS (CALLEJA S.A. DE C.V.)'
  } else {
    idEmpresa = 2
    logoTexto.value = 'DIANA'
    logoColor.value = '#e30613'
    nombreEmpresa.value = 'PRODUCTOS ALIMENTICIOS DIANA, S.A. DE C.V.'
  }

  try {
    // 1. Cargar datos de la empresa (cultura, proposito)
    const resEmp = await fetch(`http://localhost:3000/empresas`)
    if (resEmp.ok) {
      const empresas = await resEmp.json()
      empresaRecord = empresas.find(e => e.id_empresa === idEmpresa)
      if (empresaRecord) {
        const desc = empresaRecord.descripcion || ''
        
        const culturaMatch = desc.match(/\[CULTURA\]([\s\S]*?)(?:\[PROPOSITO\]|$)/)
        const propositoMatch = desc.match(/\[PROPOSITO\]([\s\S]*?)$/)
        
        if (culturaMatch && culturaMatch[1].trim()) {
          textoCultura.value = culturaMatch[1].trim()
        }
        if (propositoMatch && propositoMatch[1].trim()) {
          textoProposito.value = propositoMatch[1].trim()
        }
      }
    }

    // 2. Cargar calificaciones y calcular promedio
    const resVal = await fetch(`http://localhost:3000/valoraciones/buscarPorIdEmpresa/${idEmpresa}`)
    if (resVal.ok) {
      listaEvaluaciones.value = await resVal.json()
      if (listaEvaluaciones.value.length > 0) {
        const sum = listaEvaluaciones.value.reduce((acc, curr) => acc + curr.calificacion, 0)
        promedioCalificacion.value = (sum / listaEvaluaciones.value.length).toFixed(1)
      } else {
        promedioCalificacion.value = '4.5'
      }
    }

    // 3. Cargar vacantes de la empresa
    const resVac = await fetch(`http://localhost:3000/vacantes`)
    if (resVac.ok) {
      const vacantes = await resVac.json()
      listaOfertas.value = vacantes.filter(v => v.id_empresa === idEmpresa)
    }

  } catch (err) {
    console.error('Error cargando gestión de empresa:', err)
  }
}

const guardarCulturaProposito = async () => {
  if (!empresaRecord) return
  try {
    const nuevaDesc = `[CULTURA] ${textoCultura.value} [PROPOSITO] ${textoProposito.value}`
    const res = await fetch(`http://localhost:3000/empresas/${idEmpresa}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: empresaRecord.nombre,
        descripcion: nuevaDesc,
        ubicacion: empresaRecord.ubicacion,
        sitio_web: empresaRecord.sitio_web,
        calificacion_promedio: parseFloat(promedioCalificacion.value) || 0
      })
    })
    if (res.ok) {
      const data = await res.json()
      empresaRecord = data
    }
  } catch (err) {
    console.error('Error al guardar cultura y propósito:', err)
  }
}

const editarCultura = () => {
  const nuevoText = prompt(`Edita el contenido de ¿Cómo es trabajar en ${logoTexto.value}?`, textoCultura.value)
  if (nuevoText !== null && nuevoText.trim() !== '') {
    textoCultura.value = nuevoText.trim()
    guardarCulturaProposito()
  }
}

const editarProposito = () => {
  const nuevoText = prompt('Edita tu Propósito corporativo:', textoProposito.value)
  if (nuevoText !== null && nuevoText.trim() !== '') {
    textoProposito.value = nuevoText.trim()
    guardarCulturaProposito()
  }
}

const editarVacante = (vacante) => {
  router.push({ path: '/empresa/publicar', query: { edit: vacante.id_vacante } })
}

const eliminarVacante = async (idVacante) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta vacante?')) return
  try {
    const res = await fetch(`http://localhost:3000/vacantes/${idVacante}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      alert('Vacante eliminada con éxito.')
      cargarDatos()
    } else {
      alert('Error al eliminar la vacante.')
    }
  } catch (err) {
    console.error('Error al eliminar vacante:', err)
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
</style>
