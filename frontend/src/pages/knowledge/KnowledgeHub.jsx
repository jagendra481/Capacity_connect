import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import knowledgeService from '../../services/knowledgeService';
import PostCard from '../../components/knowledge/PostCard';
import Loader from '../../components/common/Loader';
import { BookOpen, Plus, Search, Filter } from 'lucide-react';

export const KnowledgeHub = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchPosts = () => {
    setLoading(true);
    knowledgeService.getPosts(search, category)
      .then(res => {
        if (res.data) setPosts(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            <span>Knowledge Sharing Hub</span>
          </h1>
          <p className="text-sm text-slate-400">
            Peer-to-peer technical articles, Q&A discussions, and organizational code snippets
          </p>
        </div>

        <Link
          to="/knowledge/create"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Knowledge Article</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-4 justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles, Q&A, and technical topics..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Database">Database</option>
            <option value="AI">AI</option>
            <option value="Security">Security</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <Loader message="Fetching knowledge posts..." />
      ) : posts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          No knowledge articles found matching your query.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeHub;
