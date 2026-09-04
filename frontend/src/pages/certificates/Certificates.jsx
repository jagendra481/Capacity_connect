import React, { useState, useEffect } from 'react';
import certificateService from '../../services/certificateService';
import CertificateCard from '../../components/certificates/CertificateCard';
import QRScannerModal from '../../components/certificates/QRScannerModal';
import Loader from '../../components/common/Loader';
import { Award, ShieldCheck, Camera, Sparkles, Filter, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'approved' | 'pending'
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await certificateService.getMyCertificates();
      if (res.data) {
        setCerts(res.data);
      }
    } catch (err) {
      console.error('Cannot load trainee certificates', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = certs.filter((c) => {
    if (activeTab === 'approved') return c.status === 'approved';
    if (activeTab === 'pending') return c.status === 'pending_approval' || c.status === 'pending';
    return true;
  });

  const approvedCount = certs.filter((c) => c.status === 'approved').length;
  const pendingCount = certs.filter((c) => c.status === 'pending_approval' || c.status === 'pending').length;

  if (loading) return <Loader size="large" message="Loading your Ministry completion credentials..." />;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Government Credentials</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            My Digital Certificates
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl">
            Access, download, and verify tamper-evident completion certificates issued by the Ministry of Earth Sciences.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowScanner(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shadow-lg"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Verify QR Code</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Completed Courses</span>
          <p className="text-3xl font-extrabold text-slate-100">{certs.length}</p>
          <p className="text-[11px] text-slate-500">100% course fulfillment verified</p>
        </div>
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold text-emerald-400">Approved & Verified</span>
          <p className="text-3xl font-extrabold text-emerald-400">{approvedCount}</p>
          <p className="text-[11px] text-emerald-500/80">Active SHA-256 credentials</p>
        </div>
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold text-amber-400">Under Admin Review</span>
          <p className="text-3xl font-extrabold text-amber-400">{pendingCount}</p>
          <p className="text-[11px] text-amber-500/80">Pending administrative approval</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'all'
              ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Certificates ({certs.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'approved'
              ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
      </div>

      {/* Certificate Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Certificates Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Complete 100% of your course lessons and assessments to trigger certificate generation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={(code) => {
          setShowScanner(false);
          navigate(`/certificates/verify/${code}`);
        }}
      />
    </div>
  );
};

export default Certificates;
