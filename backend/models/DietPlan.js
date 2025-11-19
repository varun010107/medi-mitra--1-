import mongoose from 'mongoose';

const MealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true }
});

const DietPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  goal: { type: String, required: true },
  recommendedMacros: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  meals: {
    breakfast: [MealItemSchema],
    lunch: [MealItemSchema],
    snacks: [MealItemSchema],
    dinner: [MealItemSchema]
  },
  createdAt: { type: Date, default: Date.now }
});

DietPlanSchema.index({ user: 1, date: 1 }, { unique: true });

const DietPlan = mongoose.model('DietPlan', DietPlanSchema);
export default DietPlan;
