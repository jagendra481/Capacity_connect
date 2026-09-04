import React, { useState } from 'react';
import QRCodeCanvas from './QRCodeCanvas';
import {
  Award,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Copy,
  Printer,
  ExternalLink,
  Building2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const CertificateTemplate = ({ certificate, isPublicView = false }) => {
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const certId = certificate.certificate_id || `MOES-2026-${(certificate.id || '').substring(0, 8).toUpperCase()}`;
  const traineeName = certificate.trainee_name_snapshot || certificate.trainee_name || certificate.user?.full_name || 'Authorized Trainee';
  const courseName = certificate.course_name_snapshot || certificate.course_name || certificate.course?.title || 'Advanced Capacity Building Course';
  const issueDate = certificate.issue_date || certificate.created_at || new Date().toISOString();
  const sha256 = certificate.sha256_hash || certificate.verification_hash || 'SHA256-AUTHENTICATED-TOKEN';
  const orgName = certificate.issuing_organization || 'Ministry of Earth Sciences, Govt. of India';
  const isApproved = certificate.status === 'approved';
  const isPending = certificate.status === 'pending_approval' || certificate.status === 'pending';
  const isRevoked = certificate.status === 'revoked';
  const isRejected = certificate.status === 'rejected';

  const verificationUrl = `${window.location.origin}/certificates/verify/${certId}`;

  const copyHash = () => {
    navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Actions Toolbar (Hidden in Print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          {isApproved && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official Active Credential</span>
            </span>
          )}
          {isPending && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Administrative Sign-Off</span>
            </span>
          )}
          {isRevoked && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Revoked Credential</span>
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Approval Rejected</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyHash}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
            title="Copy SHA-256 Hash"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Hash Copied!' : 'Copy SHA-256'}</span>
          </button>

          {isApproved && (
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center space-x-1.5 shadow-md shadow-amber-600/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Official Certificate Visual Document */}
      <div
        id="certificate-print-root"
        className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-8 border-double border-amber-500/40 rounded-3xl p-8 md:p-14 text-center shadow-2xl overflow-hidden print:border-amber-700 print:bg-white print:text-black print:p-8"
      >
        {/* Background Emblem Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none print:opacity-10">
          <Building2 className="w-96 h-96 text-amber-400" />
        </div>

        {/* Certificate Inner Frame */}
        <div className="relative space-y-6">
          {/* Header & National Emblem Branding */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Award className="w-7 h-7 text-slate-950" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-widest text-amber-400 uppercase print:text-amber-800">
              Government of India
            </p>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 tracking-tight print:text-slate-900">
              {orgName}
            </h2>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest print:text-slate-600">
              National Ocean & Atmospheric Sciences Capacity Development Mission
            </p>
          </div>

          <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto print:bg-amber-600" />

          {/* Certificate Title */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-amber-300 print:text-amber-900">
              Certificate of Completion
            </h1>
            <p className="text-xs text-slate-400 italic print:text-slate-600">
              This is to officially certify that
            </p>
          </div>

          {/* Trainee Name */}
          <div className="py-2">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide border-b-2 border-slate-800 inline-block px-8 pb-1 print:text-slate-900 print:border-slate-400">
              {traineeName}
            </h3>
          </div>

          {/* Course Details */}
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed print:text-slate-800">
              has successfully fulfilled all curriculum requirements, continuous competency evaluations, and practical assessments for
            </p>
            <h4 className="text-lg md:text-xl font-bold text-brand-300 print:text-slate-900">
              {courseName}
            </h4>
          </div>

          {/* Signatures & QR Section */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end text-center border-t border-slate-800/80 print:border-slate-400">
            {/* Left: Issue Date & ID */}
            <div className="space-y-1 text-left">
              <p className="text-[11px] text-slate-500 uppercase font-semibold print:text-slate-600">
                Date of Issue
              </p>
              <p className="text-xs font-bold text-slate-200 print:text-slate-900">
                {new Date(issueDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-[10px] font-mono text-amber-400 font-bold print:text-amber-800">
                ID: {certId}
              </p>
            </div>

            {/* Center: Tamper-Evident QR Code */}
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 bg-white rounded-xl shadow-lg inline-block">
                <QRCodeCanvas value={verificationUrl} size={96} fgColor="#0f172a" bgColor="#ffffff" />
              </div>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider print:text-slate-700">
                Scan to Verify Authenticity
              </p>
            </div>

            {/* Right: Authorizing Signatures */}
            <div className="space-y-1 text-right">
              <div className="h-10 flex items-center justify-end">
                <span className="font-serif italic text-base text-amber-400/90 font-bold print:text-slate-800">
                  Director General, MoES
                </span>
              </div>
              <div className="h-px w-36 bg-slate-700 ml-auto print:bg-slate-400" />
              <p className="text-[11px] font-bold text-slate-200 print:text-slate-900">
                Program Director
              </p>
              <p className="text-[9px] text-slate-500 uppercase print:text-slate-600">
                Capacity Building Commission
              </p>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash Footer */}
          <div className="pt-4 border-t border-slate-900 text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-500 print:text-slate-600">
            <div className="flex items-center space-x-1.5 truncate max-w-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">SHA-256: {sha256}</span>
            </div>
            <div className="text-right flex-shrink-0">
              <span>Security Level: Cryptographic Snapshot v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
