import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Tag, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

export const PostCard = ({ post, onLike }) => {
  if (!post) return null;

  const [likes, setLikes] = useState(post.likes_count || 0);

  const handleLikeClick = (e) => {
    e.preventDefault();
    setLikes(prev => prev + 1);
    if (onLike) onLike(post.id);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <User className="w-3.5 h-3.5 text-brand-400" />
          <span className="font-bold text-slate-200">{post.author_name}</span>
          <span>•</span>
          <span className="text-slate-400">{post.author_role}</span>
        </div>
        <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
          {post.category}
        </span>
      </div>

      <div>
        <Link to={`/knowledge/posts/${post.id}`}>
          <h3 className="text-lg font-bold text-slate-100 hover:text-brand-300 transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
          {post.content}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLikeClick}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-brand-400 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="font-semibold">{likes}</span>
          </button>
          <Link
            to={`/knowledge/posts/${post.id}`}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-purple-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-semibold">{post.comments_count || 0} Comments</span>
          </Link>
        </div>

        <div className="flex items-center space-x-1 text-[10px] text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
