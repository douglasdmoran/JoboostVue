import * as postulacionesService from '../services/postulacionesServices.js';

export const getObtenerPostulaciones = async (req, res, next) => {
    try {
        const result = await postulacionesService.getAllPostulaciones();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerPostulacionId = async (req, res, next) => {
    try {
        const result = await postulacionesService.getPostulacionById(req.params.id_postulacion);
        if (!result) {
            const error = new Error('Postulación no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const postCrearPostulacion = async (req, res, next) => {
    try {
        const { id_vacante, id_usuario } = req.body;
        if (!id_vacante || !id_usuario) {
            const error = new Error('id_vacante e id_usuario son obligatorios');
            error.statusCode = 400;
            throw error;
        }
        const result = await postulacionesService.createPostulacion(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const putActualizarPostulacion = async (req, res, next) => {
    try {
        const result = await postulacionesService.updatePostulacion(req.params.id_postulacion, req.body);
        if (!result) {
            const error = new Error('Postulación no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteEliminarPostulacion = async (req, res, next) => {
    try {
        const result = await postulacionesService.deletePostulacion(req.params.id_postulacion);
        if (!result) {
            const error = new Error('Postulación no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ status: 'success', message: 'Postulación eliminada' });
    } catch (err) {
        next(err);
    }
};