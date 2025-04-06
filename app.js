import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes.js';
import flightRoutes from './src/routes/flightRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// optional health route for testing
app.get('/', (req, res) => res.send('OK'));

export default app;
