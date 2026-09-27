import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import { SwapLoopLogo } from './SwapLoopLogo';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: (email: string, name: string) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegistered,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dorm: '',
    password: '',
    confirmPassword: '',
    agreedSafeHandovers: true
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('A valid university email address (.edu) is required');
      return;
    }
    if (!formData.dorm.trim()) {
      setError('Please mention your dorm hall or campus area');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreedSafeHandovers) {
      setError('You must agree to campus safe handover guidelines');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegistered(formData.email, formData.fullName);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-[#F2E4EF] my-8 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-[#8A7E93] hover:text-[#1D1722] hover:bg-[#FAF3F8] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <SwapLoopLogo variant="badge" badgeSize="w-9 h-9" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#DE5B9B]">
            Join The Loop
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1722] tracking-tight">
          Create student account
        </h3>
        <p className="text-sm text-[#6F6577] mt-1 mb-6">
          Trade circular items within your verified campus network.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 px-3.5 py-2.5 rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g., Maya Lin"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
            />
          </div>

          {/* University Email */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
              University Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="m.lin@university.edu"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
            />
          </div>

          {/* Dorm / Residence */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
              Dorm / Campus Quad
            </label>
            <input
              type="text"
              value={formData.dorm}
              onChange={(e) => setFormData({ ...formData, dorm: e.target.value })}
              placeholder="e.g., West Quad Hall 304"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
            />
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 8 chars"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
              />
            </div>
          </div>

          {/* Campus Commitment */}
          <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF3F8] border border-[#F0E2EC] cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={formData.agreedSafeHandovers}
              onChange={(e) => setFormData({ ...formData, agreedSafeHandovers: e.target.checked })}
              className="mt-0.5 rounded text-[#DE5B9B] focus:ring-[#DE5B9B]"
            />
            <div className="text-xs text-[#52465D] leading-tight">
              <span className="font-semibold text-[#1D1722] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#DE5B9B] inline" />
                Community Safe Handover Pledge
              </span>
              <span>
                I agree to meet exclusively at well-lit, public campus zones (Library, Dining hall, Security desk) and conduct 100% cashless item-for-item swaps.
              </span>
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] mt-4 rounded-full bg-[#DE5B9B] hover:bg-[#CF4A89] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#DE5B9B]/25 disabled:opacity-75"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Creating account...</span>
              </span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
