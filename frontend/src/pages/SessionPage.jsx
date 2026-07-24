import React, { useState } from 'react';
import { useSocketContext } from '../contexts/SocketContext';
import InstructorView from '../components/InstructorView';
import StudentView from '../components/StudentView';
import { Monitor, User } from 'lucide-react';

const SessionPage = () => {
  const {
    sessionCode,
    userRole,
    participantCount,
    isConnected,
    confusionScore,
    totalConfusionResponses,
    activePoll,
    questions,
    joinSession,
    startPoll,
    submitVote,
    sendConfusion,
    submitQuestion,
    upvoteQuestion
  } = useSocketContext();

  const [currentRole, setCurrentRole] = useState(userRole || 'STUDENT');

  const handleRoleToggle = (newRole) => {
    setCurrentRole(newRole);
    joinSession(sessionCode, newRole);
  };

  return (
    <div style={{ backgroundColor: '#090D16', minHeight: '100vh' }}>
      {/* Role Switcher Toolbar */}
      <div style={{
        background: '#0F172A',
        borderBottom: '1px solid #1E293B',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '13px', color: '#94A3B8' }}>
          Role Enforcement Mode: <strong style={{ color: currentRole === 'INSTRUCTOR' ? '#60A5FA' : '#34D399' }}>{currentRole}</strong>
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleRoleToggle('INSTRUCTOR')}
            style={{
              background: currentRole === 'INSTRUCTOR' ? '#2563EB' : 'rgba(255,255,255,0.05)',
              color: '#FFF',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Monitor size={14} /> Instructor Mode
          </button>

          <button
            onClick={() => handleRoleToggle('STUDENT')}
            style={{
              background: currentRole === 'STUDENT' ? '#10B981' : 'rgba(255,255,255,0.05)',
              color: '#FFF',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <User size={14} /> Student Mode
          </button>
        </div>
      </div>

      {/* Conditional View Rendering based on Role State */}
      {currentRole === 'INSTRUCTOR' ? (
        <InstructorView
          sessionCode={sessionCode}
          participantCount={participantCount}
          isConnected={isConnected}
          confusionScore={confusionScore}
          totalConfusionResponses={totalConfusionResponses}
          activePoll={activePoll}
          questions={questions}
          onJoinSession={joinSession}
          onStartPoll={startPoll}
          onUpvoteQuestion={upvoteQuestion}
        />
      ) : (
        <StudentView
          sessionCode={sessionCode}
          activePoll={activePoll}
          questions={questions}
          onJoinSession={joinSession}
          onSubmitVote={submitVote}
          onSendConfusion={sendConfusion}
          onSubmitQuestion={submitQuestion}
          onUpvoteQuestion={upvoteQuestion}
        />
      )}
    </div>
  );
};

export default SessionPage;