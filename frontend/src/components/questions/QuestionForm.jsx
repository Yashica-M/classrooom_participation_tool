import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import './QuestionForm.css';

const QuestionForm = ({ sessionId, onQuestionSubmit }) => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const newQuestion = {
        content,
        anonymous: isAnonymous,
        sessionId,
        authorId: isAnonymous ? null : user.id
      };
      
      await onQuestionSubmit(newQuestion);
      setContent('');
      setIsAnonymous(false);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <p>Please log in to ask questions.</p>;
  }

  return (
    <div className="question-form">
      <h3>Ask a Question</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question-content">Your Question:</label>
          <textarea
            id="question-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What would you like to ask?"
            required
          />
        </div>
        
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous">Ask anonymously</label>
        </div>
        
        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? 'Submitting...' : 'Submit Question'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;