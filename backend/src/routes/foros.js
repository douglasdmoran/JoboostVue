import { Router } from "express";

//import { getAllForos,getForosByTitulo,getForosByFecha,crearForo, actualizarForo, eliminarForo } from '../services/forosServices.js';
import * as forosController from '../controller/forosControllers.js';

const router = Router();

router.get('/', forosController.getObtenerTodosLosForos);
router.get('/buscarPorTitulo/:titulo', forosController.getObtenerForosTitulo);
router.get('/buscarPorFecha/:fecha', forosController.getObtenerForosFecha);
router.post('/', forosController.postCrearForo);
router.put('/:id_foro', forosController.putActualizarForo);
router.delete('/:id_foro', forosController.deleteEliminarForo);

export default router;