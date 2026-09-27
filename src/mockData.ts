import { SwapItem, UserProfile } from './types';

export const currentUserMock: UserProfile = {
  name: 'Maya Lin',
  email: 'm.lin@university.edu',
  university: 'State University',
  dorm: 'West Quad Hall 304',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  totalSwaps: 14,
  carbonSavedKg: 42.6,
  rating: 4.9
};

export const safeHandoverLocations = [
  {
    name: 'Main Campus Library Lobby',
    badge: 'Staffed & Monitored',
    desc: 'Beside the main circulation desk, open 24/7 with campus security desk nearby.',
  },
  {
    name: 'Student Center Atrium',
    badge: 'High Foot Traffic',
    desc: 'Central tables next to the campus info booth and coffee shop.',
  },
  {
    name: 'Campus Police Station Lobby',
    badge: 'Official Safe Exchange Zone',
    desc: 'Designated 24hr video-monitored community exchange zone with visitor parking.',
  },
  {
    name: 'North Quad Dining Hall Foyer',
    badge: 'Daytime Hub',
    desc: 'Well-lit central entrance area with indoor seating.',
  }
];

export const mockSwapItems: SwapItem[] = [
  {
    id: 'item-1',
    title: 'Campbell Biology (12th Edition)',
    category: 'Textbooks',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
    description: 'Clean pages, no highlighting! Used for one semester in Bio 101. Includes unused online practice code card.',
    lookingFor: 'Organic Chemistry textbook (Klein 4th ed) or graphing calculator',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    campusDorm: 'North Quad Tower B',
    postedTime: '2 hours ago',
    swapCount: 3,
    featured: true
  },
  {
    id: 'item-2',
    title: 'Sony WH-CH520 Wireless Headphones',
    category: 'Electronics',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
    description: 'Cream color, fantastic battery life (up to 50 hrs). Comes with original USB-C charging cable.',
    lookingFor: 'Mechanical keyboard (compact 65% or 75%) or ergonomic desk chair cushion',
    ownerName: 'Marcus Chen',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    campusDorm: 'South Residential Hall',
    postedTime: '4 hours ago',
    swapCount: 5,
    featured: true
  },
  {
    id: 'item-3',
    title: 'Kryptonite U-Lock + Heavy Cable',
    category: 'Bikes & Transit',
    condition: 'Gently Used',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=700&q=80',
    description: 'Heavy duty anti-theft bike lock with 2 original keys and 4ft extension cable. Kept my bike safe all year.',
    lookingFor: 'Bike helmet (size M) or skateboard deck',
    ownerName: 'Samira Patel',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    campusDorm: 'Campus Village Apts',
    postedTime: '5 hours ago',
    swapCount: 8
  },
  {
    id: 'item-4',
    title: 'Warm Fairy Curtain Lights (10ft x 10ft)',
    category: 'Dorm & Living',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80',
    description: '8 lighting modes with remote control. Warm golden glow, perfect for dorm bedroom cozy vibes.',
    lookingFor: 'Succulents / indoor plant pots or desk organizer tray',
    ownerName: 'Chloe Bennett',
    ownerAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    campusDorm: 'East Dorm Complex',
    postedTime: 'Yesterday',
    swapCount: 2
  },
  {
    id: 'item-5',
    title: 'Oversized Levi’s Denim Sherpa Jacket (M)',
    category: 'Clothing',
    condition: 'Good',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
    description: 'Vintage wash with super warm faux shearling lining. Fits oversized relaxed. Great condition.',
    lookingFor: 'North Face fleece / windbreaker (Men/Unisex M or L)',
    ownerName: 'Jordan Vance',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    campusDorm: 'Maple Hall 102',
    postedTime: '1 day ago',
    swapCount: 4
  },
  {
    id: 'item-6',
    title: 'Settlers of Catan Board Game',
    category: 'Games & Hobbies',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=700&q=80',
    description: '100% complete with all cards, resource hexes, dice, and wooden settlements. Played only twice.',
    lookingFor: 'Wingspan, Ticket to Ride, or portable bluetooth speaker',
    ownerName: 'Liam O’Connor',
    ownerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    campusDorm: 'Birch Tower 4',
    postedTime: '2 days ago',
    swapCount: 6
  },
  {
    id: 'item-7',
    title: 'AeroPress Go Travel Coffee Maker',
    category: 'Kitchen',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    description: 'Includes carrying mug, scoop, stirrer, and ~200 paper micro-filters. Makes smooth, rich dorm espresso.',
    lookingFor: 'Electric kettle with temperature control or blender cup',
    ownerName: 'Tara Gupta',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    campusDorm: 'Oakwood Commons',
    postedTime: '3 days ago',
    swapCount: 1
  },
  {
    id: 'item-8',
    title: 'TI-84 Plus CE Color Graphing Calculator',
    category: 'Electronics',
    condition: 'Gently Used',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=700&q=80',
    description: 'Rose gold edition! Battery holds full charge for weeks. Includes slide cover and charging cable.',
    lookingFor: 'iPad Apple Pencil (2nd gen) or noise canceling earbuds',
    ownerName: 'Zoe Martinez',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    campusDorm: 'Highland Quad',
    postedTime: '3 days ago',
    swapCount: 7
  }
];
