import JournalEntry from '../models/JournalEntry.js';
import analyzeEmotion from '../utils/sentimentAnalyzer.js';

// Create a new journal entry
export const createEntry = async(req, res) => {
    const { content, date, emotionTag } = req.body;

    try {
        // Analyze emotion from content
        const detectedEmotion = analyzeEmotion(content);

        // Create new journal entry
        const newEntry = new JournalEntry({
            userId: req.user.id,
            content,
            date: date || Date.now(),
            detectedEmotion,
            emotionTag
        });

        // Save entry to database
        const entry = await newEntry.save();
        res.json(entry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all journal entries for a user
export const getEntries = async(req, res) => {
    try {
        const entries = await JournalEntry.find({ userId: req.user.id })
            .sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get a single journal entry
export const getEntry = async(req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);

        // Check if entry exists
        if (!entry) {
            return res.status(404).json({ msg: 'Entry not found' });
        }

        // Check if user owns the entry
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(entry);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Entry not found' });
        }
        res.status(500).send('Server error');
    }
};

// Update a journal entry
export const updateEntry = async(req, res) => {
    const { content, date, emotionTag } = req.body;

    try {
        let entry = await JournalEntry.findById(req.params.id);

        // Check if entry exists
        if (!entry) {
            return res.status(404).json({ msg: 'Entry not found' });
        }

        // Check if user owns the entry
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Analyze emotion if content is updated
        const detectedEmotion = content ? analyzeEmotion(content) : entry.detectedEmotion;

        // Update entry
        entry = await JournalEntry.findByIdAndUpdate(
            req.params.id, {
                content: content || entry.content,
                date: date || entry.date,
                detectedEmotion,
                emotionTag: emotionTag || entry.emotionTag
            }, { new: true }
        );

        res.json(entry);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Entry not found' });
        }
        res.status(500).send('Server error');
    }
};

// Delete a journal entry
export const deleteEntry = async(req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);

        // Check if entry exists
        if (!entry) {
            return res.status(404).json({ msg: 'Entry not found' });
        }

        // Check if user owns the entry
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Delete entry
        await JournalEntry.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Entry removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Entry not found' });
        }
        res.status(500).send('Server error');
    }
};