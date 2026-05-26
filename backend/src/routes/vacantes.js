import { Router } from "express";

//import { getAllVacantes, getBuscarById, getBuscarPorTitulo, getBuscarPorUbicacion, getBuscarPorModalidad, getBuscarPorTipoContrato,crearVacante,actualizarVacante,eliminarVacante} from '../services/vacantesServices.js';
import * as vacantesController from '../controller/vacantesControllers.js';

const router = Router();

router.get('/', vacantesController.getObtenerTodasVacantes);
router.get('/buscarPorId/:id_vacante', vacantesController.getObtenerVacanteId);
router.get('/buscarPorTitulo/:titulo', vacantesController.getObtenerVacantesTitulo);
router.get('/buscarPorUbicacion/:ubicacion', vacantesController.getObtenerVacantesUbicacion);
router.get('/buscarPorModalidad/:modalidad', vacantesController.getObtenerVacantesModalidad);
router.get('/buscarPorTipoContrato/:tipo_contrato', vacantesController.getObtenerVacantesTipoContrato);
router.post('/', vacantesController.postCrearVacante);
router.put('/:id_vacante', vacantesController.putActualizarVacante);
router.delete('/:id_vacante', vacantesController.deleteEliminarVacante);

export default router;