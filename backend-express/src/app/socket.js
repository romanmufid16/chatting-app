import { Server } from "socket.io";
import http from "http";
import { web } from './web.js';
import { logger } from "./logging.js";
import { prismaClient } from "./database.js";

export const server = http.createServer(web);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000", // Ganti dengan URL frontend Anda
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

let activeUsers = {};

io.on('connection', (socket) => {
  logger.info('A user connected', socket.id);

  socket.on('setUsername', (username) => {
    activeUsers[username] = socket.id;
    logger.info(`${username} is now online`);
  });

  socket.on('sendMessage', async (message) => {
    try {
      // Validasi senderId dan receiverId
      const senderExists = await prismaClient.user.findUnique({ where: { id: message.senderId } });
      const receiverExists = await prismaClient.user.findUnique({ where: { id: message.receiverId } });

      if (!senderExists || !receiverExists) {
        socket.emit('error', 'Sender or receiver not found');
        return;
      }

      // Simpan pesan
      const savedMessage = await prismaClient.message.create({
        data: {
          content: message.content,
          senderId: message.senderId,
          receiverId: message.receiverId
        }
      });

      // Kirim pesan ke penerima
      const receiverSocketId = activeUsers[message.receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', savedMessage);
      }
    } catch (error) {
      logger.error("Error saving message:", error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    for (let [username, id] of Object.entries(activeUsers)) {
      if (id === socket.id) {
        delete activeUsers[username];
        logger.info(`${username} is now offline`);
      }
    }
  });

});