import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import QAFeed from './QAFeed';
import PollModal from './PollModal';
import { LogOut, Bell, Clock, QrCode, BookOpen, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

const UNDERSTANDING_LEVELS = [
  { level: 1, label: 'Got it',        emoji: '😀', color: '#10B981' },
  { level: 2, label: 'Mostly clear',  emoji: '🙂', color: '#2563EB' },
  { level: 3, label: 'Unsure',        emoji: '😐', color: '#94A3B8' },
  { level: 4, label: 'Confused',      emoji: '😕', color: '#F59E0B' },
  { level: 5, label: 'Lost',          emoji: '😵', color: '#EF4444' },
];

const StudentActionPanel = ({
  sessionCode = '',
  userName = 'Student',
  activePoll,
  questions = [],
  announcements = [],
  resources = [],
  onSubmitVote,
  onSendConfusion,
  onSubmitQuestion,
  onUpvoteQuestion,
  onLeaveSession
}) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLevelClick = (lvl) => {
    setSelectedLevel(lvl.level);
    onSendConfusion(lvl.level);
    toast.success(`Sent: ${lvl.emoji} ${lvl.label}`, {
      id: 'confusion',
      style: { background: '#141D30', color: '#F1F5F9', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '14px' }
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070B17', color: '#F1F5F9', padding: '24px 32px', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Top bar with Logo */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#0E1525', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '14px 22px', marginBottom: '24px',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Logo size={28} />
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '14px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>Student Workspace</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Room <strong style={{ color: '#22D3EE' }}>{sessionCode || 'Active'}</strong> · {userName}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '12px', color: '#64748B', background: '#141D30', border: '1px solid rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} color="#7C3AED" /> {time}
          </div>

          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setShowNotif(!showNotif)} className="btn-secondary"
              style={{ padding: '7px 11px', borderRadius: '8px', position: 'relative', lineHeight: 0 }}>
              <Bell size={16} color="#94A3B8" />
              {activePoll?.isActive && (
                <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '50%', border: '1px solid #070B17' }} />
              )}
            </button>
            {showNotif && (
              <div className="glass-card-static" style={{ position: 'absolute', top: '44px', right: 0, width: '280px', padding: '16px', zIndex: 100, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Notifications</div>
                <div style={{ fontSize: '13px', color: '#94A3B8', background: '#0E1525', padding: '10px', borderRadius: '8px' }}>
                  {activePoll?.isActive ? 'Active poll broadcast in progress.' : 'No active notifications.'}
                </div>
              </div>
            )}
          </div>

          <button onClick={onLeaveSession} style={{
            background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171',
            padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit'
          }}>
            <LogOut size={13} /> Leave
          </button>
        </div>
      </header>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

        {/* Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Understanding cards */}
          <div className="glass-card-static" style={{ padding: '22px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#F1F5F9' }}>How well are you following?</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Your response is sent to the instructor</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {UNDERSTANDING_LEVELS.map((lvl) => (
                <button key={lvl.level} type="button" onClick={() => handleLevelClick(lvl)} style={{
                  background: selectedLevel === lvl.level ? `${lvl.color}20` : '#0E1525',
                  border: selectedLevel === lvl.level ? `1px solid ${lvl.color}` : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px', padding: '12px 4px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit'
                }}>
                  <span style={{ fontSize: '24px' }}>{lvl.emoji}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: selectedLevel === lvl.level ? lvl.color : '#64748B', textAlign: 'center' }}>{lvl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Status */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={17} color="#10B981" /> Session Attendance
              </div>
              <button type="button" onClick={() => setShowQr(true)} className="btn-primary" style={{ padding: '5px 13px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <QrCode size={13} /> QR Code
              </button>
            </div>
            <div style={{ background: '#0E1525', borderRadius: '8px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '3px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#10B981', flexShrink: 0 }}>
                ✓
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#F1F5F9' }}>Session Connected</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Active in Room {sessionCode || 'Main'}</div>
              </div>
            </div>
          </div>

          {/* Resources (Dynamic or clean empty state) */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#F1F5F9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={17} color="#22D3EE" /> Session Materials
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resources.length > 0 ? (
                resources.map((r, i) => (
                  <div key={i} style={{ background: '#0E1525', padding: '11px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#94A3B8' }}>{r.name}</span>
                    <span style={{ fontSize: '12px', color: '#22D3EE', fontWeight: 600, cursor: 'pointer' }}>View</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', padding: '12px 0' }}>
                  No session materials uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Questions & Announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <QAFeed questions={questions} role="STUDENT" onSubmitQuestion={onSubmitQuestion} onUpvoteQuestion={onUpvoteQuestion} />

          {/* Announcements (Dynamic or clean empty state) */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#F1F5F9', marginBottom: '14px' }}>Announcements</div>
            {announcements.length > 0 ? (
              announcements.map((a, i) => (
                <div key={i} style={{ borderLeft: '2px solid #7C3AED', paddingLeft: '14px', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#F1F5F9' }}>{a.title}</div>
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>{a.content}</p>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', padding: '12px 0' }}>
                No active announcements for this session.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Poll modal */}
      {activePoll?.isActive && <PollModal poll={activePoll} onSubmitVote={onSubmitVote} />}

      {/* QR modal */}
      {showQr && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,11,23,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card-static" style={{ maxWidth: '360px', width: '100%', padding: '32px', textAlign: 'center' }}>
            <QrCode size={72} color="#7C3AED" style={{ margin: '0 auto 14px auto' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Room Code: {sessionCode || 'Active'}</h3>
            <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '20px' }}>Share this code with your class to join.</p>
            <button onClick={() => setShowQr(false)} className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentActionPanel;
