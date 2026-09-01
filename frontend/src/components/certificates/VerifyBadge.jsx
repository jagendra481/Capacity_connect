import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const VerifyBadge = ({ hash }) => {
  return (
    <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-bold">
      <ShieldCheck className="w-4 h-4" />
      <span>Cryptographically Verified ({hash})</span>
    </div>
  );
};

export default VerifyBadge;
