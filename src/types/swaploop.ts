export type TrustLevel = 'New' | 'Trusted' | 'Veteran';

export type UserRole = 'Student' | 'Desk Operator' | 'Admin';

export type ItemCategory = 
  | 'Books'
  | 'Electronics'
  | 'Stationery'
  | 'Furniture'
  | 'Hostel Gear'
  | 'Lab Gear'
  | 'Clothing';

export type ItemCondition = 'Like New' | 'Good' | 'Fair';

export type ValueBand = 'Low' | 'Medium' | 'High';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  contactNote: string; // Private phone or hostel room
  trustLevel: TrustLevel;
  swapScore: number;
  emailVerified: boolean;
  role: UserRole;
  completedSwapsCount: number;
  currentDropCode?: string;
}

export interface Item {
  id: string;
  ownerId: string;
  title: string;
  category: ItemCategory;
  condition: ItemCondition;
  valueBand: ValueBand;
  imageUrl?: string;
  isFreeGift: boolean;
  isLockedInProposal?: boolean;
  createdAt: number;
}

export interface WantRelation {
  studentId: string;
  itemId: string;
}

export interface ProposalMember {
  studentId: string;
  codename: string; // e.g. "Swapper 1", "Swapper 2"
  givesItemId: string;
  receivesItemId: string;
  accepted: boolean;
  handoverChoice?: 'desk' | 'meet';
  checkedInMeet?: boolean;
  dropoffCode: string; // 6-character alphanumeric code
  dropoffDone: boolean;
  pickupCode: string; // 6-character alphanumeric code
  pickupDone: boolean;
  returnCode?: string; // Generated if proposal fails after dropoff
  name?: string; // Revealed when sealed
  email?: string; // Revealed when sealed
  contactNote?: string; // Revealed when sealed
}

export type ProposalStatus = 
  | 'proposed' 
  | 'sealed' 
  | 'eligible'
  | 'declined' 
  | 'expired' 
  | 'completed' 
  | 'failed';

export interface Proposal {
  id: string;
  type: 'loop' | 'gift_chain';
  members: ProposalMember[];
  status: ProposalStatus;
  handoverMethod?: 'desk' | 'meet';
  createdAt: number;
  expiresAt: number; // e.g. 5 minutes countdown
  signature: string; // Unique signature to ensure declined/expired loops are never offered again
  failureReason?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'proposal' | 'sealed' | 'desk' | 'system';
}

export interface LoopWallStats {
  totalRehomed: number;
  loopsCompleted: number;
  longestGiftChain: number;
}
