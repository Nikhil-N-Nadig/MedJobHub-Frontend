import React from 'react';
import Chat from '../../components/Chat/Chat';
import { ChatProvider } from '../../context/ChatContext';

const ChatPage = () => {
  return (
    <ChatProvider>
      <div className="chat-page">
        <Chat />
      </div>
    </ChatProvider>
  );
};

export default ChatPage;