import React, { useState } from 'react';
import { SwapLoopLogo } from './SwapLoopLogo';
import { FloatingDoodles } from './FloatingDoodles';
import { ArrowRight, Eye, EyeOff, Check, Building2, Shield } from 'lucide-react';

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
  const [selectedDemoRole, setSelectedDemoRole] = useState<'Student' | 'Desk Operator' | 'Admin'>('Student');

  const demoAccounts = {
    students: [
      { name: 'Arjun', email: 'arjun@college.edu', note: 'Has Mini drafter (New tier)' },
      { name: 'Bhavya', email: 'bhavya@college.edu', note: 'Has Bicycle (New tier)' },
      { name: 'Chetan', email: 'chetan@college.edu', note: 'Has Ext Board (New tier)' },
      { name: 'Divya', email: 'divya@college.edu', note: 'Has Headphones (New tier)' },
      { name: 'Esha', email: 'esha@college.edu', note: 'Has Table Lamp (New tier)' }
    ],
    desk: { name: 'Hostel Desk Operator', email: 'desk@college.edu', role: 'Desk Operator' },
    admin: { name: 'Campus Admin', email: 'admin@college.edu', role: 'Admin' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your university email');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid university email address (e.g., student@university.edu or student@gmail.com)');
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
      onSignIn(trimmedEmail);
    }, 350);
  };

  const handleQuickLogin = (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword('password123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn(targetEmail);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF3F8] text-[#1D1722] selection:bg-[#F2D7E7] selection:text-[#63183E] relative overflow-hidden">
      {/* LEFT COLUMN: Blush Mist Branding & Hero Section (Desktop) / Top Banner (Mobile) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 bg-[#FAF3F8] relative border-b lg:border-b-0 lg:border-r border-[#F0E2EC]">
        {/* Subtle Floating SVG Doodles */}
        <FloatingDoodles />

        {/* Top-left: SwapLoop Brand Mark */}
        <div className="relative z-10">
          <SwapLoopLogo
            variant="badge"
            badgeSize="w-10 h-10"
            className="cursor-pointer transition-transform hover:scale-105"
          />
        </div>

        {/* Center / Hero Copy */}
        <div className="max-w-xl my-10 lg:my-0 space-y-6 relative z-10">
          {/* Eyebrow: THE CAMPUS CIRCULAR */}
          <div className="text-[#DE5B9B] text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase">
            THE CAMPUS CIRCULAR
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#1D1722] leading-[1.12]">
            Less clutter.<br />
            More connection.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-[18px] text-[#6F6577] leading-relaxed max-w-lg font-normal">
            Trade things you no longer need for things you'll actually love,
            all within your campus community.
          </p>

          {/* Feature Bullets with Pink Checks */}
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
        <div className="text-xs sm:text-[13px] text-[#8C8294] font-normal pt-4 relative z-10">
          Made for students, kinder to the planet.
        </div>
      </div>

      {/* RIGHT COLUMN: Clean White Auth Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-20 bg-white relative">
        <div className="w-full max-w-[440px] mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="text-[#DE5B9B] text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase">
              WELCOME BACK
            </div>
            <h2 className="text-3xl sm:text-[34px] font-extrabold tracking-tight text-[#1D1722]">
              Ready to swap?
            </h2>
            <p className="text-sm sm:text-[15px] text-[#6F6577] font-normal">
              Use your university email to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200/80 px-3.5 py-2.5 rounded-2xl flex items-center gap-2 animate-fadeIn">
                <span>•</span>
                <span>{error}</span>
              </div>
            )}

            {/* University Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#261E2E]"
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
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#261E2E]"
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

            {/* Submit Button: Full-width vibrant blush-pink button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] rounded-2xl bg-[#DE5B9B] hover:bg-[#CF4A89] active:bg-[#B93874] text-white font-semibold text-sm sm:text-[15px] flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-[#DE5B9B]/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
                className="text-xs sm:text-[13px] font-medium text-[#DE5B9B] hover:text-[#C74082] transition-colors focus:outline-none cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          </form>

          {/* Role Switcher / Demo Quick-Login Pills */}
          <div className="pt-2 border-t border-[#F0E4ED]/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#6F6577] uppercase tracking-wider text-[11px]">
                Demo Quick Logins:
              </span>
              <div className="flex items-center gap-1 bg-[#FAF3F8] p-1 rounded-full border border-[#F0E4ED] text-[11px] font-semibold">
                {(['Student', 'Desk Operator', 'Admin'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedDemoRole(role)}
                    className={`px-2.5 py-0.5 rounded-full transition-all ${
                      selectedDemoRole === role
                        ? 'bg-white text-[#DE5B9B] font-bold shadow-xs'
                        : 'text-[#7F7488] hover:text-[#1D1722]'
                    }`}
                  >
                    {role === 'Desk Operator' ? 'Desk' : role}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-pills based on selected role */}
            {selectedDemoRole === 'Student' && (
              <div className="space-y-1.5">
                <div className="text-[11px] text-[#8C8294]">
                  Click a student to instant sign in (Scenario A cast):
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {demoAccounts.students.map((st) => (
                    <button
                      key={st.email}
                      type="button"
                      onClick={() => handleQuickLogin(st.email)}
                      className="px-2 py-1.5 rounded-xl border border-pink-200/80 bg-[#FFF7FA] hover:bg-[#DE5B9B] hover:text-white text-[#DE5B9B] text-xs font-bold transition-all text-center truncate shadow-xs"
                      title={`${st.name} (${st.email}) - ${st.note}`}
                    >
                      {st.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDemoRole === 'Desk Operator' && (
              <button
                type="button"
                onClick={() => handleQuickLogin(demoAccounts.desk.email)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200/80 bg-[#FFF7FA] hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Building2 className="w-3.5 h-3.5 text-[#DE5B9B]" />
                <span>Sign in as Campus Desk Coordinator ({demoAccounts.desk.email})</span>
              </button>
            )}

            {selectedDemoRole === 'Admin' && (
              <button
                type="button"
                onClick={() => handleQuickLogin(demoAccounts.admin.email)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200/80 bg-[#FFF7FA] hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-[#DE5B9B]" />
                <span>Sign in as Campus Admin ({demoAccounts.admin.email})</span>
              </button>
            )}
          </div>

          {/* Create Account Link */}
          <div className="pt-2 text-center text-xs sm:text-[14px] text-[#6F6577]">
            <span>New to SwapLoop? </span>
            <button
              type="button"
              onClick={onOpenRegister}
              className="text-[#DE5B9B] font-semibold hover:text-[#C74082] hover:underline focus:outline-none transition-colors cursor-pointer"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
