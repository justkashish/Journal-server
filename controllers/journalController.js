const JournalEntry = require("../models/JournalEntry")
const { analyzeEmotion } = require("../utils/sentimentAnalyzer")

// Create a new journal entry
exports.createEntry = async(req, res) => {
    try {
        const { content, date, emotionTag } = req.body

        // Analyze emotion from content
        const detectedEmotion = analyzeEmotion(content)

        // Create new journal entry
        const newEntry = new JournalEntry({
            userId: req.user.id,
            content,
            date: date || Date.now(),
            detectedEmotion,
            emotionTag,
        })

        const savedEntry = await newEntry.save()
        res.status(201).json(savedEntry)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

// Get all journal entries for a user
exports.getEntries = async(req, res) => {
    try {
        const entries = await JournalEntry.find({ userId: req.user.id }).sort({ date: -1 })
        res.json(entries)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

// Get a single journal entry
exports.getEntry = async(req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id)

        // Check if entry exists
        if (!entry) {
            return res.status(404).json({ message: "Entry not found" })
        }

        // Check if entry belongs to user
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" })
        }

        res.json(entry)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

// Update a journal entry
exports.updateEntry = async(req, res) => {
    try {
        const { content, date, emotionTag } = req.body

        // Find the entry
        const entry = await JournalEntry.findById(req.params.id)

        // Check if entry exists
        if (!entry) {
            return res.status(404).json({ message: "Entry not found" })
        }

        // Check if entry belongs to user
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" })
        }

        // Update fields
        if (content) {
            entry.content = content
            entry.detectedEmotion = analyzeEmotion(content)
        }

        if (date) entry.date = date
        if (emotionTag) entry.emotionTag = emotionTag

        await entry.save()
        res.json(entry)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

// Delete a journal entry
exports.deleteEntry = async(req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id)

        // Check if entry exists
        if (!entry) {
            return res.status(404).json({ message: "Entry not found" })
        }

        // Check if entry belongs to user
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" })
        }

        await entry.remove()
        res.json({ message: "Entry removed" })
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}