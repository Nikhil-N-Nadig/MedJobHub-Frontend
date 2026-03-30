import React from 'react';
import { MessageCircle, Building } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './MessageEmployerButton.css';

const MessageEmployerButton = ({ application }) => {
  const { startChat, loadChatMessages } = useChat();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);

  const handleStartChat = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const employerId = application.job.posted_by;
    if (user.id === employerId) {
      return; 
    }

    if (!employerId) {
      console.error('Employer ID is missing');
      return;
    }

    try {
      await startChat(employerId);
      // ensure messages for this partner are loaded so Chat shows the correct thread immediately
      await loadChatMessages(employerId);
      navigate(`/chat?partner=${employerId}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  // Hide button if not logged in or trying to chat with self or missing employer
  if (!user || user.id === application.job.posted_by || !application.job.posted_by) {
    return null;
  }

  const companyName = application.job.company_name || application.job.employer_name || "Employer";

  return (
    <button 
      className="msg-message-employer-btn"
      onClick={handleStartChat}
      title={`Send message to ${companyName}`}
    >
      <div className="msg-btn-content">
        {/* Only show message icon for employers, not job seekers */}
        {user.role === 'employer' && (
          <div className="msg-btn-icon">
            <MessageCircle size={18} />
          </div>
        )}
        <div className="msg-btn-text">
          <span className="msg-btn-title">Message Employer</span>
          <span className="msg-btn-subtitle">
            <Building size={12} />
            {companyName}
          </span>
        </div>
      </div>
    </button>
  );
};

export default MessageEmployerButton;