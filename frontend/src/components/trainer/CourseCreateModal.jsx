import React, { useState } from 'react';
import Modal from '../common/Modal';
import { BookOpen, Plus } from 'lucide-react';

export const CourseCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [level, setLevel] = useState('Intermediate');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    setLoading(true);
    await onCreate({ title, category, level, description });
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Training Course">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Advanced System Architecture"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Difficulty Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Course Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive description of learning objectives, prerequisites, and curriculum..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseCreateModal;
