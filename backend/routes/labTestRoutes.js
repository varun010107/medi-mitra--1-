import express from 'express';
import { getAllLabTests, getLabTestById } from '../controllers/labTestController.js';

const router = express.Router();

router.get('/', getAllLabTests);
router.get('/:id', getLabTestById);

export default router;
