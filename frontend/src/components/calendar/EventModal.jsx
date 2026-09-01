import React, { useState } from 'react';
import Modal from '../common/Modal';

export const EventModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [meetingLink, setMeetingLink] = useState('https://meet.capacityconnect.com/live');
  const [startTime, setStartTime] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startTime) return;
    setLoading(true);
    await onCreate({
      title,
      category,
      meeting_link: meetingLink,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(new Date(startTime).getTime() + 3600000).toISOString(),
      capacity: parseInt(capacity),
      description,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Training Session">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Session Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Advanced AI System Fine-Tuning"
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
            <label className="text-xs font-semibold text-slate-400">Start Date & Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Meeting Stream Link</label>
            <input
              type="text"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Participant Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Session Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Agenda, prerequisites, and workshop goals..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
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
            {loading ? 'Scheduling...' : 'Schedule Workshop'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
