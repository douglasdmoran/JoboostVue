import { pool } from '../db.js';

export const getAllValoraciones = async () => {
    const result = await pool.query('SELECT * FROM valoraciones_empresa');
    return result.rows;
};

export const getValoracionesByIdUsuario = async (id_usuario) => {
    const result = await pool.query(
        `SELECT v.*, e.nombre as empresa_nombre 
         FROM valoraciones_empresa v
         LEFT JOIN empresas e ON v.id_empresa = e.id_empresa
         WHERE v.id_usuario = $1
         ORDER BY v.fecha_valoracion DESC`,
        [id_usuario]
    );
    return result.rows;
};

export const getValoracionesByIdEmpresa = async (id_empresa) => {
    const result = await pool.query(
        `SELECT v.*, u.nombre as usuario_nombre 
         FROM valoraciones_empresa v
         LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
         WHERE v.id_empresa = $1
         ORDER BY v.fecha_valoracion DESC`,
        [id_empresa]
    );
    return result.rows;
};

export const createValoracion = async (data) => {
    const { id_usuario, id_empresa, calificacion, comentario, fecha_valoracion } = data;
    const result = await pool.query(`
        INSERT INTO valoraciones_empresa (id_usuario, id_empresa, calificacion, comentario, fecha_valoracion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [id_usuario, id_empresa, calificacion, comentario, fecha_valoracion || new Date()]);

    // Recalcular y actualizar calificacion_promedio en empresas
    await pool.query(`
        UPDATE empresas 
        SET calificacion_promedio = COALESCE((SELECT ROUND(AVG(calificacion), 1) FROM valoraciones_empresa WHERE id_empresa = $1), 0)
        WHERE id_empresa = $1
    `, [id_empresa]);

    return result.rows[0];
};

export const updateValoracion = async (id, data) => {
    const { calificacion, comentario, fecha_valoracion } = data;
    const result = await pool.query(`
        UPDATE valoraciones_empresa 
        SET calificacion = COALESCE($1, calificacion),
            comentario = COALESCE($2, comentario),
            fecha_valoracion = COALESCE($3, fecha_valoracion)
        WHERE id_valoracion = $4
        RETURNING *
    `, [calificacion, comentario, fecha_valoracion, id]);

    if (result.rows[0]) {
        const id_empresa = result.rows[0].id_empresa;
        await pool.query(`
            UPDATE empresas 
            SET calificacion_promedio = COALESCE((SELECT ROUND(AVG(calificacion), 1) FROM valoraciones_empresa WHERE id_empresa = $1), 0)
            WHERE id_empresa = $1
        `, [id_empresa]);
    }

    return result.rows[0];
};

export const deleteValoracion = async (id) => {
    const result = await pool.query(
        'DELETE FROM valoraciones_empresa WHERE id_valoracion = $1 RETURNING *',
        [id]
    );

    if (result.rows[0]) {
        const id_empresa = result.rows[0].id_empresa;
        await pool.query(`
            UPDATE empresas 
            SET calificacion_promedio = COALESCE((SELECT ROUND(AVG(calificacion), 1) FROM valoraciones_empresa WHERE id_empresa = $1), 0)
            WHERE id_empresa = $1
        `, [id_empresa]);
    }

    return result.rows[0];
};