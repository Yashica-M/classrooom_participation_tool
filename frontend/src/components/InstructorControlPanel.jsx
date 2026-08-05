import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ConfusionGauge from './confusion/ConfusionGauge';
import LivePollChart from './polls/LivePollChart';
import QAFeed from './QAFeed';
import { Send, LogOut, QrCode, Copy, Bot, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

const InstructorControlPanel = ({
  sessionCode = '',
  userName = 'Instructor',
  participantCount = 0,
  isConnected = true,
  confusionScore = 1.0,
  totalConfusionResponses = 0,
  activePoll,
  questions = [],
  onStartPoll,
  onUpvoteQuestion,
  onMarkAnswered,
  onLeaveSession
}) => {
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptionsStr, setPollOptionsStr] = useState('');
  const [sessionActive, setSessionActive] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    let t;
    if (sessionActive) t = setInterval(() => setSessionTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [sessionActive]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleLaunchPoll = (e) => {
    e.preventDefault();
    if (!pollQuestion.trim()) return toast.error('Enter a question first.');
    const opts = pollOptionsStr.split(',').map(s => s.trim()).filter(Boolean);
    if (opts.length < 2) return toast.error('Add at least 2 options, separated by commas.');
    onStartPoll(pollQuestion, opts);
    toast.success('Poll broadcasted to session!');
    setPollQuestion('');
    setPollOptionsStr('');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/session/${sessionCode}`);
    toast.success('Invite link copied');
  };

  const statusLabel = confusionScore <= 1.8 ? 'Clear' : confusionScore <= 2.8 ? 'Mostly clear' : confusionScore <= 3.8 ? 'Some confusion' : 'Struggling';
  const statusColor = confusionScore <= 1.8 ? '#10B981' : confusionScore <= 2.8 ? '#2563EB' : confusionScore <= 3.8 ? '#F59E0B' : '#EF4444';

  return (
    <div className="responsive-dashboard-padding" style={{ minHeight: '100vh', backgroundColor: '#070B17', color: '#F1F5F9', padding: '24px 32px', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Top bar with Responsive Header Flex */}
      <header className="responsive-header-flex" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#0E1525', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '14px 22px', marginBottom: '24px',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Logo size={26} />
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '14px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>Instructor Control Panel</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              {userName} · Room <strong style={{ color: '#22D3EE' }}>{sessionCode || 'Active'}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Live toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#141D30', border: '1px solid rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: '20px' }}>
            <button type="button" onClick={() => setSessionActive(a => !a)} style={{
              width: '34px', height: '18px', borderRadius: '9px', border: 'none',
              background: sessionActive ? '#10B981' : '#374151', position: 'relative', cursor: 'pointer', flexShrink: 0
            }}>
              <span style={{ position: 'absolute', top: '2px', left: sessionActive ? '18px' : '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s ease' }} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 600, color: sessionActive ? '#10B981' : '#64748B' }}>
              {sessionActive ? `Live · ${fmt(sessionTime)}` : 'Paused'}
            </span>
          </div>

          <button type="button" onClick={copyLink} className="btn-secondary" style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Copy size={13} /> Invite
          </button>
          <button type="button" onClick={() => setShowQr(true)} className="btn-secondary" style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <QrCode size={13} /> QR Code
          </button>
          <button onClick={onLeaveSession} style={{
            background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171',
            padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', cursor: 'pointer'
          }}>
            <LogOut size={13} /> End Session
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Students Online', value: `${participantCount}`, color: '#22D3EE' },
          { label: 'Questions Pending', value: `${questions.length}`, color: '#A78BFA' },
          { label: 'Class Comprehension', value: statusLabel, color: statusColor },
          { label: 'Poll Votes', value: activePoll ? `${activePoll.totalVotes || 0}` : 'None', color: '#F59E0B' },
        ].map((kpi, i) => (
          <div key={i} className="glass-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{kpi.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Main columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ConfusionGauge score={confusionScore} totalResponses={totalConfusionResponses} />

          {/* Poll builder */}
          <div className="glass-card-static" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#F1F5F9', marginBottom: '14px' }}>Broadcast a Poll</div>
            <form onSubmit={handleLaunchPoll} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>Poll Question</label>
                <input type="text" value={pollQuestion} onChange={e => setPollQuestion(e.target.value)}
                  placeholder="Enter your question..." style={{ width: '100%', background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)', color: '#F1F5F9', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>Options <span style={{ color: '#4B5563', fontWeight: 400 }}>(comma-separated)</span></label>
                <input type="text" value={pollOptionsStr} onChange={e => setPollOptionsStr(e.target.value)}
                  placeholder="Option 1, Option 2, Option 3" style={{ width: '100%', background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)', color: '#F1F5F9', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '11px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Send size={15} /> Send to Class
              </button>
            </form>
          </div>

          {/* Session Insights */}
          <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(34,211,238,0.15)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#F1F5F9', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={16} color="#22D3EE" /> Live Session Insights
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
              {totalConfusionResponses > 0 ? (
                confusionScore > 3.0 ? (
                  <div style={{ background: '#0E1525', padding: '10px 12px', borderRadius: '8px', display: 'flex', gap: '10px' }}>
                    <AlertTriangle size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span>Increased confusion detected ({confusionScore.toFixed(1)}/5). Consider pausing to explain the current topic.</span>
                  </div>
                ) : (
                  <div style={{ background: '#0E1525', padding: '10px 12px', borderRadius: '8px', display: 'flex', gap: '10px' }}>
                    <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span>Class understanding is high ({confusionScore.toFixed(1)}/5). You can proceed to the next topic.</span>
                  </div>
                )
              ) : (
                <div style={{ background: '#0E1525', padding: '10px 12px', borderRadius: '8px', display: 'flex', gap: '10px' }}>
                  <Sparkles size={15} color="#7C3AED" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span>Session active. Feedback insights will update as students submit comprehension signals and poll votes.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LivePollChart poll={activePoll} />
          <QAFeed questions={questions} role="INSTRUCTOR" onUpvoteQuestion={onUpvoteQuestion} onMarkAnswered={onMarkAnswered} />
        </div>
      </div>

      {/* QR modal */}
      {showQr && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,11,23,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card-static" style={{ maxWidth: '340px', width: '100%', padding: '28px', textAlign: 'center' }}>
            <QrCode size={80} color="#7C3AED" style={{ margin: '0 auto 14px auto' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Room Code: {sessionCode || 'Active'}</h3>
            <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '18px' }}>Students can scan this to join instantly.</p>
            <button onClick={() => setShowQr(false)} className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorControlPanel;
