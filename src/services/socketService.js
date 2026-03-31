import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_BACKEND_URI, {
        transports: ['websocket'],
        withCredentials: true,
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to chat server:', this.socket.id);
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        this.isConnected = false;
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinChat(userId, partnerId) {
    if (this.socket) {
      this.socket.emit('join_chat', {
        user_id: userId,
        partner_id: partnerId
      });
    }
  }

  // Leave a chat room
  leaveChat(userId, partnerId) {
    if (this.socket) {
      this.socket.emit('leave_chat', {
        user_id: userId,
        partner_id: partnerId
      });
    }
  }

  // Send a message
  sendMessage(senderId, receiverId, message) {
    if (this.socket) {
      this.socket.emit('send_message', {
        sender_id: senderId,
        receiver_id: receiverId,
        message: message
      });
    }
  }

  sendTyping(userId, partnerId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', {
        user_id: userId,
        partner_id: partnerId,
        is_typing: isTyping
      });
    }
  }

  // Listen for events
  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onJoinedRoom(callback) {
    if (this.socket) {
      this.socket.on('joined_room', callback);
    }
  }

  onLeftRoom(callback) {
    if (this.socket) {
      this.socket.on('left_room', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onConnected(callback) {
    if (this.socket) {
      this.socket.on('connected', callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  removeListener(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;