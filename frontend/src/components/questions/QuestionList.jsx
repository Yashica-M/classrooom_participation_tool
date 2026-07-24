import React from 'react';
import QuestionItem from './QuestionItem';

const QuestionList = ({ questions, onVote, onMarkAsAnswered, currentUser }) => {
  if (!questions || questions.length === 0) {
    return <p>No questions yet. Be the first to ask!</p>;
  }

  return (
    <div className="question-list">
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          onVote={onVote}
          onMarkAsAnswered={onMarkAsAnswered}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default QuestionList;