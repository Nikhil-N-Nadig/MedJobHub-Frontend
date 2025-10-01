import React from 'react';
import { MessageCircle, Building } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './MessageEmployerButton.css';

const MessageEmployerButton = ({ application }) => {
  const { startChat } = useChat();
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
      navigate('/chat');
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  if (!user || user.id === application.job.posted_by || !application.job.posted_by) {
    return null;
  }

  const companyName = application.job.company_name || application.job.employer_name || "Employer";

  return (
    <button 
      className="message-employer-btn"
      onClick={handleStartChat}
      title={`Send message to ${companyName}`}
    >
      <div className="btn-content">
        <div className="btn-icon">
          <MessageCircle size={18} />
        </div>
        <div className="btn-text">
          <span className="btn-title">Message Employer</span>
          <span className="btn-subtitle">
            <Building size={12} />
            {companyName}
          </span>
        </div>
      </div>
    </button>
  );
};

export default MessageEmployerButton;