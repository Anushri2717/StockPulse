import { useState } from 'react';
import { useApi } from '../hooks/useFetch';

export default function AIPanel({ symbol, history, currentPrice, buyPrice }) {
  const { post } = useApi();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAnalysis = async () => {
    setLoading(true);
    const data = await post('/api/ai/suggest', { symbol, history, currentPrice, buyPrice });
    setResult(data.suggestion);
    setLoading(false);
  };

  const colors = { BUY: '#00D4AA', SELL: '#FF4566', HOLD: '#FFD700' };
  const icons  = { BUY: '📈', SELL: '📉', HOLD: '⏸️' };
  const risks  = { LOW: '#00D4AA', MEDIUM: '#FFD700', HIGH: '#FF4566' };

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <div>
          <h2 className="section-title">🤖 AI Analysis</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Powered by GPT — not financial advice
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={getAnalysis}
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: 14 }}
        >
          {loading ? '⏳ Analyzing...' : '✨ Get AI Suggestion'}
        </button>
      </div>

      {result && (
        <div className="ai-result" style={{ borderColor: colors[result.action] }}>
          <div className="ai-action" style={{ color: colors[result.action] }}>
            <span style={{ fontSize: 32 }}>{icons[result.action]}</span>
            <span>{result.action}</span>
          </div>
          <p className="ai-reason">{result.reason}</p>
          <div className="ai-risk">
            Risk Level:
            <span style={{ color: risks[result.risk], fontWeight: 700 }}>
              {' '}{result.risk}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}