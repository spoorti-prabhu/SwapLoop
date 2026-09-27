import React, { useState } from 'react';
import { SwapLoopLogo } from './SwapLoopLogo';
import { ArrowRight, Eye, EyeOff, Check } from 'lucide-react';

interface LoginPageProps {
  onSignIn: (email: string) => void;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSignIn,
  onOpenRegister,
  onOpenForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your university email');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid university email address (e.g., student@university.edu)');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn(email);
    }, 450);
  };

  const handleDemoSignIn = () => {
    setEmail('maya.lin@campus.edu');
    setPassword('campusSwap2026!');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn('maya.lin@campus.edu');
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF3F8] text-[#1D1722] selection:bg-[#F2D7E7] selection:text-[#63183E]">
      {/* LEFT COLUMN: Blush Mist Branding & Hero Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 bg-[#FAF3F8] relative">
        {/* Top-left: SwapLoop Brand Mark with 3-arrow triangular loop symbol */}
        <div>
          <SwapLoopLogo
            variant="badge"
            badgeSize="w-10 h-10"
            className="cursor-pointer"
          />
        </div>

        {/* Center / Hero Copy */}
        <div className="max-w-xl my-12 lg:my-0 space-y-6">
          {/* Eyebrow */}
          <div className="text-[#DE5B9B] text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase">
            THE CAMPUS CIRCULAR
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#1D1722] leading-[1.12]">
            Less clutter.<br />
            More connection.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-[18px] text-[#6F6577] leading-relaxed max-w-lg font-normal">
            Trade things you no longer need for things you’ll actually love,
            all within your campus community.
          </p>

          {/* Feature Badges with Pink Checks */}
          <div className="pt-2 flex flex-wrap items-center gap-6 sm:gap-8 text-[15px] font-medium text-[#221A28]">
            <div className="inline-flex items-center gap-2">
              <span className="text-[#DE5B9B] font-bold text-lg">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <span>Safe handovers</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <span className="text-[#DE5B9B] font-bold text-lg">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <span>No money needed</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="text-xs sm:text-[13px] text-[#8C8294] font-normal pt-4">
          Made for students, kinder to the planet.
        </div>
      </div>

      {/* RIGHT COLUMN: Clean White Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-20 bg-white">
        <div className="w-full max-w-[420px] mx-auto space-y-7">
          {/* Header */}
          <div className="space-y-2">
            <div className="text-[#DE5B9B] text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase">
              WELCOME BACK
            </div>
            <h2 className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#1D1722]">
              Ready to swap?
            </h2>
            <p className="text-sm sm:text-[15px] text-[#6F6577] font-normal">
              Use your university email to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200/80 px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-fadeIn">
                <span>•</span>
                <span>{error}</span>
              </div>
            )}

            {/* University Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#261E2E]"
              >
                University email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full px-4 py-3 rounded-2xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10 transition duration-150"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#261E2E]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 pr-11 rounded-2xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10 transition duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E94A5] hover:text-[#6F6577] focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] rounded-full bg-[#DE5B9B] hover:bg-[#CF4A89] active:bg-[#B93874] text-white font-medium text-sm sm:text-[15px] flex items-center justify-center gap-2 shadow-sm transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-[#DE5B9B]/25 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={onOpenForgotPassword}
                className="text-xs sm:text-[13px] font-medium text-[#DE5B9B] hover:text-[#C74082] transition-colors focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Demo Instant Sign In Helper */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="inline-flex items-center gap-1.5 text-xs text-[#7F7488] hover:text-[#DE5B9B] px-3 py-1.5 rounded-full border border-dashed border-[#E7D7E3] hover:border-[#DE5B9B] transition-all bg-[#FCF8FB]"
              >
                <span>✨ Fast Demo: Sign in as student Maya</span>
              </button>
            </div>

            {/* Create Account Link */}
            <div className="pt-5 text-center text-xs sm:text-[14px] text-[#6F6577]">
              <span>New to SwapLoop? </span>
              <button
                type="button"
                onClick={onOpenRegister}
                className="text-[#DE5B9B] font-medium hover:text-[#C74082] hover:underline focus:outline-none transition-colors"
              >
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
