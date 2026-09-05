import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  Eye,
  X,
} from 'lucide-react';

export const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs({ limit: 100 });
      if (res?.data) {
        setLogs(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) =>
    (l.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.target_entity || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(l.target_id || '').includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Immutable System Audit Trail</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Security & Administrative Event Logs
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Cryptographically timestamped log of all user registrations, role transitions, course changes, certificate approvals, and password resets.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center space-x-2"
        >
          <History className="w-4 h-4" />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search logs by action, entity, target ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 outline-none focus:border-red-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-slate-400 font-bold">{filteredLogs.length} Events Logged</span>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader size="medium" message="Retrieving immutable audit records..." />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No activity logs match your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Entity</th>
                  <th className="py-3.5 px-4">Performed By</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(l.created_at || Date.now()).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-red-400">{l.action}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-200">
                      {l.target_entity} #{l.target_id || ''}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {l.performed_by ? `Admin #${l.performed_by}` : 'SYSTEM'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {l.ip_address || '127.0.0.1'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(l)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-lg font-sans"
                        title="View JSON Payload"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: JSON Payload Viewer */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-mono text-red-400">
                {selectedLog.action}
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-80">
              {JSON.stringify(selectedLog, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLogs;
