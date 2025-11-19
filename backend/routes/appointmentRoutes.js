import express from 'express';
import { createAppointment, getUserAppointments } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', createAppointment);
router.get('/user/:userId', getUserAppointments);

export default router;
