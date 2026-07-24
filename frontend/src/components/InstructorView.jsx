import React, { useState } from 'react';
import ConfusionGauge from './confusion/ConfusionGauge';
import LivePollChart from './polls/LivePollChart';
import { Users, Radio, MessageSquarePlus, ThumbsUp, Send } from 'lucide-react';

const InstructorView = ({
  sessionCode,
  participantCount,
  isConnected,
  confusionScore,
  totalConfusionResponses,
  activePoll,
  questions,
  onJoinSession,
  onStartPoll,
  onUpvoteQuestion
}) => {
  const [inputCode, setInputCode] = useState(sessionCode || 'CS101');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptionsStr, setPollOptionsStr] = useState('Option A, Option B, Option C');

  const handleSwitchSession = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoinSession(inputCode.trim().toUpperCase(), 'INSTRUCTOR');
    }
  };

  const handleLaunchPoll = (e) => {
    e.preventDefault();
    if (!pollQuestion.trim()) return;

    const options = pollOptionsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (options.length < 2) {
      alert('Please enter at least 2 options separated by commas.');
      return;
    }

    onStartPoll(pollQuestion, options);
    setPollQuestion('');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#090D16', color: '#F8FAFC', minHeight: 'calc(100vh - 60px)' }}>
      {/* Control Room Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        padding: '16px 24px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2563EB', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <Radio size={24} color="#FFF" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Instructor Control Room</h2>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>Managing Room: <strong style={{ color: '#60A5FA' }}>{sessionCode}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <form onSubmit={handleSwitchSession} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Session Code"
              style={{
                background: '#0F172A',
                border: '1px solid #334155',
                color: '#FFF',
                padding: '8px 12px',
                borderRadius: '8px',
                width: '120px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#2563EB',
                color: '#FFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Switch
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '20px' }}>
            <Users size={16} color="#60A5FA" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0' }}>
              {participantCount} Students
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#10B981' : '#EF4444'
            }}></span>
            <span style={{ fontSize: '12px', color: isConnected ? '#10B981' : '#EF4444', fontWeight: 600 }}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Weighted Confusion Speedometer & Launch Poll */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ConfusionGauge score={confusionScore} totalResponses={totalConfusionResponses} />

          {/* Launch Poll Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquarePlus size={20} color="#3B82F6" /> Launch Live Poll
            </h3>
            <form onSubmit={handleLaunchPoll}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Question</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Which algorithm provides O(1) average lookup?"
                  style={{
                    width: '100%',
                    background: '#0F172A',
                    border: '1px solid #334155',
                    color: '#FFF',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Options (Comma-separated)</label>
                <input
                  type="text"
                  value={pollOptionsStr}
                  onChange={(e) => setPollOptionsStr(e.target.value)}
                  placeholder="Hash Table, Binary Search Tree, Linked List"
                  style={{
                    width: '100%',
                    background: '#0F172A',
                    border: '1px solid #334155',
                    color: '#FFF',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#FFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '15px',
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

        {/* Right Column: Live Poll Graph & Q&A Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <LivePollChart poll={activePoll} />

          {/* Q&A Queue */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            flex: 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                💬 Live Q&A Stream ({questions.length})
              </h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Sorted by upvotes</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {questions.length === 0 ? (
                <p style={{ color: '#64748B', textAlign: 'center', marginTop: '20px' }}>No student questions asked yet.</p>
              ) : (
                questions.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      background: '#0F172A',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #1E293B',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#F1F5F9', fontWeight: 500 }}>
                        {q.text}
                      </p>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>Posted by {q.author}</span>
                    </div>

                    <button
                      onClick={() => onUpvoteQuestion(q.id)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid #3B82F6',
                        color: '#60A5FA',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ThumbsUp size={14} /> {q.upvotes}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorView;
