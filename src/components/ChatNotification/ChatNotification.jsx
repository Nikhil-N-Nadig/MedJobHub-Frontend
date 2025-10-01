import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import './ChatNotification.css';

const ChatNotification = () => {
  const { unreadCount, loadUnreadCount } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    // Load unread count when component mounts
    loadUnreadCount();
    
    // Set up interval to check for new messages every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <button 
      className="chat-notification-btn" 
      onClick={handleChatClick}
      title="Messages"
    >
      <MessageCircle size={20} />
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default ChatNotification;