import React from 'react';

export const CapacityRiskBadge = ({ level = 'MEDIUM_RISK' }) => {
  const styles = {
    LOW_RISK: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    MEDIUM_RISK: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    CRITICAL_RISK: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const labels = {
    LOW_RISK: 'Low Capacity Risk',
    MEDIUM_RISK: 'Moderate Gap Risk',
    CRITICAL_RISK: 'Critical Gap Risk',
  };

  return (
    <span className={`px-3 py-1 text-[10px] uppercase font-extrabold rounded-full border ${styles[level] || styles.MEDIUM_RISK}`}>
      {labels[level] || 'Moderate Gap Risk'}
    </span>
  );
};

export default CapacityRiskBadge;
