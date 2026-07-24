import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import './QuestionItem.css';

const QuestionItem = ({ question, onVote, onMarkAsAnswered }) => {
  const { user } = useAuth();
  
  const isAuthor = user && question.author && user.id === question.author.id;
  const isInstructor = user && user.role === 'INSTRUCTOR';
  const hasVoted = question.votes && question.votes.some(vote => vote.userId === user?.id);
  
  const timeAgo = formatDistanceToNow(new Date(question.timestamp), { addSuffix: true });

  return (
    <div className={`question-item ${question.answered ? 'answered' : ''}`}>
      <div className="vote-section">
        <button 
          className={`vote-button ${hasVoted ? 'voted' : ''}`}
          onClick={() => onVote(question.id)}
          disabled={hasVoted || question.answered || !user}
          aria-label="Vote for this question"
        >
          <span className="vote-icon">▲</span>
          <span className="vote-count">{question.voteCount || 0}</span>
        </button>
      </div>
      
      <div className="question-content">
        <div className="question-header">
          <span className="question-author">
            {question.anonymous ? 'Anonymous' : question.author?.name || 'Unknown'}
          </span>
          <span className="question-time">{timeAgo}</span>
        </div>
        
        <p className="question-text">{question.content}</p>
        
        <div className="question-footer">
          {question.answered && (
            <span className="answered-badge">Answered</span>
          )}
          
          {(isInstructor || isAuthor) && !question.answered && (
            <Button 
              onClick={() => onMarkAsAnswered(question.id)}
              className="mark-answered-button"
            >
              Mark as Answered
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;