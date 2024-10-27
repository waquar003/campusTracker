import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config({});

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(cookieParser())

import userRouter from './routes/User.route.js';



app.use('/api/v1/user', userRouter);

export default app;
