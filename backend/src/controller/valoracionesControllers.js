import * as valoracionesService from '../services/valoracionesServices.js';

export const getObtenerTodasValoraciones = async (req, res, next) => {
    try {
        const result = await valoracionesService.getAllValoraciones();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerValoracionesUsuario = async (req, res, next) => {
    try {
        const result = await valoracionesService.getValoracionesByIdUsuario(req.params.id_usuario);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerValoracionesEmpresa = async (req, res, next) => {
    try {
        const result = await valoracionesService.getValoracionesByIdEmpresa(req.params.id_empresa);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const postCrearValoracion = async (req, res, next) => {
    try {
        const { id_usuario, id_empresa, calificacion } = req.body;
        if (!id_usuario || !id_empresa || !calificacion) {
            const error = new Error('id_usuario, id_empresa y calificacion son requeridos');
            error.statusCode = 400;
            throw error;
        }
        if (calificacion < 1 || calificacion > 5) {
            const error = new Error('La calificación debe estar entre 1 y 5');
            error.statusCode = 400;
            throw error;
        }
        const result = await valoracionesService.createValoracion(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const putActualizarValoracion = async (req, res, next) => {
    try {
        const { calificacion } = req.body;
        if (calificacion && (calificacion < 1 || calificacion > 5)) {
            const error = new Error('La calificación debe estar entre 1 y 5');
            error.statusCode = 400;
            throw error;
        }
        const result = await valoracionesService.updateValoracion(req.params.id_valoracion, req.body);
        if (!result) {
            const error = new Error('Valoración no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteEliminarValoracion = async (req, res, next) => {
    try {
        const result = await valoracionesService.deleteValoracion(req.params.id_valoracion);
        if (!result) {
            const error = new Error('Valoración no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Valoración eliminada exitosamente' });
    } catch (err) {
        next(err);
    }
};