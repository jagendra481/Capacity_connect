import React, { useState, useEffect } from 'react';
import certificateService from '../../services/certificateService';
import CertificateApprovalTable from '../../components/admin/CertificateApprovalTable';
import Loader from '../../components/common/Loader';
import { Award, ShieldCheck, Clock, XCircle, RefreshCw, ExternalLink, CheckCircle2 } from 'lucide-react';

export const CertificateManagement = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await certificateService.getAllCertificatesAdmin();
      if (res.data) {
        setCerts(res.data);
      }
    } catch (err) {
      console.error('Cannot fetch admin certificates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, reason) => {
    await certificateService.approveCertificateAdmin(id, reason);
    showFeedback('Certificate approved successfully.');
    fetchCertificates();
  };

  const handleReject = async (id, reason) => {
    await certificateService.rejectCertificateAdmin(id, reason);
    showFeedback('Certificate request rejected.');
    fetchCertificates();
  };

  const handleRevoke = async (id, reason) => {
    await certificateService.revokeCertificateAdmin(id, reason);
    showFeedback('Certificate revoked.');
    fetchCertificates();
  };

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const total = certs.length;
  const pending = certs.filter(c => c.status === 'pending_approval' || c.status === 'pending').length;
  const approved = certs.filter(c => (c.status || 'approved') === 'approved').length;
  const rejectedOrRevoked = certs.filter(c => c.status === 'rejected' || c.status === 'revoked').length;

  if (loading) return <Loader size="large" message="Loading Admin Certificate Governance Console..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2.5">
            <Award className="w-7 h-7 text-amber-400" />
            <span>Certificate Management & Approval</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official Ministry of Earth Sciences completion credentials audit, review, and verification
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="/certificates/verify"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors inline-flex items-center space-x-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
            <span>Public Verifier</span>
          </a>
          <button
            onClick={fetchCertificates}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-600/20 inline-flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Registered</span>
            <Award className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{total}</p>
          <p className="text-[11px] text-slate-500">All issued and pending credentials</p>
        </div>
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400">Pending Approval</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{pending}</p>
          <p className="text-[11px] text-amber-500/80">Requires administrator review</p>
        </div>
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">Approved & Valid</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{approved}</p>
          <p className="text-[11px] text-emerald-500/80">Cryptographically active</p>
        </div>
        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400">Rejected / Revoked</span>
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400">{rejectedOrRevoked}</p>
          <p className="text-[11px] text-rose-500/80">Invalidated credentials</p>
        </div>
      </div>

      <CertificateApprovalTable
        certificates={certs}
        onApprove={handleApprove}
        onReject={handleReject}
        onRevoke={handleRevoke}
        refreshData={fetchCertificates}
      />
    </div>
  );
};

export default CertificateManagement;
