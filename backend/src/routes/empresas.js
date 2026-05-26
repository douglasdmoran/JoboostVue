import { Router } from "express";

//import { getAllEmpresas,getEmpresaByNombre,getEmpresaByUbicacion, getEmpresaByCalificacion,crearEmpresa,actualizarEmpresa,eliminarEmpresa } from '../services/empresasServices.js';
import * as empresasController from '../controller/empresasControllers.js';

const router = Router();

router.get('/', empresasController.getObtenerEmpresas);
router.get('/buscarPorNombre/:nombre', empresasController.getObtenerEmpresaNombre);
router.get('/buscarPorUbicacion/:ubicacion', empresasController.getObtenerEmpresaUbicacion);
router.get('/buscarPorCalificacion/:calificacion', empresasController.getObtenerEmpresaCalificacion);
router.post('/', empresasController.postCrearEmpresa);
router.put('/:id_empresa', empresasController.putActualizarEmpresa);
router.delete('/:id_empresa', empresasController.deleteEliminarEmpresa);

export default router;