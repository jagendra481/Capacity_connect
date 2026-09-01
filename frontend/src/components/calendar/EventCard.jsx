import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, Users, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const EventCard = ({ session, onRSVP }) => {
  if (!session) return null;

  const [rsvped, setRsvped] = useState(false);
  const [count, setCount] = useState(session.rsvp_count || 0);

  const handleRSVP = (e) => {
    e.preventDefault();
    setRsvped(prev => !prev);
    setCount(prev => (rsvped ? prev - 1 : prev + 1));
    if (onRSVP) onRSVP(session.id);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-brand-500/40 transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-brand-500/10 text-brand-400 rounded border border-brand-500/20">
            {session.category} Workshop
          </span>
          <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{count} / {session.capacity} RSVPs</span>
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-100">{session.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{session.description}</p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="flex flex-col space-y-1 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-3.5 h-3.5 text-brand-400" />
            <span>{formatDate(session.start_time)}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Instructor: <strong className="text-slate-200">{session.trainer_name}</strong></span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {session.meeting_link && (
            <a
              href={session.meeting_link}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
            >
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Join Live Stream</span>
            </a>
          )}

          <button
            onClick={handleRSVP}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
              rsvped
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md'
            }`}
          >
            {rsvped && <CheckCircle className="w-3.5 h-3.5" />}
            <span>{rsvped ? 'RSVPeD' : 'RSVP Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
