import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onLogin: () => void;
}

type AuthMode = 'login' | 'register';
type AuthMethod = 'mobile' | 'email';
type MobileStep = 'input' | 'otp';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const { loginWithMobile, registerWithMobile, loginWithEmail, registerWithEmail } = useAuth();

  // Navigation / Tabs state
  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<AuthMethod>('mobile');
  const [mobileStep, setMobileStep] = useState<MobileStep>('input');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP State
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Feedback & Loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mobileStep === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [mobileStep, resendTimer]);

  // Reset errors when switching mode or method
  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setMobileStep('input');
    setOtp(['', '', '', '', '', '']);
  };

  const handleMethodSwitch = (newMethod: AuthMethod) => {
    setMethod(newMethod);
    setErrorMessage(null);
    setMobileStep('input');
    setOtp(['', '', '', '', '', '']);
  };

  // OTP Input logic
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, idx) => {
        if (idx < 6) newOtp[idx] = digit;
      });
      setOtp(newOtp);
      setErrorMessage(null);
      const nextFocus = Math.min(digits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setErrorMessage(null);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Submit Mobile (Step 1 -> OTP)
  const handleMobileInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register' && (!fullName || fullName.trim().length < 2)) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMobileStep('otp');
      setResendTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    }, 500);
  };

  // Submit Mobile OTP
  const handleMobileOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    let res;
    if (mode === 'register') {
      res = await registerWithMobile(fullName, phone, enteredOtp);
    } else {
      res = await loginWithMobile(phone, enteredOtp);
    }

    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please try again.');
    } else {
      onLogin();
    }
  };

  // Submit Email Form
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must meet minimum requirements (at least 6 characters).');
      return;
    }

    if (mode === 'register') {
      if (!fullName || fullName.trim().length < 2) {
        setErrorMessage('Please enter your full legal name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    let res;
    if (mode === 'register') {
      res = await registerWithEmail(fullName, email, password);
    } else {
      res = await loginWithEmail(email, password);
    }

    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please try again.');
    } else {
      onLogin();
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setErrorMessage(null);
  };

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden font-sans">
      {/* Container */}
      <main className="w-full max-w-md bg-white rounded-2xl border border-[#c3c6d1] p-6 sm:p-8 shadow-xs relative z-10 flex flex-col items-center my-auto">
        {/* Brand Badge & Header */}
        <header className="flex flex-col items-center mb-5 w-full text-center">
          <div className="w-12 h-12 bg-[#001e40] text-white rounded-2xl mb-2.5 flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-2xl">account_balance</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#001e40] tracking-tight">{t('app_name')}</h1>
          <p className="text-xs text-[#43474f] font-semibold mt-0.5">Citizen Preparation Portal</p>
        </header>

        {/* Mode Switcher: Sign In vs Create Account */}
        <div className="w-full bg-[#f8f9ff] p-1 rounded-xl border border-[#c3c6d1]/80 flex mb-5">
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-[#001e40] shadow-xs border border-[#c3c6d1]/50'
                : 'text-[#43474f] hover:text-[#001e40]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-[#001e40] shadow-xs border border-[#c3c6d1]/50'
                : 'text-[#43474f] hover:text-[#001e40]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Method Switcher: Mobile vs Email */}
        <div className="w-full flex items-center justify-center gap-3 mb-5 border-b border-[#c3c6d1]/60 pb-3">
          <button
            type="button"
            onClick={() => handleMethodSwitch('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              method === 'mobile'
                ? 'bg-[#001e40]/10 text-[#001e40] border border-[#001e40]/20'
                : 'text-[#737780] hover:text-[#001e40]'
            }`}
          >
            <span className="material-symbols-outlined text-base">smartphone</span>
            Mobile OTP
          </button>
          <button
            type="button"
            onClick={() => handleMethodSwitch('email')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              method === 'email'
                ? 'bg-[#001e40]/10 text-[#001e40] border border-[#001e40]/20'
                : 'text-[#737780] hover:text-[#001e40]'
            }`}
          >
            <span className="material-symbols-outlined text-base">mail</span>
            Email & Password
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="w-full bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 mb-4 animate-in fade-in">
            <span className="material-symbols-outlined text-base shrink-0 text-red-600 mt-0.5">error</span>
            <span className="flex-1 leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* ----------------- METHOD 1: MOBILE OTP ----------------- */}
        {method === 'mobile' && mobileStep === 'input' && (
          <form onSubmit={handleMobileInputSubmit} className="w-full flex flex-col gap-4">
            {mode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-xs font-bold text-[#121c28]">
                  Full Name (Legal) <span className="text-red-600">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  required
                  className="w-full bg-white rounded-xl border border-[#737780] focus:border-[#005db6] focus:ring-2 focus:ring-[#005db6] px-3.5 py-3 text-sm font-semibold text-[#121c28] h-12 focus:outline-none"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-[#121c28]">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <div className="flex relative rounded-xl border border-[#737780] focus-within:border-[#005db6] focus-within:ring-2 focus-within:ring-[#005db6] bg-white overflow-hidden">
                <span className="flex items-center justify-center px-3.5 bg-[#eef4ff] text-[#001e40] border-r border-[#c3c6d1] text-sm font-bold select-none shrink-0">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  required
                  maxLength={11}
                  className="flex-1 bg-transparent border-none focus:outline-none px-3.5 py-3 text-sm font-semibold text-[#121c28] h-12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] bg-[#001e40] text-white rounded-xl font-bold text-sm hover:bg-[#00376f] transition-all mt-2 shadow-xs flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#005db6] focus:outline-none disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'register' ? 'Register & Get OTP' : 'Send OTP'}</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        )}

        {method === 'mobile' && mobileStep === 'otp' && (
          <form onSubmit={handleMobileOtpSubmit} className="w-full flex flex-col gap-4">
            <div className="text-center mb-1">
              <p className="text-xs text-[#43474f]">
                Enter 6-digit OTP code sent to <span className="font-bold text-[#001e40]">+91 {phone}</span>
              </p>
            </div>

            <div className="flex justify-between gap-1.5 sm:gap-2 my-1">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  aria-label={`Verification code digit ${idx + 1}`}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 sm:w-12 sm:h-12 text-center text-lg font-bold rounded-xl border border-[#737780] focus:border-[#005db6] focus:ring-2 focus:ring-[#005db6] text-[#001e40] bg-white focus:outline-none"
                />
              ))}
            </div>

            <div className="flex justify-between items-center text-xs mt-1 px-1">
              <button
                type="button"
                onClick={() => setMobileStep('input')}
                className="font-bold text-[#005db6] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Change Number
              </button>

              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-bold text-[#005db6] hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-[#737780] font-medium">
                  Resend in <span className="font-bold text-[#001e40]">{resendTimer}s</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] bg-[#001e40] text-white rounded-xl font-bold text-sm hover:bg-[#00376f] transition-all mt-2 shadow-xs flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#005db6] focus:outline-none disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify & Proceed</span>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ----------------- METHOD 2: EMAIL & PASSWORD ----------------- */}
        {method === 'email' && (
          <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-3.5">
            {mode === 'register' && (
              <div className="flex flex-col gap-1">
                <label htmlFor="emailFullName" className="text-xs font-bold text-[#121c28]">
                  Full Name (Legal) <span className="text-red-600">*</span>
                </label>
                <input
                  id="emailFullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  required
                  className="w-full bg-white rounded-xl border border-[#737780] focus:border-[#005db6] focus:ring-2 focus:ring-[#005db6] px-3.5 py-2.5 text-sm font-semibold text-[#121c28] h-11 focus:outline-none"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="emailInput" className="text-xs font-bold text-[#121c28]">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-white rounded-xl border border-[#737780] focus:border-[#005db6] focus:ring-2 focus:ring-[#005db6] px-3.5 py-2.5 text-sm font-semibold text-[#121c28] h-11 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="passwordInput" className="text-xs font-bold text-[#121c28]">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                id="passwordInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full bg-white rounded-xl border border-[#737780] focus:border-[#005db6] focus:ring-2 focus:ring-[#005db6] px-3.5 py-2.5 text-sm font-semibold text-[#121c28] h-11 focus:outline-none"
              />
            </div>

            {mode === 'register' && (
              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPasswordInput" className="text-xs font-bold text-[#121c28]">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <input
                  id="confirmPasswordInput"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  minLength={6}
                  className="w-full bg-white rounded-xl border border-[#737780] focus:border-[#005db6] focus:ring-2 focus:ring-[#005db6] px-3.5 py-2.5 text-sm font-semibold text-[#121c28] h-11 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] bg-[#001e40] text-white rounded-xl font-bold text-sm hover:bg-[#00376f] transition-all mt-2 shadow-xs flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#005db6] focus:outline-none disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'register' ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'register' ? 'Create Account' : 'Sign In'}</span>
                  <span className="material-symbols-outlined text-lg">login</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Bottom Toggle Note & Guest Access */}
        <div className="mt-5 text-center text-xs text-[#43474f] space-y-2.5">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className="font-bold text-[#005db6] hover:underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className="font-bold text-[#005db6] hover:underline"
              >
                Sign In
              </button>
            </p>
          )}

          <div>
            <button
              type="button"
              onClick={onLogin}
              className="text-xs font-semibold text-[#535f70] hover:text-[#001e40] py-1 px-3 rounded-lg hover:bg-[#f0f4fc] transition-colors inline-flex items-center gap-1"
            >
              <span>Explore as Guest</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Footer Terms */}
        <footer className="mt-6 text-center w-full border-t border-[#c3c6d1]/50 pt-3.5">
          <p className="text-[11px] text-[#737780] leading-relaxed">
            {t('agree_terms_text')}{' '}
            <a href="#" className="text-[#001e40] font-bold underline hover:text-[#005db6]">
              {t('terms_of_service')}
            </a>{' '}
            {t('and')}{' '}
            <a href="#" className="text-[#001e40] font-bold underline hover:text-[#005db6]">
              {t('privacy_policy')}
            </a>.
          </p>
        </footer>
      </main>
    </div>
  );
};
