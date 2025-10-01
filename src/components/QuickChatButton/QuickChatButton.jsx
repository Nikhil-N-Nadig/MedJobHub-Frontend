import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './QuickChatButton.css';

const QuickChatButton = ({ targetUserId, targetUserName, className = '' }) => {
  const { startChat } = useChat();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);

  const handleStartChat = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (user.id === targetUserId) {
      return; // Can't chat with yourself
    }

    if (!targetUserId) {
      console.error('Target user ID is missing');
      return;
    }

    try {
      await startChat(targetUserId);
      navigate('/chat');
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  // Don't show button if not logged in or trying to chat with self
  if (!user || user.id === targetUserId || !targetUserId) {
    return null;
  }

  const displayName = targetUserName || 'User';

  return (
    <button 
      className={`quick-chat-btn ${className}`}
      onClick={handleStartChat}
      title={`Send message to ${displayName}`}
    >
      <MessageCircle size={16} />
      <span>Message {displayName}</span>
    </button>
  );
};

export default QuickChatButton;