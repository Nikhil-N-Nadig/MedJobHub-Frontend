import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useSelector } from 'react-redux';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ChatWindow = () => {
  const { 
    activeChat, 
    messages, 
    sendMessage, 
    sendTyping, 
    typingUsers,
    leaveChat 
  } = useChat();
  
  const user = useSelector((state) => state.auth.userData);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    if (isTyping && activeChat) {
      sendTyping(activeChat.id, true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(activeChat.id, false);
        setIsTyping(false);
      }, 1000);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && activeChat) {
      sendMessage(activeChat.id, messageInput);
      setMessageInput('');
      setIsTyping(false);
      sendTyping(activeChat.id, false);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const isPartnerTyping = typingUsers[activeChat?.id];

  if (!activeChat) {
    return null;
  }

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-partner-info">
          <div className="partner-avatar">
            {activeChat.name.charAt(0).toUpperCase()}
          </div>
          <div className="partner-details">
            <h3 className="partner-name">{activeChat.name}</h3>
            <p className="partner-status">
              {activeChat.role === 'employer' ? 
                `${activeChat.company || 'Company'}` : 
                'Job Seeker'
              }
            </p>
          </div>
        </div>
        
        <div className="chat-actions">
          <button className="action-btn" title="Voice Call">
            <Phone size={20} />
          </button>
          <button className="action-btn" title="Video Call">
            <Video size={20} />
          </button>
          <button className="action-btn" title="More Options">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="empty-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender_id === user?.id;
              const showAvatar = index === 0 || 
                messages[index - 1].sender_id !== message.sender_id;
              
              return (
                <div
                  key={message.id}
                  className={`message-item ${isOwn ? 'own' : 'partner'}`}
                >
                  {!isOwn && showAvatar && (
                    <div className="message-avatar">
                      {message.sender_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="message-content">
                    {!isOwn && showAvatar && (
                      <p className="message-sender">{message.sender_name}</p>
                    )}
                    <div className="message-bubble">
                      <p className="message-text">{message.message}</p>
                      <span className="message-time">
                        {formatMessageTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {/* Typing Indicator */}
          {isPartnerTyping && (
            <div className="message-item partner">
              <div className="message-avatar">
                {activeChat.name.charAt(0).toUpperCase()}
              </div>
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className="typing-text">{activeChat.name} is typing...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <form onSubmit={handleSendMessage} className="message-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              placeholder={`Message ${activeChat.name}...`}
              className="message-input"
              autoFocus
            />
            <button
              type="submit"
              className="send-button"
              disabled={!messageInput.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;