import React, { useState, useEffect } from 'react';
import {
  getSocket,
  joinSessionRoom,
  startPoll,
  upvoteQuestion
} from '../services/socket';
import ConfusionGauge from '../components/confusion/ConfusionGauge';
import LivePollChart from '../components/polls/LivePollChart';
import { Users, Radio, MessageSquarePlus, ThumbsUp, Send } from 'lucide-react';

const InstructorDashboard = () => {
  const [sessionCode, setSessionCode] = useState('CS101');
  const [joinedCode, setJoinedCode] = useState('CS101');
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptionsStr, setPollOptionsStr] = useState('Option A, Option B, Option C');
  const [activePoll, setActivePoll] = useState(null);

  // Confusion state
  const [confusionScore, setConfusionScore] = useState(1.0);
  const [confusionResponses, setConfusionResponses] = useState(0);

  // Questions state
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setIsConnected(true);
      joinSessionRoom(joinedCode, 'INSTRUCTOR');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('session-joined', (data) => {
      if (data.activePoll) setActivePoll(data.activePoll);
      if (data.questions) setQuestions(data.questions);
      if (data.confusionScore) setConfusionScore(data.confusionScore);
      if (data.participantCount) setParticipantCount(data.participantCount);
    });

    socket.on('poll-started', (poll) => {
      setActivePoll(poll);
    });

    socket.on('poll-updated', (poll) => {
      setActivePoll(poll);
    });

    socket.on('confusion-updated', (data) => {
      if (data.confusionScore !== undefined) setConfusionScore(data.confusionScore);
      if (data.totalResponses !== undefined) setConfusionResponses(data.totalResponses);
    });

    socket.on('questions-updated', (updatedQuestions) => {
      setQuestions(updatedQuestions);
    });

    socket.on('room-participants-update', ({ participantCount }) => {
      setParticipantCount(participantCount);
    });

    // Auto join on mount if already connected
    if (socket.connected) {
      setIsConnected(true);
      joinSessionRoom(joinedCode, 'INSTRUCTOR');
    }

    return () => {
      socket.off('session-joined');
      socket.off('poll-started');
      socket.off('poll-updated');
      socket.off('confusion-updated');
      socket.off('questions-updated');
      socket.off('room-participants-update');
    };
  }, [joinedCode]);

  const handleJoinSession = (e) => {
    e.preventDefault();
    const code = sessionCode.trim().toUpperCase() || 'CS101';
    setJoinedCode(code);
    joinSessionRoom(code, 'INSTRUCTOR');
  };

  const handleCreatePoll = (e) => {
    e.preventDefault();
    if (!pollQuestion.trim()) return;

    const options = pollOptionsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (options.length < 2) {
      alert('Please provide at least 2 comma-separated options.');
      return;
    }

    startPoll(joinedCode, pollQuestion, options);
    setPollQuestion('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090D16',
      color: '#F8FAFC',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px'
    }}>
      {/* Top Header */}
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
          <div style={{ background: '#3B82F6', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <Radio size={24} color="#FFF" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>SyncPoll Live Control Room</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>Instructor Dashboard & Real-Time Analytics</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <form onSubmit={handleJoinSession} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              placeholder="Code (e.g. CS101)"
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
              Switch Session
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '20px' }}>
            <Users size={16} color="#60A5FA" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0' }}>
              {participantCount} Connected
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
        {/* Left Column: Confusion Gauge & Create Poll */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ConfusionGauge score={confusionScore} totalResponses={confusionResponses} />

          {/* Create Poll Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquarePlus size={20} color="#3B82F6" /> Launch Live Poll
            </h3>
            <form onSubmit={handleCreatePoll}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Poll Question</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Which layer does HTTP operate on?"
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
                  placeholder="Application, Transport, Network"
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
                <Send size={16} /> Broadcast Poll to Class
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Poll Chart & Q&A Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <LivePollChart poll={activePoll} />

          {/* Live Q&A */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            flex: 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                💬 Live Anonymous Q&A Queue ({questions.length})
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
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Posted by {q.author}
                      </span>
                    </div>

                    <button
                      onClick={() => upvoteQuestion(joinedCode, q.id)}
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

export default InstructorDashboard;