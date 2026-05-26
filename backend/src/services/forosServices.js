import { pool } from '../db.js';

export const getAllForos = async () => {
    const result = await pool.query('SELECT * FROM foros');
    return result.rows;
};

export const getForosByTitulo = async (titulo) => {
    const result = await pool.query(`
        SELECT f.*, u.nombre as usuario_nombre 
        FROM foros f
        LEFT JOIN usuarios u ON f.id_usuario = u.id_usuario
        WHERE f.titulo ILIKE $1
        ORDER BY f.fecha_creacion DESC
    `, [`%${titulo}%`]);
    return result.rows;
};

export const getForosByFecha = async (fecha) => {
    const result = await pool.query(`
        SELECT f.*, u.nombre as usuario_nombre 
        FROM foros f
        LEFT JOIN usuarios u ON f.id_usuario = u.id_usuario
        WHERE DATE(f.fecha_creacion) = $1
        ORDER BY f.fecha_creacion DESC
    `, [fecha]);
    return result.rows;
};

export const createForo = async (data) => {
    const { titulo, contenido, id_usuario, cerrado } = data;
    const result = await pool.query(`
        INSERT INTO foros (titulo, contenido, id_usuario, fecha_creacion, cerrado)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
        RETURNING *
    `, [titulo, contenido, id_usuario || null, cerrado || false]);
    return result.rows[0];
};

export const updateForo = async (id, data) => {
    const { titulo, contenido, cerrado } = data;
    const result = await pool.query(`
        UPDATE foros 
        SET titulo = COALESCE($1, titulo),
            contenido = COALESCE($2, contenido),
            cerrado = COALESCE($3, cerrado)
        WHERE id_foro = $4
        RETURNING *
    `, [titulo, contenido, cerrado, id]);
    return result.rows[0];
};

export const deleteForo = async (id) => {
    const result = await pool.query(
        'DELETE FROM foros WHERE id_foro = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};