import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import certificateService from '../../services/certificateService';
import CertificateTemplate from '../../components/certificates/CertificateTemplate';
import QRScannerModal from '../../components/certificates/QRScannerModal';
import Loader from '../../components/common/Loader';
import {
  ShieldCheck,
  Search,
  Award,
  AlertCircle,
  AlertTriangle,
  Clock,
  XCircle,
  CheckCircle2,
  Camera,
  Building2,
  ArrowLeft,
} from 'lucide-react';

export const CertificateVerify = () => {
  const { hash, identifier } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryId = new URLSearchParams(location.search).get('id');
  const targetId = identifier || hash || queryId || '';

  const [searchInput, setSearchInput] = useState(targetId);
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (targetId.trim()) {
      performVerification(targetId.trim());
    } else {
      setVerifyResult(null);
    }
  }, [targetId]);

  const performVerification = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await certificateService.verifyCertificate(id);
      setVerifyResult(res.data);
    } catch (err) {
      console.error(err);
      setVerifyResult({
        verified: false,
        status: 'error',
        message: 'Connection error or unresolved verification payload. Please check the Certificate ID.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/certificates/verify/${searchInput.trim()}`);
  };

  const handleScanSuccess = (scannedId) => {
    setSearchInput(scannedId);
    navigate(`/certificates/verify/${scannedId}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Sanitized Public Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Building2 className="w-64 h-64 text-amber-400" />
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/" className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Ministry of Earth Sciences • Public Verification Portal</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Digital Certificate Verification System
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Verify genuine course completion credentials using canonical SHA-256 tamper-evident cryptographic authentication.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <form onSubmit={handleSubmit} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Certificate ID or SHA-256 (e.g. MOES-2026-7B9A2F1C)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50 flex items-center space-x-1.5 flex-shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify</span>
            </button>
          </form>

          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 flex-shrink-0"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Camera Scanner</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Test Samples:</span>
          <button
            onClick={() => { setSearchInput('MOES-2026-7B9A2F1C'); navigate('/certificates/verify/MOES-2026-7B9A2F1C'); }}
            className="px-2.5 py-0.5 bg-slate-950 border border-emerald-500/30 hover:bg-emerald-950/30 text-emerald-400 rounded-lg text-[11px] font-mono transition-colors"
          >
            ✅ Approved (MOES-2026-7B9A2F1C)
          </button>
          <button
            onClick={() => { setSearchInput('MOES-2026-4A2D8F9E'); navigate('/certificates/verify/MOES-2026-4A2D8F9E'); }}
            className="px-2.5 py-0.5 bg-slate-950 border border-amber-500/30 hover:bg-amber-950/30 text-amber-400 rounded-lg text-[11px] font-mono transition-colors"
          >
            ⏳ Pending (MOES-2026-4A2D8F9E)
          </button>
        </div>
      </div>

      {loading && <Loader size="large" message="Validating canonical SHA-256 signature against Ministry registry..." />}

      {!loading && verifyResult && (
        <div className="space-y-6">
          {/* VERIFICATION STATUS BANNER */}
          {verifyResult.verified && verifyResult.status === 'approved' && (
            <div className="bg-emerald-950/40 border-2 border-emerald-500/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-950/50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-emerald-300">
                    ✅ Certificate Officially Verified & Genuine
                  </h3>
                  <p className="text-xs text-emerald-400/90">
                    Cryptographic SHA-256 integrity confirmed. Signed by Ministry of Earth Sciences.
                  </p>
                </div>
              </div>
              <div className="text-right text-xs font-mono text-emerald-300">
                <p className="font-bold">ID: {verifyResult.certificate?.certificate_id}</p>
                <p className="text-[10px] text-emerald-500">
                  Verified On: {verifyResult.certificate?.last_verified_at ? new Date(verifyResult.certificate.last_verified_at).toLocaleDateString() : 'Just now'}
                </p>
              </div>
            </div>
          )}

          {!verifyResult.verified && verifyResult.status === 'pending_approval' && (
            <div className="bg-amber-950/40 border-2 border-amber-500/50 rounded-2xl p-5 flex items-center space-x-4 shadow-lg">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-amber-300">
                  ⏳ Certificate Issuance Pending Admin Approval
                </h3>
                <p className="text-xs text-amber-400/90">
                  This course completion request has been generated and is awaiting official review and sign-off by Ministry Administrators. It is not yet an officially verified credential.
                </p>
              </div>
            </div>
          )}

          {verifyResult.is_tampered && (
            <div className="bg-rose-950/50 border-2 border-rose-500 rounded-2xl p-5 flex items-center space-x-4 shadow-lg">
              <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-rose-200">
                  🚨 SECURITY ALERT: CERTIFICATE INTEGRITY TEST FAILED
                </h3>
                <p className="text-xs text-rose-300">
                  The recalculated Canonical SHA-256 hash does not match the registered certificate data. This credential has been modified or tampered with and is INVALID.
                </p>
              </div>
            </div>
          )}

          {!verifyResult.verified && verifyResult.status === 'revoked' && (
            <div className="bg-rose-950/40 border-2 border-rose-500/50 rounded-2xl p-5 flex items-center space-x-4 shadow-lg">
              <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-rose-300">
                  ⚠️ Certificate Revoked
                </h3>
                <p className="text-xs text-rose-400/90">
                  {verifyResult.message || 'This certificate has been revoked by Administration and is no longer valid.'}
                </p>
              </div>
            </div>
          )}

          {!verifyResult.verified && verifyResult.status === 'rejected' && (
            <div className="bg-rose-950/40 border-2 border-rose-500/50 rounded-2xl p-5 flex items-center space-x-4 shadow-lg">
              <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl">
                <XCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-rose-300">
                  ❌ Certificate Request Rejected
                </h3>
                <p className="text-xs text-rose-400/90">
                  {verifyResult.message || 'This certificate request was not approved by Ministry Administration.'}
                </p>
              </div>
            </div>
          )}

          {!verifyResult.verified && verifyResult.status === 'not_found' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">Certificate Not Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                The provided Certificate ID does not exist in the official Ministry of Earth Sciences registry. Please check your ID and try again.
              </p>
            </div>
          )}

          {/* Render Certificate Template if available */}
          {verifyResult.certificate && (
            <CertificateTemplate certificate={verifyResult.certificate} isPublicView={true} />
          )}
        </div>
      )}

      <QRScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default CertificateVerify;
