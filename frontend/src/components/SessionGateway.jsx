import React, { useState } from 'react';
import axios from 'axios';
import { User, Monitor, LogIn, UserPlus, KeyRound, Radio } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const SessionGateway = ({ onJoinSession, isConnected }) => {
  const [activeTab, setActiveTab] = useState('JOIN');
  const [authMode, setAuthMode] = useState('LOGIN');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [sessionCode, setSessionCode] = useState('CS101');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!sessionCode.trim()) return;

    onJoinSession({
      name: name.trim() || (role === 'INSTRUCTOR' ? 'Prof. Instructor' : 'Student User'),
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

      if (response.data && response.data.token) {
        localStorage.setItem('syncpoll_token', response.data.token);
        localStorage.setItem('syncpoll_user', JSON.stringify(response.data.user));

        onJoinSession({
          name: response.data.user.name,
          role: response.data.user.role,
          sessionCode: sessionCode.trim().toUpperCase()
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#020617',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        background: '#0F172A',
        width: '100%',
        maxWidth: '480px',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid #1E293B',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
        color: '#F1F5F9'
      }}>
        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            background: '#0D9488',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Radio size={24} color="#FFF" />
          </div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Sync<span style={{ color: '#14B8A6' }}>Poll</span> Gateway
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>
            Live Classroom Participation Platform
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#020617', padding: '4px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #1E293B' }}>
          <button
            onClick={() => setActiveTab('JOIN')}
            style={{
              background: activeTab === 'JOIN' ? '#0D9488' : 'transparent',
              color: '#FFF',
              border: 'none',
              padding: '10px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Quick Join
          </button>
          <button
            onClick={() => setActiveTab('AUTH')}
            style={{
              background: activeTab === 'AUTH' ? '#0D9488' : 'transparent',
              color: '#FFF',
              border: 'none',
              padding: '10px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Sign In / Register
          </button>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            color: '#F87171',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Quick Join Form */}
        {activeTab === 'JOIN' ? (
          <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                Your Name / Alias
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                style={{
                  width: '100%',
                  background: '#020617',
                  border: '1px solid #1E293B',
                  color: '#F1F5F9',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                Session Room Code
              </label>
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="CS101"
                required
                style={{
                  width: '100%',
                  background: '#020617',
                  border: '1px solid #0D9488',
                  color: '#14B8A6',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px' }}>
                Select Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  style={{
                    background: role === 'STUDENT' ? '#0D9488' : '#020617',
                    color: '#FFF',
                    border: role === 'STUDENT' ? '1px solid #14B8A6' : '1px solid #1E293B',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <User size={16} /> Student
                </button>

                <button
                  type="button"
                  onClick={() => setRole('INSTRUCTOR')}
                  style={{
                    background: role === 'INSTRUCTOR' ? '#0F766E' : '#020617',
                    color: '#FFF',
                    border: role === 'INSTRUCTOR' ? '1px solid #14B8A6' : '1px solid #1E293B',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Monitor size={16} /> Instructor
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#0D9488',
                color: '#FFF',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px'
              }}
            >
              <LogIn size={18} /> Join Room CS101
            </button>
          </form>
        ) : (
          /* Sign In / Register Mode */
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {authMode === 'REGISTER' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prof. Smith"
                  required
                  style={{ width: '100%', background: '#020617', border: '1px solid #1E293B', color: '#F1F5F9', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@university.edu"
                required
                style={{ width: '100%', background: '#020617', border: '1px solid #1E293B', color: '#F1F5F9', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', background: '#020617', border: '1px solid #1E293B', color: '#F1F5F9', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>Room Code to Enter</label>
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="CS101"
                required
                style={{ width: '100%', background: '#020617', border: '1px solid #0D9488', color: '#14B8A6', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: '#0D9488',
                color: '#FFF',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px'
              }}
            >
              {authMode === 'REGISTER' ? <UserPlus size={18} /> : <KeyRound size={18} />}
              {isLoading ? 'Authenticating...' : (authMode === 'REGISTER' ? 'Register & Enter Room' : 'Login & Enter Room')}
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                style={{ background: 'none', border: 'none', color: '#14B8A6', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {authMode === 'LOGIN' ? "Don't have an account? Register here" : 'Already have an account? Login here'}
              </button>
            </div>
          </form>
        )}

        {/* Clean Status Badge */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#14B8A6' : '#EF4444'
          }}></span>
          <span>Status: <strong style={{ color: isConnected ? '#14B8A6' : '#EF4444' }}>{isConnected ? 'Connected' : 'Connecting...'}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default SessionGateway;
