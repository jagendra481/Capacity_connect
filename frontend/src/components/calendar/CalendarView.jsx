import React from 'react';
import EventCard from './EventCard';

export const CalendarView = ({ sessions = [], onRSVP }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((s) => (
        <EventCard key={s.id} session={s} onRSVP={onRSVP} />
      ))}
    </div>
  );
};

export default CalendarView;
