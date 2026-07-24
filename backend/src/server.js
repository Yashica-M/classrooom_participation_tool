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

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : '*';

// Enable CORS
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

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
    origin: allowedOrigins,
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
