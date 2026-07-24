import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8081';

export function useSocket(initialSessionCode = 'CS101', role = 'STUDENT') {
  const [sessionCode, setSessionCode] = useState(initialSessionCode);
  const [userRole, setUserRole] = useState(role);
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  // Real-time state
  const [activePoll, setActivePoll] = useState(null);
  const [confusionScore, setConfusionScore] = useState(1.0);
  const [totalConfusionResponses, setTotalConfusionResponses] = useState(0);
  const [questions, setQuestions] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.io instance with auto-reconnection
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('⚡ [useSocket] Connected with ID:', socket.id);
      setIsConnected(true);
      socket.emit('join-session', { sessionCode, role: userRole });
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ [useSocket] Disconnected:', reason);
      setIsConnected(false);
    });

    const handleRoomState = (data) => {
      if (data.activePoll !== undefined) setActivePoll(data.activePoll);
      if (data.questions) setQuestions(data.questions);
      if (data.confusionScore !== undefined) setConfusionScore(data.confusionScore);
      if (data.totalResponses !== undefined) setTotalConfusionResponses(data.totalResponses);
      if (data.participantCount !== undefined) setParticipantCount(Math.max(0, data.participantCount));
    };

    socket.on('session-joined', handleRoomState);
    socket.on('room-state', handleRoomState);

    const handlePollState = (poll) => {
      setActivePoll(poll);
    };

    socket.on('poll-started', handlePollState);
    socket.on('poll-created', handlePollState);
    socket.on('poll-updated', handlePollState);
    socket.on('poll-update', handlePollState);

    const handleConfusionState = (data) => {
      if (data.confusionScore !== undefined) setConfusionScore(data.confusionScore);
      if (data.totalResponses !== undefined) setTotalConfusionResponses(data.totalResponses);
    };

    socket.on('confusion-updated', handleConfusionState);
    socket.on('confusion-update', handleConfusionState);

    const handleQAState = (updatedQuestions) => {
      setQuestions(updatedQuestions);
    };

    socket.on('questions-updated', handleQAState);
    socket.on('qa-update', handleQAState);

    socket.on('room-participants-update', ({ participantCount }) => {
      setParticipantCount(Math.max(0, participantCount || 0));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-session', { sessionCode });
      }
      socket.disconnect();
    };
  }, [sessionCode, userRole]);

  // Action Dispatchers
  const joinSession = useCallback((newCode, newRole, name) => {
    const code = (newCode || 'CS101').toUpperCase().trim();
    setSessionCode(code);
    if (newRole) setUserRole(newRole);
    if (socketRef.current) {
      socketRef.current.emit('join-session', { sessionCode: code, role: newRole || userRole, name });
    }
  }, [userRole]);

  const leaveSession = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leave-session', { sessionCode });
    }
  }, [sessionCode]);

  const startPoll = useCallback((question, options) => {
    if (socketRef.current) {
      socketRef.current.emit('start-poll', { sessionCode, question, options });
    }
  }, [sessionCode]);

  const submitVote = useCallback((optionId) => {
    if (socketRef.current) {
      socketRef.current.emit('submit-vote', { sessionCode, optionId });
    }
  }, [sessionCode]);

  const sendConfusion = useCallback((level) => {
    if (socketRef.current) {
      socketRef.current.emit('send-confusion', { sessionCode, level });
    }
  }, [sessionCode]);

  const submitQuestion = useCallback((text, isAnonymous = true) => {
    if (socketRef.current) {
      socketRef.current.emit('submit-question', { sessionCode, text, isAnonymous });
    }
  }, [sessionCode]);

  const upvoteQuestion = useCallback((questionId) => {
    if (socketRef.current) {
      socketRef.current.emit('upvote-question', { sessionCode, questionId });
    }
  }, [sessionCode]);

  const markAnswered = useCallback((questionId) => {
    if (socketRef.current) {
      socketRef.current.emit('mark-answered', { sessionCode, questionId });
    }
  }, [sessionCode]);

  return {
    socket: socketRef.current,
    isConnected,
    sessionCode,
    userRole,
    participantCount,
    activePoll,
    confusionScore,
    totalConfusionResponses,
    questions,
    joinSession,
    leaveSession,
    startPoll,
    submitVote,
    sendConfusion,
    submitQuestion,
    upvoteQuestion,
    markAnswered
  };
}
