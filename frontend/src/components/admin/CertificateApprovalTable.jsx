import React, { useState } from 'react';
import certificateService from '../../services/certificateService';
import QRCodeCanvas from '../certificates/QRCodeCanvas';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Calendar,
  X,
  FileText,
} from 'lucide-react';

export const CertificateApprovalTable = ({
  certificates = [],
  onApprove,
  onReject,
  onRevoke,
  refreshData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCert, setSelectedCert] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject' | 'revoke'
  const [reasonInput, setReasonInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Audit trail modal state
  const [auditCert, setAuditCert] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const filtered = certificates.filter((c) => {
    const term = searchTerm.toLowerCase();
    const idMatch = (c.certificate_id || '').toLowerCase().includes(term);
    const traineeMatch = (c.trainee_name_snapshot || c.trainee_name || c.user?.full_name || '').toLowerCase().includes(term);
    const courseMatch = (c.course_name_snapshot || c.course_name || c.course?.title || '').toLowerCase().includes(term);
    const matchesSearch = idMatch || traineeMatch || courseMatch;

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && c.status === statusFilter;
  });

  const handleOpenAction = (cert, type) => {
    setSelectedCert(cert);
    setActionType(type);
    setReasonInput('');
  };

  const handleConfirmAction = async () => {
    if (!selectedCert || !actionType) return;
    setActionLoading(true);
    try {
      if (actionType === 'approve') {
        await onApprove(selectedCert.id, reasonInput);
      } else if (actionType === 'reject') {
        await onReject(selectedCert.id, reasonInput);
      } else if (actionType === 'revoke') {
        await onRevoke(selectedCert.id, reasonInput);
      }
      setSelectedCert(null);
      setActionType(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewAudit = async (cert) => {
    setAuditCert(cert);
    setAuditLoading(true);
    try {
      const res = await certificateService.getCertificateAuditTrailAdmin(cert.id);
      setAuditLogs(res.data || []);
    } catch (err) {
      console.error(err);
      setAuditLogs([]);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Ribbon */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Certificate ID, Trainee Name, or Course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved & Active</option>
            <option value="rejected">Rejected</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Certificate ID</th>
                <th className="px-5 py-3.5">Trainee</th>
                <th className="px-5 py-3.5">Course</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Completion Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-slate-500">
                    No matching certificate records found.
                  </td>
                </tr>
              ) : (
                filtered.map((cert) => {
                  const certId = cert.certificate_id || `MOES-2026-${(cert.id || '').substring(0, 8).toUpperCase()}`;
                  const trainee = cert.trainee_name_snapshot || cert.trainee_name || cert.user?.full_name || 'Trainee';
                  const course = cert.course_name_snapshot || cert.course_name || cert.course?.title || 'Course';
                  const date = cert.issue_date || cert.created_at;
                  const isPending = cert.status === 'pending_approval' || cert.status === 'pending';
                  const isApproved = cert.status === 'approved';
                  const isRevoked = cert.status === 'revoked';
                  const isRejected = cert.status === 'rejected';

                  return (
                    <tr key={cert.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {certId}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-100 whitespace-nowrap">
                        {trainee}
                      </td>
                      <td className="px-5 py-4 text-slate-300 max-w-xs truncate" title={course}>
                        {course}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {isApproved && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-semibold">
                            <Clock className="w-3 h-3" />
                            <span>Pending Review</span>
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
                            <XCircle className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {date ? new Date(date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleViewAudit(cert)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors inline-flex items-center space-x-1"
                          title="View Cryptographic Audit Trail"
                        >
                          <History className="w-3 h-3 text-brand-400" />
                          <span>Audit</span>
                        </button>

                        {isPending && (
                          <>
                            <button
                              onClick={() => handleOpenAction(cert, 'approve')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm inline-flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleOpenAction(cert, 'reject')}
                              className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/30 rounded-lg text-xs transition-colors inline-flex items-center space-x-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <button
                            onClick={() => handleOpenAction(cert, 'revoke')}
                            className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-500/30 rounded-lg text-xs transition-colors inline-flex items-center space-x-1"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Revoke</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Reason Confirmation Modal */}
      {selectedCert && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                Confirm {actionType}
              </h3>
              <button
                onClick={() => { setSelectedCert(null); setActionType(null); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong>Certificate ID:</strong> {selectedCert.certificate_id || selectedCert.id}
              </p>
              <p>
                <strong>Trainee:</strong> {selectedCert.trainee_name_snapshot || selectedCert.user?.full_name}
              </p>
              <p>
                <strong>Course:</strong> {selectedCert.course_name_snapshot || selectedCert.course?.title}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                Reason / Remarks (Recorded in Cryptographic Audit Log):
              </label>
              <textarea
                rows="3"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder={`Provide remarks for ${actionType}ing this credential...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => { setSelectedCert(null); setActionType(null); }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {actionLoading ? 'Processing...' : `Confirm ${actionType.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {auditCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Cryptographic Audit Trail
                </h3>
              </div>
              <button
                onClick={() => setAuditCert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <p className="text-amber-400 font-bold">
                ID: {auditCert.certificate_id || auditCert.id}
              </p>
              <p className="text-slate-400 truncate">
                SHA-256: {auditCert.sha256_hash || 'SHA256-REGISTERED'}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lifecycle Events History:
              </h4>

              {auditLoading ? (
                <p className="text-xs text-slate-500 text-center py-4">Loading audit logs...</p>
              ) : auditLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No audit logs recorded for this credential.</p>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start justify-between text-xs gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-amber-400 uppercase">
                            {log.action}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            by {log.performed_by || 'System'}
                          </span>
                        </div>
                        {log.details && (
                          <p className="text-slate-400 text-[11px]">{log.details}</p>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateApprovalTable;
