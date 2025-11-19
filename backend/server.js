import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import dietRoutes from './routes/dietRoutes.js';
import symptomRoutes from './routes/symptomRoutes.js';
import labTestRoutes from './routes/labTestRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import { seedInitialData } from './seeders/seeder.js';

dotenv.config();
connectDB();
seedInitialData();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/lab-tests', labTestRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  res.send('Medi Mitra API is running...');
});

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
