const JournalEntry = require("../models/JournalEntry")
const moment = require("moment")

// Get emotion counts
exports.getEmotionCounts = async(req, res) => {
    try {
        const emotionCounts = await JournalEntry.aggregate([
            { $match: { userId: req.user.id } },
            { $group: { _id: "$detectedEmotion", count: { $sum: 1 } } },
        ])

        // Format the response
        const formattedCounts = emotionCounts.reduce((acc, item) => {
            acc[item._id] = item.count
            return acc
        }, {})

        res.json(formattedCounts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

// Get weekly emotion breakdown
exports.getWeeklyEmotions = async(req, res) => {
    try {
        // Get entries from the past 7 days
        const sevenDaysAgo = moment().subtract(7, "days").toDate()

        const entries = await JournalEntry.find({
            userId: req.user.id,
            date: { $gte: sevenDaysAgo },
        }).sort({ date: 1 })

        // Group by day and emotion
        const dailyEmotions = {}

        entries.forEach((entry) => {
            const day = moment(entry.date).format("YYYY-MM-DD")

            if (!dailyEmotions[day]) {
                dailyEmotions[day] = {}
            }

            const emotion = entry.detectedEmotion
            dailyEmotions[day][emotion] = (dailyEmotions[day][emotion] || 0) + 1
        })

        res.json(dailyEmotions)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

// Get monthly emotion breakdown
exports.getMonthlyEmotions = async(req, res) => {
    try {
        const { month, year } = req.query

        // Default to current month and year if not provided
        const targetMonth = month ? Number.parseInt(month) - 1 : moment().month() // 0-indexed
        const targetYear = year ? Number.parseInt(year) : moment().year()

        const startDate = moment().year(targetYear).month(targetMonth).startOf("month").toDate()
        const endDate = moment().year(targetYear).month(targetMonth).endOf("month").toDate()

        const entries = await JournalEntry.find({
            userId: req.user.id,
            date: { $gte: startDate, $lte: endDate },
        })

        // Group by emotion
        const emotionCounts = {}

        entries.forEach((entry) => {
            const emotion = entry.detectedEmotion
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
        })

        res.json({
            month: targetMonth + 1,
            year: targetYear,
            emotions: emotionCounts,
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}