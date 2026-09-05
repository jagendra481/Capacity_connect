import React, { useState } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  FileSpreadsheet,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BarChart3,
  Users,
  Award,
} from 'lucide-react';

export const Reports = () => {
  const [downloading, setDownloading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleExport = async (type = 'full') => {
    setDownloading(true);
    try {
      const res = await adminService.exportCapacityReport(type);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `institutional_capacity_audit_${type}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setFeedback('Capacity report downloaded successfully.');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      alert('Export failed: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Institutional Governance Reports</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Capacity Building & Audit Exports
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-0.5">
          Generate official capacity development audits, compliance verifications, and department training reports.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl border text-xs font-semibold flex items-center space-x-2 bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Full Platform Audit Dossier</h3>
            <p className="text-xs text-slate-400">
              Complete snapshot including all registered trainees, trainers, course progress, certificate hashes, and security logs.
            </p>
          </div>
          <button
            onClick={() => handleExport('full')}
            disabled={downloading}
            className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating...' : 'Export Full Audit (JSON)'}</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Certificate Verification Ledger</h3>
            <p className="text-xs text-slate-400">
              Full registry of SHA-256 verified certificates, cryptographic signatures, issue dates, and approval authorities.
            </p>
          </div>
          <button
            onClick={() => handleExport('certificates')}
            disabled={downloading}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all shadow flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Certificate Ledger</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Competency Benchmark Report</h3>
            <p className="text-xs text-slate-400">
              Aggregated skill gap metrics across departments with institutional training recommendations.
            </p>
          </div>
          <button
            onClick={() => handleExport('competency')}
            disabled={downloading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Competency Benchmark</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
