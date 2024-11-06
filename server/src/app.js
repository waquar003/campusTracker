import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// app.use(cors({
//   origin: process.env.CORS_ORIGIN,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: true,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// Add headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', `${process.env.CORS_ORIGIN}`);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

app.use(express.static('public'));
app.use(cookieParser());

import userRouter from './routes/User.routes.js';
import scheduleRoutes from './routes/Schedule.routes.js';
import academicGoalRoutes from './routes/AcademicGoal.routes.js';

app.use('/api/v1/user', userRouter);
app.use('/api/v1/schedule', scheduleRoutes);
app.use('/api/v1/academic-goals', academicGoalRoutes);

export default app;
