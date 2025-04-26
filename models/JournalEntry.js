import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    detectedEmotion: {
        type: String,
        enum: ['happy', 'sad', 'angry', 'neutral', 'anxious', 'excited', 'grateful'],
        default: 'neutral'
    },
    emotionTag: {
        type: String,
        enum: ['happy', 'sad', 'angry', 'neutral', 'anxious', 'excited', 'grateful'],
    }
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;