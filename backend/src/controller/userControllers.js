import * as userService from '../services/userServices.js';

export const getObtenerUsuarios = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

export const getUsuarioPorCorreo = async (req, res, next) => {
    try {
        const { correo } = req.params;
        const user = await userService.getUserByCorreo(correo);
        if (!user) {
            const error = new Error('Usuario no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

export const postCrearUsuario = async (req, res, next) => {
    try {
        let { nombre, email, contrasenia, rol } = req.body;
        if (rol) {
            rol = rol.toLowerCase();
            if (rol === 'admin') rol = 'gestor';
        }
        const user = await userService.createUser(nombre, email, contrasenia, rol);
        res.status(201).json({
            message: "¡Usuario registrado con éxito!",
            usuario: user
        });
    } catch (err) {
        next(err);
    }
};

export const postLoginUsuario = async (req, res, next) => {
    try {
        const { email, contrasenia } = req.body;
        const user = await userService.authenticateUser(email, contrasenia);
        if (!user) {
            const error = new Error('Correo o contraseña incorrectos');
            error.statusCode = 401;
            throw error;
        }
        const { contrasena, ...userWithoutPassword } = user;
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            usuario: userWithoutPassword
        });
    } catch (err) {
        next(err);
    }
};

export const putActualizarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { nombre, email, contrasenia, rol, foto_url } = req.body;
        if (rol) {
            rol = rol.toLowerCase();
            if (rol === 'admin') rol = 'gestor';
        }
        const updatedUser = await userService.updateUser(id, nombre, email, contrasenia, rol, foto_url);
        if (!updatedUser) {
            const error = new Error('No se pudo actualizar, usuario no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};

export const deleteEliminarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await userService.deleteUser(id);
        if (!deletedUser) {
            const error = new Error('Usuario no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        next(err);
    }
};