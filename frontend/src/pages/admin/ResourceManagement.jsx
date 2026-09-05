import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  FolderArchive,
  Plus,
  Edit3,
  Trash2,
  Video,
  FileText,
  Presentation,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';

export const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_type: 'video', // video, presentation, pdf, guide
    course_id: '',
    file_url: '',
    duration_or_pages: '',
    tags: '',
  });

  const fetchResourcesAndCourses = async () => {
    setLoading(true);
    try {
      const [resList, courseList] = await Promise.all([
        adminService.getResources({ type: typeFilter }).catch(() => ({ data: [] })),
        adminService.getCourses().catch(() => ({ data: [] })),
      ]);

      if (resList?.data) setResources(Array.isArray(resList.data) ? resList.data : []);
      if (courseList?.data) setCourses(Array.isArray(courseList.data) ? courseList.data : []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourcesAndCourses();
  }, [typeFilter]);

  const showFeedbackMsg = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
      const payload = { ...formData, tags: tagsArray };

      if (editingResource) {
        await adminService.updateResource(editingResource.id, payload);
        showFeedbackMsg('success', `Resource "${formData.title}" updated.`);
      } else {
        await adminService.createResource(payload);
        showFeedbackMsg('success', `New resource "${formData.title}" uploaded.`);
      }

      setShowCreateModal(false);
      setEditingResource(null);
      fetchResourcesAndCourses();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  const handleDeleteResource = async (id, title) => {
    if (!window.confirm(`Delete learning resource "${title}"?`)) return;
    try {
      await adminService.deleteResource(id);
      showFeedbackMsg('success', `Resource "${title}" deleted.`);
      fetchResourcesAndCourses();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  const filtered = resources.filter((r) =>
    (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 mb-2">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Learning Resource Library</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Digital Curriculum & Resource Repository
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Administer video lectures, PowerPoint presentations, research PDFs, dataset schemas, and study guides.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingResource(null);
            setFormData({
              title: '',
              description: '',
              resource_type: 'video',
              course_id: courses[0]?.id || 101,
              file_url: '',
              duration_or_pages: '',
              tags: '',
            });
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2 border border-purple-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Resource</span>
        </button>
      </div>

      {feedback.message && (
        <div className="p-4 rounded-xl border text-xs font-semibold flex items-center space-x-2 bg-purple-500/10 border-purple-500/30 text-purple-300">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {['', 'video', 'presentation', 'pdf', 'guide'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                typeFilter === t
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t ? t : 'All Types'}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 w-64 outline-none focus:border-purple-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Resource Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader size="medium" message="Fetching learning resources..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No learning resources found matching your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Linked Course</th>
                  <th className="py-3.5 px-4">Duration / Size</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((r) => {
                  const Icon =
                    r.resource_type === 'video'
                      ? Video
                      : r.resource_type === 'presentation'
                      ? Presentation
                      : FileText;

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100">{r.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{r.description}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">
                          {r.course_title || `Course #${r.course_id}`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-400 font-mono text-[11px]">
                          {r.duration_or_pages || 'N/A'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {r.file_url && (
                            <a
                              href={r.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-lg"
                              title="Open File URL"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteResource(r.id, r.title)}
                            className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Resource */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FolderArchive className="w-5 h-5 text-purple-400" />
                <span>Upload Learning Resource</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Hydrodynamics and Altimetry Handbook"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Type *</label>
                  <select
                    value={formData.resource_type}
                    onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="video">Video Lecture</option>
                    <option value="presentation">Presentation (PPT)</option>
                    <option value="pdf">Document (PDF)</option>
                    <option value="guide">Study Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Linked Course *</label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">File URL / Video Embed Link</label>
                <input
                  type="text"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://cloud-storage.moes.gov.in/resources/altimetry.pdf"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Duration / Pages</label>
                  <input
                    type="text"
                    value={formData.duration_or_pages}
                    onChange={(e) => setFormData({ ...formData, duration_or_pages: e.target.value })}
                    placeholder="e.g. 45 Mins or 78 Pages"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g. Satellite, Radar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
