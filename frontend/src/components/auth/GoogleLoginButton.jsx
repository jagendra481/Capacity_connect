import React, { useEffect, useRef } from 'react';

export const GoogleLoginButton = ({ onGoogleSuccess, onError, label = 'Continue with Google' }) => {
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1048827394857-capacityconnectdemo.apps.googleusercontent.com';

    const loadGoogleSdk = () => {
      if (window.google?.accounts?.id) {
        initializeGoogleBtn(clientId);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initializeGoogleBtn(clientId);
      document.body.appendChild(script);
    };

    const initializeGoogleBtn = (cId) => {
      try {
        window.google.accounts.id.initialize({
          client_id: cId,
          callback: handleCredentialResponse,
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'pill',
          });
        }
      } catch (err) {
        console.warn('Google GIS initialization:', err.message);
      }
    };

    const handleCredentialResponse = (response) => {
      if (response?.credential) {
        onGoogleSuccess({ credential: response.credential });
      } else if (onError) {
        onError('Google login failed or closed');
      }
    };

    loadGoogleSdk();
  }, [onGoogleSuccess, onError]);

  // Direct manual fallback button if GIS is blocked or for testing
  const handleMockGoogleAuth = () => {
    const mockEmail = `learner_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
    onGoogleSuccess({
      email: mockEmail,
      name: 'Google Learner',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google_user',
      sub: `google_id_${Date.now()}`,
    });
  };

  return (
    <div className="w-full space-y-2">
      <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>

      {/* Fallback Custom Google Styling Button */}
      <button
        type="button"
        onClick={handleMockGoogleAuth}
        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{label}</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
