import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Settings, MessageCircle, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { initializeChat, sendMessage, addMessage, clearMessages } from '../../store/slices/chatSlice';
import { buildWalletfyContext } from '../../utils/contextBuilder';
import { LLMConfig } from '../../types/chat';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import ChatSettings from './ChatSettings';

const ChatInterface: React.FC = () => {
  const dispatch = useAppDispatch();
  const { messages, isLoading, isModelReady, error } = useAppSelector(state => state.chat);
  const { events, balanceInicial } = useAppSelector(state => state.events);
  
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<LLMConfig>({
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 500,
    model: 'gpt-3.5-turbo',
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(initializeChat());
  }, [dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isModelReady || isLoading) return;

    const userMessage = {
      id: uuidv4(),
      role: 'user' as const,
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    dispatch(addMessage(userMessage));
    setInputMessage('');

    const context = buildWalletfyContext(events, balanceInicial);
    
    try {
      await dispatch(sendMessage({ 
        message: inputMessage.trim(), 
        context, 
        config 
      })).unwrap();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar el chat?')) {
      dispatch(clearMessages());
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Asistente Financiero
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isModelReady ? 'Listo para ayudarte' : 'Cargando modelo...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Configuración"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Limpiar chat"
            disabled={messages.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <ChatSettings
          config={config}
          onConfigChange={setConfig}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {!isModelReady && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Cargando modelo de chat...</span>
            </div>
          </div>
        )}

        {messages.length === 0 && isModelReady && (
          <div className="text-center py-8">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                ¡Hola! Soy tu asistente financiero
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Puedo ayudarte a analizar tus finanzas, dar consejos personalizados y responder preguntas sobre tu balance.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Pensando...</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isModelReady ? "Pregúntame sobre tus finanzas..." : "Esperando modelo..."}
              disabled={!isModelReady || isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !isModelReady || isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;