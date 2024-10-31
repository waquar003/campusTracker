import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${process.env.CORS_ORIGIN}`);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(express.static('public'));
app.use(cookieParser());

import userRouter from './routes/User.routes.js';

app.use('/api/v1/user', userRouter);

export default app;
