import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { BrandLogo } from './BrandLogo';
import { UserRole } from '../types/swaploop';
import {
  Sparkles,
  Shield,
  Award,
  Bell,
  UserCheck,
  ChevronDown,
  Layers,
  Inbox,
  Heart,
  RotateCw,
  Building2,
  Sliders,
  LogOut,
  MailCheck,
  AlertTriangle,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenArchitecture?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenNotifications,
  onOpenArchitecture
}) => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    allUsers,
    impersonateUser,
    notifications,
    toggleEmailVerified,
    logout
  } = useSwapLoop();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'browse', label: 'Browse Items', icon: Layers },
    { id: 'have', label: 'My Items (Have)', icon: Inbox },
    { id: 'wants', label: 'My Wants', icon: Heart },
    { id: 'drop', label: 'The Drop', icon: RotateCw },
    { id: 'desk', label: 'Swap Desk', icon: Building2 },
    { id: 'wall', label: 'Loop Wall', icon: Sparkles }
  ];

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'Desk Operator') {
      setActiveTab('desk');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm">
      {/* Email Verification Banner (F1, T1) */}
      {currentUser && !currentUser.emailVerified && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Verify your email:</strong> A confirmation link was sent to{' '}
              <span className="font-semibold">{currentUser.email}</span>. Click to simulate email confirmation:
            </span>
            <button
              onClick={toggleEmailVerified}
              className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] transition-colors"
            >
              Simulate Verify
            </button>
          </div>
        </div>
      )}

      {currentUser && currentUser.emailVerified && (
        <div className="bg-[#FAF3F8] border-b border-pink-100 px-4 py-1 text-[11px] text-[#8C7A8A] flex items-center justify-center gap-2">
          <MailCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Campus email verified for {currentUser.name} ({currentUser.email})</span>
          <button
            onClick={toggleEmailVerified}
            className="text-[10px] text-pink-600 hover:underline ml-2"
            title="Toggle to test unverified state"
          >
            (Toggle to Unverified)
          </button>
        </div>
      )}

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Left: Brand Logo with S-Loop and Spark (Section 3) */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
            onClick={() => setActiveTab('browse')}
          >
            <BrandLogo variant="badge" badgeSize="w-10 h-10" />
          </div>

          {onOpenArchitecture && (
            <button
              onClick={onOpenArchitecture}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff7f9] hover:bg-pink-100 border border-pink-200 text-pink-600 text-xs font-bold transition-all"
              title="View Technical System Architecture (Section 32)"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </button>
          )}
        </div>

        {/* Center: Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#fff7f9] p-1.5 rounded-full border border-pink-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white shadow-sm shadow-pink-500/20'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Badges, Score & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {currentUser && (
            <>
              {/* Trust Badge */}
              <div
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  currentUser.trustLevel === 'New'
                    ? 'bg-pink-50 border-pink-200 text-pink-600'
                    : currentUser.trustLevel === 'Trusted'
                    ? 'bg-purple-50 border-purple-200 text-purple-600'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
                title={`Trust Level: ${currentUser.trustLevel} (${currentUser.completedSwapsCount} completed swaps)`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{currentUser.trustLevel}</span>
              </div>

              {/* Swap Score Pill */}
              <div
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm"
                title="Swap Score (starts at 100, drops if proposals expire unaccepted)"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentUser.swapScore}</span>
              </div>

              {/* Role Switcher Toggle [Student] | [Desk Operator] | [Admin] */}
              <div className="flex items-center bg-[#fff7f9] p-1 rounded-full border border-pink-100 text-[11px] font-semibold">
                {(['Student', 'Desk Operator', 'Admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                      currentRole === role
                        ? 'bg-white text-pink-600 shadow-sm font-bold border border-pink-200'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {role === 'Desk Operator' ? 'Desk' : role}
                  </button>
                ))}
              </div>

              {/* Notification Bell */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-full text-slate-600 hover:text-pink-600 hover:bg-[#fff7f9] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Student Switcher / Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-pink-200 hover:border-pink-300 bg-white transition-all text-xs font-medium text-slate-800"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center font-bold text-[11px]">
                    {currentUser.name[0]}
                  </div>
                  <span className="hidden md:inline font-semibold">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-pink-100 p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-pink-50">
                      <div className="font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-slate-500 text-[11px] truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-pink-600 mt-0.5">{currentUser.contactNote}</div>
                    </div>

                    {/* Quick Switch Student (Useful for testing Blind Proposals) */}
                    <div className="py-2">
                      <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-pink-500" />
                        <span>Switch Student Persona:</span>
                      </div>
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            impersonateUser(u.id);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center justify-between ${
                            u.id === currentUser.id
                              ? 'bg-pink-50 text-pink-700 font-bold'
                              : 'text-slate-700 hover:bg-[#fff7f9]'
                          }`}
                        >
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">Score: {u.swapScore}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-1 border-t border-pink-50 flex items-center justify-between px-1">
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setUserMenuOpen(false);
                        }}
                        className="p-1.5 text-slate-600 hover:text-pink-600 flex items-center gap-1"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Sign In / Up</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="p-1.5 text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Tabs Bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-pink-50 bg-[#fff7f9] scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                isActive
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white/80'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Navbar;
