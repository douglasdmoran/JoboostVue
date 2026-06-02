import * as vacantesService from '../services/vacantesServices.js';

export const getObtenerTodasVacantes = async (req, res, next) => {
    try {
        const result = await vacantesService.getAllVacantes();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerVacanteId = async (req, res, next) => {
    try {
        const result = await vacantesService.getVacanteById(req.params.id_vacante);
        if (!result) {
            const error = new Error('Vacante no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerVacantesTitulo = async (req, res, next) => {
    try {
        const result = await vacantesService.getVacantesPorTitulo(req.params.titulo);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerVacantesUbicacion = async (req, res, next) => {
    try {
        const result = await vacantesService.getVacantesPorUbicacion(req.params.ubicacion);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerVacantesModalidad = async (req, res, next) => {
    try {
        const result = await vacantesService.getVacantesPorModalidad(req.params.modalidad);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getObtenerVacantesTipoContrato = async (req, res, next) => {
    try {
        const result = await vacantesService.getVacantesPorTipoContrato(req.params.tipo_contrato);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const postCrearVacante = async (req, res, next) => {
    try {
        if (!req.body.id_empresa || !req.body.titulo) {
            const error = new Error('id_empresa y titulo son requeridos');
            error.statusCode = 400;
            throw error;
        }
        
        let { tipo_contrato } = req.body;
        if (tipo_contrato) {
            tipo_contrato = tipo_contrato.toLowerCase().replace(/_/g, ' ');
            if (tipo_contrato === 'contrato') tipo_contrato = 'por proyecto';
            if (tipo_contrato === 'practicas') tipo_contrato = 'freelance';
            req.body.tipo_contrato = tipo_contrato;
        }
        
        const result = await vacantesService.createVacante(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const putActualizarVacante = async (req, res, next) => {
    try {
        let { tipo_contrato } = req.body;
        if (tipo_contrato) {
            tipo_contrato = tipo_contrato.toLowerCase().replace(/_/g, ' ');
            if (tipo_contrato === 'contrato') tipo_contrato = 'por proyecto';
            if (tipo_contrato === 'practicas') tipo_contrato = 'freelance';
            req.body.tipo_contrato = tipo_contrato;
        }
        
        const result = await vacantesService.updateVacante(req.params.id_vacante, req.body);
        if (!result) {
            const error = new Error('Vacante no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteEliminarVacante = async (req, res, next) => {
    try {
        const result = await vacantesService.deleteVacante(req.params.id_vacante);
        if (!result) {
            const error = new Error('Vacante no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Vacante eliminada exitosamente' });
    } catch (err) {
        next(err);
    }
};