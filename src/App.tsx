import React, { useState, useEffect } from 'react';
import { SwapLoopProvider, useSwapLoop } from './context/SwapLoopContext';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { Dashboard } from './components/Dashboard';
import { HomeHeroView } from './components/HomeHeroView';
import { BrowseItemsView } from './components/BrowseItemsView';
import { MyItemsView } from './components/MyItemsView';
import { MyWantsView } from './components/MyWantsView';
import { LoopWallView } from './components/LoopWallView';
import { SwapDeskPortal } from './components/SwapDeskPortal';
import { TheDropView } from './components/TheDropView';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AdminControlBar } from './components/AdminControlBar';
import { LoginPage } from './components/LoginPage';
import { AdminView } from './components/AdminView';
import { DeskOperatorDashboard } from './components/DeskOperatorDashboard';
import { DeskLedgerView } from './components/DeskLedgerView';
import { GlitterCursor } from './components/GlitterCursor';
import {
  Bell,
  Award,
  Shield,
  Menu,
  X,
  Sliders,
  LogOut,
  Zap,
  Building2
} from 'lucide-react';
import { UserRole } from './types/swaploop';

const MainAppLayout: React.FC = () => {
  const {
    activeTab,
    currentUser,
    currentRole,
    setCurrentRole,
    isAuthenticated,
    notifications,
    triggerDropNow,
    login,
    logout
  } = useSwapLoop();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminBarVisible, setIsAdminBarVisible] = useState(true);
  const [isHeaderDropRunning, setIsHeaderDropRunning] = useState(false);

  // F10 hotkey listener for Admin and Desk Operator to toggle scenario presets
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F10') {
        e.preventDefault();
        if (currentRole === 'Admin' || currentRole === 'Desk Operator') {
          setIsAdminBarVisible((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRole]);

  const [selectedCampus, setSelectedCampus] = useState(() => {
    return localStorage.getItem('swaploop_selected_campus') || 'North Campus';
  });

  const handleSelectCampus = (campus: string) => {
    setSelectedCampus(campus);
    localStorage.setItem('swaploop_selected_campus', campus);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Auth Guard: If user is not authenticated or currentUser is null, display the Sign-In screen
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="relative min-h-screen">
        <LoginPage
          onSignIn={async (email) => {
            await login(email);
          }}
          onOpenRegister={() => {
            setIsAuthOpen(true);
          }}
          onOpenForgotPassword={() => {
            alert('Password reset link sent to your registered university email.');
          }}
        />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  // Active view title mapping for breadcrumbs
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Student Dashboard';
      case 'desk_dashboard':
        return 'Desk Operator Dashboard';
      case 'desk_ledger':
        return 'Desk Ledger & Verification Log';
      case 'how_it_works':
        return 'How the Rules Work';
      case 'browse':
        return 'Browse Campus Items';
      case 'have':
        return 'My Have List';
      case 'wants':
        return 'My Want List';
      case 'wall':
        return 'Loop Wall & Campus Impact';
      case 'desk':
        return 'Swap Desk Verification Escrow';
      case 'drop':
        return 'The Drop Matching Engine';
      case 'admin':
        return 'Campus Administration & Oversight';
      default:
        return 'Campus Circular';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FFF7FA] text-slate-800 overflow-hidden font-sans selection:bg-pink-100 selection:text-pink-900">
      {/* 1. LEFT-HAND VERTICAL STICKY SIDEBAR NAVIGATION */}
      {/* Desktop / Split-Screen Sidebar */}
      <div className="hidden md:flex flex-shrink-0 h-full">
        <Sidebar
          onOpenSettings={() => setIsSettingsOpen(true)}
          selectedCampus={selectedCampus}
          onSelectCampus={handleSelectCampus}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-72 h-full bg-white shadow-2xl relative">
            <Sidebar
              onOpenSettings={() => {
                setIsMobileMenuOpen(false);
                setIsSettingsOpen(true);
              }}
              selectedCampus={selectedCampus}
              onSelectCampus={(camp) => {
                handleSelectCampus(camp);
                setIsMobileMenuOpen(false);
              }}
              isCollapsed={false}
            />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 text-slate-600 flex items-center justify-center hover:bg-pink-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* 2. MAIN APP CONTENT CONTAINER (Split-screen safe: flex-1 min-w-0) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Admin Scenario Presets Bar (strictly hidden from Students, toggleable via F10) */}
        {(currentRole === 'Admin' || currentRole === 'Desk Operator') && (
          <AdminControlBar
            isVisible={isAdminBarVisible}
            onToggleVisibility={() => setIsAdminBarVisible(false)}
          />
        )}

        {/* Lightweight Top Navigation Rail */}
        <header className="h-16 border-b border-pink-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 flex-shrink-0 z-20">
          {/* Left: Mobile hamburger & Active Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-pink-50 text-slate-700 hover:text-[#db2777] hover:bg-pink-100 transition-colors cursor-pointer"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">SwapLoop</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {getTabTitle(activeTab)}
              </h1>
            </div>
          </div>

          {/* Right: Quick actions, Role Switcher, Notifications, Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* On-demand Run Drop Now Button for Desk Operator */}
            {currentRole === 'Desk Operator' && (
              <button
                onClick={async () => {
                  setIsHeaderDropRunning(true);
                  try {
                    await triggerDropNow();
                  } finally {
                    setIsHeaderDropRunning(false);
                  }
                }}
                disabled={isHeaderDropRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#db2777] hover:bg-[#be185d] text-white text-xs font-black shadow-xs transition-all cursor-pointer disabled:opacity-50"
                title="Immediately run circular matching engine on-demand"
              >
                <Zap className={`w-3.5 h-3.5 ${isHeaderDropRunning ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isHeaderDropRunning ? 'Running...' : 'Run Drop Now'}</span>
              </button>
            )}

            {/* Role & Trust Badges */}
            {currentUser && currentRole === 'Desk Operator' ? (
              <div
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-pink-50 border-pink-200 text-[#db2777]"
                title="Residence Hall Escrow Station #1 · Staff Role"
              >
                <Building2 className="w-3 h-3 text-[#db2777]" />
                <span>Station #1 Staff</span>
              </div>
            ) : currentUser && currentRole === 'Admin' ? (
              <div
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-slate-900 border-slate-800 text-white"
                title="Campus Administrator Oversight"
              >
                <Shield className="w-3 h-3 text-pink-400" />
                <span>Admin Oversight</span>
              </div>
            ) : currentUser ? (
              <div
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  currentUser.trustLevel === 'New'
                    ? 'bg-pink-50 border-pink-200 text-[#be185d]'
                    : currentUser.trustLevel === 'Trusted'
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
                title={`Trust Level: ${currentUser.trustLevel}`}
              >
                <Shield className="w-3 h-3" />
                <span>{currentUser.trustLevel} Tier</span>
              </div>
            ) : null}

            {/* Swap Score Pill - Students only */}
            {currentUser && currentRole === 'Student' && (
              <div
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-2xs"
                title="Swap Score (starts at 100)"
              >
                <Award className="w-3 h-3 text-amber-400" />
                <span>{currentUser.swapScore} pts</span>
              </div>
            )}

            {/* Quick Role Switcher */}
            <div className="hidden xl:flex items-center bg-[#FFF7FA] p-1 rounded-full border border-pink-100 text-[11px] font-semibold">
              {(['Student', 'Desk Operator', 'Admin'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentRole(role);
                  }}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    currentRole === role
                      ? 'bg-white text-[#db2777] shadow-2xs font-bold border border-pink-200'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {role === 'Desk Operator' ? 'Desk Operator' : role === 'Admin' ? 'Admin' : 'Student'}
                </button>
              ))}
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifsOpen(true)}
              className="relative p-2 rounded-full text-slate-600 hover:text-[#db2777] hover:bg-pink-50/80 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#db2777] text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Settings Quick Access */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full text-slate-600 hover:text-[#db2777] hover:bg-pink-50/80 transition-colors cursor-pointer"
              title="Open Campus & Student Settings"
              aria-label="Settings"
            >
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Sign Out Button in Header */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer shadow-2xs"
              title="Sign out of your active session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* 3. SCROLLABLE MAIN CONTENT (50/50 Split-Screen desktop safe) */}
        <main className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 scrollbar-thin">
          <div className="max-w-6xl mx-auto w-full min-w-0">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'desk_dashboard' && <DeskOperatorDashboard />}
            {activeTab === 'desk_ledger' && <DeskLedgerView />}
            {activeTab === 'how_it_works' && <HomeHeroView />}
            {activeTab === 'home' && <HomeHeroView />}
            {activeTab === 'browse' && <BrowseItemsView />}
            {activeTab === 'have' && <MyItemsView />}
            {activeTab === 'wants' && <MyWantsView />}
            {activeTab === 'wall' && <LoopWallView />}
            {activeTab === 'desk' && <SwapDeskPortal selectedCampus={selectedCampus} />}
            {activeTab === 'drop' && <TheDropView />}
            {activeTab === 'admin' && <AdminView />}
          </div>
        </main>

        {/* 4. COMPACT FOOTER */}
        <footer className="border-t border-pink-100 bg-white/70 backdrop-blur-sm py-3 px-4 sm:px-6 flex-shrink-0 text-[11px] text-slate-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">SwapLoop</span>
              <span>•</span>
              <span>Campus Circular Economy</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">100% Cashless Dorm Swaps</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className="text-rose-600 hover:underline font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals & Drawers */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedCampus={selectedCampus}
        onSelectCampus={handleSelectCampus}
      />
      <NotificationDrawer isOpen={isNotifsOpen} onClose={() => setIsNotifsOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SwapLoopProvider>
      <GlitterCursor />
      <MainAppLayout />
    </SwapLoopProvider>
  );
};

export default App;
