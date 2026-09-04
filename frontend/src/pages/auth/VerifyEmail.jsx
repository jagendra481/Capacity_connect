import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/auth/AuthLayout';
import { getDashboardRoute } from '../../utils/roleUtils';
import { ArrowRight, AlertCircle, CheckCircle2, RefreshCw, Mail, Edit3 } from 'lucide-react';

export const VerifyEmail = () => {
  const { verifyEmailOTP, resendOTP, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get('email');
  const targetEmail = location.state?.email || emailFromQuery || user?.email || localStorage.getItem('pending_verify_email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || 'Verification code sent to your email.');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // 30-Second Resend Cooldown calculation with localStorage persistence across refreshes
  const getInitialCooldown = () => {
    if (!targetEmail) return 30;
    const storedTimestamp = localStorage.getItem(`otp_sent_at_${targetEmail}`);
    if (storedTimestamp) {
      const elapsedSeconds = Math.floor((Date.now() - Number(storedTimestamp)) / 1000);
      return Math.max(0, 30 - elapsedSeconds);
    }
    localStorage.setItem(`otp_sent_at_${targetEmail}`, String(Date.now()));
    return 30;
  };

  const [cooldown, setCooldown] = useState(getInitialCooldown);

  useEffect(() => {
    if (!targetEmail && !user) {
      navigate('/login');
    }
  }, [targetEmail, user, navigate]);

  useEffect(() => {
    let timer;
    if (cooldown > 0 && targetEmail) {
      timer = setInterval(() => {
        const storedTimestamp = localStorage.getItem(`otp_sent_at_${targetEmail}`);
        if (storedTimestamp) {
          const elapsed = Math.floor((Date.now() - Number(storedTimestamp)) / 1000);
          const remaining = Math.max(0, 30 - elapsed);
          setCooldown(remaining);
        } else {
          setCooldown((c) => Math.max(0, c - 1));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown, targetEmail]);

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
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await verifyEmailOTP(targetEmail, fullOtp);
      localStorage.removeItem('pending_verify_email');
      localStorage.removeItem(`otp_sent_at_${targetEmail}`);
      const userRole = res.data?.user?.role || res?.user?.role || 'trainee';
      navigate(getDashboardRoute(userRole), { replace: true });
    } catch (err) {
      console.error('Verify OTP error:', err);
      const msg = err.response?.data?.message || err.message || 'Invalid or expired verification code.';
      setError(msg);
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
      const now = Date.now();
      localStorage.setItem(`otp_sent_at_${targetEmail}`, String(now));
      setCooldown(30);
      setSuccessMsg(res.data?.message || 'A new verification code has been sent to your email.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend OTP error:', err);
      const retryAfter = err.response?.data?.retryAfter || 30;
      if (err.response?.status === 429) {
        setCooldown(retryAfter);
      }
      setError(err.response?.data?.message || err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Verify Email Address</h2>
          <p className="text-xs text-slate-400 mt-1">We sent a 6-digit security code to:</p>
          <div className="flex items-center space-x-2 mt-2 p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-cyan-400 font-mono text-xs font-semibold">
            <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="truncate flex-1">{targetEmail}</span>
            <Link to="/signup" className="text-slate-400 hover:text-slate-200 p-1">
              <Edit3 className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-2xl text-xs text-rose-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && !error && (
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

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
                className="w-12 h-14 bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl text-center text-xl font-bold text-slate-100 font-mono focus:outline-none transition-all shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length < 6}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-1.5"
          >
            <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Didn't get the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="text-cyan-400 hover:text-cyan-300 font-semibold disabled:opacity-40 disabled:no-underline flex items-center space-x-1 transition-colors"
          >
            {resending ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <span>Resend Code</span>
            )}
          </button>
        </div>

        <div className="text-center pt-1">
          <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
