import React, { useState } from 'react';
import { Radio, AlertCircle, ThumbsUp, Send, CheckCircle2, HelpCircle } from 'lucide-react';

const StudentView = ({
  sessionCode,
  activePoll,
  questions,
  onJoinSession,
  onSubmitVote,
  onSendConfusion,
  onSubmitQuestion,
  onUpvoteQuestion
}) => {
  const [inputCode, setInputCode] = useState(sessionCode || 'CS101');
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const [myConfusionLevel, setMyConfusionLevel] = useState(null);
  const [confusionSubmitted, setConfusionSubmitted] = useState(false);

  const [newQuestionText, setNewQuestionText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleJoin = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoinSession(inputCode.trim().toUpperCase(), 'STUDENT');
    }
  };

  const handleVote = (optionId) => {
    if (hasVoted) return;
    setSelectedOption(optionId);
    setHasVoted(true);
    onSubmitVote(optionId);
  };

  const handlePulseConfusion = (level) => {
    setMyConfusionLevel(level);
    setConfusionSubmitted(true);
    onSendConfusion(level);

    setTimeout(() => {
      setConfusionSubmitted(false);
    }, 3000);
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    onSubmitQuestion(newQuestionText, isAnonymous);
    setNewQuestionText('');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#090D16', color: '#F8FAFC', minHeight: 'calc(100vh - 60px)' }}>
      {/* Student Header Bar */}
      <header style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#10B981', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <Radio size={20} color="#FFF" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Student Workspace</h2>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Active Session: <strong style={{ color: '#60A5FA' }}>{sessionCode}</strong></span>
          </div>
        </div>

        <form onSubmit={handleJoin} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Code (e.g. CS101)"
            style={{
              background: '#0F172A',
              border: '1px solid #334155',
              color: '#FFF',
              padding: '8px 12px',
              borderRadius: '8px',
              width: '110px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#10B981',
              color: '#FFF',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Join Room
          </button>
        </form>
      </header>

      {/* Main Student Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Confusion Pulse Buttons */}
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} color="#F59E0B" /> Live Confusion Pulse
            </h3>
            {confusionSubmitted && (
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Sent to Instructor!
              </span>
            )}
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#94A3B8' }}>
            Click your current understanding level to update the live class Speedometer Gauge:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {[
              { level: 1, label: 'Clear', color: '#10B981' },
              { level: 2, label: 'Mostly Clear', color: '#84CC16' },
              { level: 3, label: 'Unsure', color: '#F59E0B' },
              { level: 4, label: 'Confused', color: '#F97316' },
              { level: 5, label: 'Lost!', color: '#EF4444' }
            ].map((btn) => (
              <button
                key={btn.level}
                onClick={() => handlePulseConfusion(btn.level)}
                style={{
                  background: myConfusionLevel === btn.level ? btn.color : '#0F172A',
                  color: myConfusionLevel === btn.level ? '#FFF' : '#E2E8F0',
                  border: `1px solid ${btn.color}`,
                  padding: '12px 6px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Class Poll Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
            📊 Active Class Poll
          </h3>

          {!activePoll ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
              Waiting for instructor to broadcast a poll...
            </div>
          ) : (
            <div>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#60A5FA', fontWeight: 600 }}>
                {activePoll.question}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activePoll.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(opt.id)}
                    disabled={hasVoted}
                    style={{
                      background: selectedOption === opt.id ? '#2563EB' : '#0F172A',
                      color: '#FFF',
                      border: selectedOption === opt.id ? '2px solid #60A5FA' : '1px solid #334155',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: hasVoted ? 'default' : 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{opt.text}</span>
                    {hasVoted && (
                      <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 'bold' }}>
                        {opt.votes || 0} votes
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {hasVoted && (
                <p style={{ marginTop: '12px', fontSize: '13px', color: '#10B981', textAlign: 'center', fontWeight: 600 }}>
                  ✓ Vote recorded! Live results updating on instructor dashboard.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Anonymous Q&A Form & Peer Questions Feed */}
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="#3B82F6" /> Anonymous Q&A
          </h3>

          <form onSubmit={handleAskQuestion} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Ask a question anonymously..."
                style={{
                  flex: 1,
                  background: '#0F172A',
                  border: '1px solid #334155',
                  color: '#FFF',
                  padding: '12px 14px',
                  borderRadius: '8px'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#2563EB',
                  color: '#FFF',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={16} /> Post
              </button>
            </div>
            <label style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              Post anonymously
            </label>
          </form>

          {/* Q&A List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
            {questions.map((q) => (
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
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#F1F5F9' }}>
                    {q.text}
                  </p>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{q.author}</span>
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
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentView;
