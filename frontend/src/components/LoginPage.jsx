import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone, Shield, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

/* ── Auth helpers ── */
const USERS_KEY = 'hm_users';
const SESSION_KEY = 'hm_session';

const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
};
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const saveSession = (user) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));

/* ── Component ── */
const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'Receptionist'
  });

  const handleInput = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    const users = getUsers();
    if (users.find(u => u.email === form.email)) return setError('This email is already registered.');

    const newUser = { id: Date.now(), name: form.name, email: form.email, phone: form.phone, role: form.role, password: form.password };
    saveUsers([...users, newUser]);
    setSuccess('Account created! Please log in.');
    setMode('login');
    setForm(p => ({ ...p, password: '', confirmPassword: '' }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.email === form.email && u.password === form.password);
      if (!user) {
        setError('Incorrect email or password.');
        setLoading(false);
        return;
      }
      saveSession(user);
      onLogin(user);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', fontFamily: "'Montserrat', sans-serif",
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #0d3349 100%)',
    }}>

      {/* ── Left Panel ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(13, 148, 136, 0.12)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(30, 58, 138, 0.25)', filter: 'blur(80px)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', zIndex: 1 }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(13,148,136,0.2)', border: '1.5px solid rgba(13,148,136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/logo-s.png" alt="Logo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'white', letterSpacing: '0.04em' }}>HOTEL SHUBHA SAI</div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>MANAGEMENT SYSTEM</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '420px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '20px' }}>
            Hospitality<br/><span style={{ color: '#2dd4bf' }}>Simplified.</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', fontWeight: '500', lineHeight: 1.7 }}>
            Your all-in-one receptionist dashboard for managing rooms, bookings, checkout, and guest history — from one elegant interface.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '48px', zIndex: 1, width: '100%', maxWidth: '360px' }}>
          {['Room booking & status management', 'Instant checkout with invoice printing', 'Guest history & maintenance tracking', 'Dark/Light mode with live notifications'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={18} color="#2dd4bf" />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontWeight: '600' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div style={{
        width: '480px', minHeight: '100vh', background: 'white', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', padding: '56px 48px',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.3)'
      }}>
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '40px', background: '#f1f5f9', borderRadius: '14px', padding: '4px' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setMode(t); setError(''); setSuccess(''); }} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: '800', textTransform: 'capitalize', transition: 'all 0.2s',
              background: mode === t ? 'white' : 'transparent',
              color: mode === t ? '#0f172a' : '#64748b',
              boxShadow: mode === t ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
            }}>{t === 'login' ? '🔑 Login' : '✨ Register'}</button>
          ))}
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', marginBottom: '6px' }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '32px' }}>
          {mode === 'login' ? 'Sign in to your receptionist account' : 'Register to get started with the dashboard'}
        </p>

        {/* Alerts */}
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>⚠ {error}</div>}
        {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>✅ {success}</div>}

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {mode === 'register' && (
            <>
              <Field label="Full Name" icon={User} name="name" value={form.name} onChange={handleInput} placeholder="e.g. Priya Sharma" required />
              <Field label="Phone Number" icon={Phone} name="phone" value={form.phone} onChange={handleInput} placeholder="+91 98765 43210" type="tel" />
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>ROLE</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Receptionist', 'Manager'].map(r => (
                    <button type="button" key={r} onClick={() => setForm(p => ({ ...p, role: r }))} style={{
                      flex: 1, padding: '10px', borderRadius: '10px', border: `2px solid ${form.role === r ? '#0d9488' : '#e2e8f0'}`,
                      background: form.role === r ? '#f0fdfa' : 'white', color: form.role === r ? '#0d9488' : '#64748b',
                      fontSize: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}>
                      {r === 'Receptionist' ? <Building2 size={14}/> : <Shield size={14}/>} {r}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Field label="Email Address" icon={Mail} name="email" value={form.email} onChange={handleInput} placeholder="you@example.com" type="email" required />
          <PasswordField label="Password" name="password" value={form.password} onChange={handleInput} show={showPass} onToggle={() => setShowPass(!showPass)} placeholder={mode === 'login' ? 'Enter your password' : 'Min. 6 characters'} required />
          {mode === 'register' && (
            <PasswordField label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleInput} show={showPass} onToggle={() => setShowPass(!showPass)} placeholder="Repeat password" required />
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px', borderRadius: '14px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0d9488, #0891b2)',
            color: 'white', border: 'none', fontSize: '15px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 8px 20px rgba(13,148,136,0.35)', transition: 'all 0.2s'
          }}>
            {loading ? '⏳ Signing in...' : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={18}/></>}
          </button>
        </form>

        <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
          Hotel Shubha Sai · Bommasandra, Bangalore
        </p>
      </div>
    </div>
  );
};

/* ── Small Field components ── */
const Field = ({ label, icon: Icon, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <Icon size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
      <input {...props} style={{
        width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
        fontSize: '14px', fontWeight: '600', color: '#0f172a', background: '#f8fafc', outline: 'none',
        boxSizing: 'border-box', transition: 'border-color 0.2s',
        fontFamily: "'Montserrat', sans-serif"
      }}
      onFocus={e => e.target.style.borderColor = '#0d9488'}
      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
    </div>
  </div>
);

const PasswordField = ({ label, show, onToggle, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
      <input {...props} type={show ? 'text' : 'password'} style={{
        width: '100%', padding: '12px 44px 12px 40px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
        fontSize: '14px', fontWeight: '600', color: '#0f172a', background: '#f8fafc', outline: 'none',
        boxSizing: 'border-box', fontFamily: "'Montserrat', sans-serif"
      }}
      onFocus={e => e.target.style.borderColor = '#0d9488'}
      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
      <button type="button" onClick={onToggle} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
        {show ? <EyeOff size={16}/> : <Eye size={16}/>}
      </button>
    </div>
  </div>
);

export default LoginPage;
