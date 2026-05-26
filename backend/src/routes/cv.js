import { Router } from "express";

//import { getAllCv,getCVByTelefono,getCVByUbicacion,crearCV, actualizarCV, eliminarCV  } from '../services/cvServices.js';
import * as cvController from '../controller/cvControllers.js';

const router = Router();

router.get('/', cvController.getObtenerTodosLosCV);
router.get('/buscarPorTelefono/:telefono', cvController.getObtenerCVPorTelefono);
router.get('/buscarPorUbicacion/:ubicacion', cvController.getObtenerCVPorUbicacion);
router.post('/', cvController.postCrearCV);
router.put('/:id_cv', cvController.putActualizarCV);
router.delete('/:id_cv', cvController.deleteEliminarCV);

export default router;