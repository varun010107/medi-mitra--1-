import DietPlan from '../models/DietPlan.js';
import User from '../models/User.js';

// Simple TDEE calculation
const calculateTDEE = (age, gender, height, weight, activityLevel) => {
  let BMR;
  if (gender === 'Male') {
    BMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    BMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  const multipliers = {
    Sedentary: 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725
  };

  return BMR * (multipliers[activityLevel] || 1.375);
};

const getMacroSplit = (goal, TDEE) => {
  let proteinFactor, carbFactor, fatFactor;
  let calorieAdjustment = 0;

  switch (goal) {
    case 'Lose weight':
      proteinFactor = 0.35;
      carbFactor = 0.45;
      fatFactor = 0.20;
      calorieAdjustment = -500;
      break;
    case 'Gain weight':
      proteinFactor = 0.30;
      carbFactor = 0.50;
      fatFactor = 0.20;
      calorieAdjustment = 500;
      break;
    case 'Build muscle':
    default:
      proteinFactor = 0.35;
      carbFactor = 0.40;
      fatFactor = 0.25;
      calorieAdjustment = 300;
      break;
  }

  const dailyCalories = TDEE + calorieAdjustment;
  const proteinGrams = Math.round((dailyCalories * proteinFactor) / 4);
  const carbsGrams = Math.round((dailyCalories * carbFactor) / 4);
  const fatsGrams = Math.round((dailyCalories * fatFactor) / 9);

  return {
    calories: Math.round(dailyCalories),
    protein: proteinGrams,
    carbs: carbsGrams,
    fats: fatsGrams
  };
};

const autoMeals = {
  breakfast: [
    { name: 'Oatmeal with berries', quantity: 1, calories: 350, protein: 12, carbs: 55, fats: 8 },
    { name: 'Scrambled eggs (2)', quantity: 1, calories: 250, protein: 18, carbs: 2, fats: 18 }
  ],
  lunch: [
    { name: 'Chicken salad wrap', quantity: 1, calories: 450, protein: 35, carbs: 40, fats: 18 },
    { name: 'Lentil soup and whole-wheat bread', quantity: 1, calories: 380, protein: 20, carbs: 55, fats: 8 }
  ],
  snacks: [
    { name: 'Apple and peanut butter', quantity: 1, calories: 200, protein: 7, carbs: 25, fats: 10 },
    { name: 'Handful of almonds', quantity: 1, calories: 180, protein: 6, carbs: 6, fats: 15 }
  ],
  dinner: [
    { name: 'Salmon with roasted vegetables', quantity: 1, calories: 550, protein: 40, carbs: 30, fats: 30 },
    { name: 'Tofu Stir-fry with Brown Rice', quantity: 1, calories: 480, protein: 30, carbs: 60, fats: 15 }
  ]
};

export const getAndSaveDietPlan = async (req, res) => {
  const { userId, name, age, gender, height, currentWeight, activityLevel, goal } = req.body;

  if (!userId || !age || !height || !currentWeight || !activityLevel || !goal) {
    return res.status(400).json({ message: 'Missing required diet parameters.' });
  }

  try {
    let user = await User.findById(userId);

    if (!user) {
      user = await User.create({
        _id: userId,
        name: name || 'Demo User',
        email: `${userId}@demo.com`,
        age,
        gender,
        height,
        currentWeight,
        activityLevel,
        goal
      });
    } else {
      user.age = age;
      user.gender = gender;
      user.height = height;
      user.currentWeight = currentWeight;
      user.activityLevel = activityLevel;
      user.goal = goal;
      if (name) user.name = name;
      await user.save();
    }

    const TDEE = calculateTDEE(age, gender, height, currentWeight, activityLevel);
    const recommendedMacros = getMacroSplit(goal, TDEE);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const dietPlan = await DietPlan.findOneAndUpdate(
      { user: userId, date: startOfToday },
      {
        goal,
        recommendedMacros,
        meals: autoMeals
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json({
      message: 'Diet plan calculated and saved successfully (auto-suggested).',
      userProfile: user,
      dietPlan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error when calculating diet plan.' });
  }
};

export const addCustomFoodEntry = async (req, res) => {
  const { userId, mealType, foodItem } = req.body;

  if (!userId || !mealType || !foodItem) {
    return res.status(400).json({ message: 'Missing user, meal type, or food item details.' });
  }

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const dietPlan = await DietPlan.findOne({ user: userId, date: startOfToday });

    if (!dietPlan) {
      return res.status(404).json({ message: 'No diet plan found for today. Please run /api/diet/plan first.' });
    }

    if (dietPlan.meals[mealType]) {
      dietPlan.meals[mealType].push(foodItem);
    } else {
      return res.status(400).json({ message: 'Invalid meal type provided.' });
    }

    await dietPlan.save();
    res.json({
      message: `${foodItem.name} added successfully to ${mealType}.`,
      updatedDietPlan: dietPlan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error when adding custom food entry.' });
  }
};

export const getDailySummary = async (req, res) => {
  const { userId } = req.params;

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const dietPlan = await DietPlan.findOne({ user: userId, date: startOfToday });

    if (!dietPlan) {
      return res.status(200).json({
        message: 'No diet plan or entries found for today.',
        summary: { calories: 0, protein: 0, carbs: 0, fats: 0 },
        recommendedMacros: null
      });
    }

    let totalCalories = 0,
      totalProtein = 0,
      totalCarbs = 0,
      totalFats = 0;

    const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];
    mealTypes.forEach(mealType => {
      dietPlan.meals[mealType].forEach(item => {
        totalCalories += item.calories;
        totalProtein += item.protein;
        totalCarbs += item.carbs;
        totalFats += item.fats;
      });
    });

    res.json({
      message: 'Daily diet summary retrieved.',
      summary: {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fats: totalFats
      },
      recommendedMacros: dietPlan.recommendedMacros,
      fullPlan: dietPlan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error when retrieving diet summary.' });
  }
};
