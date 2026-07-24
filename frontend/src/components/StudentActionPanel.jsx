import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import PollModal from './PollModal';
import QAFeed from './QAFeed';
import { Radio, AlertCircle, CheckCircle2, LogOut, BarChart3 } from 'lucide-react';

const StudentActionPanel = ({
  sessionCode,
  userName,
  activePoll,
  questions,
  onSubmitVote,
  onSendConfusion,
  onSubmitQuestion,
  onUpvoteQuestion,
  onLeaveSession
}) => {
  const [showPollModal, setShowPollModal] = useState(false);
  const [optimisticConfusionLevel, setOptimisticConfusionLevel] = useState(null);

  useEffect(() => {
    if (activePoll && activePoll.isActive) {
      setShowPollModal(true);
      toast.success('📢 New Live Poll broadcasted by Instructor!', { duration: 4000 });
    }
  }, [activePoll?.id]);

  const handleConfusionPulse = (level) => {
    setOptimisticConfusionLevel(level);

    toast.success('⚡ Confusion pulse sent to instructor!', {
      id: 'confusion-pulse',
      duration: 3000
    });

    onSendConfusion(level);
  };

  const handleVoteWrapped = (optionId) => {
    onSubmitVote(optionId);
    toast.success('📊 Vote submitted successfully!', { id: 'poll-vote' });
  };

  const handleQuestionWrapped = (text, isAnonymous) => {
    onSubmitQuestion(text, isAnonymous);
    toast.success('💬 Question posted to Q&A queue!', { id: 'post-qa' });
  };

  const handleUpvoteWrapped = (questionId) => {
    onUpvoteQuestion(questionId);
    toast.success('👍 Upvoted question!', { id: 'upvote-qa' });
  };

  return (
    <div style={{
      padding: '32px 20px',
      backgroundColor: '#020617',
      color: '#F1F5F9',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {showPollModal && (
        <PollModal
          poll={activePoll}
          onSubmitVote={handleVoteWrapped}
          onClose={() => setShowPollModal(false)}
        />
      )}

      {/* Header Bar */}
      <header style={{
        background: '#0F172A',
        padding: '20px 24px',
        borderRadius: '12px',
        border: '1px solid #1E293B',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#0D9488', padding: '10px', borderRadius: '10px', display: 'flex' }}>
            <Radio size={22} color="#FFF" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Student Workspace</h2>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Student: <strong style={{ color: '#F1F5F9' }}>{userName || 'Student User'}</strong> | Session: <strong style={{ color: '#14B8A6' }}>{sessionCode}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activePoll && (
            <button
              onClick={() => setShowPollModal(true)}
              style={{
                background: '#0D9488',
                color: '#FFF',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px'
              }}
            >
              <BarChart3 size={16} /> Open Live Poll
            </button>
          )}

          <button
            onClick={onLeaveSession}
            style={{
              background: '#020617',
              border: '1px solid #1E293B',
              color: '#94A3B8',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px'
            }}
          >
            <LogOut size={16} /> Exit Room
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Real-time Confusion Pulse Controls */}
        <div style={{
          background: '#0F172A',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #1E293B'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#F1F5F9' }}>
              <AlertCircle size={20} color="#F59E0B" /> Real-time Confusion Pulse
            </h3>
            {optimisticConfusionLevel && (
              <span style={{ fontSize: '12px', color: '#14B8A6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Active Pulse: Level {optimisticConfusionLevel}
              </span>
            )}
          </div>
          <p style={{ margin: '0 0 18px 0', fontSize: '13px', color: '#94A3B8' }}>
            Tap your current understanding level to update the professor's Speedometer Gauge in real time:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '12px'
          }}>
            {[
              { level: 1, label: 'Clear', color: '#10B981' },
              { level: 2, label: 'Mostly Clear', color: '#14B8A6' },
              { level: 3, label: 'Unsure', color: '#F59E0B' },
              { level: 4, label: 'Confused', color: '#F97316' },
              { level: 5, label: 'Lost!', color: '#EF4444' }
            ].map((btn) => (
              <button
                key={btn.level}
                onClick={() => handleConfusionPulse(btn.level)}
                style={{
                  background: optimisticConfusionLevel === btn.level ? btn.color : '#020617',
                  color: optimisticConfusionLevel === btn.level ? '#FFF' : '#E2E8F0',
                  border: optimisticConfusionLevel === btn.level ? `1px solid ${btn.color}` : '1px solid #1E293B',
                  padding: '16px 8px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  minHeight: '54px'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Anonymous Q&A Queue */}
        <QAFeed
          questions={questions}
          role="STUDENT"
          onSubmitQuestion={handleQuestionWrapped}
          onUpvoteQuestion={handleUpvoteWrapped}
        />

      </div>
    </div>
  );
};

export default StudentActionPanel;
