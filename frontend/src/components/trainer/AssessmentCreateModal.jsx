import React, { useState } from 'react';
import Modal from '../common/Modal';

export const AssessmentCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState(30);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    setLoading(true);
    await onCreate({
      title,
      category,
      passing_score: parseInt(passingScore),
      time_limit_minutes: parseInt(timeLimit),
      description,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Technical Assessment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Assessment Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Distributed Node.js Microservices Evaluation"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              <option value="Engineering">Engineering</option>
              <option value="Database">Database</option>
              <option value="AI">AI</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Passing Target (%)</label>
            <input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Time Limit (Mins)</label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Objectives and topic coverage..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
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
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            {loading ? 'Creating...' : 'Create Assessment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssessmentCreateModal;
