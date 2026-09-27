export type Category = 
  | 'Textbooks'
  | 'Electronics'
  | 'Dorm & Living'
  | 'Clothing'
  | 'Bikes & Transit'
  | 'Kitchen'
  | 'Games & Hobbies';

export type Condition = 'Like New' | 'Gently Used' | 'Good' | 'Fair';

export interface SwapItem {
  id: string;
  title: string;
  category: Category;
  condition: Condition;
  image: string;
  description: string;
  lookingFor: string;
  ownerName: string;
  ownerAvatar: string;
  campusDorm: string;
  postedTime: string;
  swapCount: number;
  featured?: boolean;
}

export interface SwapOffer {
  id: string;
  targetItemId: string;
  offeredItemId: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  senderName: string;
  recipientName: string;
  safeLocation: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  university: string;
  dorm: string;
  avatar: string;
  totalSwaps: number;
  carbonSavedKg: number;
  rating: number;
}
