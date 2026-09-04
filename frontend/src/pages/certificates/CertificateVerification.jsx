import React, { useState } from 'react';
import certificateService from '../../services/certificateService';
import CertificateTemplate from '../../components/certificates/CertificateTemplate';
import Loader from '../../components/common/Loader';
import { ShieldCheck, Search, Award, AlertCircle } from 'lucide-react';

export const CertificateVerification = () => {
  const [hashInput, setHashInput] = useState('');
  const [certResult, setCertResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!hashInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setCertResult(null);

    try {
      const res = await certificateService.verifyCertificate(hashInput.trim());
      if (res.data && res.data.verified) {
        setCertResult(res.data.certificate);
      } else {
        setErrorMsg('Invalid certificate hash or credential not found in registry.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Certificate verification request failed. Please verify the hash key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Verification Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 md:p-8 shadow-2xl text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Public Cryptographic Verification Portal</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Verify Capacity Connect Credentials
        </h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto">
          Enter a SHA-256 certificate hash key below to independently verify completion credentials against our decentralized registry.
        </p>

        {/* Search Form */}
        <form onSubmit={handleVerify} className="flex items-center justify-center max-w-lg mx-auto gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="e.g. CC-CERT-7B9A2F1C3D8E"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !hashInput.trim()}
            className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50 flex items-center space-x-1"
          >
            <span>Verify</span>
            <ShieldCheck className="w-4 h-4" />
          </button>
        </form>
      </div>

      {loading && <Loader size="large" message="Verifying SHA-256 cryptographic signature..." />}

      {errorMsg && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-6 text-center text-rose-300 space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold">Verification Failed</h3>
          <p className="text-xs text-slate-400">{errorMsg}</p>
        </div>
      )}

      {certResult && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center space-x-2 font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Cryptographic Signature Verified Authentic (SHA-256 Registered)</span>
            </span>
            <span className="font-mono">{certResult.certificate_hash}</span>
          </div>

          <CertificateTemplate certificate={certResult} />
        </div>
      )}
    </div>
  );
};

export default CertificateVerification;
