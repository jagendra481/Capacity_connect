import React, { useState } from 'react';
import QRCodeCanvas from './QRCodeCanvas';
import CertificateTemplate from './CertificateTemplate';
import {
  Award,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Share2,
  Calendar,
  CheckCircle2,
  X,
} from 'lucide-react';

export const CertificateCard = ({ certificate }) => {
  const [showModal, setShowModal] = useState(false);

  if (!certificate) return null;

  const certId = certificate.certificate_id || `MOES-2026-${(certificate.id || '').substring(0, 8).toUpperCase()}`;
  const courseTitle = certificate.course_name_snapshot || certificate.course_name || certificate.course?.title || 'Capacity Training Course';
  const issueDate = certificate.issue_date || certificate.created_at;
  const isApproved = certificate.status === 'approved';
  const isPending = certificate.status === 'pending_approval' || certificate.status === 'pending';
  const isRevoked = certificate.status === 'revoked';
  const isRejected = certificate.status === 'rejected';

  const verificationUrl = `${window.location.origin}/certificates/verify/${certId}`;

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between space-y-5 relative overflow-hidden group">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

        <div className="space-y-4">
          {/* Top Status & ID Bar */}
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-amber-400">
              {certId}
            </span>

            {isApproved && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-semibold">
                <Clock className="w-3 h-3" />
                <span>Pending Approval</span>
              </span>
            )}
            {isRevoked && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-semibold">
                <AlertTriangle className="w-3 h-3" />
                <span>Revoked</span>
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-semibold">
                <AlertTriangle className="w-3 h-3" />
                <span>Rejected</span>
              </span>
            )}
          </div>

          {/* Main Info */}
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2">
              {courseTitle}
            </h3>
            <p className="text-xs text-slate-400">
              Ministry of Earth Sciences • Official Credential
            </p>
          </div>

          {/* Mini QR + Issue Meta */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{issueDate ? new Date(issueDate).toLocaleDateString() : 'Completed'}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-mono">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>SHA-256 Tamper-Proof</span>
              </div>
            </div>

            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <QRCodeCanvas value={verificationUrl} size={48} fgColor="#020617" bgColor="#ffffff" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>View Certificate</span>
          </button>

          {isApproved ? (
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 shadow-md shadow-amber-600/20"
              title="Download Certificate"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div
              className="px-3 py-2 bg-slate-950 text-slate-600 rounded-xl text-[11px] font-semibold border border-slate-800"
              title="Certificate not yet approved by Administrator"
            >
              Pending Sign-Off
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Certificate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CertificateTemplate certificate={certificate} />
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateCard;
