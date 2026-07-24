import React, { useState } from 'react';
import { useSocketContext } from '../contexts/SocketContext';
import SessionGateway from '../components/SessionGateway';
import InstructorControlPanel from '../components/InstructorControlPanel';
import StudentActionPanel from '../components/StudentActionPanel';

const SessionWorkspace = () => {
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
    leaveSession,
    startPoll,
    submitVote,
    sendConfusion,
    submitQuestion,
    upvoteQuestion,
    markAnswered
  } = useSocketContext();

  const [hasJoined, setHasJoined] = useState(false);
  const [joinedUser, setJoinedUser] = useState({
    name: '',
    role: 'STUDENT'
  });

  const handleJoinFromGateway = ({ name, role, sessionCode: code }) => {
    setJoinedUser({ name, role });
    setHasJoined(true);
    joinSession(code, role, name);
  };

  const handleLeaveSession = () => {
    if (leaveSession) {
      leaveSession();
    }
    setHasJoined(false);
  };

  // 1. Render Session Gateway if not joined yet
  if (!hasJoined) {
    return (
      <SessionGateway
        onJoinSession={handleJoinFromGateway}
        isConnected={isConnected}
      />
    );
  }

  // 2. Conditional View Rendering based on Joined Role
  return (
    <div>
      {joinedUser.role === 'INSTRUCTOR' ? (
        <InstructorControlPanel
          sessionCode={sessionCode}
          userName={joinedUser.name}
          participantCount={participantCount}
          isConnected={isConnected}
          confusionScore={confusionScore}
          totalConfusionResponses={totalConfusionResponses}
          activePoll={activePoll}
          questions={questions}
          onStartPoll={startPoll}
          onUpvoteQuestion={upvoteQuestion}
          onMarkAnswered={markAnswered}
          onLeaveSession={handleLeaveSession}
        />
      ) : (
        <StudentActionPanel
          sessionCode={sessionCode}
          userName={joinedUser.name}
          activePoll={activePoll}
          questions={questions}
          onSubmitVote={submitVote}
          onSendConfusion={sendConfusion}
          onSubmitQuestion={submitQuestion}
          onUpvoteQuestion={upvoteQuestion}
          onLeaveSession={handleLeaveSession}
        />
      )}
    </div>
  );
};

export default SessionWorkspace;
