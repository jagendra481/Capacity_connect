import React, { useRef, useEffect } from 'react';
import { X, Trash2, Bot, Sparkles, RotateCw } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export const ChatWindow = ({
  messages,
  onSendMessage,
  onClearHistory,
  onClose,
  isLoading,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 w-[380px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100vh-120px)] bg-slate-950/95 border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-white">Capacity AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Resource & Knowledge Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={onClearHistory}
              title="Clear chat history"
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            title="Close Assistant"
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">How can I help you?</h3>
            <p className="text-xs max-w-xs text-slate-400 leading-relaxed">
              Ask about team capacity, search developers by skill, or query course materials.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => <ChatMessage key={msg.id || index} message={msg} />)
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-950/30 p-2.5 rounded-xl border border-purple-500/20 w-max">
            <RotateCw className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing capacity and formulating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;
