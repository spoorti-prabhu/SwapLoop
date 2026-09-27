import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { SwapLoopLogo } from './SwapLoopLogo';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid university email');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#F2E4EF]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-[#8A7E93] hover:text-[#1D1722] hover:bg-[#FAF3F8] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <SwapLoopLogo variant="badge" badgeSize="w-9 h-9" />
        </div>

        {!submitted ? (
          <>
            <h3 className="text-2xl font-bold text-[#1D1722] mb-2 tracking-tight">
              Reset your password
            </h3>
            <p className="text-sm text-[#6F6577] mb-6 leading-relaxed">
              Enter your registered university email address and we’ll send you a secure link to reset your campus swap account password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
                  University Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full px-4 py-3 rounded-2xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
                    autoFocus
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89CAE]" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-[48px] mt-2 rounded-full bg-[#DE5B9B] hover:bg-[#CF4A89] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#DE5B9B]/25"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1722]">
              Check your university inbox
            </h3>
            <p className="text-sm text-[#6F6577] max-w-xs mx-auto">
              We've dispatched a recovery link to <span className="font-semibold text-[#1D1722]">{email}</span>. Click the link in your email to choose a new password.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#FAF3F8] hover:bg-[#F2E4EF] text-[#DE5B9B] font-medium text-sm transition-colors"
              >
                Back to Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
