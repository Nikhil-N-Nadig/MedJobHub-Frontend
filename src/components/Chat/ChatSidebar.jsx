import React, { useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Plus, Search } from 'lucide-react';

const ChatSidebar = ({ onNewChat }) => {
  const { 
    conversations, 
    unreadConversations, 
    loadChatMessages, 
    activeChat,
    loading 
  } = useChat();

  const formatLastSeen = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getUnreadCount = (partnerId) => {
    const unreadConv = unreadConversations.find(conv => conv.sender_id === partnerId);
    return unreadConv ? unreadConv.count : 0;
  };

  const handleConversationClick = (conversation) => {
    loadChatMessages(conversation.partner_id);
  };

  if (loading) {
    return (
      <div className="chat-sidebar-container">
        <div className="sidebar-header">
          <h3>Messages</h3>
          <button className="new-chat-btn" onClick={onNewChat}>
            <Plus size={20} />
          </button>
        </div>
        <div className="loading-conversations">
          <div className="loading-spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-sidebar-container">
      <div className="sidebar-header">
        <h3>Messages</h3>
        <button className="new-chat-btn" onClick={onNewChat} title="Start new chat">
          <Plus size={20} />
        </button>
      </div>

      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <MessageCircle size={48} className="empty-icon" />
            <p>No conversations yet</p>
            <button className="btn-secondary" onClick={onNewChat}>
              Start your first chat
            </button>
          </div>
        ) : (
          conversations.map((conversation) => {
            const unreadCount = getUnreadCount(conversation.partner_id);
            const isActive = activeChat?.id === conversation.partner_id;
            
            return (
              <div
                key={conversation.partner_id}
                className={`conversation-item ${isActive ? 'active' : ''}`}
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="conversation-avatar">
                  <div className="avatar-circle">
                    {conversation.partner_name.charAt(0).toUpperCase()}
                  </div>
                  {unreadCount > 0 && (
                    <div className="unread-badge">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="conversation-content">
                  <div className="conversation-header">
                    <h4 className="partner-name">{conversation.partner_name}</h4>
                    <span className="conversation-time">
                      {formatLastSeen(conversation.last_timestamp)}
                    </span>
                  </div>
                  
                  <div className="conversation-details">
                    <p className="partner-role">
                      {conversation.partner_role === 'employer' ? 
                        `${conversation.partner_company || 'Company'}` : 
                        'Job Seeker'
                      }
                    </p>
                    <p className={`last-message ${unreadCount > 0 ? 'unread' : ''}`}>
                      {conversation.last_message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;