import { Router } from "express";
import * as userController from '../controller/userControllers.js';
import { createUserValidator, runValidations } from '../middlewares/validators.js';

const router = Router();

router.get('/', userController.getObtenerUsuarios);
router.get('/correo/:correo', userController.getUsuarioPorCorreo);


router.post('/', runValidations(createUserValidator()), userController.postCrearUsuario);

router.put('/:id', userController.putActualizarUsuario);
router.delete('/:id', userController.deleteEliminarUsuario);

export default router;