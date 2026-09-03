import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Clean, lightweight, responsive Markdown Renderer component for AI responses
 */
export const FormattedMarkdown = ({ content = '' }) => {
  if (!content || typeof content !== 'string') return null;

  const lines = content.split('\n');
  const renderedElements = [];
  let inList = false;
  let listItems = [];

  const parseInlineMarkdown = (text) => {
    if (!text) return null;

    // Pattern for markdown links [label](url), bold **text**, and code `code`
    const parts = [];
    let lastIndex = 0;
    
    // Match [label](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    let processedText = text;

    // Helper to split text by bold **text**
    const renderBold = (rawStr) => {
      const boldParts = rawStr.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-semibold text-slate-100">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    // Helper to render inline links or standard bold text
    let keyIdx = 0;
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderBold(text.substring(lastIndex, match.index)));
      }

      const label = match[1];
      const url = match[2];

      if (url.startsWith('/')) {
        parts.push(
          <Link
            key={`link_${keyIdx++}`}
            to={url}
            className="text-cyan-400 font-semibold hover:underline inline-flex items-center space-x-1"
          >
            <span>{label}</span>
          </Link>
        );
      } else {
        parts.push(
          <a
            key={`link_${keyIdx++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 font-semibold underline hover:text-cyan-300"
          >
            {label}
          </a>
        );
      }

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(renderBold(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : renderBold(text);
  };

  const flushList = (key) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={key} className="space-y-1.5 my-2 pl-2 border-l-2 border-cyan-500/30">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2 leading-relaxed">
              <span className="text-cyan-400 font-bold flex-shrink-0 mt-0.5">•</span>
              <span>{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Blank line
    if (!trimmed) {
      flushList(`list_${index}`);
      return;
    }

    // Headers: ### Header or ## Header
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      flushList(`list_${index}`);
      const headerText = trimmed.replace(/^#+\s*/, '');
      renderedElements.push(
        <h3 key={index} className="text-sm font-bold text-slate-100 mt-3 mb-1.5 tracking-tight flex items-center space-x-2">
          <span>{parseInlineMarkdown(headerText)}</span>
        </h3>
      );
      return;
    }

    // Bullet list items: • item or - item or * item
    if (/^[•\-\*]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[•\-\*]\s+/, '');
      listItems.push(itemText);
      return;
    }

    // Numbered list items: 1. item
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      listItems.push(itemText);
      return;
    }

    // Standard paragraph line
    flushList(`list_${index}`);
    renderedElements.push(
      <p key={index} className="text-xs text-slate-300 leading-relaxed my-1">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList(`list_final`);

  return <div className="space-y-1 w-full overflow-hidden break-words">{renderedElements}</div>;
};

export default FormattedMarkdown;
