import React, { useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Search } from 'lucide-react';

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
    const unreadConv = (Array.isArray(unreadConversations) ? unreadConversations : []).find(
      (conv) => conv.sender_id === partnerId
    );
    return unreadConv ? unreadConv.count : 0;
  };

  // compute total unread messages for header badge
  const totalUnread = (Array.isArray(unreadConversations) ? unreadConversations : []).reduce(
    (sum, conv) => sum + (Number(conv.count) || 0),
    0
  );

  const handleConversationClick = (conversation) => {
    loadChatMessages(conversation.partner_id);
  };

  if (loading) {
    return (
      <div className="msg-chat-sidebar-container">
        <div className="msg-sidebar-header">
          <h3>Messages</h3>
          <button className="msg-new-chat-btn" onClick={onNewChat}>
            <Plus size={20} />
          </button>
        </div>
        <div className="msg-loading-conversations">
          <div className="msg-loading-spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="msg-chat-sidebar-container">
      <div className="msg-sidebar-header">
        <h3>
          Messages
          {totalUnread > 0 && (
            <span className="msg-header-unread-badge" title={`${totalUnread} unread messages`}>
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </h3>
        <button className="msg-new-chat-btn" onClick={onNewChat} title="Start new chat">
          <Plus size={20} />
        </button>
      </div>

      <div className="msg-conversations-list">
        {conversations.length === 0 ? (
          <div className="msg-empty-conversations">
            <p className="msg-empty-text">No conversations yet</p>
             <button className="msg-btn-secondary" onClick={onNewChat}>
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
                 className={`msg-conversation-item ${isActive ? 'active' : ''}`}
                 onClick={() => handleConversationClick(conversation)}
               >
                 <div className="msg-conversation-avatar">
                   <div className="msg-avatar-circle">
                     {conversation.partner_name.charAt(0).toUpperCase()}
                   </div>
                   {unreadCount > 0 && (
                     <div className="msg-unread-badge">
                       {unreadCount > 99 ? '99+' : unreadCount}
                     </div>
                   )}
                 </div>
                 
                 <div className="msg-conversation-content">
                   <div className="msg-conversation-header">
                     <h4 className="msg-partner-name">{conversation.partner_name}</h4>
                     <span className="msg-conversation-time">
                       {formatLastSeen(conversation.last_timestamp)}
                     </span>
                   </div>
                   
                   <div className="msg-conversation-details">
                     <p className="msg-partner-role">
                       {conversation.partner_role === 'employer' ? 
                         `${conversation.partner_company || 'Company'}` : 
                         'Job Seeker'
                       }
                     </p>
                     <p className={`msg-last-message ${unreadCount > 0 ? 'unread' : ''}`}>
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