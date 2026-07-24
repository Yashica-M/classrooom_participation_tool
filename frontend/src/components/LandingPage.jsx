import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, BarChart2, Activity, HelpCircle } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#020617',
      color: '#F1F5F9',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
      padding: '32px 48px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Top Header Bar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '48px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            background: '#0D9488',
            padding: '10px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Radio size={22} color="#FFF" />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px' }}>
            Sync<span style={{ color: '#14B8A6' }}>Poll</span>
          </span>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/gateway')}
            style={{
              background: '#0F172A',
              border: '1px solid #1E293B',
              color: '#F1F5F9',
              padding: '10px 22px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Enter Session
          </button>

          <button
            onClick={() => navigate('/gateway')}
            style={{
              background: '#0D9488',
              color: '#FFF',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* Centered High-Impact Hero Layout */}
      <main className="animate-fade-in" style={{
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '60px 0 80px 0',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '58px',
          fontWeight: 800,
          lineHeight: 1.15,
          color: '#F1F5F9',
          margin: '0 0 24px 0',
          letterSpacing: '-1.5px'
        }}>
          Real-Time Classroom Engagement,<br />
          <span style={{ color: '#14B8A6' }}>Simplified & Connected.</span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#94A3B8',
          lineHeight: 1.6,
          maxWidth: '640px',
          margin: '0 auto 48px auto'
        }}>
          Empowering instructors and students with instant live feedback, interactive polling, and anonymous Q&A queue in a calm, non-distracting environment.
        </p>

        {/* 3 Interactive Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '52px',
          textAlign: 'left'
        }}>
          <div className="smooth-card" style={{
            background: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '24px',
            cursor: 'pointer'
          }} onClick={() => navigate('/gateway')}>
            <div style={{ background: 'rgba(20, 184, 166, 0.1)', padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '16px' }}>
              <BarChart2 size={24} color="#14B8A6" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', margin: '0 0 6px 0' }}>Live Polling</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
              Instant bar charts updated over WebSockets with zero race conditions.
            </p>
          </div>

          <div className="smooth-card" style={{
            background: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '24px',
            cursor: 'pointer'
          }} onClick={() => navigate('/gateway')}>
            <div style={{ background: 'rgba(13, 148, 136, 0.1)', padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '16px' }}>
              <Activity size={24} color="#0D9488" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', margin: '0 0 6px 0' }}>Confusion Pulse</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
              Weighted speedometer gauge aggregating student understanding levels.
            </p>
          </div>

          <div className="smooth-card" style={{
            background: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '24px',
            cursor: 'pointer'
          }} onClick={() => navigate('/gateway')}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '16px' }}>
              <HelpCircle size={24} color="#3B82F6" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', margin: '0 0 6px 0' }}>Anonymous Q&A</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
              Privacy-focused queue with peer upvoting and teacher answered marks.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/gateway')}
            style={{
              background: '#0D9488',
              border: 'none',
              color: '#FFF',
              padding: '16px 48px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)'
            }}
          >
            Try SyncPoll Free
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
