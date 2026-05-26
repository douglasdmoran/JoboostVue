import { pool } from '../db.js';

export const getAllComentarios = async () => {
    const result = await pool.query('SELECT * FROM comentarios_foro');
    return result.rows;
};

export const getComentariosByUsuario = async (id_usuario) => {
    const result = await pool.query(`
        SELECT c.*, f.titulo as foro_titulo 
        FROM comentarios_foro c
        LEFT JOIN foros f ON c.id_foro = f.id_foro
        WHERE c.id_usuario = $1
        ORDER BY c.fecha_comentario DESC
    `, [id_usuario]);
    return result.rows;
};

export const createComentario = async (id_foro, id_usuario, mensaje) => {
    const result = await pool.query(`
        INSERT INTO comentarios_foro (id_foro, id_usuario, mensaje, fecha_comentario)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
    `, [id_foro, id_usuario || null, mensaje]);
    return result.rows[0];
};

export const updateComentario = async (id_comentario, mensaje) => {
    const result = await pool.query(`
        UPDATE comentarios_foro 
        SET mensaje = $1, fecha_comentario = CURRENT_TIMESTAMP
        WHERE id_comentario = $2
        RETURNING *
    `, [mensaje, id_comentario]);
    return result.rows[0];
};

export const deleteComentario = async (id_comentario) => {
    const result = await pool.query(`
        DELETE FROM comentarios_foro 
        WHERE id_comentario = $1
        RETURNING *
    `, [id_comentario]);
    return result.rows[0];
};