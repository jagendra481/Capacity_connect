import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import knowledgeService from '../../services/knowledgeService';
import CommentSection from '../../components/knowledge/CommentSection';
import Loader from '../../components/common/Loader';
import { ArrowLeft, User, ThumbsUp, Tag, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPostDetails = () => {
    knowledgeService.getPostById(id)
      .then(res => {
        if (res.data) setPost(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const handleAddComment = async (commentText) => {
    await knowledgeService.addComment(id, commentText);
    fetchPostDetails();
  };

  const handleLike = async () => {
    await knowledgeService.toggleLike(id);
    setPost(prev => prev ? { ...prev, likes_count: (prev.likes_count || 0) + 1 } : prev);
  };

  if (loading) return <Loader size="large" message="Loading article details..." />;
  if (!post) return <div className="p-8 text-center text-slate-400">Post not found</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/knowledge" className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Knowledge Hub</span>
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 text-xs font-bold uppercase bg-brand-500/10 text-brand-400 rounded-lg border border-brand-500/20">
              {post.category}
            </span>
            <span className="text-xs text-slate-500">{formatDate(post.created_at)}</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-100 leading-snug">{post.title}</h1>

          <div className="flex items-center space-x-3 text-xs text-slate-400 pt-2">
            <User className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-slate-200">{post.author_name}</span>
            <span>•</span>
            <span>{post.author_role}</span>
          </div>
        </div>

        {/* Post Content Body */}
        <div className="text-sm text-slate-200 leading-relaxed space-y-4 font-normal">
          <p className="whitespace-pre-line">{post.content}</p>
        </div>

        {/* Tags & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            {(post.tags || []).map((t, idx) => (
              <span key={idx} className="px-2.5 py-1 text-[10px] uppercase font-bold bg-slate-950 text-slate-400 rounded border border-slate-800">
                #{t}
              </span>
            ))}
          </div>

          <button
            onClick={handleLike}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-brand-400 text-xs font-bold rounded-xl transition-colors flex items-center space-x-2"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likes_count || 0} Upvotes</span>
          </button>
        </div>

        {/* Peer Discussion Comments */}
        <div className="pt-4">
          <CommentSection comments={post.comments || []} onAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
