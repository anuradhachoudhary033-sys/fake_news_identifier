Write-Host "Training ML model..."
.\venv\Scripts\python train_model.py

Write-Host "Starting FastAPI Backend..."
Start-Process -FilePath ".\venv\Scripts\uvicorn.exe" -ArgumentList "api:app", "--reload", "--port", "8000"

Write-Host "Starting Streamlit App..."
Start-Process -FilePath ".\venv\Scripts\streamlit.exe" -ArgumentList "run", "app.py"

Write-Host "Servers started. FastAPI on http://localhost:8000 and Streamlit on http://localhost:8501"
