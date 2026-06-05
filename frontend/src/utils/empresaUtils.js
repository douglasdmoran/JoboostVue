/**
 * Resuelve el id_empresa del usuario logueado buscando en la tabla empresas
 * por coincidencia de nombre. Cachea el resultado en localStorage.
 */
export async function resolveEmpresaId() {
  // 1. Verificar si ya tenemos el id_empresa cacheado
  const cached = localStorage.getItem('id_empresa')
  if (cached) return parseInt(cached, 10)

  // 2. Obtener datos del usuario logueado
  const userJson = localStorage.getItem('usuario') || localStorage.getItem('currentUser')
  if (!userJson) return null

  let user
  try {
    user = JSON.parse(userJson)
  } catch (e) {
    return null
  }

  const userName = (user.nombre || '').trim().toLowerCase()
  if (!userName) return null

  // 3. Buscar en la tabla empresas por coincidencia de nombre
  try {
    const res = await fetch('http://localhost:3000/empresas')
    if (!res.ok) return null
    const empresas = await res.json()

    // Buscar coincidencia exacta primero
    let empresa = empresas.find(e => e.nombre.trim().toLowerCase() === userName)

    // Si no hay coincidencia exacta, buscar coincidencia parcial
    if (!empresa) {
      empresa = empresas.find(e =>
        e.nombre.trim().toLowerCase().includes(userName) ||
        userName.includes(e.nombre.trim().toLowerCase())
      )
    }

    if (empresa) {
      localStorage.setItem('id_empresa', empresa.id_empresa.toString())
      return empresa.id_empresa
    }
  } catch (err) {
    console.error('Error resolviendo id_empresa:', err)
  }

  return null
}

/**
 * Obtiene la información completa de la empresa del usuario logueado.
 */
export async function getEmpresaData() {
  const idEmpresa = await resolveEmpresaId()
  if (!idEmpresa) return null

  try {
    const res = await fetch('http://localhost:3000/empresas')
    if (!res.ok) return null
    const empresas = await res.json()
    return empresas.find(e => e.id_empresa === idEmpresa) || null
  } catch (err) {
    console.error('Error obteniendo datos de empresa:', err)
    return null
  }
}

/**
 * Genera un color determinístico basado en el nombre
 */
export function generarColor(nombre) {
  const colores = ['#1e3a8a', '#c8102e', '#005a32', '#004a99', '#f39c12', '#6b21a8', '#0d6efd', '#dc3545', '#198754', '#e85d04']
  let hash = 0
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colores[Math.abs(hash) % colores.length]
}

/**
 * Genera un logo (iniciales) basado en el nombre
 */
export function generarLogo(nombre) {
  const words = nombre.trim().split(/\s+/)
  if (words.length === 1) {
    return nombre.substring(0, 3).toUpperCase()
  }
  return words.map(w => w[0]).join('').toUpperCase().substring(0, 4)
}
