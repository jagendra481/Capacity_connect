import React, { useState } from 'react';
import { Bot, User, Copy, Check, BookOpen } from 'lucide-react';
import FormattedMarkdown from '../common/FormattedMarkdown';

export const ChatMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-2.5 items-start mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} w-full`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      {/* Message Bubble */}
      <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative p-3 rounded-2xl text-xs backdrop-blur-md shadow-lg border break-words overflow-hidden ${
            isUser
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/30 rounded-br-none'
              : 'bg-slate-900/90 text-slate-200 border-slate-800 rounded-bl-none'
          }`}
        >
          {/* Render Formatted Markdown */}
          <FormattedMarkdown content={message.text} />

          {/* RAG Sources Citations */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-purple-300 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Source References:</span>
              </p>
              {message.sources.map((s, sIdx) => (
                <p key={sIdx} className="text-slate-400">
                  📚 {s.courseTitle} — <span className="text-slate-300 font-semibold">{s.source}</span>
                </p>
              ))}
            </div>
          )}

          {/* Copy Button */}
          {!isUser && (
            <button
              onClick={handleCopy}
              title="Copy message"
              className="absolute top-1.5 right-1.5 text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-500 mt-1 px-1">
          {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
