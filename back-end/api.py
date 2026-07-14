from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import re
from scraper import scrape_news_context
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Fake News Identifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Model and Vectorizer
MODEL_PATH = "model.pkl"
VECTORIZER_PATH = "vectorizer.pkl"

if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
else:
    model = None
    vectorizer = None

def clean_text(text):
    text = re.sub(r'[^\w\s]', '', text)
    text = text.lower()
    return text

class QuoteRequest(BaseModel):
    quote: str

@app.post("/api/score")
def score_text(req: QuoteRequest):
    """
    Feature A: Returns probability of text being fake or real based on ML model.
    """
    if not model or not vectorizer:
        raise HTTPException(status_code=500, detail="Model not loaded. Train the model first.")
    
    cleaned = clean_text(req.quote)
    features = vectorizer.transform([cleaned])
    prob_fake = model.predict_proba(features)[0][1] # Probability of class 1 (Fake)
    
    status = "Fake" if prob_fake > 0.5 else "Real"
    return {
        "status": status,
        "fake_probability": round(prob_fake * 100, 2),
        "real_probability": round((1 - prob_fake) * 100, 2)
    }

@app.post("/api/verify")
def verify_quote(req: QuoteRequest):
    """
    Feature B: Scrape news sites to find context for the quote.
    """
    # 1. Score the quote using ML
    score_result = score_text(req)
    
    # 2. Scrape for context
    context = scrape_news_context(req.quote)
    
    return {
        "ml_score": score_result,
        "scraped_context": context,
        "analysis": "Combined verification complete."
    }
