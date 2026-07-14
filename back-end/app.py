import streamlit as st
import requests

API_URL = "http://localhost:8000"

st.set_page_config(page_title="Fake News Identifier", page_icon="🕵️", layout="centered")

st.title("🕵️ Fake News Identifier")
st.markdown("Analyze news articles and quotes using Machine Learning and Web Scraping.")

st.sidebar.header("Features")
feature = st.sidebar.radio("Select Feature", ["Text ML Scoring", "Quote Verification (Scraping)"])

if feature == "Text ML Scoring":
    st.header("📝 Feature A: Text ML Scoring")
    st.markdown("Paste an article's text below to get an ML probability score (Real vs Fake).")
    
    text = st.text_area("Article Text", height=200)
    if st.button("Score Article"):
        if text:
            with st.spinner("Analyzing..."):
                try:
                    res = requests.post(f"{API_URL}/api/score", json={"quote": text})
                    res.raise_for_status()
                    data = res.json()
                    
                    st.subheader(f"Prediction: **{data['status']}**")
                    col1, col2 = st.columns(2)
                    col1.metric("Real Probability", f"{data['real_probability']}%")
                    col2.metric("Fake Probability", f"{data['fake_probability']}%")
                    
                    st.progress(data['fake_probability'] / 100.0)
                except Exception as e:
                    st.error(f"Error connecting to backend API: {e}")
        else:
            st.warning("Please enter some text.")

elif feature == "Quote Verification (Scraping)":
    st.header("🔍 Feature B: Quote Verification")
    st.markdown("Enter a quote or claim to search credible news sources for verification.")
    
    quote = st.text_input("Quote or Claim")
    if st.button("Verify Claim"):
        if quote:
            with st.spinner("Scraping for context..."):
                try:
                    res = requests.post(f"{API_URL}/api/verify", json={"quote": quote})
                    res.raise_for_status()
                    data = res.json()
                    
                    st.subheader("ML Baseline Score")
                    st.write(f"The text styling looks **{data['ml_score']['status']}** (Fake Prob: {data['ml_score']['fake_probability']}%)")
                    
                    st.subheader("Scraped Context Results")
                    if not data['scraped_context']:
                        st.write("No direct sources found.")
                    else:
                        for item in data['scraped_context']:
                            with st.expander(item['title'], expanded=True):
                                st.write(item['snippet'])
                                st.markdown(f"[Read more]({item['link']})")
                except Exception as e:
                    st.error(f"Error connecting to backend API: {e}")
        else:
            st.warning("Please enter a quote.")
