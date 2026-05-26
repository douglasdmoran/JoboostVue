import { pool } from '../db.js';

export const getAllVacantes = async () => {
    const result = await pool.query('SELECT * FROM vacantes');
    return result.rows;
};

export const getVacanteById = async (id_vacante) => {
    const result = await pool.query(
        `SELECT v.*, e.nombre as empresa_nombre 
         FROM vacantes v
         LEFT JOIN empresas e ON v.id_empresa = e.id_empresa
         WHERE v.id_vacante = $1`,
        [id_vacante]
    );
    return result.rows[0];
};

export const getVacantesPorTitulo = async (titulo) => {
    const result = await pool.query(
        `SELECT v.*, e.nombre as empresa_nombre 
         FROM vacantes v
         LEFT JOIN empresas e ON v.id_empresa = e.id_empresa
         WHERE v.titulo ILIKE $1 AND v.activa = true
         ORDER BY v.fecha_publicacion DESC`,
        [`%${titulo}%`]
    );
    return result.rows;
};

export const getVacantesPorUbicacion = async (ubicacion) => {
    const result = await pool.query(
        `SELECT v.*, e.nombre as empresa_nombre 
         FROM vacantes v
         LEFT JOIN empresas e ON v.id_empresa = e.id_empresa
         WHERE v.ubicacion ILIKE $1 AND v.activa = true
         ORDER BY v.fecha_publicacion DESC`,
        [`%${ubicacion}%`]
    );
    return result.rows;
};

export const getVacantesPorModalidad = async (modalidad) => {
    const result = await pool.query(
        `SELECT v.*, e.nombre as empresa_nombre 
         FROM vacantes v
         LEFT JOIN empresas e ON v.id_empresa = e.id_empresa
         WHERE v.modalidad = $1 AND v.activa = true
         ORDER BY v.fecha_publicacion DESC`,
        [modalidad]
    );
    return result.rows;
};

export const getVacantesPorTipoContrato = async (tipo_contrato) => {
    const result = await pool.query(
        `SELECT v.*, e.nombre as empresa_nombre 
         FROM vacantes v
         LEFT JOIN empresas e ON v.id_empresa = e.id_empresa
         WHERE v.tipo_contrato = $1 AND v.activa = true
         ORDER BY v.fecha_publicacion DESC`,
        [tipo_contrato]
    );
    return result.rows;
};

export const createVacante = async (data) => {
    const { id_empresa, titulo, descripcion, requisitos, ubicacion, salario_oferta, tipo_contrato, modalidad, fecha_limite, activa } = data;
    const result = await pool.query(`
        INSERT INTO vacantes (id_empresa, titulo, descripcion, requisitos, ubicacion, salario_oferta, tipo_contrato, modalidad, fecha_publicacion, fecha_limite, activa)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, $9, $10)
        RETURNING *
    `, [id_empresa, titulo, descripcion, requisitos, ubicacion, salario_oferta, tipo_contrato, modalidad, fecha_limite, activa !== undefined ? activa : true]);
    return result.rows[0];
};

export const updateVacante = async (id, data) => {
    const { id_empresa, titulo, descripcion, requisitos, ubicacion, salario_oferta, tipo_contrato, modalidad, fecha_limite, activa } = data;
    const result = await pool.query(`
        UPDATE vacantes 
        SET id_empresa = COALESCE($1, id_empresa),
            titulo = COALESCE($2, titulo),
            descripcion = COALESCE($3, descripcion),
            requisitos = COALESCE($4, requisitos),
            ubicacion = COALESCE($5, ubicacion),
            salario_oferta = COALESCE($6, salario_oferta),
            tipo_contrato = COALESCE($7, tipo_contrato),
            modalidad = COALESCE($8, modalidad),
            fecha_limite = COALESCE($9, fecha_limite),
            activa = COALESCE($10, activa)
        WHERE id_vacante = $11
        RETURNING *
    `, [id_empresa, titulo, descripcion, requisitos, ubicacion, salario_oferta, tipo_contrato, modalidad, fecha_limite, activa, id]);
    return result.rows[0];
};

export const deleteVacante = async (id) => {
    const result = await pool.query('DELETE FROM vacantes WHERE id_vacante = $1 RETURNING *', [id]);
    return result.rows[0];
};