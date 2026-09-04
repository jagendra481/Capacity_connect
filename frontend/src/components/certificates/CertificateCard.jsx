import React from 'react';
import { Award, ShieldCheck, ArrowRight, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

export const CertificateCard = ({ certificate }) => {
  if (!certificate) return null;

  const status = certificate.status || 'approved';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 text-[10px] uppercase font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
            Official Certification
          </span>
          {status === 'approved' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
          {status === 'pending' && <Clock className="w-4 h-4 text-amber-400" />}
          {status === 'rejected' && <XCircle className="w-4 h-4 text-rose-400" />}
        </div>

        <h3 className="text-base font-bold text-slate-100">{certificate.title}</h3>
        <p className="text-xs font-mono text-slate-400">ID: {certificate.certificate_hash}</p>

        {/* Approval Status Badge */}
        <div>
          {status === 'approved' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ✓ Verified & Approved
            </span>
          )}
          {status === 'pending' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              ⏳ Pending Admin Approval
            </span>
          )}
          {status === 'rejected' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              ✕ Request Rejected
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <span className="text-slate-500">Issued: {formatDate(certificate.issued_date)}</span>
        <Link
          to={`/certificates/verify/${certificate.certificate_hash}`}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg transition-colors flex items-center space-x-1"
        >
          <span>View</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default CertificateCard;
