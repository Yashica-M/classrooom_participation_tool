const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'syncpoll_secret_key_2026';

// In-memory fallback users list for offline testing
const memoryUsers = new Map();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userRole = (role || 'STUDENT').toUpperCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedEmail = email.toLowerCase().trim();

    let user;
    try {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole
      });
    } catch (err) {
      // Fallback in-memory registration if DB is offline
      if (memoryUsers.has(normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      user = {
        id: `usr_${Date.now()}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole
      };
      memoryUsers.set(normalizedEmail, user);
    }

    const token = jwt.sign(
      { id: user._id || user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user;

    try {
      user = await User.findOne({ email: normalizedEmail });
    } catch (err) {
      user = memoryUsers.get(normalizedEmail);
    }

    if (!user) {
      user = memoryUsers.get(normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id || user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    return res.status(200).json({
      success: true,
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
