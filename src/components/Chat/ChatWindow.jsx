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
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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
    <div className="msg-chat-window">
      {/* Chat Header */}
      <div className="msg-chat-header">
        <div className="msg-chat-partner-info">
          <div className="msg-partner-avatar">
            {activeChat.name.charAt(0).toUpperCase()}
          </div>
          <div className="msg-partner-details">
            <h3 className="msg-partner-name">{activeChat.name}</h3>
            <p className="msg-partner-status">
              {activeChat.role === 'employer' ? 
                `${activeChat.company || 'Company'}` : 
                'Job Seeker'
              }
            </p>
          </div>
        </div>
        
        <div className="msg-chat-actions">
          <button className="msg-action-btn" title="Voice Call">
            <Phone size={20} />
          </button>
          <button className="msg-action-btn" title="Video Call">
            <Video size={20} />
          </button>
          <button className="msg-action-btn" title="More Options">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="msg-messages-container">
        <div className="msg-messages-list">
          {messages.length === 0 ? (
            <div className="msg-empty-messages">
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
                  className={`msg-message-item ${isOwn ? 'msg-own' : 'msg-partner'}`}
                >
                  {!isOwn && showAvatar && (
                    <div className="msg-message-avatar">
                      {message.sender_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="msg-message-content">
                    {!isOwn && showAvatar && (
                      <p className="msg-message-sender">{message.sender_name}</p>
                    )}
                    <div className="msg-message-bubble">
                      <p className="msg-message-text">{message.message}</p>
                      <span className="msg-message-time">
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
            <div className="msg-message-item msg-partner">
              <div className="msg-message-avatar">
                {activeChat.name.charAt(0).toUpperCase()}
              </div>
              <div className="msg-typing-indicator">
                <div className="msg-typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className="msg-typing-text">{activeChat.name} is typing...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="msg-message-input-container">
        <form onSubmit={handleSendMessage} className="msg-message-form">
          <div className="msg-input-wrapper">
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              placeholder={`Message ${activeChat.name}...`}
              className="msg-message-input"
              autoFocus
            />
            <button
              type="submit"
              className="msg-send-button"
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