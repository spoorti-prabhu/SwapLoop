import { ItemCategory, ItemCondition, ValueBand } from '../types/swaploop';

let currentAuthUserId = localStorage.getItem('swaploop_auth_user_id') || 'user-arjun';

export const setAuthUserId = (id: string) => {
  currentAuthUserId = id;
  localStorage.setItem('swaploop_auth_user_id', id);
};

export const getAuthUserId = () => currentAuthUserId;

const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': currentAuthUserId,
    ...(options.headers || {})
  };

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  // Auth
  login: (email: string) => apiRequest<{ user: any }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  register: (data: { name: string; email: string; password?: string; contactNote: string }) =>
    apiRequest<{ user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getCurrentUser: () => apiRequest<{ user: any }>('/api/auth/me'),

  toggleEmailVerify: () => apiRequest<{ email_verified: boolean }>('/api/auth/toggle-verify', {
    method: 'POST'
  }),

  getUsers: () => apiRequest<{ users: any[] }>('/api/users'),

  // Items
  getItems: () => apiRequest<{ items: any[] }>('/api/items'),

  createItem: (data: {
    title: string;
    category: ItemCategory;
    condition: ItemCondition;
    valueBand: ValueBand;
    isFreeGift: boolean;
  }) => apiRequest<{ item: any }>('/api/items', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateItem: (id: string, data: any) => apiRequest<{ item: any }>(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteItem: (id: string) => apiRequest<{ success: boolean }>(`/api/items/${id}`, {
    method: 'DELETE'
  }),

  // Wants
  getWants: () => apiRequest<{ wants: any[] }>('/api/wants'),

  toggleWant: (itemId: string) => apiRequest<{ inWants: boolean }>('/api/wants/toggle', {
    method: 'POST',
    body: JSON.stringify({ itemId })
  }),

  // The Drop & Proposals
  triggerDrop: () => apiRequest<{ createdProposalsCount: number; scenarioNote: string }>('/api/drop/trigger', {
    method: 'POST'
  }),

  getDropStatus: () => apiRequest<{ scheduledTime: string; secondsUntilDrop: number }>('/api/drop/status'),

  getProposals: () => apiRequest<{ proposals: any[] }>('/api/proposals'),

  acceptProposal: (proposalId: string, handoverChoice: 'desk' | 'meet' = 'desk') =>
    apiRequest<{ success: boolean; allAccepted: boolean }>(`/api/proposals/${proposalId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ handoverChoice })
    }),

  declineProposal: (proposalId: string) =>
    apiRequest<{ success: boolean; dissolved: boolean }>(`/api/proposals/${proposalId}/decline`, {
      method: 'POST'
    }),

  expireProposal: (proposalId: string) =>
    apiRequest<{ success: boolean; expired: boolean }>(`/api/proposals/${proposalId}/expire`, {
      method: 'POST'
    }),

  // Swap Desk (T2, T3)
  deskDropoff: (proposalId: string, dropoffCode: string) =>
    apiRequest<{ success: boolean; message: string }>('/api/desk/dropoff', {
      method: 'POST',
      body: JSON.stringify({ proposalId, dropoffCode })
    }),

  deskPickup: (proposalId: string, pickupCode: string) =>
    apiRequest<{ success: boolean; message: string; isAllCompleted: boolean }>('/api/desk/pickup', {
      method: 'POST',
      body: JSON.stringify({ proposalId, pickupCode })
    }),

  deskSimulateFailure: (proposalId: string) =>
    apiRequest<{ success: boolean; message: string }>('/api/desk/simulate-failure', {
      method: 'POST',
      body: JSON.stringify({ proposalId })
    }),

  // Swap Meet (Section 17 & 29)
  meetCheckin: (proposalId: string, campusLocationCode: string) =>
    apiRequest<{ success: boolean; allCheckedIn: boolean; message: string }>('/api/meet/checkin', {
      method: 'POST',
      body: JSON.stringify({ proposalId, campusLocationCode })
    }),

  // Reports (Section 22)
  submitReport: (data: { reportedUserId: string; proposalId?: string; reason: string; details?: string }) =>
    apiRequest<{ success: boolean; reportId: string }>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getReports: () => apiRequest<{ reports: any[] }>('/api/reports'),

  resolveReport: (reportId: string, action: 'uphold' | 'dismiss') =>
    apiRequest<{ success: boolean }>(`/api/reports/${reportId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ action })
    }),

  // Scenarios (F10)
  loadScenario: (name: string) => apiRequest<{ success: boolean; scenario: string }>(`/api/scenarios/${name}`, {
    method: 'POST'
  }),

  // Stats & Notifications
  getStats: () => apiRequest<{ totalRehomed: number; loopsCompleted: number; longestGiftChain: number; activeScenario: string }>('/api/stats'),

  getNotifications: () => apiRequest<{ notifications: any[] }>('/api/notifications'),

  markNotificationRead: (id: string) => apiRequest<{ success: boolean }>(`/api/notifications/${id}/read`, {
    method: 'PUT'
  })
};
