import * as recursosService from '../services/recursosServices.js';

export const getObtenerTodosLosRecursos = async (req, res, next) => {
    try {
        const result = await recursosService.getAllRecursos();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerRecursoTitulo = async (req, res, next) => {
    try {
        const result = await recursosService.getRecursoByTitulo(req.params.titulo);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const postCrearRecurso = async (req, res, next) => {
    try {
        if (!req.body.titulo) {
            const error = new Error('El título es requerido');
            error.statusCode = 400;
            throw error;
        }
        const result = await recursosService.createRecurso(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const putActualizarRecurso = async (req, res, next) => {
    try {
        const result = await recursosService.updateRecurso(req.params.id_recurso, req.body);
        if (!result) {
            const error = new Error('Recurso no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteEliminarRecurso = async (req, res, next) => {
    try {
        const result = await recursosService.deleteRecurso(req.params.id_recurso);
        if (!result) {
            const error = new Error('Recurso no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ status: 'success', message: 'Recurso eliminado' });
    } catch (err) {
        next(err);
    }
};