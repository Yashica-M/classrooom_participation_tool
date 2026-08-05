import React, { useState } from 'react';
import axios from 'axios';
import { User, Monitor, LogIn, ShieldCheck, CheckCircle2, PlusCircle } from 'lucide-react';
import Logo from './Logo';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';
const AVATARS = ['🎓', '🚀', '🧠', '⚡', '🦉', '💻', '🧪', '✨'];

const inputStyle = {
  width: '100%',
  background: '#0E1525',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#F1F5F9',
  padding: '11px 14px',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '6px', letterSpacing: '0.02em' };

const SessionGateway = ({ onJoinSession, isConnected, initialTab = 'JOIN', initialAuthMode = 'LOGIN' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [authMode, setAuthMode] = useState(initialAuthMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [role, setRole] = useState('STUDENT');
  const [sessionCode, setSessionCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!sessionCode.trim()) return;
    onJoinSession({
      name: `${selectedAvatar} ${name.trim() || (role === 'INSTRUCTOR' ? 'Instructor' : 'Student')}`,
      role,
      sessionCode: sessionCode.trim().toUpperCase()
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const endpoint = authMode === 'REGISTER' ? '/api/auth/register' : '/api/auth/login';
      const payload = authMode === 'REGISTER'
        ? { name: name.trim() || 'User', email, password, role }
        : { email, password };
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      if (response.data?.token) {
        localStorage.setItem('syncpoll_token', response.data.token);
        localStorage.setItem('syncpoll_user', JSON.stringify(response.data.user));
        onJoinSession({
          name: `${selectedAvatar} ${response.data.user.name}`,
          role: response.data.user.role,
          sessionCode: sessionCode.trim().toUpperCase()
        });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070B17',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>

      {/* Subtle glowing radial */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      {/* Centered Responsive Card Container */}
      <div className="glass-card-static responsive-gateway-card" style={{
        maxWidth: '1000px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Left Informational Panel */}
        <div className="responsive-panel-padding" style={{
          padding: '40px 36px',
          background: 'linear-gradient(145deg, rgba(14, 21, 37, 0.9) 0%, rgba(7, 11, 23, 0.9) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div>
            <div style={{ marginBottom: '32px' }}>
              <Logo size={34} />
            </div>

            <h2 className="responsive-hero-h1" style={{ fontSize: '28px', fontWeight: 800, color: '#F1F5F9', lineHeight: 1.2, letterSpacing: '-0.6px', marginBottom: '14px' }}>
              Real-time classroom<br />participation for<br /><span style={{ color: '#22D3EE' }}>interactive learning.</span>
            </h2>

            <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.65, marginBottom: '28px' }}>
              {role === 'INSTRUCTOR'
                ? 'Create an active classroom session with a unique room code. Control polls, track student comprehension, and view live Q&A.'
                : 'Join your classroom session using the room code provided by your instructor. Submit feedback and ask questions anonymously.'
              }
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '13px' }}>
                  {role === 'INSTRUCTOR' ? 'Host Room Sessions' : 'Instant Student Access'}
                </div>
                <div style={{ color: '#64748B', fontSize: '12px' }}>
                  {role === 'INSTRUCTOR' ? 'Instructors generate unique room codes for their class' : 'Students join directly from any browser without sign-up'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <ShieldCheck size={16} color="#22D3EE" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '13px' }}>Session Privacy</div>
                <div style={{ color: '#64748B', fontSize: '12px' }}>Each room is isolated to ensure data security</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Action Panel */}
        <div className="responsive-panel-padding" style={{ padding: '40px 32px', background: '#0E1525', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div>
            {/* Tab Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#070B17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '3px', marginBottom: '20px' }}>
              {['JOIN', 'AUTH'].map(tab => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
                  background: activeTab === tab ? 'linear-gradient(135deg, #7C3AED, #2563EB)' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '9px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  cursor: 'pointer'
                }}>
                  {tab === 'JOIN' ? (role === 'INSTRUCTOR' ? 'Create Session' : 'Join Session') : 'Sign In'}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', color: '#FCA5A5', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMessage}
              </div>
            )}

            {/* Session Join / Create Form */}
            {activeTab === 'JOIN' ? (
              <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={role === 'INSTRUCTOR' ? 'Prof. Smith' : 'e.g. Alex Johnson'} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Choose Avatar</label>
                  <div className="responsive-avatar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px' }}>
                    {AVATARS.map(av => (
                      <button key={av} type="button" onClick={() => setSelectedAvatar(av)} style={{
                        background: selectedAvatar === av ? 'rgba(124,58,237,0.25)' : '#070B17',
                        border: selectedAvatar === av ? '1px solid #7C3AED' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px', padding: '6px 0', fontSize: '18px', cursor: 'pointer'
                      }}>
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Switcher */}
                <div>
                  <label style={labelStyle}>Role</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[{ key: 'STUDENT', icon: <User size={15} />, label: 'Student' }, { key: 'INSTRUCTOR', icon: <Monitor size={15} />, label: 'Instructor' }].map(r => (
                      <button key={r.key} type="button" onClick={() => setRole(r.key)} style={{
                        background: role === r.key ? 'linear-gradient(135deg, #7C3AED, #2563EB)' : '#070B17',
                        color: '#fff', border: role === r.key ? '1px solid #7C3AED' : '1px solid rgba(255,255,255,0.06)',
                        padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '13px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'inherit', cursor: 'pointer'
                      }}>
                        {r.icon} {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    {role === 'INSTRUCTOR' ? 'Room Code (Create or Select)' : 'Room Code (From Instructor)'}
                  </label>
                  <input
                    type="text"
                    value={sessionCode}
                    onChange={e => setSessionCode(e.target.value.toUpperCase())}
                    placeholder={role === 'INSTRUCTOR' ? 'e.g. CS101' : 'ENTER ROOM CODE'}
                    required
                    style={{ ...inputStyle, border: '1px solid rgba(124,58,237,0.4)', color: '#22D3EE', fontWeight: 700, fontSize: '14px', letterSpacing: '1.5px', textTransform: 'uppercase' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                  {role === 'INSTRUCTOR' ? <PlusCircle size={16} /> : <LogIn size={16} />}
                  {role === 'INSTRUCTOR' ? `Create & Host Room ${sessionCode || ''}` : `Join Room ${sessionCode || ''}`}
                </button>
              </form>
            ) : (
              /* Auth Form */
              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {authMode === 'REGISTER' && (
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required style={inputStyle} />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                    {authMode === 'LOGIN' && <span style={{ color: '#7C3AED', fontSize: '12px', cursor: 'pointer' }}>Forgot password?</span>}
                  </div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary" style={{ padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }}>
                  {isLoading ? 'Please wait...' : (authMode === 'REGISTER' ? 'Create Account' : 'Sign In')}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button type="button" onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                    style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {authMode === 'LOGIN' ? "Don't have an account? " : 'Already have an account? '}
                    <span style={{ color: '#7C3AED', fontWeight: 600 }}>{authMode === 'LOGIN' ? 'Register' : 'Sign In'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Connection status */}
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isConnected ? '#10B981' : '#EF4444', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                {isConnected ? 'Server Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SessionGateway;
