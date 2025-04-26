const express = require("express")
const router = express.Router()
const analyticsController = require("../controllers/analyticsController")
const auth = require("../middleware/auth")

// Apply auth middleware to all routes
router.use(auth)

// @route   GET api/analytics/emotions
// @desc    Get emotion counts
// @access  Private
router.get("/emotions", analyticsController.getEmotionCounts)

// @route   GET api/analytics/weekly
// @desc    Get weekly emotion breakdown
// @access  Private
router.get("/weekly", analyticsController.getWeeklyEmotions)

// @route   GET api/analytics/monthly
// @desc    Get monthly emotion breakdown
// @access  Private
router.get("/monthly", analyticsController.getMonthlyEmotions)

module.exports = router