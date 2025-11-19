import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientContact: { type: String, required: true },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTimeSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  createdAt: { type: Date, default: Date.now }
});

AppointmentSchema.index({ doctor: 1, appointmentDate: 1, appointmentTimeSlot: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
