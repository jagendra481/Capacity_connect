import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, Clock, ExternalLink, Search } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const CertificateApprovalTable = ({ certificates = [], onStatusUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = certificates.filter((c) => {
    const matchesSearch =
      (c.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.certificate_hash || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || (c.status || 'approved') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Digital Certificate Approval Console</span>
          </h3>
          <p className="text-xs text-slate-400">Review, approve, or reject trainee course completion & test certificate requests</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold">
            <tr>
              <th className="p-3.5">Trainee Learner</th>
              <th className="p-3.5">Certificate Title</th>
              <th className="p-3.5">Cryptographic Hash</th>
              <th className="p-3.5">Issue Date</th>
              <th className="p-3.5">Approval Status</th>
              <th className="p-3.5 text-right">Governance Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-slate-500">
                  No certificate requests found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const status = c.status || 'approved';
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-200">{c.user_name || 'Trainee Learner'}</td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate">{c.title}</td>
                    <td className="p-3.5 font-mono text-[11px] text-amber-300">{c.certificate_hash}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(c.issued_date)}</td>
                    <td className="p-3.5">
                      {status === 'approved' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved</span>
                        </span>
                      )}
                      {status === 'pending' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {status === 'rejected' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {status !== 'approved' && (
                        <button
                          onClick={() => onStatusUpdate(c.id, 'approved')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-all shadow inline-flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}
                      {status !== 'rejected' && (
                        <button
                          onClick={() => onStatusUpdate(c.id, 'rejected')}
                          className="px-3 py-1 bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-slate-700 hover:border-rose-500/40 rounded-lg text-[11px] font-semibold transition-all inline-flex items-center space-x-1"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      )}
                      <a
                        href={`/certificates/verify/${c.certificate_hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-200 inline-block align-middle"
                        title="View Certificate"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CertificateApprovalTable;
