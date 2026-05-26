import * as seguimientosService from '../services/seguimientosServices.js';

export const getObtenerSeguimientos = async (req, res, next) => {
    try {
        const result = await seguimientosService.getAllSeguimientos();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerSeguimientoId = async (req, res, next) => {
    try {
        const result = await seguimientosService.getSeguimientoById(req.params.id_seguimiento);
        if (!result) {
            const error = new Error('Seguimiento no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const postCrearSeguimiento = async (req, res, next) => {
    try {
        if (!req.body.id_postulacion) {
            const error = new Error('id_postulacion es requerido');
            error.statusCode = 400;
            throw error;
        }
        const result = await seguimientosService.createSeguimiento(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const putActualizarSeguimiento = async (req, res, next) => {
    try {
        const result = await seguimientosService.updateSeguimiento(req.params.id_seguimiento, req.body);
        if (!result) {
            const error = new Error('Seguimiento no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteEliminarSeguimiento = async (req, res, next) => {
    try {
        const result = await seguimientosService.deleteSeguimiento(req.params.id_seguimiento);
        if (!result) {
            const error = new Error('Seguimiento no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ status: 'success', message: 'Seguimiento eliminado' });
    } catch (err) {
        next(err);
    }
};