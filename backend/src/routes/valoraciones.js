import { Router } from "express";

//import { getAllValoraciones,getBuscarByIdUsuario,getBuscarByIdEmpresa,crearValoracion,actualizarValoracion,eliminarValoracion } from '../services/valoracionesServices.js';
import * as valoracionesController from '../controller/valoracionesControllers.js';

const router = Router();

router.get('/', valoracionesController.getObtenerTodasValoraciones);
router.get('/buscarPorIdUsuario/:id_usuario', valoracionesController.getObtenerValoracionesUsuario);
router.get('/buscarPorIdEmpresa/:id_empresa', valoracionesController.getObtenerValoracionesEmpresa);
router.post('/', valoracionesController.postCrearValoracion);
router.put('/:id_valoracion', valoracionesController.putActualizarValoracion);
router.delete('/:id_valoracion', valoracionesController.deleteEliminarValoracion);

export default router;