import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const PollModal = ({ poll, onSubmitVote, onClose }) => {
  const [selected, setSelected] = useState(null);
  const [voted, setVoted] = useState(false);

  if (!poll?.options) return null;

  const handleVote = (id) => {
    if (voted) return;
    setSelected(id);
    setVoted(true);
    onSubmitVote(id);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,11,23,0.88)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div className="glass-card-static" style={{ width: '100%', maxWidth: '480px', padding: '32px', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 20px 60px -10px rgba(124,58,237,0.25)', position: 'relative' }}>
        {onClose && (
          <button type="button" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', lineHeight: 0 }}>
            <X size={18} />
          </button>
        )}

        <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Poll</div>
        <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#F1F5F9', marginBottom: '22px', lineHeight: 1.4 }}>{poll.question}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {poll.options.map(opt => (
            <button key={opt.id} type="button" onClick={() => handleVote(opt.id)} disabled={voted} style={{
              background: selected === opt.id ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.3))' : '#0E1525',
              color: '#F1F5F9',
              border: selected === opt.id ? '1px solid #7C3AED' : '1px solid rgba(255,255,255,0.07)',
              padding: '14px 18px',
              borderRadius: '8px',
              fontWeight: selected === opt.id ? 700 : 500,
              fontSize: '14px',
              cursor: voted ? 'default' : 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease'
            }}>
              <span>{opt.text}</span>
              {voted && <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{opt.votes || 0}</span>}
            </button>
          ))}
        </div>

        {voted && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '11px', textAlign: 'center', color: '#10B981', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> Response recorded — results are updating live
          </div>
        )}
      </div>
    </div>
  );
};

export default PollModal;
