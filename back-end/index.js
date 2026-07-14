const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock database of credible news organizations
const credibleSources = [
  "Reuters",
  "Associated Press",
  "BBC News",
  "NPR",
  "The New York Times",
  "The Wall Street Journal"
];

// Helper to simulate analysis
const analyzeQuote = (quote) => {
  const quoteLower = quote.toLowerCase();
  
  // Very simplistic mock logic for demonstration
  if (quoteLower.includes('alien') || quoteLower.includes('flat earth') || quoteLower.includes('lizard people') || quoteLower.includes('nuke') || quoteLower.includes('iran')) {
    return {
      status: 'fake',
      score: 12,
      analysis: "This claim is highly dubious. No credible news organizations have reported on this event. The severity of the claim combined with a complete lack of corroborating evidence from major outlets indicates it is false.",
      matchedSources: [],
      relatedLinks: []
    };
  } else if (quoteLower.includes('election') || quoteLower.includes('economy') || quoteLower.includes('government')) {
    return {
      status: 'mixed',
      score: 55,
      analysis: "This quote contains elements of truth but lacks crucial context. Credible organizations have reported on the topic, but the specific phrasing or conclusion here may be misleading.",
      matchedSources: ["Reuters", "BBC News"],
      relatedLinks: [
        { title: "Recent Developments in Policy", url: "https://www.reuters.com/mock-article-1" },
        { title: "Fact Check: Contextualizing Recent Claims", url: "https://www.bbc.com/news/mock-article-2" }
      ]
    };
  } else if (quoteLower.includes('hospital') || quoteLower.includes('science') || quoteLower.includes('discovery')) {
    return {
      status: 'true',
      score: 89,
      analysis: "This quote aligns with reports from multiple credible news organizations. The facts stated have been independently verified by major journalistic outlets.",
      matchedSources: ["Associated Press", "The New York Times", "NPR"],
      relatedLinks: [
        { title: "In-depth Analysis of the Event", url: "https://apnews.com/mock-article-3" },
        { title: "Official Report Released", url: "https://www.nytimes.com/mock-article-4" }
      ]
    };
  } else {
    // Default to unknown for claims we don't have in our "mock" database
    return {
      status: 'mixed', // Using mixed as a fallback "Unknown" state visually
      score: 40,
      analysis: "We could not find sufficient evidence from credible news organizations to verify this specific claim. Proceed with caution.",
      matchedSources: [],
      relatedLinks: []
    };
  }
};

app.post('/api/verify', (req, res) => {
  const { quote } = req.body;
  
  if (!quote || quote.trim() === '') {
    return res.status(400).json({ error: 'Quote is required for verification.' });
  }

  // Simulate network delay and AI processing time
  setTimeout(() => {
    const result = analyzeQuote(quote);
    res.json(result);
  }, 2500); 
});

app.listen(PORT, () => {
  console.log(`Fake News Identifier backend running on http://localhost:${PORT}`);
});
