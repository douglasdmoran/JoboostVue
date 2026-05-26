import { pool } from '../db.js';

export const getAllCvs = async () => {
    const result = await pool.query('SELECT * FROM cv');
    return result.rows;
};

export const getCvByTelefono = async (telefono) => {
    const result = await pool.query('SELECT * FROM cv WHERE telefono = $1', [telefono]);
    return result.rows;
};

export const getCvByUbicacion = async (ubicacion) => {
    const result = await pool.query(
        'SELECT * FROM cv WHERE ubicacion ILIKE $1',
        [`%${ubicacion}%`]
    );
    return result.rows;
};

export const createCv = async (id_usuario, datos_personales, experiencia_laboral, formacion_academica, habilidades, ubicacion, telefono) => {
    const result = await pool.query(`
        INSERT INTO cv (id_usuario, datos_personales, experiencia_laboral, formacion_academica, habilidades, ubicacion, telefono, fecha_actualizacion)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
        RETURNING *
    `, [id_usuario, datos_personales, experiencia_laboral, formacion_academica, habilidades, ubicacion, telefono]);
    return result.rows[0];
};

export const updateCv = async (id_cv, data) => {
    const { datos_personales, experiencia_laboral, formacion_academica, habilidades, ubicacion, telefono } = data;
    const result = await pool.query(`
        UPDATE cv 
        SET datos_personales = COALESCE($1, datos_personales),
            experiencia_laboral = COALESCE($2, experiencia_laboral),
            formacion_academica = COALESCE($3, formacion_academica),
            habilidades = COALESCE($4, habilidades),
            ubicacion = COALESCE($5, ubicacion),
            telefono = COALESCE($6, telefono),
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_cv = $7
        RETURNING *
    `, [datos_personales, experiencia_laboral, formacion_academica, habilidades, ubicacion, telefono, id_cv]);
    return result.rows[0];
};

export const deleteCv = async (id_cv) => {
    const result = await pool.query('DELETE FROM cv WHERE id_cv = $1 RETURNING *', [id_cv]);
    return result.rows[0];
};
