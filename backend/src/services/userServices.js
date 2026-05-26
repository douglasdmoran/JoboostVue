import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows;
};

export const getUserByCorreo = async (correo) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    return result.rows[0];
};

export const createUser = async (nombre, documento, carnet, email, contrasenia) => {
    const SALT_ROUNDS = 10;
    const salt = await bcrypt.genSaltSync(SALT_ROUNDS); // Usar genSaltSync para consistencia o await con genSalt
    const contraseniaHashed = bcrypt.hashSync(contrasenia, salt);

    // Corregido: Una sola declaración de result y usando la contraseña hasheada
    const result = await pool.query(`
        INSERT INTO usuarios (nombre, documento, carnet, correo, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [nombre, documento, carnet, email, contraseniaHashed]);
    
    return result.rows[0];
};

export const updateUser = async (id, nombre, documento, carnet, email, contrasenia, rol) => {
    let query = `UPDATE usuarios SET nombre = $1, correo = $2, documento = $3`;
    let values = [nombre, email, documento || null];
    let paramIndex = 4;

    if (rol) {
        query += `, rol = $${paramIndex}`;
        values.push(rol);
        paramIndex++;
    }

    if (contrasenia) {
        const SALT_ROUNDS = 10;
        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const contraseniaHashed = bcrypt.hashSync(contrasenia, salt);
        // Sometimes password column is used, sometimes contrasena, let's update both just in case or just stick to contrasena
        query += `, contrasena = $${paramIndex}`;
        values.push(contraseniaHashed);
        paramIndex++;
    }

    query += ` WHERE id_usuario = $${paramIndex} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
    return result.rows[0];
};
