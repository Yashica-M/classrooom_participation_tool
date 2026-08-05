import React, { useState } from 'react';
import { HelpCircle, ThumbsUp, Send, CheckCircle } from 'lucide-react';

const QAFeed = ({ questions = [], role = 'STUDENT', onSubmitQuestion, onUpvoteQuestion, onMarkAnswered }) => {
  const [text, setText] = useState('');
  const [anon, setAnon] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmitQuestion(text.trim(), anon);
    setText('');
  };

  return (
    <div className="glass-card-static" style={{ padding: '22px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={17} color="#7C3AED" /> Questions
          {questions.length > 0 && (
            <span style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>{questions.length}</span>
          )}
        </div>
        <span style={{ fontSize: '12px', color: '#4B5563' }}>Sorted by upvotes</span>
      </div>

      {role === 'STUDENT' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Ask something..."
              style={{ flex: 1, background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)', color: '#F1F5F9', padding: '10px 13px', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', flexShrink: 0 }}>
              <Send size={14} /> Post
            </button>
          </div>
          <label style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} style={{ accentColor: '#7C3AED', width: 'auto' }} />
            Post anonymously
          </label>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '2px' }}>
        {questions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#4B5563', fontSize: '13px' }}>No questions yet.</div>
        ) : questions.map((q) => (
          <div key={q.id} style={{ background: '#0E1525', padding: '12px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#F1F5F9', fontWeight: 500, lineHeight: 1.5 }}>{q.text}</p>
              <span style={{ fontSize: '11px', color: '#4B5563', marginTop: '4px', display: 'block' }}>{q.author}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <button type="button" onClick={() => onUpvoteQuestion(q.id)} style={{
                background: '#141D30', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8',
                padding: '5px 11px', borderRadius: '20px', fontWeight: 700, fontSize: '12px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'inherit'
              }}>
                <ThumbsUp size={12} /> {q.upvotes || 0}
              </button>
              {role === 'INSTRUCTOR' && onMarkAnswered && (
                <button type="button" onClick={() => onMarkAnswered(q.id)} style={{
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981',
                  padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit'
                }}>
                  <CheckCircle size={12} /> Done
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAFeed;
