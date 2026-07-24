const SocketService = require('../services/SocketService');

module.exports = (io) => {
  const socketService = new SocketService(io);
  socketService.init();
};
