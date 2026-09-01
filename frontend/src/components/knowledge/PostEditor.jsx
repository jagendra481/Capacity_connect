import React, { useState } from 'react';
import { Send, FileText } from 'lucide-react';

export const PostEditor = ({ onSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    onSubmit({ title, category, content, tags: tagArray });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
        <FileText className="w-5 h-5 text-brand-400" />
        <span>Publish Knowledge Post</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-400">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Best Practices for JWT Token Revocation"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
          >
            <option value="Engineering">Engineering</option>
            <option value="Database">Database</option>
            <option value="AI">AI</option>
            <option value="Security">Security</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-400">Content / Article Description</label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your peer-learning insights, architectural solutions, or technical code snippets..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-400">Tags (Comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="React, Microservices, Security"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand-600/20 flex items-center space-x-2"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Publishing...' : 'Publish Article'}</span>
      </button>
    </form>
  );
};

export default PostEditor;
