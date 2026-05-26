import { pool } from '../db.js';

export const getAllPostulaciones = async () => {
    const result = await pool.query('SELECT * FROM postulaciones');
    return result.rows;
};

export const getPostulacionById = async (id) => {
    const result = await pool.query('SELECT * FROM postulaciones WHERE id_postulacion = $1', [id]);
    return result.rows[0];
};

export const createPostulacion = async (data) => {
    const { id_vacante, id_usuario, estado, fecha_postulacion } = data;
    const result = await pool.query(`
        INSERT INTO postulaciones (id_vacante, id_usuario, estado, fecha_postulacion)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [id_vacante, id_usuario, estado || 'postulado', fecha_postulacion || new Date()]);
    return result.rows[0];
};

export const updatePostulacion = async (id, data) => {
    const { id_vacante, id_usuario, estado, fecha_postulacion } = data;
    const result = await pool.query(`
        UPDATE postulaciones 
        SET id_vacante = COALESCE($1, id_vacante),
            id_usuario = COALESCE($2, id_usuario),
            estado = COALESCE($3, estado),
            fecha_postulacion = COALESCE($4, fecha_postulacion)
        WHERE id_postulacion = $5
        RETURNING *
    `, [id_vacante, id_usuario, estado, fecha_postulacion, id]);
    return result.rows[0];
};

export const deletePostulacion = async (id) => {
    const result = await pool.query('DELETE FROM postulaciones WHERE id_postulacion = $1 RETURNING *', [id]);
    return result.rows[0];
};