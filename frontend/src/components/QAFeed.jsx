import React, { useState } from 'react';
import { HelpCircle, ThumbsUp, Send, CheckCircle } from 'lucide-react';

const QAFeed = ({
  questions = [],
  role = 'STUDENT',
  onSubmitQuestion,
  onUpvoteQuestion,
  onMarkAnswered
}) => {
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    onSubmitQuestion(newQuestionText, isAnonymous);
    setNewQuestionText('');
  };

  return (
    <div style={{
      background: '#0F172A',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #1E293B'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#F1F5F9' }}>
          <HelpCircle size={18} color="#0D9488" /> Anonymous Q&A Queue ({questions.length})
        </h3>
        <span style={{ fontSize: '12px', color: '#94A3B8' }}>Sorted by upvotes</span>
      </div>

      {role === 'STUDENT' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Ask a question anonymously..."
              style={{
                flex: 1,
                background: '#020617',
                border: '1px solid #1E293B',
                color: '#F1F5F9',
                padding: '12px 14px',
                borderRadius: '6px'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#0D9488',
                color: '#FFF',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '6px',
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
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
        {questions.length === 0 ? (
          <p style={{ color: '#64748B', textAlign: 'center', margin: '20px 0' }}>
            No active questions in queue.
          </p>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              style={{
                background: '#020617',
                padding: '14px 16px',
                borderRadius: '8px',
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
                  Asked by {q.author}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onUpvoteQuestion(q.id)}
                  style={{
                    background: '#0F172A',
                    border: '1px solid #1E293B',
                    color: '#14B8A6',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ThumbsUp size={14} /> {q.upvotes || 0}
                </button>

                {role === 'INSTRUCTOR' && onMarkAnswered && (
                  <button
                    onClick={() => onMarkAnswered(q.id)}
                    title="Mark as Answered"
                    style={{
                      background: 'rgba(13, 148, 136, 0.15)',
                      border: '1px solid #0D9488',
                      color: '#14B8A6',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle size={14} /> Answered
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QAFeed;
