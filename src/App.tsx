import React, { useState } from 'react';
import { SwapLoopProvider, useSwapLoop } from './context/SwapLoopContext';
import { Navbar } from './components/Navbar';
import { AdminControlBar } from './components/AdminControlBar';
import { BrowseItemsView } from './components/BrowseItemsView';
import { MyItemsView } from './components/MyItemsView';
import { MyWantsView } from './components/MyWantsView';
import { TheDropView } from './components/TheDropView';
import { SwapDeskPortal } from './components/SwapDeskPortal';
import { LoopWallView } from './components/LoopWallView';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LoginPage } from './components/LoginPage';
import { TechArchitectureModal } from './components/TechArchitectureModal';

const MainAppLayout: React.FC = () => {
  const { activeTab, login } = useSwapLoop();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [showDedicatedLoginPage, setShowDedicatedLoginPage] = useState(false);

  // If user explicitly wants to view the standalone pixel-perfect login page
  if (showDedicatedLoginPage) {
    return (
      <div className="relative">
        <LoginPage
          onSignIn={async (email) => {
            await login(email);
            setShowDedicatedLoginPage(false);
          }}
          onOpenRegister={() => {
            setShowDedicatedLoginPage(false);
            setIsAuthOpen(true);
          }}
          onOpenForgotPassword={() => {
            alert("Password reset simulated for your university email.");
          }}
        />
        <button
          onClick={() => setShowDedicatedLoginPage(false)}
          className="fixed bottom-6 left-6 z-50 px-4 py-2 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-md hover:bg-slate-900 transition-all shadow-lg"
        >
          ← Return to SwapLoop Platform
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7f9] text-slate-800 selection:bg-pink-100 selection:text-pink-900 flex flex-col font-sans">
      {/* Admin Scenario Presets Bar (F10) */}
      <AdminControlBar />

      {/* Main Navbar (Tabs, Trust Badge, Swap Score, Role Switcher, Student Impersonation, How It Works) */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenNotifications={() => setIsNotifsOpen(true)}
        onOpenArchitecture={() => setIsArchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && <BrowseItemsView />}
        {activeTab === 'have' && <MyItemsView />}
        {activeTab === 'wants' && <MyWantsView />}
        {activeTab === 'drop' && <TheDropView />}
        {activeTab === 'desk' && <SwapDeskPortal />}
        {activeTab === 'wall' && <LoopWallView />}
      </main>

      {/* Footer & Reference Login View Switcher */}
      <footer className="mt-auto border-t border-pink-100 bg-white/70 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            SwapLoop — The Campus Circular • Soft Blush Mist Theme
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchOpen(true)}
              className="text-pink-600 hover:text-pink-700 font-semibold hover:underline"
            >
              System Architecture Diagram
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setShowDedicatedLoginPage(true)}
              className="text-slate-600 hover:text-pink-600 font-semibold hover:underline"
            >
              View Dedicated Login Screen (Reference Replica)
            </button>
            <span className="text-slate-300">•</span>
            <span>All trades 100% cashless</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <NotificationDrawer isOpen={isNotifsOpen} onClose={() => setIsNotifsOpen(false)} />
      <TechArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SwapLoopProvider>
      <MainAppLayout />
    </SwapLoopProvider>
  );
};

export default App;
