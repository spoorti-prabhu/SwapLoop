import { Item, User, WantRelation } from '../types/swaploop';

export const SEED_USERS_SCENARIO_A: User[] = [
  {
    id: 'user-arjun',
    name: 'Arjun Sharma',
    email: 'arjun@college.edu',
    contactNote: 'Hostel 3, Room 204 | Ph: +91 98765 43210',
    trustLevel: 'New',
    swapScore: 100,
    emailVerified: true,
    role: 'Student',
    completedSwapsCount: 0
  },
  {
    id: 'user-bhavya',
    name: 'Bhavya Patel',
    email: 'bhavya@college.edu',
    contactNote: 'Hostel 2, Room 112 | Ph: +91 98765 43211',
    trustLevel: 'New',
    swapScore: 100,
    emailVerified: true,
    role: 'Student',
    completedSwapsCount: 0
  },
  {
    id: 'user-chetan',
    name: 'Chetan Verma',
    email: 'chetan@college.edu',
    contactNote: 'Hostel 4, Room 305 | Ph: +91 98765 43212',
    trustLevel: 'New',
    swapScore: 100,
    emailVerified: true,
    role: 'Student',
    completedSwapsCount: 0
  },
  {
    id: 'user-divya',
    name: 'Divya Nair',
    email: 'divya@college.edu',
    contactNote: 'Hostel 1, Room 108 | Ph: +91 98765 43213',
    trustLevel: 'New',
    swapScore: 100,
    emailVerified: true,
    role: 'Student',
    completedSwapsCount: 0
  },
  {
    id: 'user-esha',
    name: 'Esha Rao',
    email: 'esha@college.edu',
    contactNote: 'Hostel 5, Room 402 | Ph: +91 98765 43214',
    trustLevel: 'New',
    swapScore: 100,
    emailVerified: true,
    role: 'Student',
    completedSwapsCount: 0
  }
];

export const SEED_ITEMS_SCENARIO_A: Item[] = [
  {
    id: 'item-drafter',
    ownerId: 'user-arjun',
    title: 'Mini drafter',
    category: 'Stationery',
    condition: 'Like New',
    valueBand: 'Low',
    isFreeGift: false,
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'item-bicycle',
    ownerId: 'user-bhavya',
    title: 'Bicycle',
    category: 'Hostel Gear',
    condition: 'Good',
    valueBand: 'Low', // In Scenario C, changed to 'Medium'
    isFreeGift: false,
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'item-ext-board',
    ownerId: 'user-chetan',
    title: 'Extension board',
    category: 'Electronics',
    condition: 'Like New',
    valueBand: 'Low',
    isFreeGift: false,
    createdAt: Date.now() - 3600000 * 3
  },
  {
    id: 'item-headphones',
    ownerId: 'user-divya',
    title: 'Headphones',
    category: 'Electronics',
    condition: 'Good',
    valueBand: 'Low',
    isFreeGift: false,
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'item-table-lamp',
    ownerId: 'user-esha',
    title: 'Table lamp',
    category: 'Furniture',
    condition: 'Good',
    valueBand: 'Low',
    isFreeGift: false,
    createdAt: Date.now() - 3600000 * 1
  }
];

export const SEED_WANTS_SCENARIO_A: WantRelation[] = [
  // Arjun wants Bicycle, Headphones
  { studentId: 'user-arjun', itemId: 'item-bicycle' },
  { studentId: 'user-arjun', itemId: 'item-headphones' },

  // Bhavya wants Extension board
  { studentId: 'user-bhavya', itemId: 'item-ext-board' },

  // Chetan wants Mini drafter
  { studentId: 'user-chetan', itemId: 'item-drafter' },

  // Divya wants Mini drafter
  { studentId: 'user-divya', itemId: 'item-drafter' },

  // Esha wants Bicycle
  { studentId: 'user-esha', itemId: 'item-bicycle' }
];

// Scenario B: Add Kiran with free gift
export const SEED_USER_KIRAN: User = {
  id: 'user-kiran',
  name: 'Kiran Reddy',
  email: 'kiran@college.edu',
  contactNote: 'Hostel 3, Room 110 | Ph: +91 98765 43215',
  trustLevel: 'Trusted',
  swapScore: 115,
  emailVerified: true,
  role: 'Student',
  completedSwapsCount: 4
};

export const SEED_ITEM_KIRAN_GIFT: Item = {
  id: 'item-study-table',
  ownerId: 'user-kiran',
  title: 'Solid Wood Study Table',
  category: 'Furniture',
  condition: 'Good',
  valueBand: 'Medium',
  isFreeGift: true,
  createdAt: Date.now() - 1800000
};
