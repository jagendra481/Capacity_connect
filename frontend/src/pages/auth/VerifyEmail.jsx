import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardRoute } from '../../utils/roleUtils';
import { Award, Mail, ArrowRight, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export const VerifyEmail = () => {
  const { verifyEmailOTP, resendOTP, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const targetEmail = location.state?.email || user?.email || localStorage.getItem('pending_verify_email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Resend Cooldown Timer (60s)
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (!targetEmail && !user) {
      navigate('/login');
    }
  }, [targetEmail, user, navigate]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-advance to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setError('');

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await verifyEmailOTP(targetEmail, fullOtp);
      localStorage.removeItem('pending_verify_email');
      const userRole = res.data?.user?.role || 'trainee';
      navigate(getDashboardRoute(userRole), { replace: true });
    } catch (err) {
      setError(err || 'Verification failed. Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setError('');
    setSuccessMsg('');
    setResending(true);

    try {
      const res = await resendOTP(targetEmail);
      setSuccessMsg(res.data?.message || 'New verification code sent to your email.');
      setCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err || 'Failed to resend verification code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl z-10 text-center space-y-6">
        
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
          <Award className="w-7 h-7 text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-100">Verify Your Email</h1>
          <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
            We've sent a 6-digit verification code to:
          </p>
          <p className="text-sm font-semibold text-cyan-400 mt-1 font-mono">{targetEmail}</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-2.5 text-red-400 text-xs text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-2.5 text-emerald-400 text-xs text-left">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 6 OTP Input Boxes */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2 my-4" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl font-bold text-slate-100 font-mono focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length < 6}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Resend Cooldown Section */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="text-cyan-400 hover:underline font-semibold disabled:opacity-40 disabled:no-underline flex items-center space-x-1"
          >
            {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
            <span>
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
            </span>
          </button>
        </div>

        <div className="pt-2 text-xs">
          <Link to="/login" className="text-slate-400 hover:text-slate-200 underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;
