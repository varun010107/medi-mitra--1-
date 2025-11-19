import mongoose from 'mongoose';

const DayScheduleSchema = new mongoose.Schema({
  workout: { type: Boolean, default: false },
  running: { type: Boolean, default: false },
  yoga: { type: Boolean, default: false },
  sleepHours: { type: Number, default: 8 }
});

const FitnessPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStart: {
    type: Date,
    required: true
  },
  schedule: {
    monday: DayScheduleSchema,
    tuesday: DayScheduleSchema,
    wednesday: DayScheduleSchema,
    thursday: DayScheduleSchema,
    friday: DayScheduleSchema,
    saturday: DayScheduleSchema,
    sunday: DayScheduleSchema
  },
  createdAt: { type: Date, default: Date.now }
});

const FitnessPlan = mongoose.model('FitnessPlan', FitnessPlanSchema);
export default FitnessPlan;
