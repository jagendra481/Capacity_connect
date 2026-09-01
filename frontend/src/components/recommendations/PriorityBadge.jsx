import React from 'react';

export const PriorityBadge = ({ priority = 'HIGH' }) => {
  const styles = {
    CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
    HIGH: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    MEDIUM: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${styles[priority] || styles.HIGH}`}>
      {priority} Priority
    </span>
  );
};

export default PriorityBadge;
