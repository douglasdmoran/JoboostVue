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

export const createUser = async (nombre, email, contrasenia, rol = 'postulante') => {
    const SALT_ROUNDS = 10;
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const contraseniaHashed = bcrypt.hashSync(contrasenia, salt);

    const result = await pool.query(`
        INSERT INTO usuarios (nombre, correo, contrasena, rol, fecha_registro)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        RETURNING *
    `, [nombre, email, contraseniaHashed, rol]);
    
    return result.rows[0];
};

export const updateUser = async (id, nombre, email, contrasenia, rol) => {
    let query = `UPDATE usuarios SET nombre = $1, correo = $2`;
    let values = [nombre, email];
    let paramIndex = 3;

    if (rol) {
        query += `, rol = $${paramIndex}`;
        values.push(rol);
        paramIndex++;
    }

    if (contrasenia) {
        const SALT_ROUNDS = 10;
        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const contraseniaHashed = bcrypt.hashSync(contrasenia, salt);
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

export const authenticateUser = async (email, contrasenia) => {
    const user = await getUserByCorreo(email);
    if (!user) return null;

    let match = false;
    const dbPass = user.contrasena || '';

    // Si parece un hash bcrypt, comparar con bcrypt
    if (dbPass.startsWith('$2a$') || dbPass.startsWith('$2b$') || dbPass.startsWith('$2y$')) {
        try {
            match = bcrypt.compareSync(contrasenia, dbPass);
        } catch (e) {
            match = false;
        }
    } else {
        // Fallback para contraseñas históricas/heredadas en texto plano
        match = contrasenia === dbPass;
    }

    if (!match) return null;

    // Actualizar fecha de último acceso
    await pool.query('UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = $1', [user.id_usuario]);

    return user;
};
