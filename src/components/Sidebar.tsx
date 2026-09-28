import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { SwapLoopLogo } from './SwapLoopLogo';
import {
  LayoutDashboard,
  FileText,
  Search,
  Package,
  Heart,
  Zap,
  Award,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Check,
  Lock,
  LogOut,
  Shield,
  Users
} from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenSettings,
  selectedCampus,
  onSelectCampus,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    currentRole,
    dropCountdownSeconds,
    items,
    wants,
    impersonateUser,
    allUsers,
    logout
  } = useSwapLoop();

  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);

  // Format seconds to HH:MM:SS strictly for single-line display
  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const campuses = [
    'North Campus',
    'Downtown Campus',
    'Engineering Quad',
    'Stanley'
  ];

  // Counts for badges
  const myHaveCount = currentUser ? items.filter(i => i.ownerId === currentUser.id).length : 0;
  const myWantCount = currentUser ? wants.filter(w => w.studentId === currentUser.id).length : 0;

  // 5 Demo Students for Fast Switcher
  const demoStudents = [
    { id: 'user-arjun', name: 'Arjun', email: 'arjun@college.edu' },
    { id: 'user-bhavya', name: 'Bhavya', email: 'bhavya@college.edu' },
    { id: 'user-chetan', name: 'Chetan', email: 'chetan@college.edu' },
    { id: 'user-divya', name: 'Divya', email: 'divya@college.edu' },
    { id: 'user-esha', name: 'Esha', email: 'esha@college.edu' }
  ];

  // Role-Based Navigation Items
  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge: string | null;
    isAction?: boolean;
  }

  let navItems: NavItem[] = [];

  if (currentRole === 'Desk Operator') {
    // Desk Operator View:
    // Hidden: Must NOT see "My Have List" or "My Want List"
    // Visible: Browse Campus Items, How the Rules Work, Start Test, Loop Wall, Swap Desk Escrow
    navItems = [
      {
        id: 'desk',
        label: 'Swap Desk Escrow',
        icon: Building2,
        badge: 'Desk'
      },
      {
        id: 'browse',
        label: 'Browse Campus Items',
        icon: Search,
        badge: items.length > 0 ? items.length.toString() : null
      },
      {
        id: 'how_it_works',
        label: 'How the Rules Work',
        icon: FileText,
        badge: 'Rules'
      },
      {
        id: 'drop',
        label: 'Start Test / Drop',
        icon: Zap,
        badge: 'Simulator'
      },
      {
        id: 'wall',
        label: 'Loop Wall / Loophole',
        icon: Award,
        badge: 'Stats'
      }
    ];
  } else if (currentRole === 'Admin') {
    // Admin View:
    // Full Oversight Access, Desk Escrow, Browse, Rules, Start Test, Loop Wall
    navItems = [
      {
        id: 'admin',
        label: 'Admin Oversight',
        icon: Shield,
        badge: 'Console'
      },
      {
        id: 'desk',
        label: 'Swap Desk Escrow',
        icon: Building2,
        badge: 'Desk'
      },
      {
        id: 'browse',
        label: 'Browse Campus Items',
        icon: Search,
        badge: items.length > 0 ? items.length.toString() : null
      },
      {
        id: 'how_it_works',
        label: 'How the Rules Work',
        icon: FileText,
        badge: 'Rules'
      },
      {
        id: 'drop',
        label: 'Start Test / Drop',
        icon: Zap,
        badge: 'Simulator'
      },
      {
        id: 'wall',
        label: 'Loop Wall / Loophole',
        icon: Award,
        badge: 'Stats'
      }
    ];
  } else {
    // Student View:
    // Visible: Dashboard, Browse Campus Items, How the Rules Work, My Have List, My Want List, Loop Wall
    navItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        badge: null
      },
      {
        id: 'browse',
        label: 'Browse Campus Items',
        icon: Search,
        badge: items.length > 0 ? items.length.toString() : null
      },
      {
        id: 'how_it_works',
        label: 'How the Rules Work',
        icon: FileText,
        badge: 'Rules'
      },
      {
        id: 'have',
        label: 'My Have List',
        icon: Package,
        badge: myHaveCount > 0 ? myHaveCount.toString() : null
      },
      {
        id: 'wants',
        label: 'My Want List',
        icon: Heart,
        badge: myWantCount > 0 ? myWantCount.toString() : null
      },
      {
        id: 'wall',
        label: 'Loop Wall / Loophole',
        icon: Award,
        badge: 'Stats'
      }
    ];
  }

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.id);
  };

  return (
    <aside
      className={`sticky top-0 h-screen bg-white/95 backdrop-blur-md border-r border-pink-100 flex flex-col justify-between z-30 transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64 lg:w-72'
      }`}
    >
      {/* TOP SECTION: BRAND + CAMPUS SWITCHER + FAST STUDENT SWITCHER */}
      <div className="p-4 sm:p-5 border-b border-pink-50 space-y-3.5 flex-shrink-0">
        {/* Brand Header & Rail Toggle */}
        <div className="flex items-center justify-between gap-2">
          <div
            onClick={() => {
              if (currentRole === 'Desk Operator') setActiveTab('desk');
              else if (currentRole === 'Admin') setActiveTab('admin');
              else setActiveTab('dashboard');
            }}
            className="cursor-pointer transition-transform hover:scale-[1.02] flex items-center min-w-0"
          >
            <SwapLoopLogo
              variant="badge"
              badgeSize="w-10 h-10"
              showText={!isCollapsed}
            />
          </div>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex w-7 h-7 rounded-xl bg-pink-50 hover:bg-pink-100 text-slate-500 hover:text-[#db2777] items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Rail'}
              aria-label="Toggle sidebar collapse"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Role Identity Tag */}
        {!isCollapsed && (
          <div className="flex items-center justify-between px-2.5 py-1 rounded-xl bg-pink-50/70 border border-pink-100 text-[11px] font-bold">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Active Role:</span>
            <span className="text-[#db2777] font-black">{currentRole}</span>
          </div>
        )}

        {/* Campus Switcher: Interactive Dropdown for Desk Operator/Admin, STRICTLY LOCKED for Students */}
        {!isCollapsed ? (
          currentRole === 'Student' ? (
            /* Student View: Campus is strictly locked to home campus */
            <div
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-[#FFF7FA] border border-pink-200/60 text-xs font-bold text-slate-700 shadow-2xs select-none"
              title="Students are locked to their registered home campus"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#db2777] flex-shrink-0" />
                <span className="truncate">{selectedCampus}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100/80 text-[10px] font-extrabold text-[#be185d]">
                <Lock className="w-2.5 h-2.5" />
                <span>Locked</span>
              </span>
            </div>
          ) : (
            /* Desk Operator / Admin View: Full multi-campus dropdown retained */
            <div className="relative">
              <button
                type="button"
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-[#FFF7FA] hover:bg-pink-50/80 border border-pink-200/80 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[#db2777] flex-shrink-0" />
                  <span className="truncate">{selectedCampus}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#db2777] transition-transform ${
                    campusDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {campusDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-pink-100 p-1.5 z-50 text-xs animate-fadeIn space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Select University Campus:
                  </div>
                  {campuses.map((camp) => (
                    <button
                      key={camp}
                      onClick={() => {
                        onSelectCampus(camp);
                        setCampusDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-semibold transition-all cursor-pointer ${
                        selectedCampus === camp
                          ? 'bg-pink-50 text-[#be185d] font-bold'
                          : 'text-slate-700 hover:bg-[#FFF7FA] hover:text-[#db2777]'
                      }`}
                    >
                      <span>{camp}</span>
                      {selectedCampus === camp && <Check className="w-3.5 h-3.5 text-[#db2777]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex justify-center" title={`Active Campus: ${selectedCampus}`}>
            <div className="w-10 h-10 rounded-2xl bg-[#FFF7FA] border border-pink-200 flex items-center justify-center text-[#db2777]">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Student View Fast Profile Switcher: 1-Tap switcher among 5 distinct student accounts */}
        {currentRole === 'Student' && !isCollapsed && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-[#db2777]" />
                <span>Fast Switch Demo Student:</span>
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {demoStudents.map((st) => {
                const isSelected = currentUser?.id === st.id || currentUser?.name.toLowerCase() === st.name.toLowerCase();
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      const match = allUsers.find(u => u.id === st.id || u.name.toLowerCase() === st.name.toLowerCase());
                      if (match) {
                        impersonateUser(match.id);
                      }
                    }}
                    className={`py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center truncate ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#db2777] to-[#be185d] text-white shadow-xs'
                        : 'bg-[#FFF7FA] hover:bg-pink-100/70 text-slate-700 border border-pink-200/60'
                    }`}
                    title={`Switch to ${st.name} (${st.email})`}
                  >
                    {st.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Single-Line Timer Badge: "Next Drop in: 10:24:36" */}
        <div
          className={`flex items-center justify-center rounded-2xl bg-[#FFF7FA] border border-pink-200/90 shadow-2xs ${
            isCollapsed ? 'p-2' : 'px-3 py-1.5'
          }`}
          title="Daily 5:00 PM Drop Matching Countdown"
        >
          <div className="flex items-center gap-2 whitespace-nowrap min-w-0">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#db2777]"></span>
            </span>

            {!isCollapsed && (
              <span className="font-mono text-[11px] font-bold text-[#be185d] tracking-tight whitespace-nowrap">
                Next Drop: {formatCountdown(dropCountdownSeconds)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: ROLE-FILTERED NAVIGATION ITEMS */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAction = item.isAction;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              title={item.label}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                isAction
                  ? 'bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-rose-500/20 text-[#be185d] border border-pink-200/80 shadow-2xs hover:shadow-sm'
                  : isActive
                  ? 'bg-gradient-to-r from-[#db2777] to-[#be185d] text-white shadow-md shadow-pink-500/20'
                  : 'text-slate-600 hover:text-[#db2777] hover:bg-[#FFF7FA]'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'text-white'
                    : isAction
                    ? 'text-amber-500'
                    : 'text-slate-400 group-hover:text-[#db2777]'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0 text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex-shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isAction
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-pink-100/80 text-[#be185d]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* BOTTOM SECTION: USER IDENTITY + SIGN OUT ACTION */}
      <div className="p-3 sm:p-4 border-t border-pink-100 bg-[#FFFDFE] flex-shrink-0 space-y-2">
        {currentUser && (
          <div className="flex items-center justify-between gap-2">
            {/* User Profile Card */}
            <div
              onClick={onOpenSettings}
              className={`flex items-center gap-2.5 min-w-0 cursor-pointer p-1 rounded-xl hover:bg-pink-50/60 transition-colors flex-1 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="Click to open profile settings"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#db2777] to-[#f472b6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.name[0]}
                </div>
                {currentUser.emailVerified && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                    <Check className="w-1.5 h-1.5 text-white stroke-[3]" />
                  </span>
                )}
              </div>

              {/* User Name & Verification Status */}
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-xs text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentUser.email}
                  </div>
                </div>
              )}
            </div>

            {/* Settings Gear */}
            {!isCollapsed && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="w-7 h-7 rounded-xl bg-pink-50 hover:bg-pink-100 text-slate-600 hover:text-[#db2777] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-2xs"
                title="Settings & Preferences"
                aria-label="Open settings"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Functional Sign Out Button */}
        <button
          type="button"
          onClick={logout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-2xs ${
            isCollapsed ? 'justify-center' : 'justify-center sm:justify-start'
          }`}
          title="Sign out of your SwapLoop account"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
