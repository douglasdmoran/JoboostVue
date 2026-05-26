import { pool } from '../db.js';

export const getAllSeguimientos = async () => {
    const result = await pool.query('SELECT * FROM seguimientos');
    return result.rows;
};

export const getSeguimientoById = async (id) => {
    const result = await pool.query('SELECT * FROM seguimientos WHERE id_seguimiento = $1', [id]);
    return result.rows[0];
};

export const createSeguimiento = async (data) => {
    const { id_postulacion, id_gestor, mensaje, fecha_seguimiento } = data;
    const result = await pool.query(`
        INSERT INTO seguimientos (id_postulacion, id_gestor, mensaje, fecha_seguimiento)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [id_postulacion, id_gestor, mensaje, fecha_seguimiento || new Date()]);
    return result.rows[0];
};

export const updateSeguimiento = async (id, data) => {
    const { id_postulacion, id_gestor, mensaje, fecha_seguimiento } = data;
    const result = await pool.query(`
        UPDATE seguimientos 
        SET id_postulacion = COALESCE($1, id_postulacion),
            id_gestor = COALESCE($2, id_gestor),
            mensaje = COALESCE($3, mensaje),
            fecha_seguimiento = COALESCE($4, fecha_seguimiento)
        WHERE id_seguimiento = $5
        RETURNING *
    `, [id_postulacion, id_gestor, mensaje, fecha_seguimiento, id]);
    return result.rows[0];
};

export const deleteSeguimiento = async (id) => {
    const result = await pool.query('DELETE FROM seguimientos WHERE id_seguimiento = $1 RETURNING *', [id]);
    return result.rows[0];
};