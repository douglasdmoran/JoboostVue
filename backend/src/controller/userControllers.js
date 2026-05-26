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

import { pool } from '../db.js';
export const postCrearUsuario = async (req, res) => {
    try {
        const { nombre, email, contrasenia, rol: bodyRol, documento } = req.body;
        const rol = bodyRol || 'postulante';

        // Consulta con los campos de tu tabla: nombre, correo, contrasena, rol, documento
        const query = `
            INSERT INTO usuarios (nombre, correo, contrasena, rol, documento) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`;
        
        const values = [nombre, email, contrasenia, rol, documento || null];

        // 2. CAMBIO CLAVE: Usa 'pool.query' en lugar de 'db.query'
        const result = await pool.query(query, values); 

        res.status(201).json({
            message: "¡Usuario registrado con éxito!",
            usuario: result.rows[0]
        });

    } catch (error) {
        // Esto imprimirá el error real si falta alguna columna o algo falla
        console.error("ERROR DETALLADO:", error.message);
        res.status(500).json({ 
            message: "Error en el servidor al crear usuario",
            error: error.message 
        });
    }
};

export const putActualizarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, documento, carnet, email, contrasenia, rol } = req.body;
        const updatedUser = await userService.updateUser(id, nombre, documento, carnet, email, contrasenia, rol);
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