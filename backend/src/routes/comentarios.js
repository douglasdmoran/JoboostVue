import { Router } from "express";

//import { getAllComentarios,getComentariosByUsuario,crearComentario, actualizarComentario, borrarComentario } from '../services/comentariosServices.js';
import * as comentariosController from '../controller/comentariosControllers.js';

const router = Router();

router.get('/', comentariosController.getObtenerComentarios);
router.get('/buscarPorUsuario/:id_usuario', comentariosController.getObtenerComentariosUsuario);
router.post('/', comentariosController.postCrearComentario);
router.put('/:id_comentario', comentariosController.putActualizarComentario);
router.delete('/:id_comentario', comentariosController.deleteBorrarComentario);

export default router;

