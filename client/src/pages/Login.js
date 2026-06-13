import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">📈</div>
        <h1 className="login-title">StockTrack</h1>
        <p className="login-sub">Real-time portfolio tracker with AI insights</p>

        <div className="login-tabs">
          <button className={`login-tab ${mode==='login'?'active':''}`} onClick={()=>setMode('login')}>Sign In</button>
          <button className={`login-tab ${mode==='register'?'active':''}`} onClick={()=>setMode('register')}>Register</button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your name" value={form.name}
                onChange={e=>setForm({...form,name:e.target.value})} required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email}
              onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e=>setForm({...form,password:e.target.value})} required minLength={6} />
          </div>
          {error && <div className="form-error">⚠️ {error}</div>}
          <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%',marginTop:4}}>
            {loading ? '⏳ Please wait...' : mode==='login' ? '🚀 Sign In' : '🎉 Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}