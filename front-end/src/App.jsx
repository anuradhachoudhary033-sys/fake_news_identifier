import { useState } from 'react';
import Header from './components/Header';
import QuoteInput from './components/QuoteInput';
import AnalysisResults from './components/AnalysisResults';
import { AlertCircle } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (quote) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify the quote. The server might be down.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      
      <main className="main-content">
        <QuoteInput onAnalyze={handleAnalyze} isLoading={loading} />
        
        {error && (
          <div className="error-msg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="loading-container glass-panel">
            <div className="spinner"></div>
            <p>Scanning news databases and analyzing credibility...</p>
          </div>
        )}

        {result && !loading && (
          <AnalysisResults result={result} />
        )}
      </main>
    </div>
  );
}

export default App;
