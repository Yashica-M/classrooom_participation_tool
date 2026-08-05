const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const socketHandler = require('./socket');

const app = express();
const server = http.createServer(app);

// Dynamic CORS configuration supporting Vercel, localhost, and credentials
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like server-to-server, curl, mobile apps)
    if (!origin) return callback(null, true);

    // If process.env.CORS_ORIGIN is specified and not '*', check against explicit allowed origins
    if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*') {
      const allowedList = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
      if (allowedList.includes(origin)) {
        return callback(null, true);
      }
    }

    // Reflect the requesting origin to satisfy Access-Control-Allow-Origin with credentials
    return callback(null, origin);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'SyncPoll Backend Engine', timestamp: new Date() });
});

// Socket.io Setup with CORS
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      return callback(null, origin);
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize Socket event handlers
socketHandler(io);

const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 SyncPoll Real-time Engine listening on port ${PORT}`);
  console.log(`⚡ WebSocket Server ready with Socket.io`);
  console.log(`=================================================`);
});
