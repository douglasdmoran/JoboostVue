import * as forosService from '../services/forosServices.js';

export const getObtenerTodosLosForos = async (req, res, next) => {
    try {
        const foros = await forosService.getAllForos();
        res.status(200).json(foros);
    } catch (err) {
        next(err);
    }
};

export const getObtenerForosTitulo = async (req, res, next) => {
    try {
        const foros = await forosService.getForosByTitulo(req.params.titulo);
        res.status(200).json(foros);
    } catch (err) {
        next(err);
    }
};

export const getObtenerForosFecha = async (req, res, next) => {
    try {
        const foros = await forosService.getForosByFecha(req.params.fecha);
        res.status(200).json(foros);
    } catch (err) {
        next(err);
    }
};

export const postCrearForo = async (req, res, next) => {
    try {
        if (!req.body.titulo) {
            const error = new Error('El título es requerido');
            error.statusCode = 400;
            throw error;
        }
        const nuevoForo = await forosService.createForo(req.body);
        res.status(201).json(nuevoForo);
    } catch (err) {
        next(err);
    }
};

export const putActualizarForo = async (req, res, next) => {
    try {
        const result = await forosService.updateForo(req.params.id_foro, req.body);
        if (!result) {
            const error = new Error('Foro no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteEliminarForo = async (req, res, next) => {
    try {
        const result = await forosService.deleteForo(req.params.id_foro);
        if (!result) {
            const error = new Error('Foro no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ status: 'success', message: 'Foro eliminado' });
    } catch (err) {
        next(err);
    }
};