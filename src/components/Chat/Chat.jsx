import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import UserSearch from './UserSearch';
import './Chat.css';

const Chat = () => {
  const { activeChat, loadConversations, loadUnreadCount } = useChat();
  const [showUserSearch, setShowUserSearch] = useState(false);

  useEffect(() => {
    loadConversations();
    loadUnreadCount();
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-layout">
        <div className="chat-sidebar">
          <ChatSidebar 
            onNewChat={() => setShowUserSearch(true)}
          />
        </div>

        <div className="chat-main">
          {activeChat ? (
            <ChatWindow />
          ) : (
            <div className="chat-welcome">
              <div className="welcome-content">
                <h2>Welcome to MedJobHub Chat</h2>
                <p>Select a conversation from the sidebar or start a new chat to begin messaging.</p>
                <button 
                  className="btn-primary"
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