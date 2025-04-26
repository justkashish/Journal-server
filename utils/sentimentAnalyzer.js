// Simple keyword-based sentiment analyzer

// Define emotion keywords
const emotionKeywords = {
    happy: ['happy', 'joy', 'delighted', 'excited', 'glad', 'pleased', 'thrilled', 'wonderful', 'smile', 'laugh', 'great', 'amazing', 'awesome', 'fantastic', 'excellent', 'love', 'enjoy', 'fun'],
    sad: ['sad', 'unhappy', 'depressed', 'down', 'miserable', 'gloomy', 'heartbroken', 'disappointed', 'upset', 'cry', 'tears', 'grief', 'sorrow', 'regret', 'miss', 'lonely', 'alone'],
    angry: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'irritated', 'frustrated', 'hate', 'dislike', 'resent', 'bitter', 'outraged', 'hostile', 'enraged', 'disgusted', 'upset'],
    anxious: ['anxious', 'worried', 'nervous', 'stress', 'stressed', 'tense', 'uneasy', 'afraid', 'scared', 'fear', 'panic', 'dread', 'concern', 'apprehensive', 'overwhelmed'],
    excited: ['excited', 'thrilled', 'eager', 'enthusiastic', 'looking forward', 'anticipate', 'pumped', 'psyched', 'stoked', 'energetic', 'motivated', 'inspired', 'passionate'],
    grateful: ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate', 'lucky', 'content', 'satisfied', 'fulfilled', 'humble', 'honored']
};

// Analyze text and return detected emotion
const analyzeEmotion = (text) => {
    // Convert text to lowercase for case-insensitive matching
    const lowercaseText = text.toLowerCase();

    // Count occurrences of emotion keywords
    const emotionCounts = {};

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        emotionCounts[emotion] = 0;

        for (const keyword of keywords) {
            // Count occurrences of each keyword
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = lowercaseText.match(regex);

            if (matches) {
                emotionCounts[emotion] += matches.length;
            }
        }
    }

    // Find the emotion with the highest count
    let dominantEmotion = 'neutral';
    let maxCount = 0;

    for (const [emotion, count] of Object.entries(emotionCounts)) {
        if (count > maxCount) {
            maxCount = count;
            dominantEmotion = emotion;
        }
    }

    // If no emotion keywords are found, return neutral
    return maxCount > 0 ? dominantEmotion : 'neutral';
};

export default analyzeEmotion;