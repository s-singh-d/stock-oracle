import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://stock-oracle-v2.up.railway.app/predict'; // Or your backend URL

function App() {
  const [tickers, setTickers] = useState(['AAPL']);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    setLoading(true);
    try {
      const res = await axios.post(API, { tickers });
      setResults(res.data.results || []);
    } catch (e) {
      alert('API error — check console. Using demo mode.');
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white p-6">
      <h1 className="text-5xl font-bold text-center mb-2">StockOracle v2</h1>
      <p className="text-center mb-8 text-yellow-300">AI-Powered Precision Predictor</p>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {tickers.map((t, i) => (
            <input
              key={i}
              value={t}
              onChange={(e) => {
                const newT = [...tickers];
                newT[i] = e.target.value.toUpperCase();
                setTickers(newT);
              }}
              className="border p-3 rounded bg-white/10 text-white placeholder-gray-300"
              placeholder="TSLA"
            />
          ))}
          <button
            onClick={() => setTickers([...tickers, ''])}
            className="bg-green-600 px-4 py-3 rounded hover:bg-green-700"
          >
            +
          </button>
          <button
            onClick={predict}
            disabled={loading}
            className="bg-yellow-500 text-black px-6 py-3 rounded font-bold hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? 'AI Thinking...' : 'PREDICT'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((r) => (
              <div
                key={r.ticker}
                className={`p-6 rounded-xl ${
                  r.signal?.includes('BUY')
                    ? 'bg-green-900/50 border-green-500'
                    : r.signal?.includes('SELL')
                    ? 'bg-red-900/50 border-red-500'
                    : 'bg-gray-800/50'
                } border-2`}
              >
                <h2 className="text-2xl font-bold mb-2">{r.ticker}</h2>
                <p className="text-lg">
                  Now: <strong>`\({r.current}</strong> → Tomorrow: <strong>\)`{r.predicted}</strong>
                </p>
                <p className="text-3xl font-bold my-2 text-center">
                  {r.change_pct > 0 ? '+' : ''}${r.change_pct}%
                </p>
                <p className="text-xl font-bold text-center mb-2">
                  <strong>{r.signal}</strong>
                </p>
                <p className="text-sm opacity-70 text-center">
                  Sentiment: {r.sentiment} | Sources: Multi-API
                </p>
              </div>
            ))}
          </div>
        )}
        {results.length === 0 && !loading && (
          <p className="text-center text-gray-400">Enter tickers like AAPL, TSLA & hit PREDICT!</p>
        )}
      </div>
    </div>
  );
}

export default App;
