import React from 'react';
import { Award, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import VerifyBadge from './VerifyBadge';

export const CertificateTemplate = ({ certificate }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Certificate Frame */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-500/40 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Background Watermark Decorative Crest */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Award className="w-96 h-96 text-amber-400" />
        </div>

        <div className="flex items-center justify-center space-x-2">
          <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
            <Award className="w-8 h-8" />
          </div>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
            CAPACITY CONNECT DIGITAL ACADEMY
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            Certificate of Accomplishment
          </h1>
          <p className="text-xs text-slate-400 mt-1">This official document verifies that</p>
        </div>

        <div className="py-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-300 underline underline-offset-8 decoration-brand-500/50">
            {certificate.user_name || 'Valued Trainee'}
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          has successfully demonstrated technical competency and met all performance criteria for the program:
        </p>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-slate-100">{certificate.title}</h3>
        </div>

        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end border-t border-slate-800/80 max-w-3xl mx-auto text-xs text-slate-400">
          <div className="text-left space-y-1">
            <p><span className="text-slate-500 font-semibold">Certificate ID:</span> <span className="font-mono text-slate-200 font-bold">{certificate.certificate_hash}</span></p>
            <p><span className="text-slate-500 font-semibold">Issue Date:</span> <span className="text-slate-200 font-medium">{new Date(certificate.issued_date).toLocaleDateString()}</span></p>
          </div>

          <div className="text-right space-y-1">
            <p className="font-bold text-slate-200">Director of Capacity Building</p>
            <p className="text-[10px] text-slate-500">Capacity Connect Enterprise Portal</p>
          </div>
        </div>

        <div className="pt-2">
          <VerifyBadge hash={certificate.certificate_hash} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <a
          href={certificate.verification_url}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-colors inline-flex items-center space-x-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
          <span>Public Verification Link</span>
        </a>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand-600/20 inline-flex items-center space-x-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF / Print</span>
        </button>
      </div>
    </div>
  );
};

export default CertificateTemplate;
