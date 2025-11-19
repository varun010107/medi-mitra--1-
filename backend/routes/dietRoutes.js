import express from 'express';
import {
  getAndSaveDietPlan,
  addCustomFoodEntry,
  getDailySummary
} from '../controllers/dietController.js';

const router = express.Router();

router.post('/plan', getAndSaveDietPlan);
router.post('/custom-food-entry', addCustomFoodEntry);
router.get('/summary/:userId', getDailySummary);

export default router;
