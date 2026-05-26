import * as comentariosService from '../services/comentariosServices.js';

export const getObtenerComentarios = async (req, res, next) => {
    try {
        const comentarios = await comentariosService.getAllComentarios();
        res.status(200).json(comentarios);
    } catch (err) {
        next(err);
    }
};

export const getObtenerComentariosUsuario = async (req, res, next) => {
    try {
        const { id_usuario } = req.params;
        const comentarios = await comentariosService.getComentariosByUsuario(id_usuario);
        res.status(200).json(comentarios);
    } catch (err) {
        next(err);
    }
};

export const postCrearComentario = async (req, res, next) => {
    try {
        const { id_foro, id_usuario, mensaje } = req.body;
        if (!mensaje) {
            const error = new Error('El mensaje es requerido');
            error.statusCode = 400;
            throw error;
        }
        const nuevoComentario = await comentariosService.createComentario(id_foro, id_usuario, mensaje);
        res.status(201).json(nuevoComentario);
    } catch (err) {
        next(err);
    }
};

export const putActualizarComentario = async (req, res, next) => {
    try {
        const { id_comentario } = req.params;
        const { mensaje } = req.body;
        
        const comentarioEditado = await comentariosService.updateComentario(id_comentario, mensaje);
        
        if (!comentarioEditado) {
            const error = new Error('Comentario no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(comentarioEditado);
    } catch (err) {
        next(err);
    }
};

export const deleteBorrarComentario = async (req, res, next) => {
    try {
        const { id_comentario } = req.params;
        const comentarioEliminado = await comentariosService.deleteComentario(id_comentario);
        
        if (!comentarioEliminado) {
            const error = new Error('Comentario no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Comentario eliminado exitosamente' });
    } catch (err) {
        next(err);
    }
};