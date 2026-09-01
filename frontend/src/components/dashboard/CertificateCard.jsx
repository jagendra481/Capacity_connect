import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CertificateCard = ({ certificate }) => {
  if (!certificate) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-200">{certificate.title}</h5>
          <p className="text-xs text-slate-500">Issued: {certificate.issued_date} • ID: {certificate.id}</p>
        </div>
      </div>
      <Link
        to={certificate.verification_url || '/trainee/certificates'}
        className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors"
        title="Verify Certificate"
      >
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default CertificateCard;
