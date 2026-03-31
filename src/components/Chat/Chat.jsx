import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import UserSearch from './UserSearch';
import './Chat.css';
import { useLocation } from 'react-router-dom';

const Chat = () => {
  const { activeChat, loadConversations, loadUnreadCount, loadChatMessages } = useChat();
  const [showUserSearch, setShowUserSearch] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadConversations();
    loadUnreadCount();
  }, []);

  // If a partner query param is provided (e.g. /chat?partner=123), load that partner's messages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const partnerId = params.get('partner');
    if (partnerId) {
      // load messages for the partner
      loadChatMessages(partnerId);
    }
  }, [location.search]);

  return (
    <div className="msg-chat-container">
      <div className="msg-chat-layout">
        <div className="msg-chat-sidebar">
          <ChatSidebar 
            onNewChat={() => setShowUserSearch(true)}
          />
        </div>

        <div className="msg-chat-main">
          {activeChat ? (
            <ChatWindow />
          ) : (
            <div className="msg-chat-welcome">
              <div className="msg-welcome-content">
                <h2>Welcome to MedJobHub Chat</h2>
                <p>Select a conversation from the sidebar or start a new chat to begin messaging.</p>
                <button 
                  className="msg-btn-primary"
                  onClick={() => setShowUserSearch(true)}
                >
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUserSearch && (
        <UserSearch 
          onClose={() => setShowUserSearch(false)}
          onUserSelect={() => setShowUserSearch(false)}
        />
      )}
    </div>
  );
};

export default Chat;