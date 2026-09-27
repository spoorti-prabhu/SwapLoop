import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { SwapLoopLogo } from './SwapLoopLogo';
import { X, Mail, Lock, User, Phone, CheckCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, allUsers } = useSwapLoop();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('arjun@college.edu');

  // Sign Up fields (F1)
  const [displayName, setDisplayName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNote, setContactNote] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(signInEmail);
    if (ok) {
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 500);
    } else {
      setError('User not found. Use a seeded email (e.g. arjun@college.edu) or sign up.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Please enter your display name.');
      return;
    }

    // T1: @gmail.com or @college.edu allowed for testing
    const emailLower = signUpEmail.trim().toLowerCase();
    if (!emailLower.endsWith('@college.edu') && !emailLower.endsWith('@gmail.com')) {
      setError('College Email must end with @college.edu or @gmail.com for testing.');
      return;
    }

    if (!contactNote.trim()) {
      setError('Please provide a private contact note (phone number or hostel room).');
      return;
    }

    signup({
      name: displayName.trim(),
      email: emailLower,
      password,
      contactNote: contactNote.trim()
    });

    setSuccess('Student account created! Email verification link simulated.');
    setTimeout(() => {
      setSuccess('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#fff7f9] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <SwapLoopLogo variant="badge" badgeSize="w-9 h-9" />
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#fff7f9] p-1 rounded-2xl mb-6 border border-pink-100">
          <button
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up (F1, T1)
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3.5 py-2.5 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Campus Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="e.g., arjun@college.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-pink-100 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick click student presets */}
            <div className="pt-2">
              <div className="text-[11px] text-slate-400 mb-1 text-center font-medium">
                Or quick sign in as a seeded student:
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSignInEmail(u.email);
                      login(u.email);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#fff7f9] hover:bg-pink-100 text-pink-700 text-[11px] font-semibold border border-pink-200"
                  >
                    {u.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Priya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-100 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                College Email (@college.edu or @gmail.com)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="priya@college.edu or priya@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-100 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-100 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Private Contact Note (Phone or Hostel Room)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contactNote}
                  onChange={(e) => setContactNote(e.target.value)}
                  placeholder="e.g. Hostel 3, Room 102 | +91 9988776655"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-100 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                🔒 Strictly private. Hidden from all other swappers until a proposal is officially sealed.
              </p>
            </div>

            <button
              type="submit"
              className="w-full h-11 mt-2 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Create Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
