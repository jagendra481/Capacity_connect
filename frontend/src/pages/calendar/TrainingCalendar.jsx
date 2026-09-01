import React, { useState, useEffect } from 'react';
import calendarService from '../../services/calendarService';
import CalendarView from '../../components/calendar/CalendarView';
import EventModal from '../../components/calendar/EventModal';
import Loader from '../../components/common/Loader';
import { Calendar as CalendarIcon, Plus, Video, Filter } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const TrainingCalendar = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchSessions = () => {
    calendarService.getSessions()
      .then(res => {
        if (res.data) setSessions(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRSVP = async (id) => {
    await calendarService.toggleRSVP(id);
  };

  const handleCreateSession = async (data) => {
    await calendarService.createSession(data);
    fetchSessions();
  };

  const isTrainerOrAdmin = user?.role === 'trainer' || user?.role === 'administrator';

  const filteredSessions = selectedCategory
    ? sessions.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase())
    : sessions;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-brand-400" />
            <span>Interactive Training Calendar</span>
          </h1>
          <p className="text-sm text-slate-400">
            Schedule workshops, webinars, RSVP live sessions, and join video streams
          </p>
        </div>

        {isTrainerOrAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Workshop</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">Filter Upcoming Webinars:</span>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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

      {loading ? (
        <Loader message="Loading training schedule..." />
      ) : (
        <CalendarView sessions={filteredSessions} onRSVP={handleRSVP} />
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSession}
      />
    </div>
  );
};

export default TrainingCalendar;
