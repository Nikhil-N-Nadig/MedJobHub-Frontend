import axios from 'axios';

class ChatService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URI,
      withCredentials: true,
    });
  }

  async getConversations() {
    try {
      const response = await this.api.get('/api/chat/conversations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch conversations' };
    }
  }

  // Get messages between current user and partner
  async getChatMessages(partnerId) {
    try {
      const response = await this.api.get(`/api/chat/messages/${partnerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch messages' };
    }
  }

  // Start a new chat or get existing room
  async startChat(partnerId) {
    try {
      const response = await this.api.post(`/api/chat/start/${partnerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to start chat' };
    }
  }

  async searchUsers(query = '', role = '') {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (role) params.append('role', role);
      
      const response = await this.api.get(`/api/chat/users/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to search users' };
    }
  }

  async markMessagesRead(partnerId) {
    try {
      const response = await this.api.post(`/api/chat/mark-read/${partnerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to mark messages as read' };
    }
  }

  async getUnreadCount() {
    try {
      const response = await this.api.get('/api/chat/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get unread count' };
    }
  }
}

const chatService = new ChatService();
export default chatService;