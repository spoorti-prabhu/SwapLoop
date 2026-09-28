import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Bell,
  MapPin,
  UserCheck,
  Check,
  Building2,
  LogOut,
  Sparkles,
  Users
} from 'lucide-react';
import { UserRole } from '../types/swaploop';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedCampus,
  onSelectCampus
}) => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    toggleEmailVerified,
    allUsers,
    impersonateUser,
    logout
  } = useSwapLoop();

  const [notifications, setNotifications] = useState({
    dropMatches: true,
    expiringAlerts: true,
    deskEscrow: true,
    circularStats: false
  });

  const [selectedSafeLocation, setSelectedSafeLocation] = useState(
    'Main Student Union Desk (Ground Floor Certified Escrow)'
  );

  if (!isOpen || !currentUser) return null;

  const campuses = [
    'North Campus',
    'Downtown Campus',
    'Engineering Quad',
    'Stanley'
  ];

  const safeLocations = [
    {
      id: 'loc1',
      name: 'Main Student Union Desk (Ground Floor Certified Escrow)',
      desc: 'Staffed Mon-Fri 8 AM - 8 PM • QR escrow code verified'
    },
    {
      id: 'loc2',
      name: 'Engineering Quad Commons (Locker Pod B)',
      desc: 'Self-service 24/7 digital locker drop'
    },
    {
      id: 'loc3',
      name: 'Downtown Campus Library Desk',
      desc: 'Reserve circulation desk pick-up'
    },
    {
      id: 'loc4',
      name: 'North Campus Recreation Center Desk',
      desc: 'Staffed until 10 PM daily'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2rem] border border-pink-200/90 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-4">
          <div className="space-y-0.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#db2777] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Preferences</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Settings & Student Profile
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. CAMPUS VERIFICATION STATUS & TOGGLE */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 via-white to-pink-50/40 border border-pink-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentUser.emailVerified ? (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                  <span>Student Campus Verification</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      currentUser.emailVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentUser.emailVerified ? '✓ Verified Student' : '⚠️ Unverified'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
              </div>
            </div>

            <button
              onClick={async () => {
                await toggleEmailVerified();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                currentUser.emailVerified
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {currentUser.emailVerified ? 'Simulate Unverify' : 'Simulate Verify'}
            </button>
          </div>

          <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-pink-100">
            {currentUser.emailVerified ? (
              <span className="text-emerald-700 font-medium">
                ✓ Student identity confirmed. Eligible for multi-student loop matching and campus desk escrow.
              </span>
            ) : (
              <span className="text-amber-700 font-medium">
                ⚠️ Unverified accounts are limited to browsing. Verify to participate in daily 5:00 PM drops.
              </span>
            )}
          </div>
        </div>

        {/* 2. CAMPUS SELECTION */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#db2777]" />
            <span>Active Campus Zone</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {campuses.map((camp) => (
              <button
                key={camp}
                onClick={() => onSelectCampus(camp)}
                className={`p-3 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                  selectedCampus === camp
                    ? 'bg-[#db2777] text-white border-[#db2777] shadow-sm shadow-pink-500/25'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-pink-200 hover:bg-pink-50/50'
                }`}
              >
                <div className="truncate">{camp}</div>
                <div
                  className={`text-[10px] font-normal mt-0.5 ${
                    selectedCampus === camp ? 'text-pink-100' : 'text-slate-400'
                  }`}
                >
                  {selectedCampus === camp ? '● Active Loop Pool' : 'Connect'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. SAFE PICKUP & ESCROW LOCATIONS */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#db2777]" />
            <span>Preferred Safe Escrow Drop Location</span>
          </label>
          <div className="space-y-2">
            {safeLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => setSelectedSafeLocation(loc.name)}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  selectedSafeLocation === loc.name
                    ? 'bg-pink-50/70 border-pink-300 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-pink-200'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center border ${
                    selectedSafeLocation === loc.name
                      ? 'border-[#db2777] bg-[#db2777] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedSafeLocation === loc.name && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{loc.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{loc.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. NOTIFICATION PREFERENCES */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#db2777]" />
            <span>Student Notification Channels</span>
          </label>
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2.5 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-700">Daily Drop loop match notifications</span>
              <input
                type="checkbox"
                checked={notifications.dropMatches}
                onChange={(e) => setNotifications({ ...notifications, dropMatches: e.target.checked })}
                className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-700">Proposal 5-minute countdown alert</span>
              <input
                type="checkbox"
                checked={notifications.expiringAlerts}
                onChange={(e) => setNotifications({ ...notifications, expiringAlerts: e.target.checked })}
                className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-700">Swap Desk escrow drop-off ready</span>
              <input
                type="checkbox"
                checked={notifications.deskEscrow}
                onChange={(e) => setNotifications({ ...notifications, deskEscrow: e.target.checked })}
                className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 5. ROLE SWITCHER */}
        <div className="space-y-2 pt-2 border-t border-pink-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#db2777]" />
            <span>Active Persona Role</span>
          </div>
          <div className="flex items-center gap-2">
            {(['Student', 'Desk Operator'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  currentRole === role
                    ? 'bg-[#db2777] text-white border-[#db2777] shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-pink-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* 6. STUDENT PERSONA SWITCHER */}
        <div className="space-y-2 pt-2 border-t border-pink-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#db2777]" />
            <span>Persona Impersonation (Algorithm Testing)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allUsers
              .filter((u) => u.role === 'Student')
              .map((u) => (
                <button
                  key={u.id}
                  onClick={() => impersonateUser(u.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs cursor-pointer transition-all ${
                    u.id === currentUser.id
                      ? 'bg-pink-100/80 border-pink-300 font-bold text-[#be185d]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-pink-50/50'
                  }`}
                >
                  <div className="font-bold truncate">{u.name}</div>
                  <div className="text-[10px] text-slate-500">{u.trustLevel} • {u.swapScore} pts</div>
                </button>
              ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#db2777] to-[#be185d] text-white font-bold text-xs shadow-md shadow-pink-500/25 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
