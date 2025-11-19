import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, required: true },
  experience: { type: Number, required: true },
  locationCity: { type: String, required: true },
  consultationMode: { type: String, enum: ['Online', 'In-person', 'Both'], required: true },
  availableSlots: [String],
  rating: { type: Number, min: 1, max: 5, default: 4.0 }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
