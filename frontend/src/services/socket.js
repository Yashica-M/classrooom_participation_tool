import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8081';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.io Client] Connected to server:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ [Socket.io Client] Disconnected:', reason);
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 [Socket.io Client] Auto-reconnecting attempt #${attempt}`);
    });

    socket.on('reconnect', () => {
      console.log('✅ [Socket.io Client] Successfully reconnected to server!');
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const joinSessionRoom = (sessionCode, role = 'STUDENT') => {
  const s = getSocket();
  s.emit('join-session', { sessionCode, role });
};

export const startPoll = (sessionCode, question, options) => {
  const s = getSocket();
  s.emit('start-poll', { sessionCode, question, options });
};

export const submitVote = (sessionCode, optionId) => {
  const s = getSocket();
  s.emit('submit-vote', { sessionCode, optionId });
};

export const sendConfusionPulse = (sessionCode, level) => {
  const s = getSocket();
  s.emit('send-confusion', { sessionCode, level });
};

export const submitQuestion = (sessionCode, text, isAnonymous = true) => {
  const s = getSocket();
  s.emit('submit-question', { sessionCode, text, isAnonymous });
};

export const upvoteQuestion = (sessionCode, questionId) => {
  const s = getSocket();
  s.emit('upvote-question', { sessionCode, questionId });
};
