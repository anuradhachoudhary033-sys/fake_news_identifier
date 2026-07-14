import { useState } from 'react';
import { Search, Quote } from 'lucide-react';

const QuoteInput = ({ onAnalyze, isLoading }) => {
  const [quote, setQuote] = useState('');

  const handleSubmit = () => {
    if (quote.trim()) {
      onAnalyze(quote);
    }
  };

  return (
    <section className="input-section glass-panel">
      <label htmlFor="quote-input" className="input-label">
        <Quote size={20} color="#a78bfa" />
        Enter a quote or news claim to verify
      </label>
      
      <textarea
        id="quote-input"
        className="quote-textarea"
        placeholder="e.g. The government announced a new economic stimulus package today..."
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        disabled={isLoading}
      />
      
      <button 
        className="analyze-btn"
        onClick={handleSubmit}
        disabled={isLoading || !quote.trim()}
      >
        <Search size={18} />
        {isLoading ? 'Analyzing...' : 'Verify Authenticity'}
      </button>
    </section>
  );
};

export default QuoteInput;
