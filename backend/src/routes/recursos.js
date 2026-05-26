import { Router } from "express";

//import { getAllRecursos,getBuscarPorTitulo,crearRecurso,actualizarRecurso,eliminarRecurso } from '../services/recursosServices.js';
import * as recursosController from '../controller/recursosControllers.js';

const router = Router();

router.get('/', recursosController.getObtenerTodosLosRecursos);
router.get('/buscarPorTitulo/:titulo', recursosController.getObtenerRecursoTitulo);
router.post('/', recursosController.postCrearRecurso);
router.put('/:id_recurso', recursosController.putActualizarRecurso);
router.delete('/:id_recurso', recursosController.deleteEliminarRecurso);

export default router;