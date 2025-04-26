const mongoose = require("mongoose")

const JournalEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    detectedEmotion: {
        type: String,
        enum: ["happy", "sad", "angry", "neutral", "anxious", "excited", "grateful"],
        default: "neutral",
    },
    emotionTag: {
        type: String,
        enum: ["happy", "sad", "angry", "neutral", "anxious", "excited", "grateful"],
    },
})

module.exports = mongoose.model("JournalEntry", JournalEntrySchema)