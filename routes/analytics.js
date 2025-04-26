import express from 'express';
import {
    getEmotionCounts,
    getWeeklyEmotions,
    getMonthlyEmotions
} from '../controllers/analyticsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/analytics/emotions
// @desc    Get emotion counts
// @access  Private
router.get('/emotions', auth, getEmotionCounts);

// @route   GET api/analytics/weekly
// @desc    Get weekly emotion breakdown
// @access  Private
router.get('/weekly', auth, getWeeklyEmotions);

// @route   GET api/analytics/monthly
// @desc    Get monthly emotion breakdown
// @access  Private
router.get('/monthly', auth, getMonthlyEmotions);

export default router;