import { Router } from "express";

//import { getAllPostulaciones, getPostulacionById, crearPostulacion, actualizarPostulacion,eliminarPostulacion } from '../services/postulacionesServices.js';
import * as postulacionesController from '../controller/postulacionesControllers.js';

const router = Router();

router.get('/', postulacionesController.getObtenerPostulaciones);
router.get('/buscarPorId/:id_postulacion', postulacionesController.getObtenerPostulacionId);
router.post('/', postulacionesController.postCrearPostulacion);
router.put('/:id_postulacion', postulacionesController.putActualizarPostulacion);
router.delete('/:id_postulacion', postulacionesController.deleteEliminarPostulacion);

export default router;