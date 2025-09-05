import React from 'react';
import ChatInterface from '../components/chat/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Asistente Financiero Inteligente
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Conversa con tu asistente personal para obtener insights sobre tus finanzas
        </p>
      </div>
      
      <div className="h-[calc(100%-5rem)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;