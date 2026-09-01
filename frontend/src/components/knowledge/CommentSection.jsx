import React, { useState } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const CommentSection = ({ comments = [], onAddComment }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await onAddComment(text);
    setText('');
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
        <MessageSquare className="w-4 h-4 text-purple-400" />
        <span>Peer Discussion & Answers ({comments.length})</span>
      </h4>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment or answer..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="px-4 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">{c.author_name}</span>
              <span className="text-[10px] text-slate-500">{formatDate(c.created_at)}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
