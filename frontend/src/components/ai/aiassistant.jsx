import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import aiService from '../../services/aiService';
import ChatWindow from './ChatWindow';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('cc_floating_ai_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached chat messages', e);
      }
    }
    return [
      {
        id: 'welcome_1',
        sender: 'assistant',
        text: '👋 Hi! I am your **Capacity Connect AI Assistant**.\n\nI can help you find available developers, analyze skills & capacity, or view course materials. How can I assist you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('cc_floating_ai_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (text) => {
    const userMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await aiService.chat(text);
      const botData = res.data || res;
      const botText = botData.answer || botData.reply || 'I processed your request.';
      const sources = botData.sources || [];

      const botReply = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: botText,
        sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: '⚠️ **Unable to connect to the AI service.**\nPlease ensure your Express backend is running on `http://localhost:5000`.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const welcome = {
      id: `welcome_${Date.now()}`,
      sender: 'assistant',
      text: 'Conversation cleared! What can I help you with next?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcome]);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-2xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/20 shadow-purple-500/30 ${
          isOpen ? 'rotate-90 scale-95' : 'rotate-0'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 bg-cyan-400 text-white rounded-full p-1 shadow-lg shadow-cyan-400/50">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
          </div>
        )}
      </button>

      {/* Chat Popup Window */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          onClearHistory={handleClearHistory}
          onClose={() => setIsOpen(false)}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default AIAssistant;
