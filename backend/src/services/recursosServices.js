import { pool } from '../db.js';

export const getAllRecursos = async () => {
    const result = await pool.query('SELECT * FROM recursos');
    return result.rows;
};

export const getRecursoByTitulo = async (titulo) => {
    const buscar = `%${titulo}%`;
    const result = await pool.query(
        "SELECT * FROM recursos WHERE titulo ILIKE $1 ORDER BY fecha_publicacion DESC",
        [buscar]
    );
    return result.rows;
};

export const createRecurso = async (data) => {
    const { titulo, contenido, tipo, url, fecha_publicacion } = data;
    const result = await pool.query(`
        INSERT INTO recursos (titulo, contenido, tipo, url, fecha_publicacion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [titulo, contenido, tipo, url, fecha_publicacion || new Date()]);
    return result.rows[0];
};

export const updateRecurso = async (id, data) => {
    const { titulo, contenido, tipo, url, fecha_publicacion } = data;
    const result = await pool.query(`
        UPDATE recursos 
        SET titulo = COALESCE($1, titulo),
            contenido = COALESCE($2, contenido),
            tipo = COALESCE($3, tipo),
            url = COALESCE($4, url),
            fecha_publicacion = COALESCE($5, fecha_publicacion)
        WHERE id_recurso = $6
        RETURNING *
    `, [titulo, contenido, tipo, url, fecha_publicacion, id]);
    return result.rows[0];
};

export const deleteRecurso = async (id) => {
    const result = await pool.query('DELETE FROM recursos WHERE id_recurso = $1 RETURNING *', [id]);
    return result.rows[0];
};