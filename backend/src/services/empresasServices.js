import { pool } from '../db.js';

export const getAllEmpresas = async () => {
    const result = await pool.query('SELECT * FROM empresas');
    return result.rows;
};

export const getEmpresaByNombre = async (nombre) => {
    const result = await pool.query(
        'SELECT * FROM empresas WHERE nombre ILIKE $1 ORDER BY nombre',
        [`%${nombre}%`]
    );
    return result.rows;
};

export const getEmpresaByNombreExacto = async (nombre) => {
    const result = await pool.query(
        'SELECT * FROM empresas WHERE LOWER(TRIM(nombre)) = LOWER(TRIM($1))',
        [nombre]
    );
    return result.rows[0];
};

export const getEmpresaByUbicacion = async (ubicacion) => {
    const result = await pool.query(
        'SELECT * FROM empresas WHERE ubicacion ILIKE $1 ORDER BY nombre',
        [`%${ubicacion}%`]
    );
    return result.rows;
};

export const getEmpresaByCalificacion = async (calificacion) => {
    const result = await pool.query(
        'SELECT * FROM empresas WHERE calificacion_promedio >= $1 ORDER BY calificacion_promedio DESC',
        [calificacion]
    );
    return result.rows;
};

export const createEmpresa = async (data) => {
    const { nombre, descripcion, ubicacion, sitio_web, calificacion_promedio, logo_url } = data;
    const result = await pool.query(`
        INSERT INTO empresas (nombre, descripcion, ubicacion, sitio_web, calificacion_promedio, logo_url, fecha_creacion)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING *
    `, [nombre, descripcion, ubicacion, sitio_web, calificacion_promedio || 0, logo_url || null]);
    return result.rows[0];
};

export const updateEmpresa = async (id, data) => {
    const { nombre, descripcion, ubicacion, sitio_web, calificacion_promedio, logo_url } = data;
    const result = await pool.query(`
        UPDATE empresas 
        SET nombre = COALESCE($1, nombre),
            descripcion = COALESCE($2, descripcion),
            ubicacion = COALESCE($3, ubicacion),
            sitio_web = COALESCE($4, sitio_web),
            calificacion_promedio = COALESCE($5, calificacion_promedio),
            logo_url = COALESCE($6, logo_url)
        WHERE id_empresa = $7
        RETURNING *
    `, [nombre, descripcion, ubicacion, sitio_web, calificacion_promedio, logo_url, id]);
    return result.rows[0];
};

export const deleteEmpresa = async (id) => {
    const result = await pool.query(
        'DELETE FROM empresas WHERE id_empresa = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};