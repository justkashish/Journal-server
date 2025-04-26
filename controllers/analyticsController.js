import JournalEntry from '../models/JournalEntry.js';
import mongoose from 'mongoose';

// Get emotion counts for a user
export const getEmotionCounts = async(req, res) => {
    try {
        const emotionCounts = await JournalEntry.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: '$detectedEmotion', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json(emotionCounts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get weekly emotion breakdown
export const getWeeklyEmotions = async(req, res) => {
    try {
        // Get date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyEmotions = await JournalEntry.aggregate([{
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id),
                    date: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: '$date' },
                        month: { $month: '$date' },
                        year: { $year: '$date' },
                        emotion: '$detectedEmotion'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);

        // Format the data for frontend
        const formattedData = weeklyEmotions.map(item => ({
            date: `${item._id.year}-${item._id.month}-${item._id.day}`,
            emotion: item._id.emotion,
            count: item.count
        }));

        res.json(formattedData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get monthly emotion breakdown
export const getMonthlyEmotions = async(req, res) => {
    try {
        // Get first day of current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyEmotions = await JournalEntry.aggregate([{
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id),
                    date: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: '$date' },
                        emotion: '$detectedEmotion'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.day': 1 }
            }
        ]);

        // Format the data for frontend
        const formattedData = monthlyEmotions.map(item => ({
            day: item._id.day,
            emotion: item._id.emotion,
            count: item.count
        }));

        res.json(formattedData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};