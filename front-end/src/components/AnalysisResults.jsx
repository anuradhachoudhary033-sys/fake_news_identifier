import { CheckCircle, XCircle, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

const AnalysisResults = ({ result }) => {
  const { status, score, analysis, matchedSources, relatedLinks } = result;

  const getStatusConfig = () => {
    switch(status) {
      case 'true': return { icon: <CheckCircle size={32} />, text: 'Verified True' };
      case 'fake': return { icon: <XCircle size={32} />, text: 'Likely Fake' };
      case 'mixed': return { icon: <AlertTriangle size={32} />, text: 'Mixed Context' };
      default: return { icon: <AlertTriangle size={32} />, text: 'Unknown' };
    }
  };

  const config = getStatusConfig();

  return (
    <section className="results-section glass-panel">
      <div className="results-header">
        <div className={`score-badge score-${status}`}>
          <span className="flex items-center gap-2">
            {config.icon}
            {config.text}
          </span>
        </div>
        <div className="score-number">
          {score}<span>/100</span>
        </div>
      </div>

      <div className="analysis-text">
        <p>{analysis}</p>
      </div>

      <div className="sources-grid">
        <div className="source-list">
          <h3>
            <ShieldCheck size={20} color="#10b981" />
            Corroborating Sources
          </h3>
          {matchedSources && matchedSources.length > 0 ? (
            <div className="source-tags">
              {matchedSources.map((source, index) => (
                <span key={index} className="source-tag">
                  {source}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No credible sources matched.</p>
          )}
        </div>

        <div className="source-list">
          <h3>
            <ExternalLink size={20} color="#3b82f6" />
            Related Articles
          </h3>
          {relatedLinks && relatedLinks.length > 0 ? (
            <div className="related-links">
              {relatedLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="related-link"
                >
                  <ExternalLink size={16} />
                  {link.title}
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No related articles found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnalysisResults;
