import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Item,
  WantRelation,
  Proposal,
  AppNotification,
  LoopWallStats,
  UserRole,
  ItemCategory,
  ItemCondition,
  ValueBand
} from '../types/swaploop';
import {
  SEED_USERS_SCENARIO_A,
  SEED_ITEMS_SCENARIO_A,
  SEED_WANTS_SCENARIO_A
} from '../data/seedData';
import { api, setAuthUserId, getAuthUserId } from '../services/api';

interface SwapLoopContextType {
  // Auth & Current User
  currentUser: User | null;
  isAuthenticated: boolean;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  allUsers: User[];
  login: (email: string) => Promise<boolean>;
  signup: (data: { name: string; email: string; password?: string; contactNote: string }) => Promise<void>;
  logout: () => void;
  toggleEmailVerified: () => Promise<void>;
  impersonateUser: (userId: string) => void;

  // Items
  items: Item[];
  addItem: (item: {
    title: string;
    category: ItemCategory;
    condition: ItemCondition;
    valueBand: ValueBand;
    imageUrl?: string;
    isFreeGift: boolean;
  }) => Promise<void>;
  editItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;

  // Wants
  wants: WantRelation[];
  toggleWant: (itemId: string) => Promise<void>;
  isItemInWants: (itemId: string) => boolean;

  // The Drop & Matching
  proposals: Proposal[];
  dropCountdownSeconds: number;
  triggerDropNow: () => Promise<{ matchedCount: number; scenarioNote?: string }>;
  acceptProposal: (proposalId: string, studentId: string, handoverChoice?: 'desk' | 'meet') => Promise<void>;
  declineProposal: (proposalId: string, studentId: string) => Promise<void>;
  expireProposal: (proposalId: string) => Promise<void>;

  // Desk Operator Portal
  deskDropoffItem: (proposalId: string, dropoffCode: string) => Promise<{ success: boolean; message: string }>;
  deskPickupItem: (proposalId: string, pickupCode: string) => Promise<{ success: boolean; message: string }>;
  deskSimulateFailure: (proposalId: string) => Promise<void>;

  // Scenario Loader
  currentScenario: string;
  loadScenario: (scenario: 'A' | 'B' | 'C' | 'C_TRUSTED' | 'default') => Promise<void>;
  setScenario: (scenario: string) => Promise<void>;
  activeScenario: string;

  // Stats & Notifications
  stats: LoopWallStats;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => Promise<void>;
  clearNotifications: () => void;
  refreshData: () => Promise<void>;
}

const SwapLoopContext = createContext<SwapLoopContextType | undefined>(undefined);

export const SwapLoopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(SEED_USERS_SCENARIO_A);

  const initialAuthUserId = getAuthUserId();
  const initialAuthenticated = (localStorage.getItem('swaploop_authenticated') === 'true' || !!initialAuthUserId);
  const initialRole = (localStorage.getItem('swaploop_auth_role') as UserRole) || 'Student';

  const [currentUserId, setCurrentUserId] = useState<string>(initialAuthenticated ? initialAuthUserId : '');
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuthenticated && !!initialAuthUserId);
  const [activeTab, setActiveTab] = useState<string>(initialRole === 'Desk Operator' ? 'desk' : initialRole === 'Admin' ? 'admin' : 'dashboard');
  const [items, setItems] = useState<Item[]>(SEED_ITEMS_SCENARIO_A);
  const [wants, setWants] = useState<WantRelation[]>(SEED_WANTS_SCENARIO_A);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [currentScenario, setCurrentScenario] = useState<string>('A');
  const [stats, setStats] = useState<LoopWallStats>({ totalRehomed: 24, loopsCompleted: 8, longestGiftChain: 5 });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [dropCountdownSeconds, setDropCountdownSeconds] = useState<number>(3600 * 3 + 1420);

  // Sync data from real backend API
  const refreshData = async () => {
    try {
      const [usersRes, itemsRes, wantsRes, propsRes, statsRes, notifsRes, dropStatusRes] = await Promise.all([
        api.getUsers().catch(() => ({ users: [] })),
        api.getItems().catch(() => ({ items: [] })),
        api.getWants().catch(() => ({ wants: [] })),
        api.getProposals().catch(() => ({ proposals: [] })),
        api.getStats().catch(() => null),
        api.getNotifications().catch(() => ({ notifications: [] })),
        api.getDropStatus().catch(() => null)
      ]);

      if (usersRes.users && usersRes.users.length > 0) {
        const mappedUsers: User[] = usersRes.users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          contactNote: u.contact_note,
          trustLevel: u.trust_level,
          swapScore: u.swap_score,
          emailVerified: u.email_verified === 1,
          role: u.role,
          completedSwapsCount: u.completed_swaps_count
        }));
        setUsers(mappedUsers);

        // Sync role if current user is active
        if (currentUserId) {
          const activeUser = mappedUsers.find(u => u.id === currentUserId);
          if (activeUser) {
            setCurrentRole(activeUser.role);
            localStorage.setItem('swaploop_auth_role', activeUser.role);
          }
        }
      }

      if (itemsRes.items && itemsRes.items.length > 0) {
        setItems(itemsRes.items.map((it: any) => ({
          id: it.id,
          ownerId: it.owner_id,
          title: it.title,
          category: it.category,
          condition: it.condition,
          valueBand: it.value_band,
          imageUrl: it.image_url,
          isFreeGift: it.is_free_gift === 1,
          isLockedInProposal: it.is_locked_in_proposal === 1,
          createdAt: it.created_at
        })));
      }

      if (wantsRes.wants) {
        setWants(wantsRes.wants.map((w: any) => ({
          studentId: w.student_id,
          itemId: w.item_id
        })));
      }

      if (propsRes.proposals) {
        setProposals(propsRes.proposals);
      }

      if (statsRes) {
        setStats({
          totalRehomed: statsRes.totalRehomed,
          loopsCompleted: statsRes.loopsCompleted,
          longestGiftChain: statsRes.longestGiftChain
        });
        if (statsRes.activeScenario) {
          setCurrentScenario(statsRes.activeScenario);
        }
      }

      if (notifsRes.notifications) {
        setNotifications(notifsRes.notifications.map((n: any) => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          type: n.type,
          read: n.read === 1,
          timestamp: n.created_at
        })));
      }

      if (dropStatusRes) {
        setDropCountdownSeconds(dropStatusRes.secondsUntilDrop);
      }
    } catch (err) {
      console.warn('API sync warning (using optimistic state):', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUserId]);

  // Live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDropCountdownSeconds(prev => (prev > 0 ? prev - 1 : 3600 * 24));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentUser = currentUserId ? (users.find(u => u.id === currentUserId) || null) : null;

  // Auth
  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await api.login(email);
      if (res.user) {
        setCurrentUserId(res.user.id);
        setCurrentRole(res.user.role);
        setIsAuthenticated(true);
        setAuthUserId(res.user.id);
        localStorage.setItem('swaploop_authenticated', 'true');
        localStorage.setItem('swaploop_auth_role', res.user.role);
        if (res.user.role === 'Desk Operator') {
          setActiveTab('desk');
        } else if (res.user.role === 'Admin') {
          setActiveTab('admin');
        } else {
          setActiveTab('dashboard');
        }
        await refreshData();
        return true;
      }
    } catch (err) {
      console.warn('Backend login attempt failed, attempting fallback match:', err);
      // Fallback matching seeded users if API is syncing
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (matched) {
        setCurrentUserId(matched.id);
        setCurrentRole(matched.role);
        setIsAuthenticated(true);
        setAuthUserId(matched.id);
        localStorage.setItem('swaploop_authenticated', 'true');
        localStorage.setItem('swaploop_auth_role', matched.role);
        if (matched.role === 'Desk Operator') {
          setActiveTab('desk');
        } else if (matched.role === 'Admin') {
          setActiveTab('admin');
        } else {
          setActiveTab('dashboard');
        }
        return true;
      }
    }
    return false;
  };

  const signup = async (data: { name: string; email: string; password?: string; contactNote: string }) => {
    try {
      const res = await api.register(data);
      if (res.user) {
        setCurrentUserId(res.user.id);
        setCurrentRole(res.user.role);
        setIsAuthenticated(true);
        setAuthUserId(res.user.id);
        localStorage.setItem('swaploop_authenticated', 'true');
        localStorage.setItem('swaploop_auth_role', res.user.role);
        await refreshData();
      }
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  };

  const logout = () => {
    setCurrentUserId('');
    setCurrentRole('Student');
    setIsAuthenticated(false);
    setAuthUserId('');
    localStorage.removeItem('swaploop_authenticated');
    localStorage.removeItem('swaploop_auth_role');
    localStorage.removeItem('swaploop_auth_user_id');
    setActiveTab('dashboard');
  };

  const toggleEmailVerified = async () => {
    try {
      await api.toggleEmailVerify();
      await refreshData();
    } catch (err) {
      console.error('Email verify error:', err);
    }
  };

  const impersonateUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      setCurrentRole(targetUser.role);
      setIsAuthenticated(true);
      setAuthUserId(targetUser.id);
      localStorage.setItem('swaploop_authenticated', 'true');
      localStorage.setItem('swaploop_auth_role', targetUser.role);
      if (targetUser.role === 'Desk Operator') {
        setActiveTab('desk');
      } else if (targetUser.role === 'Admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
    }
  };

  // Item Management (F2, T4)
  const addItem = async (itemData: {
    title: string;
    category: ItemCategory;
    condition: ItemCondition;
    valueBand: ValueBand;
    imageUrl?: string;
    isFreeGift: boolean;
  }) => {
    try {
      await api.createItem(itemData);
      await refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to add item');
      throw err;
    }
  };

  const editItem = async (id: string, updates: Partial<Item>) => {
    try {
      await api.updateItem(id, updates);
      await refreshData();
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await api.deleteItem(id);
      await refreshData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Wants Management
  const toggleWant = async (itemId: string) => {
    try {
      await api.toggleWant(itemId);
      await refreshData();
    } catch (err) {
      console.error('Toggle want error:', err);
    }
  };

  const isItemInWants = (itemId: string): boolean => {
    if (!currentUser) return false;
    return wants.some(w => w.studentId === currentUser.id && w.itemId === itemId);
  };

  // The Drop Matching Engine Trigger (F5, F6, F11, T4)
  const triggerDropNow = async (): Promise<{ matchedCount: number; scenarioNote?: string }> => {
    try {
      const res = await api.triggerDrop();
      await refreshData();

      // Confetti celebratory burst on matching success!
      if (res.createdProposalsCount > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      return {
        matchedCount: res.createdProposalsCount,
        scenarioNote: res.scenarioNote
      };
    } catch (err: any) {
      console.error('Trigger drop error:', err);
      return { matchedCount: 0, scenarioNote: err.message };
    }
  };

  // Proposal Lifecycle (F8, F9)
  const acceptProposal = async (proposalId: string, _studentId: string, handoverChoice: 'desk' | 'meet' = 'desk') => {
    try {
      const res = await api.acceptProposal(proposalId, handoverChoice);
      await refreshData();

      if (res.allAccepted) {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 }
        });
      }
    } catch (err) {
      console.error('Accept proposal error:', err);
    }
  };

  const declineProposal = async (proposalId: string, _studentId: string) => {
    try {
      await api.declineProposal(proposalId);
      await refreshData();
    } catch (err) {
      console.error('Decline proposal error:', err);
    }
  };

  const expireProposal = async (proposalId: string) => {
    try {
      await api.expireProposal(proposalId);
      await refreshData();
    } catch (err) {
      console.error('Expire proposal error:', err);
    }
  };

  // Swap Desk Escrow (T2, T3)
  const deskDropoffItem = async (proposalId: string, dropoffCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.deskDropoff(proposalId, dropoffCode);
      await refreshData();
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Drop-off verification failed' };
    }
  };

  const deskPickupItem = async (proposalId: string, pickupCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.deskPickup(proposalId, pickupCode);
      await refreshData();

      if (res.isAllCompleted) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      }
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Pickup verification failed' };
    }
  };

  const deskSimulateFailure = async (proposalId: string) => {
    try {
      await api.deskSimulateFailure(proposalId);
      await refreshData();
    } catch (err) {
      console.error('Simulate failure error:', err);
    }
  };

  // Scenario Loader (F10)
  const loadScenario = async (scenario: 'A' | 'B' | 'C' | 'C_TRUSTED' | 'default') => {
    try {
      await api.loadScenario(scenario);
      await refreshData();
    } catch (err) {
      console.error('Load scenario error:', err);
    }
  };

  const setScenario = async (scenario: string) => {
    try {
      await api.loadScenario(scenario);
      await refreshData();
    } catch (err) {
      console.error('Set scenario error:', err);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      await refreshData();
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SwapLoopContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        isAuthenticated,
        activeTab,
        setActiveTab,
        allUsers: users,
        login,
        signup,
        logout,
        toggleEmailVerified,
        impersonateUser,
        items,
        addItem,
        editItem,
        deleteItem,
        wants,
        toggleWant,
        isItemInWants,
        proposals,
        dropCountdownSeconds,
        triggerDropNow,
        acceptProposal,
        declineProposal,
        expireProposal,
        deskDropoffItem,
        deskPickupItem,
        deskSimulateFailure,
        currentScenario,
        loadScenario,
        setScenario,
        activeScenario: currentScenario,
        stats,
        notifications,
        markNotificationRead,
        clearNotifications,
        refreshData
      }}
    >
      {children}
    </SwapLoopContext.Provider>
  );
};

export const useSwapLoop = () => {
  const context = useContext(SwapLoopContext);
  if (!context) {
    throw new Error('useSwapLoop must be used within a SwapLoopProvider');
  }
  return context;
};
