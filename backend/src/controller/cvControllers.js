import * as cvServices from '../services/cvServices.js';

export const getObtenerTodosLosCV = async (req, res, next) => {
    try {
        const result = await cvServices.getAllCvs();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerCVPorTelefono = async (req, res, next) => {
    try {
        const { telefono } = req.params;
        const result = await cvServices.getCvByTelefono(telefono);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerCVPorUbicacion = async (req, res, next) => {
    try {
        const { ubicacion } = req.params;
        const result = await cvServices.getCvByUbicacion(ubicacion);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const postCrearCV = async (req, res, next) => {
    try {
        const { id_usuario, datos_personales, experiencia_laboral, formacion_academica, habilidades, ubicacion, telefono } = req.body;
        
        if (!id_usuario) {
            const error = new Error('id_usuario es requerido');
            error.statusCode = 400;
            throw error;
        }

        const nuevoCv = await cvService.createCv(id_usuario, datos_personales, experiencia_laboral, formacion_academica, habilidades, ubicacion, telefono);
        res.status(201).json(nuevoCv);
    } catch (err) {
        next(err);
    }
};

export const putActualizarCV = async (req, res, next) => {
    try {
        const { id_cv } = req.params;
        const result = await cvService.updateCv(id_cv, req.body);
        
        if (!result) {
            const error = new Error('CV no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteEliminarCV = async (req, res, next) => {
    try {
        const { id_cv } = req.params;
        const result = await cvService.deleteCv(id_cv);
        
        if (!result) {
            const error = new Error('CV no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ status: 'success', message: 'CV eliminado correctamente' });
    } catch (err) {
        next(err);
    }
};