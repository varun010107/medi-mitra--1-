import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false, unique: false },
  password: { type: String, required: false },
  age: { type: Number, required: false },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false },
  height: { type: Number, required: false }, // in cm
  currentWeight: { type: Number, required: false }, // in kg
  activityLevel: { type: String, enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'], required: false },
  goal: { type: String, enum: ['Gain weight', 'Build muscle', 'Lose weight'], required: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
export default User;
