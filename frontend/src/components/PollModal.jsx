import React, { useState } from 'react';
import { BarChart3, CheckCircle2, X } from 'lucide-react';

const PollModal = ({ poll, onSubmitVote, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  if (!poll || !poll.options) return null;

  const handleVoteSubmit = (optionId) => {
    if (hasVoted) return;
    setSelectedOption(optionId);
    setHasVoted(true);
    onSubmitVote(optionId);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#0F172A',
        width: '100%',
        maxWidth: '500px',
        padding: '28px',
        borderRadius: '16px',
        border: '1px solid #0D9488',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7)',
        color: '#F1F5F9',
        position: 'relative'
      }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: '#0D9488', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            <BarChart3 size={20} color="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#14B8A6', letterSpacing: '1px' }}>
              LIVE CLASS POLL
            </span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#F1F5F9' }}>
              {poll.question}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
          {poll.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleVoteSubmit(opt.id)}
              disabled={hasVoted}
              style={{
                background: selectedOption === opt.id ? '#0D9488' : '#020617',
                color: '#FFF',
                border: selectedOption === opt.id ? '1px solid #14B8A6' : '1px solid #1E293B',
                padding: '14px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: hasVoted ? 'default' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.15s ease'
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
          <div style={{
            background: 'rgba(13, 148, 136, 0.15)',
            border: '1px solid #0D9488',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center',
            color: '#14B8A6',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <CheckCircle2 size={16} /> Vote cast! Live graph updating on main screen.
          </div>
        )}
      </div>
    </div>
  );
};

export default PollModal;
