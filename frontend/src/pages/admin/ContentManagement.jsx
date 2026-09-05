import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  BellRing,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Users,
  Radio,
} from 'lucide-react';

export const ContentManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_audience: 'all', // all, trainee, trainer, administrator
    priority: 'medium', // low, medium, high, critical
    is_published: true,
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAnnouncements();
      if (res?.data) {
        setAnnouncements(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const showFeedbackMsg = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await adminService.createAnnouncement(formData);
      showFeedbackMsg('success', 'Announcement published successfully.');
      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        target_audience: 'all',
        priority: 'medium',
        is_published: true,
      });
      fetchAnnouncements();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    try {
      await adminService.deleteAnnouncement(id);
      showFeedbackMsg('success', 'Announcement removed.');
      fetchAnnouncements();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold border border-pink-500/20 mb-2">
            <BellRing className="w-3.5 h-3.5" />
            <span>Portal Broadcasts & Notices</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Announcements & Content Management
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Broadcast operational notices, training schedules, and institutional directives to all portal members.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2 border border-pink-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {feedback.message && (
        <div className="p-4 rounded-xl border text-xs font-semibold flex items-center space-x-2 bg-pink-500/10 border-pink-500/30 text-pink-300">
          <CheckCircle2 className="w-4 h-4 text-pink-400" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center">
            <Loader size="medium" message="Fetching announcements..." />
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No announcements published yet.
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{a.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      a.priority === 'critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : a.priority === 'high'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {a.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">{a.content}</p>
                </div>

                <button
                  onClick={() => handleDelete(a.id, a.title)}
                  className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span>Audience: <span className="text-slate-300 font-bold uppercase">{a.target_audience}</span></span>
                <span>{new Date(a.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: New Announcement */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <BellRing className="w-5 h-5 text-pink-400" />
                <span>Create Portal Announcement</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. National Oceanographic Workshop Scheduled for October"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed notice text..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Audience</label>
                  <select
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-pink-500 font-bold"
                  >
                    <option value="all">All Users</option>
                    <option value="trainee">Trainees Only</option>
                    <option value="trainer">Trainers Only</option>
                    <option value="administrator">Administrators Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-pink-500 font-bold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical Directive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
