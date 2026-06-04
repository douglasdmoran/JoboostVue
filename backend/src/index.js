import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users.js';

import comentariosRouter from './routes/comentarios.js';

import cvRouter from './routes/cv.js';

import empresasRouter from './routes/empresas.js';

import forosRouter from './routes/foros.js';

import postulacionesRouter from './routes/postulaciones.js';

import recursosRouter from './routes/recursos.js';

import seguimientosRouter from './routes/seguimientos.js';

import valoracionesRouter from './routes/valoraciones.js';

import vacantesRouter from './routes/vacantes.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { pool } from './db.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
  origin: /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor en linea y al 100 %     https://d1ih8jugeo2m5m.cloudfront.log  ');
}); 

app.get('/estadisticas', async (req, res, next) => {
  try {
    const usuariosCount = await pool.query("SELECT COUNT(*) FROM usuarios WHERE rol = 'postulante'");
    const empleosCount = await pool.query("SELECT COUNT(*) FROM vacantes WHERE activa = true");
    const empresasCount = await pool.query("SELECT COUNT(*) FROM empresas");
    
    res.status(200).json({
      activos: parseInt(usuariosCount.rows[0].count, 10),
      empleos: parseInt(empleosCount.rows[0].count, 10),
      empresas: parseInt(empresasCount.rows[0].count, 10)
    });
  } catch (err) {
    next(err);
  }
});

app.use('/users', usersRouter);

app.use('/comentarios', comentariosRouter);

app.use('/cv', cvRouter);

app.use('/empresas', empresasRouter);

app.use('/foros', forosRouter);

app.use('/postulaciones', postulacionesRouter);

app.use('/recursos', recursosRouter);

app.use('/seguimientos', seguimientosRouter);

app.use('/valoraciones', valoracionesRouter);

app.use('/vacantes', vacantesRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
});