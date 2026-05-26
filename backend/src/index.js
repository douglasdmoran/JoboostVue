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
  res.send('Servidor en linea y al 100 %     https://d1ih8jugeo2m5m.cloudfront.net/2023/01/como-funciona-un-servidor-web-ingeniero.jpg  ');
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