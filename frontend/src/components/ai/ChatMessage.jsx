import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, Copy, Check, BookOpen, ExternalLink } from 'lucide-react';

export const ChatMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      let content = line;

      // First parse markdown links [Text](url)
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      const linkParts = [];
      let lastLinkIdx = 0;
      let linkMatch;

      while ((linkMatch = linkRegex.exec(content)) !== null) {
        if (linkMatch.index > lastLinkIdx) {
          linkParts.push({ type: 'text', text: content.substring(lastLinkIdx, linkMatch.index) });
        }
        linkParts.push({ type: 'link', label: linkMatch[1], url: linkMatch[2] });
        lastLinkIdx = linkRegex.lastIndex;
      }
      if (lastLinkIdx < content.length) {
        linkParts.push({ type: 'text', text: content.substring(lastLinkIdx) });
      }

      // Helper to render bold markdown **text** within text parts
      const renderTextWithBold = (txt, keyPrefix) => {
        const parts = [];
        let lastIdx = 0;
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;

        while ((match = boldRegex.exec(txt)) !== null) {
          if (match.index > lastIdx) {
            parts.push(txt.substring(lastIdx, match.index));
          }
          parts.push(
            <strong key={`${keyPrefix}_${match.index}`} className="text-white font-semibold">
              {match[1]}
            </strong>
          );
          lastIdx = boldRegex.lastIndex;
        }
        if (lastIdx < txt.length) {
          parts.push(txt.substring(lastIdx));
        }
        return parts.length > 0 ? parts : txt;
      };

      const renderedLine = linkParts.map((item, pIdx) => {
        if (item.type === 'link') {
          const isInternal = item.url.startsWith('/');
          if (isInternal) {
            return (
              <Link
                key={pIdx}
                to={item.url}
                className="inline-flex items-center gap-1 font-bold text-purple-300 hover:text-purple-100 bg-purple-500/20 hover:bg-purple-500/30 px-2 py-0.5 rounded-md border border-purple-500/30 transition-all text-[11px] sm:text-xs"
              >
                <span>{item.label}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </Link>
            );
          }
          return (
            <a
              key={pIdx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-cyan-300 hover:underline text-[11px] sm:text-xs"
            >
              <span>{item.label}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          );
        }
        return renderTextWithBold(item.text, `part_${pIdx}`);
      });

      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');

      return (
        <div
          key={idx}
          className={`${idx > 0 ? (isBullet ? 'mt-1' : 'mt-2') : ''} ${isBullet ? 'pl-2' : ''} leading-relaxed`}
        >
          {renderedLine}
        </div>
      );
    });
  };

  return (
    <div className={`flex gap-3 items-start mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div className={`max-w-[84%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative p-3.5 rounded-2xl text-xs sm:text-sm backdrop-blur-md shadow-lg border break-words ${
            isUser
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/30 rounded-br-none'
              : 'bg-slate-900/90 text-slate-200 border-slate-800 rounded-bl-none'
          }`}
        >
          {renderFormattedText(message.text)}

          {/* RAG Sources Citations */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-purple-300 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
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
              className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
