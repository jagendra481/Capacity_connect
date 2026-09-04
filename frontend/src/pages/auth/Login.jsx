import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/auth/AuthLayout';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import { Mail, Lock, ArrowRight, AlertCircle, UserPlus } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({ message: '', accountNotFound: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorInfo.message) setErrorInfo({ message: '', accountNotFound: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorInfo({ message: 'Please enter both email and password.', accountNotFound: false });
      return;
    }

    setLoading(true);
    setErrorInfo({ message: '', accountNotFound: false });

    try {
      const user = await login(formData.email.trim(), formData.password.trim());
      // Role Redirection handled centrally in AuthContext / AppRoutes
      if (user.role === 'administrator') navigate('/admin/dashboard');
      else if (user.role === 'trainer') navigate('/trainer/dashboard');
      else navigate('/trainee/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || err.message || 'Invalid email or password.';
      const accountNotFound = err.response?.data?.accountNotFound || err.response?.status === 404;
      const requiresVerification = err.response?.data?.requiresEmailVerification;

      if (requiresVerification) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`);
        return;
      }

      setErrorInfo({
        message: accountNotFound ? 'Account not found. Please sign up first.' : msg,
        accountNotFound,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setErrorInfo({ message: '', accountNotFound: false });
    try {
      // mode: 'login' strictly rejects unknown Google accounts without creating users
      const user = await loginWithGoogle(response.credential, 'login');
      if (user.role === 'administrator') navigate('/admin/dashboard');
      else if (user.role === 'trainer') navigate('/trainer/dashboard');
      else navigate('/trainee/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      const msg = err.response?.data?.message || err.message || 'Google login failed.';
      const accountNotFound = err.response?.data?.accountNotFound || err.response?.status === 404;

      setErrorInfo({
        message: accountNotFound ? 'No Capacity Connect account was found for this Google account. Please sign up first.' : msg,
        accountNotFound,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-400 mt-1">Continue your learning journey with Capacity Connect.</p>
        </div>

        {errorInfo.message && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-2xl text-xs text-rose-300 space-y-2">
            <div className="flex items-center space-x-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorInfo.message}</span>
            </div>

            {errorInfo.accountNotFound && (
              <div className="pt-2 border-t border-rose-500/20">
                <Link
                  to="/signup"
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@organization.org"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center space-x-1.5"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500 font-bold">OR</span>
          </div>
        </div>

        <GoogleLoginButton
          mode="login"
          onSuccess={handleGoogleSuccess}
          onError={(err) => setErrorInfo({ message: err?.message || 'Google sign in failed.', accountNotFound: false })}
        />

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
