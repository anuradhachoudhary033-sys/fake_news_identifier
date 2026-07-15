import gradio as gr
import joblib

# Load the exported artifacts
vectorizer = joblib.load("vectorizer.pkl")
model = joblib.load("model.pkl")

def predict_news(text):
    # Convert text to numerical features
    vec_text = vectorizer.transform([text])
    
    # Predict (assuming 1 is Fake and 0 is Real based on your training)
    prediction = model.predict(vec_text)[0]
    return "Fake News" if prediction == 1 else "Real News"

# Create the Gradio interface
iface = gr.Interface(
    fn=predict_news,
    inputs=gr.Textbox(lines=5, placeholder="Paste news article here..."),
    outputs="text",
    title="Fake News Identifier"
)

iface.launch()
