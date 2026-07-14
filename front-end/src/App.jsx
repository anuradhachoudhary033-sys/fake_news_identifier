import { useState } from 'react';

function App() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!quote.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote })
      });

      if (!response.ok) {
        throw new Error('Failed to verify the quote. The backend might be down.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreDisplay = (ml_score) => {
    if (!ml_score) return { percent: 0, text: 'Unknown', color: '#737685', bg: '#7376851a' };
    const fakeProb = ml_score.fake_probability || 0;
    const realProb = 100 - fakeProb;
    
    if (realProb >= 70) return { percent: realProb, text: 'High Credibility', color: '#0f9d58', bg: '#0f9d581a', status: 'Verified' };
    if (realProb >= 40) return { percent: realProb, text: 'Mixed Context', color: '#f4b400', bg: '#f4b4001a', status: 'Disputed' };
    return { percent: realProb, text: 'Likely Fake', color: '#ba1a1a', bg: '#ba1a1a1a', status: 'Unverified' };
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-surface border-b border-outline-variant w-full fixed top-0 z-50 h-xxl">
        <div className="flex justify-between items-center w-full px-lg max-w-container-max mx-auto h-full">
          <div className="flex items-center gap-xl">
            <div className="font-headline-md text-headline-md font-bold text-primary">Verity Protocol</div>
            <nav className="hidden md:flex gap-md h-full items-center">
              <a className="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md h-full flex items-center pt-1" href="#">Dashboard</a>
              <a className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md h-full flex items-center" href="#">Methodology</a>
              <a className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md h-full flex items-center" href="#">Archive</a>
            </nav>
          </div>
          <div className="flex items-center gap-md">
            <form onSubmit={handleVerify} className="relative hidden lg:flex w-80 items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">search</span>
              <input 
                className="w-full pl-10 pr-20 py-2 bg-surface-container border border-outline-variant rounded focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:ring-offset-2 outline-none font-body-sm text-body-sm h-11" 
                placeholder="Enter a quote to verify..." 
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-1 top-1 bottom-1 bg-primary-container text-on-primary px-3 rounded font-label-sm text-label-sm hover:opacity-90 disabled:opacity-50"
              >
                Verify
              </button>
            </form>
            <button className="text-on-surface-variant hover:text-primary-container p-2 hidden sm:block">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="bg-primary-container text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:opacity-90 transition-opacity h-11 hidden sm:block">Sign In</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-xxl">
        {/* SideNavBar */}
        <aside className="hidden lg:flex flex-col gap-md p-md bg-surface-container border-r border-outline-variant w-64 fixed h-[calc(100vh-64px)] overflow-y-auto">
          <div className="mb-md">
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Verification Engine</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Precision Analysis</p>
          </div>
          <nav className="flex flex-col gap-2">
            <a className="bg-primary-container text-on-primary rounded-lg p-3 flex items-center gap-3 font-label-sm text-label-sm" href="#">
              <span className="material-symbols-outlined">fact_check</span> Evidence
            </a>
            <a className="text-on-surface-variant hover:bg-surface-variant rounded-lg p-3 flex items-center gap-3 font-label-sm text-label-sm" href="#">
              <span className="material-symbols-outlined">source</span> Sources
            </a>
            <a className="text-on-surface-variant hover:bg-surface-variant rounded-lg p-3 flex items-center gap-3 font-label-sm text-label-sm" href="#">
              <span className="material-symbols-outlined">analytics</span> Bias Analysis
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-lg md:p-xl max-w-container-max mx-auto w-full">
          {/* Mobile Search */}
          <form onSubmit={handleVerify} className="relative lg:hidden mb-lg w-full flex">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pl-10 pr-24 py-3 bg-surface-container border border-outline-variant rounded focus:border-primary-container outline-none font-body-md text-body-md h-12" 
              placeholder="Verify a claim..." 
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
            <button 
                type="submit" 
                disabled={loading}
                className="absolute right-1 top-1 bottom-1 bg-primary-container text-on-primary px-4 rounded font-label-md text-label-md hover:opacity-90 disabled:opacity-50"
              >
                Verify
              </button>
          </form>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container mb-4"></div>
              <p className="text-on-surface-variant font-body-md">Verifying claim across credible sources...</p>
            </div>
          )}

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-8">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">plagiarism</span>
              <h2 className="font-headline-lg">Enter a claim to begin verification.</h2>
              <p className="font-body-lg mt-2">The engine will scrape credible websites and use ML models to predict authenticity.</p>
            </div>
          )}

          {!loading && result && (
            <>
              {/* Header Section */}
              <div className="mb-xl">
                <div className="flex flex-wrap items-center gap-sm mb-md">
                  {(() => {
                    const scoreData = getScoreDisplay(result.ml_score);
                    return (
                      <span className="px-3 py-1 rounded-full font-label-sm text-label-sm inline-flex items-center gap-1" style={{ backgroundColor: scoreData.bg, color: scoreData.color }}>
                        <span className="material-symbols-outlined text-[14px]">
                          {scoreData.percent >= 70 ? 'check_circle' : (scoreData.percent >= 40 ? 'warning' : 'cancel')}
                        </span>
                        {scoreData.status}
                      </span>
                    )
                  })()}
                  <span className="text-on-surface-variant font-label-sm text-label-sm px-2">Analysis Complete</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg md:font-display md:text-display text-on-surface mb-sm">Verification Report</h1>
                <p className="font-body-lg text-body-lg text-secondary max-w-3xl italic">"{quote}"</p>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
                
                {/* Verification Score */}
                <div className="xl:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-lg p-lg hover:shadow-level-2 transition-shadow flex flex-col items-center justify-center">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg w-full text-left">Verification Score</h3>
                  
                  {(() => {
                    const scoreData = getScoreDisplay(result.ml_score);
                    const strokeDasharray = `${scoreData.percent}, 100`;
                    return (
                      <>
                        <div className="relative w-48 h-48 mb-md">
                          <svg className="circular-chart w-full h-full" viewBox="0 0 36 36">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                            <path className="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke={scoreData.color} strokeDasharray={strokeDasharray}></path>
                            <text className="percentage" x="18" y="20.35">{scoreData.percent.toFixed(0)}%</text>
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="font-headline-md text-headline-md mb-1" style={{ color: scoreData.color }}>{scoreData.text}</div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Based on ML text analysis and web scraping context.</p>
                        </div>
                      </>
                    )
                  })()}
                </div>

                {/* Source Map & Bias Meter */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-lg">
                  {/* Source Map */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg hover:shadow-level-2 transition-shadow flex flex-col">
                    <div className="flex justify-between items-center mb-md">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Source Map</h3>
                      <span className="font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-1 rounded">{result.scraped_context?.length || 0} Linked</span>
                    </div>
                    <div className="flex-1 bg-surface-container rounded border border-outline-variant relative overflow-hidden min-h-[200px] flex items-center justify-center">
                      <svg className="absolute inset-0" height="100%" viewBox="0 0 300 200" width="100%">
                        <line className="node-link strong" x1="150" x2="80" y1="100" y2="50"></line>
                        <line className="node-link strong" x1="150" x2="220" y1="100" y2="50"></line>
                        <line className="node-link" x1="150" x2="60" y1="100" y2="120"></line>
                        <line className="node-link strong" x1="150" x2="240" y1="100" y2="130"></line>
                        <circle className="node-circle" cx="60" cy="120" r="8"></circle>
                        <circle className="node-circle verified" cx="240" cy="130" r="8"></circle>
                        <circle className="node-circle verified" cx="80" cy="50" r="10"></circle>
                        <circle className="node-circle verified" cx="220" cy="50" r="10"></circle>
                        <circle cx="150" cy="100" fill="#0052cc" r="16"></circle>
                        <text fill="white" fontFamily="Inter" fontSize="10" fontWeight="bold" textAnchor="middle" x="150" y="104">CLAIM</text>
                      </svg>
                    </div>
                  </div>

                  {/* Bias Meter */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg hover:shadow-level-2 transition-shadow flex flex-col">
                    <div className="flex justify-between items-center mb-md">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">ML Analysis</h3>
                      <span className="material-symbols-outlined text-outline">analytics</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-2">
                        <span>Fake</span>
                        <span className="text-on-surface font-bold">Probability</span>
                        <span>Real</span>
                      </div>
                      <div className="h-4 w-full bg-surface-container rounded-full relative mb-6 border border-outline-variant overflow-hidden flex">
                        <div className="h-full w-1/2 bg-red-100 opacity-50"></div>
                        <div className="h-full w-1/2 bg-green-100 opacity-50"></div>
                        <div className="absolute top-0 bottom-0 w-2 bg-primary-container z-10 -translate-x-1/2" style={{ left: `${100 - (result.ml_score?.fake_probability || 50)}%` }}></div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">psychology</span>
                          <p className="font-body-sm text-body-sm text-on-surface">Text analyzed by local ML model.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Evidence List */}
              <div className="mt-lg bg-surface-container-lowest border border-outline-variant rounded-lg p-lg">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Scraped Evidence</h3>
                
                {(!result.scraped_context || result.scraped_context.length === 0) ? (
                  <p className="text-on-surface-variant">No direct sources found for this claim.</p>
                ) : (
                  <div className="flex flex-col gap-unit">
                    {result.scraped_context.map((item, index) => (
                      <div key={index} className="border border-outline-variant rounded bg-surface p-md hover:bg-surface-container-low transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-md items-start">
                            <div className="bg-surface-variant text-on-surface-variant p-2 rounded flex flex-col items-center justify-center min-w-[40px] mt-1">
                              <span className="material-symbols-outlined">description</span>
                            </div>
                            <div>
                              <h4 className="font-label-md text-label-md text-on-surface mb-1">{item.title}</h4>
                              <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{item.snippet}</p>
                              <a href={item.link} target="_blank" rel="noreferrer" className="text-primary-container hover:underline text-sm font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">open_in_new</span> Read Full Source
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
