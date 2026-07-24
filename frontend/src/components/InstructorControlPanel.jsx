import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ConfusionGauge from './confusion/ConfusionGauge';
import LivePollChart from './polls/LivePollChart';
import QAFeed from './QAFeed';
import { Users, Radio, MessageSquarePlus, Send, LogOut } from 'lucide-react';

const InstructorControlPanel = ({
  sessionCode,
  userName,
  participantCount,
  isConnected,
  confusionScore,
  totalConfusionResponses,
  activePoll,
  questions,
  onStartPoll,
  onUpvoteQuestion,
  onMarkAnswered,
  onLeaveSession
}) => {
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptionsStr, setPollOptionsStr] = useState('');

  const handleLaunchPoll = (e) => {
    e.preventDefault();
    if (!pollQuestion.trim()) {
      toast.error('Please enter a poll question.');
      return;
    }

    const options = pollOptionsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (options.length < 2) {
      toast.error('Please enter at least 2 options separated by commas.');
      return;
    }

    onStartPoll(pollQuestion, options);
    toast.success('🚀 Live Poll broadcasted to all students!', { id: 'broadcast-poll' });
    setPollQuestion('');
    setPollOptionsStr('');
  };

  const handleMarkAnsweredWrapped = (questionId) => {
    onMarkAnswered(questionId);
    toast.success('✓ Question marked as answered!', { id: 'mark-answered-toast' });
  };

  return (
    <div className="animate-fade-in" style={{
      padding: '32px',
      backgroundColor: '#020617',
      color: '#F1F5F9',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Zen SaaS Header Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0F172A',
        padding: '20px 24px',
        borderRadius: '12px',
        border: '1px solid #1E293B',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#0D9488', padding: '10px', borderRadius: '10px', display: 'flex' }}>
            <Radio size={22} color="#FFF" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Instructor Control Panel</h2>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Instructor: <strong style={{ color: '#F1F5F9' }}>{userName || 'Prof. Instructor'}</strong> | Session: <strong style={{ color: '#14B8A6' }}>{sessionCode}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#020617', padding: '6px 14px', borderRadius: '20px', border: '1px solid #1E293B' }}>
            <Users size={16} color="#14B8A6" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0' }}>
              {participantCount} Active Students
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#14B8A6' : '#EF4444'
            }}></span>
            <span style={{ fontSize: '12px', color: isConnected ? '#14B8A6' : '#EF4444', fontWeight: 700 }}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          <button
            onClick={onLeaveSession}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#F87171',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px'
            }}
          >
            <LogOut size={14} /> Exit Session
          </button>
        </div>
      </header>

      {/* Main Spacious Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {/* Column 1: Speedometer Gauge & Launch Poll */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ConfusionGauge score={confusionScore} totalResponses={totalConfusionResponses} />

          <div className="smooth-card" style={{
            background: '#0F172A',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #1E293B'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#F1F5F9' }}>
              <MessageSquarePlus size={20} color="#0D9488" /> Launch Live Poll
            </h3>
            <form onSubmit={handleLaunchPoll}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Poll Question</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Which layer does HTTP operate on?"
                  style={{
                    width: '100%',
                    background: '#020617',
                    border: '1px solid #1E293B',
                    color: '#F1F5F9',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Options (Comma-separated)</label>
                <input
                  type="text"
                  value={pollOptionsStr}
                  onChange={(e) => setPollOptionsStr(e.target.value)}
                  placeholder="e.g. Application, Transport, Network"
                  style={{
                    width: '100%',
                    background: '#020617',
                    border: '1px solid #1E293B',
                    color: '#F1F5F9',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
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
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} /> Broadcast Poll
              </button>
            </form>
          </div>
        </div>

        {/* Column 2: Live Poll Chart & QAFeed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <LivePollChart poll={activePoll} />

          <QAFeed
            questions={questions}
            role="INSTRUCTOR"
            onUpvoteQuestion={onUpvoteQuestion}
            onMarkAnswered={handleMarkAnsweredWrapped}
          />
        </div>
      </div>
    </div>
  );
};

export default InstructorControlPanel;
