import React from 'react';
import { Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

export const CertificateCard = ({ certificate }) => {
  if (!certificate) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 text-[10px] uppercase font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
            Official Certification
          </span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>

        <h3 className="text-base font-bold text-slate-100">{certificate.title}</h3>
        <p className="text-xs font-mono text-slate-400">ID: {certificate.certificate_hash}</p>
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
