import React, { createContext, useContext, useReducer, useEffect } from 'react';
import socketService from '../services/socketService';
import chatService from '../services/chatService';
import { useSelector } from 'react-redux';

// Chat Context
const ChatContext = createContext();

// Action types
const CHAT_ACTIONS = {
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_TYPING: 'SET_TYPING',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ONLINE_USERS: 'SET_ONLINE_USERS',
  MARK_MESSAGES_READ: 'MARK_MESSAGES_READ'
};

// Initial state
const initialState = {
  conversations: [],
  activeChat: null,
  messages: [],
  typingUsers: {},
  unreadCount: 0,
  unreadConversations: {},
  onlineUsers: {},
  loading: false,
  error: null
};

// Reducer
function chatReducer(state, action) {
  switch (action.type) {
    case CHAT_ACTIONS.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
        loading: false
      };

    case CHAT_ACTIONS.SET_ACTIVE_CHAT:
      return {
        ...state,
        activeChat: action.payload,
        error: null
      };

    case CHAT_ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
        loading: false
      };

    case CHAT_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };

    case CHAT_ACTIONS.SET_TYPING:
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.userId]: action.payload.isTyping
        }
      };

    case CHAT_ACTIONS.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload.total,
        unreadConversations: action.payload.conversations
      };

    case CHAT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case CHAT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case CHAT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case CHAT_ACTIONS.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.payload
      };

    case CHAT_ACTIONS.MARK_MESSAGES_READ:
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.sender_id === action.payload.partnerId ? 
          { ...msg, is_read: true } : msg
        )
      };

    default:
      return state;
  }
}

// Chat Provider Component
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const user = useSelector((state) => state.auth.userData);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const socket = socketService.connect();
      
      // Socket event listeners
      socketService.onMessageReceived((messageData) => {
        dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: messageData });
        // Update unread count if message is not from current user
        if (messageData.sender_id !== user.id) {
          loadUnreadCount();
        }
      });

      socketService.onUserTyping((data) => {
        dispatch({ 
          type: CHAT_ACTIONS.SET_TYPING, 
          payload: { 
            userId: data.user_id, 
            isTyping: data.is_typing 
          } 
        });
      });

      socketService.onJoinedRoom((data) => {
        console.log('Joined room:', data);
      });

      socketService.onLeftRoom((data) => {
        console.log('Left room:', data);
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [user]);

  // Load conversations
  const loadConversations = async () => {
    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      const response = await chatService.getConversations();
      if (response.success) {
        dispatch({ type: CHAT_ACTIONS.SET_CONVERSATIONS, payload: response.conversations });
      }
    } catch (error) {
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Load chat messages
  const loadChatMessages = async (partnerId) => {
    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      const response = await chatService.getChatMessages(partnerId);
      if (response.success) {
        dispatch({ type: CHAT_ACTIONS.SET_MESSAGES, payload: response.messages });
        dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: response.partner });
        
        // Join the chat room
        if (user) {
          socketService.joinChat(user.id, partnerId);
        }
        
        // Mark messages as read
        await chatService.markMessagesRead(partnerId);
        dispatch({ type: CHAT_ACTIONS.MARK_MESSAGES_READ, payload: { partnerId } });
        
        // Update unread count
        loadUnreadCount();
      }
    } catch (error) {
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Send message
  const sendMessage = async (receiverId, message) => {
    if (user && message.trim()) {
      socketService.sendMessage(user.id, receiverId, message.trim());
    }
  };

  // Start new chat
  const startChat = async (partnerId) => {
    try {
      const response = await chatService.startChat(partnerId);
      if (response.success) {
        dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: response.partner });
        dispatch({ type: CHAT_ACTIONS.SET_MESSAGES, payload: [] });
        
        // Join the chat room
        if (user) {
          socketService.joinChat(user.id, partnerId);
        }
      }
      return response;
    } catch (error) {
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Search users
  const searchUsers = async (query = '', role = '') => {
    try {
      const response = await chatService.searchUsers(query, role);
      return response;
    } catch (error) {
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Send typing indicator
  const sendTyping = (partnerId, isTyping) => {
    if (user) {
      socketService.sendTyping(user.id, partnerId, isTyping);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await chatService.getUnreadCount();
      if (response.success) {
        dispatch({ 
          type: CHAT_ACTIONS.SET_UNREAD_COUNT, 
          payload: { 
            total: response.total_unread, 
            conversations: response.unread_conversations 
          } 
        });
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  // Leave chat
  const leaveChat = (partnerId) => {
    if (user) {
      socketService.leaveChat(user.id, partnerId);
      dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: null });
      dispatch({ type: CHAT_ACTIONS.SET_MESSAGES, payload: [] });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
  };

  const contextValue = {
    ...state,
    loadConversations,
    loadChatMessages,
    sendMessage,
    startChat,
    searchUsers,
    sendTyping,
    loadUnreadCount,
    leaveChat,
    clearError
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}