import * as empresasService from '../services/empresasServices.js';

export const getObtenerEmpresas = async (req, res, next) => {
    try {
        const empresas = await empresasService.getAllEmpresas();
        res.status(200).json(empresas);
    } catch (err) {
        next(err);
    }
};

export const getObtenerEmpresaNombre = async (req, res, next) => {
    try {
        const empresas = await empresasService.getEmpresaByNombre(req.params.nombre);
        res.status(200).json(empresas);
    } catch (err) {
        next(err);
    }
};

export const getObtenerEmpresaUbicacion = async (req, res, next) => {
    try {
        const empresas = await empresasService.getEmpresaByUbicacion(req.params.ubicacion);
        res.status(200).json(empresas);
    } catch (err) {
        next(err);
    }
};

export const getObtenerEmpresaCalificacion = async (req, res, next) => {
    try {
        const empresas = await empresasService.getEmpresaByCalificacion(req.params.calificacion);
        res.status(200).json(empresas);
    } catch (err) {
        next(err);
    }
};

export const postCrearEmpresa = async (req, res, next) => {
    try {
        if (!req.body.nombre) {
            const error = new Error('El nombre de la empresa es requerido');
            error.statusCode = 400;
            throw error;
        }
        const nuevaEmpresa = await empresasService.createEmpresa(req.body);
        res.status(201).json(nuevaEmpresa);
    } catch (err) {
        next(err);
    }
};

export const putActualizarEmpresa = async (req, res, next) => {
    try {
        const empresaId = req.params.id_empresa;
        const empresaActualizada = await empresasService.updateEmpresa(empresaId, req.body);
        
        if (!empresaActualizada) {
            const error = new Error('Empresa no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(empresaActualizada);
    } catch (err) {
        next(err);
    }
};

export const deleteEliminarEmpresa = async (req, res, next) => {
    try {
        const empresaEliminada = await empresasService.deleteEmpresa(req.params.id_empresa);
        
        if (!empresaEliminada) {
            const error = new Error('Empresa no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Empresa eliminada exitosamente' });
    } catch (err) {
        next(err);
    }
};