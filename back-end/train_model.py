import pandas as pd
import numpy as np
import re
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, roc_auc_score

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r'[^\w\s]', '', text)
    text = text.lower()
    return text

def main():
    print("Generating synthetic dataset for demonstration...")
    
    # Generate synthetic data
    # Fake words: alien, lizard, nuke, flat earth, secret, conspiracy, hidden, shocking, revealed
    # Real words: election, hospital, economy, government, policy, market, science, discovery, official
    
    fake_texts = [
        "Shocking revealed: alien lizard people control the secret government.",
        "Conspiracy exposed: the flat earth society was right all along.",
        "Hidden nuke found in the center of the earth by conspiracy theorists.",
        "Secret alien base discovered on the dark side of the moon.",
        "Shocking truth revealed about the lizard people in our government."
    ] * 100
    
    real_texts = [
        "Official policy announcement regarding the upcoming election and economy.",
        "New hospital wing opened for science and medical discovery.",
        "Government reports steady growth in the global market economy.",
        "Scientific discovery leads to breakthrough in hospital treatments.",
        "Election results confirmed by official government sources."
    ] * 100
    
    data = []
    for text in fake_texts:
        data.append({"content": text, "label_binary": 1})
    for text in real_texts:
        data.append({"content": text, "label_binary": 0})
        
    df = pd.DataFrame(data)
    
    # Shuffle dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    print("Dataset generated. Shape:", df.shape)
    
    df['content_cleaned'] = df['content'].apply(clean_text)
    
    X = df['content_cleaned']
    y = df['label_binary']
    
    # Split manually since it's synthetic
    split_idx = int(0.8 * len(df))
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]
    
    print("Vectorizing...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=10000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    print("Training Logistic Regression model...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_tfidf, y_train)
    
    print("Evaluating...")
    y_pred = model.predict(X_test_tfidf)
    y_prob = model.predict_proba(X_test_tfidf)[:, 1]
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    auc_roc = roc_auc_score(y_test, y_prob)
    
    print(f"Metrics:")
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"AUC-ROC:   {auc_roc:.4f}")
    
    print("Saving model and vectorizer...")
    joblib.dump(vectorizer, "vectorizer.pkl")
    joblib.dump(model, "model.pkl")
    print("Done!")

if __name__ == "__main__":
    main()
