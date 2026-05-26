import { Router } from "express";

//import { getAllSeguimientos, getSeguimientoById, crearSeguimiento, actualizarSeguimiento,eliminarSeguimiento } from '../services/seguimientosServices.js';
import * as seguimientosController from '../controller/seguimientosControllers.js';

const router = Router();

router.get('/', seguimientosController.getObtenerSeguimientos);
router.get('/buscarPorId/:id_seguimiento', seguimientosController.getObtenerSeguimientoId);
router.post('/', seguimientosController.postCrearSeguimiento);
router.put('/:id_seguimiento', seguimientosController.putActualizarSeguimiento);
router.delete('/:id_seguimiento', seguimientosController.deleteEliminarSeguimiento);

export default router;