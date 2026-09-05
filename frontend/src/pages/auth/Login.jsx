import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import { getDashboardRoute, ROLES } from '../../utils/roleUtils';
import {
  Lock,
  Mail,
  Award,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  UserPlus,
  Sparkles,
} from 'lucide-react';

const ROLE_OPTIONS = [
  {
    id: 'trainee',
    label: 'Trainee',
    subtitle: 'Learner',
    icon: GraduationCap,
    description: 'Access courses, take assessments, track competencies, and ask AI.',
    badgeClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    activeClass: 'bg-slate-800 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10',
  },
  {
    id: 'trainer',
    label: 'Trainer',
    subtitle: 'Instructor',
    icon: UserCheck,
    description: 'Manage courses, create assessments, and evaluate trainee progress.',
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    activeClass: 'bg-slate-800 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10',
  },
  {
    id: 'administrator',
    label: 'Admin',
    subtitle: 'Platform Admin',
    icon: ShieldCheck,
    description: 'Manage users, departments, system analytics, and organizational capacity.',
    badgeClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    activeClass: 'bg-slate-800 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/10',
  },
];

export const Login = () => {
  const { login, loginWithGoogle, sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected Role Option: 'trainee' | 'trainer' | 'administrator' | null
  const [selectedRole, setSelectedRole] = useState(null);

  // Auth Mode: 'password' | 'otp'
  const [loginMode, setLoginMode] = useState('password');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // OTP Flow states: 'enter_email' | 'enter_otp'
  const [otpStep, setOtpStep] = useState('enter_email');
  const [otpSentMessage, setOtpSentMessage] = useState('');

  const [error, setError] = useState('');
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeRoleConfig = ROLE_OPTIONS.find((r) => r.id === selectedRole);

  const determineDestination = (userRole) => {
    if (location.state?.from?.pathname) {
      return location.state.from.pathname;
    }

    if (userRole === ROLES.ADMINISTRATOR) {
      if (selectedRole === 'trainer') return '/trainer/dashboard';
      if (selectedRole === 'trainee') return '/trainee/dashboard';
      return '/admin/dashboard';
    }

    return getDashboardRoute(userRole);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select your role (Trainee, Trainer, or Administrator) before signing in.');
      return;
    }
    setError('');
    setAccountNotFound(false);
    setLoading(true);

    try {
      const res = await login({ email, password, selectedRole });
      const userRole = res.data?.user?.role || selectedRole;
      const destination = determineDestination(userRole);
      navigate(destination, { replace: true });
    } catch (err) {
      if (err?.accountNotFound || err?.statusCode === 404) {
        setAccountNotFound(true);
        setError('Account not found. Please sign up first.');
      } else if (err?.requiresEmailVerification) {
        localStorage.setItem('pending_verify_email', err.email || email);
        navigate('/verify-email', {
          state: {
            email: err.email || email,
            message: 'Please verify your email before continuing.',
          },
        });
      } else {
        setError(err?.response?.data?.message || err?.message || err || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select your role before requesting an OTP code.');
      return;
    }
    setError('');
    setAccountNotFound(false);
    setOtpSentMessage('');
    setOtpCode('');
    setLoading(true);

    try {
      const res = await sendOTP(email, selectedRole);
      setOtpSentMessage(res.data?.message || `6-digit OTP code sent to ${email}`);
      setOtpStep('enter_otp');
    } catch (err) {
      if (err?.accountNotFound || err?.statusCode === 404) {
        setAccountNotFound(true);
        setError('Account not found. Please sign up first.');
      } else {
        setError(err?.response?.data?.message || err?.message || err || 'Failed to send OTP code.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select your role before verifying OTP code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await verifyOTP(email, otpCode, selectedRole);
      const userRole = res.data?.user?.role || selectedRole;
      const destination = determineDestination(userRole);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || err || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googlePayload) => {
    if (!selectedRole) {
      setError('Please select your role (Trainee, Trainer, or Administrator) before continuing with Google.');
      return;
    }
    setError('');
    setAccountNotFound(false);
    setLoading(true);
    try {
      const res = await loginWithGoogle(googlePayload, selectedRole);
      const userRole = res.data?.user?.role || selectedRole;
      const destination = determineDestination(userRole);
      navigate(destination, { replace: true });
    } catch (err) {
      if (err?.accountNotFound || err?.statusCode === 404) {
        setAccountNotFound(true);
        setError('No Capacity Connect account was found for this Google account. Please sign up first.');
      } else {
        setError(err?.response?.data?.message || err?.message || err || 'Google login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/20">
            <Award className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your Capacity Connect workspace</p>
        </div>

        {/* 3 Role-Based Sign-In Selection Options */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Select Your Role <span className="text-amber-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_OPTIONS.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role.id);
                    setError('');
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    isSelected
                      ? role.activeClass
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-1.5 transition-transform ${
                      isSelected ? 'scale-110' : 'opacity-70'
                    }`}
                  />
                  <span className="text-xs font-bold leading-tight">{role.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">{role.subtitle}</span>
                </button>
              );
            })}
          </div>

          {/* Role Context Hint */}
          {activeRoleConfig ? (
            <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-300 leading-snug">
                <span className="font-semibold text-slate-200">{activeRoleConfig.label} Workspace:</span>{' '}
                {activeRoleConfig.description}
              </p>
            </div>
          ) : (
            <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center">
              <p className="text-[11px] text-cyan-400/90 font-medium">
                Mandatory: Click Trainee, Trainer, or Admin to select your role.
              </p>
            </div>
          )}
        </div>

        {/* Error / Feedback Message */}
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm space-y-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {accountNotFound && (
              <div className="pt-2 border-t border-red-500/20 text-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs font-bold rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Login Mode Toggle Tabs (Password vs OTP) */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setLoginMode('password');
              setError('');
              setAccountNotFound(false);
            }}
            className={`py-2 rounded-lg transition-all ${
              loginMode === 'password'
                ? 'bg-slate-800 text-cyan-400 shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('otp');
              setError('');
              setAccountNotFound(false);
              setOtpStep('enter_email');
              setOtpCode('');
            }}
            className={`py-2 rounded-lg transition-all ${
              loginMode === 'otp'
                ? 'bg-slate-800 text-cyan-400 shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OTP Login (One-Time Pass)
          </button>
        </div>

        {/* Google Authentication */}
        <div className="mb-5">
          <GoogleLoginButton onGoogleSuccess={handleGoogleSuccess} label="Continue with Google" />
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-slate-900 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
              Or sign in with {loginMode === 'password' ? 'Password' : 'OTP Code'}
            </span>
          </div>
        </div>

        {/* MODE 1: Standard Password Login */}
        {loginMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedRole}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center space-x-2"
            >
              <span>
                {!selectedRole
                  ? 'Select a Role to Sign In'
                  : loading
                  ? 'Authenticating...'
                  : `Sign In as ${activeRoleConfig?.label}`}
              </span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* MODE 2: OTP Login */}
        {loginMode === 'otp' && (
          <div className="space-y-4">
            {otpStep === 'enter_email' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    We will send a 6-digit verification code to this email.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedRole}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
                >
                  <span>
                    {!selectedRole
                      ? 'Select a Role to Send OTP'
                      : loading
                      ? 'Sending verification code...'
                      : `Send OTP for ${activeRoleConfig?.label}`}
                  </span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                {otpSentMessage && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start space-x-2.5 text-cyan-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{otpSentMessage}</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Enter 6-Digit OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('enter_email');
                        setOtpCode('');
                      }}
                      className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Change Email</span>
                    </button>
                  </div>

                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-center font-mono text-lg tracking-widest focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6 || !selectedRole}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
                >
                  <span>
                    {!selectedRole
                      ? 'Select a Role to Verify'
                      : loading
                      ? 'Verifying...'
                      : `Verify & Sign In as ${activeRoleConfig?.label}`}
                  </span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-400 hover:underline font-semibold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
