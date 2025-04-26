  // Simple keyword-based sentiment analyzer

  // Emotion keywords mapping
  const emotionKeywords = {
      happy: [
          "happy",
          "joy",
          "excited",
          "great",
          "wonderful",
          "amazing",
          "good",
          "positive",
          "love",
          "smile",
          "laugh",
          "delighted",
          "pleased",
      ],
      sad: [
          "sad",
          "unhappy",
          "depressed",
          "down",
          "miserable",
          "upset",
          "disappointed",
          "sorrow",
          "grief",
          "cry",
          "tears",
          "heartbroken",
      ],
      angry: [
          "angry",
          "mad",
          "furious",
          "annoyed",
          "irritated",
          "frustrated",
          "rage",
          "hate",
          "upset",
          "outraged",
          "hostile",
      ],
      anxious: [
          "anxious",
          "worried",
          "nervous",
          "stressed",
          "tense",
          "uneasy",
          "afraid",
          "scared",
          "fear",
          "panic",
          "dread",
      ],
      excited: ["excited", "thrilled", "eager", "enthusiastic", "energetic", "pumped", "psyched", "stoked", "anticipation"],
      grateful: ["grateful", "thankful", "blessed", "appreciate", "gratitude", "content", "satisfied", "fulfilled"],
  }

  function analyzeEmotion(text) {
      // Convert to lowercase for case-insensitive matching
      const lowercaseText = text.toLowerCase()

      // Count occurrences of emotion keywords
      const emotionCounts = {
          happy: 0,
          sad: 0,
          angry: 0,
          anxious: 0,
          excited: 0,
          grateful: 0,
          neutral: 0,
      }

      // Check for each emotion's keywords
      for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
          for (const keyword of keywords) {
              // Use word boundary to match whole words
              const regex = new RegExp(`\\b${keyword}\\b`, "gi")
              const matches = lowercaseText.match(regex)
              if (matches) {
                  emotionCounts[emotion] += matches.length
              }
          }
      }

      // Find the dominant emotion
      let dominantEmotion = "neutral"
      let maxCount = 0

      for (const [emotion, count] of Object.entries(emotionCounts)) {
          if (count > maxCount) {
              maxCount = count
              dominantEmotion = emotion
          }
      }

      // If no emotions were detected, return neutral
      return maxCount > 0 ? dominantEmotion : "neutral"
  }

  module.exports = { analyzeEmotion }