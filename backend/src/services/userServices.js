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

export const createUser = async (nombre, email, contrasenia, rol = 'postulante', foto_url = null) => {
    const result = await pool.query(`
        INSERT INTO usuarios (nombre, correo, contrasena, rol, foto_url, fecha_registro)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        RETURNING *
    `, [nombre, email, contrasenia, rol, foto_url]);
    
    return result.rows[0];
};

export const updateUser = async (id, nombre, email, contrasenia, rol, foto_url) => {
    let query = `UPDATE usuarios SET nombre = COALESCE($1, nombre), correo = COALESCE($2, correo)`;
    let values = [nombre, email];
    let paramIndex = 3;

    if (rol) {
        query += `, rol = $${paramIndex}`;
        values.push(rol);
        paramIndex++;
    }

    if (contrasenia) {
        query += `, contrasena = $${paramIndex}`;
        values.push(contrasenia);
        paramIndex++;
    }

    if (foto_url !== undefined) {
        query += `, foto_url = $${paramIndex}`;
        values.push(foto_url);
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

export const authenticateUser = async (email, contrasenia) => {
    const user = await getUserByCorreo(email);
    if (!user) return null;

    const dbPass = user.contrasena || '';

    // Verificar primero en texto plano
    let match = contrasenia === dbPass;

    // Si en la base de datos está guardada como hash bcrypt, verificarla con bcrypt para compatibilidad
    if (!match && (dbPass.startsWith('$2a$') || dbPass.startsWith('$2b$') || dbPass.startsWith('$2y$'))) {
        try {
            match = bcrypt.compareSync(contrasenia, dbPass);
        } catch (e) {
            match = false;
        }
    }

    if (!match) return null;

    // Actualizar fecha de último acceso
    await pool.query('UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = $1', [user.id_usuario]);

    return user;
};
