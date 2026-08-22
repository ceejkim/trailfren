import type { Challenge, Clip, FeederRivalStats, Friend, Recommendation, Sighting, UserProfile } from "./types";

export const rarityPoints = {
  Common: 10,
  Uncommon: 25,
  Rare: 60,
  Legendary: 150
} as const;

export const demoProfile: UserProfile = {
  id: "profile-1",
  name: "Charlie Kimbell",
  handle: "@charlie",
  avatar: "CK",
  location: "Old Greenwich, CT",
  bio: "Backyard bird camera tinkerer, weekend birder, and feeder data nerd.",
  favoriteBird: "Northern cardinal",
  inviteCode: "FLOCK-7392",
  points: 1280,
  streak: 11
};

export const initialFriends: Friend[] = [
  {
    id: "friend-1",
    name: "Maya Patel",
    handle: "@maya",
    avatar: "MP",
    location: "Burlington, VT",
    status: "following",
    points: 1640,
    clips: 82
  },
  {
    id: "friend-2",
    name: "Sam Rivera",
    handle: "@sam",
    avatar: "SR",
    location: "Darien, CT",
    status: "following",
    points: 1465,
    clips: 64
  },
  {
    id: "friend-3",
    name: "Ari Chen",
    handle: "@ari",
    avatar: "AC",
    location: "Hudson, NY",
    status: "pending",
    points: 1185,
    clips: 47
  },
  {
    id: "friend-4",
    name: "Jess Monroe",
    handle: "@jess",
    avatar: "JM",
    location: "Madison, WI",
    status: "suggested",
    points: 990,
    clips: 39
  }
];

export const initialClips: Clip[] = [
  {
    id: "clip-1",
    cameraName: "Maple Feeder Cam",
    bird: "Rose-breasted grosbeak",
    rarity: "Rare",
    location: "Old Greenwich, CT",
    capturedAt: "08:14 AM",
    imageUrl: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1000&q=80",
    duration: "00:38",
    confidence: 94,
    motionOnly: true,
    owner: "Charlie",
    points: 60,
    reactions: 18,
    comments: [
      { id: "comment-1", author: "Maya", body: "Rare pull before coffee. League trouble.", createdAt: "08:22 AM" },
      { id: "comment-2", author: "Sam", body: "That feeder mix is doing real work.", createdAt: "08:26 AM" }
    ]
  },
  {
    id: "clip-2",
    cameraName: "Porch Rail",
    bird: "Northern cardinal",
    rarity: "Common",
    location: "Darien, CT",
    capturedAt: "07:41 AM",
    imageUrl: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=1000&q=80",
    duration: "00:21",
    confidence: 98,
    motionOnly: true,
    owner: "Sam",
    points: 10,
    reactions: 11,
    comments: [{ id: "comment-3", author: "Charlie", body: "Cleanest cardinal frame this week.", createdAt: "07:55 AM" }]
  },
  {
    id: "clip-3",
    cameraName: "Birch Box",
    bird: "Black-capped chickadee",
    rarity: "Uncommon",
    location: "Burlington, VT",
    capturedAt: "Yesterday",
    imageUrl: "https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=1000&q=80",
    duration: "00:16",
    confidence: 91,
    motionOnly: true,
    owner: "Maya",
    points: 25,
    reactions: 15,
    comments: []
  }
];

export const initialSightings: Sighting[] = [
  {
    id: "sighting-1",
    bird: "Eastern bluebird",
    rarity: "Uncommon",
    location: "Old Greenwich, CT",
    source: "Maple Feeder Cam",
    loggedAt: "Today",
    points: 25
  },
  {
    id: "sighting-2",
    bird: "Red-bellied woodpecker",
    rarity: "Rare",
    location: "Old Greenwich, CT",
    source: "Manual log",
    loggedAt: "Yesterday",
    points: 60
  },
  {
    id: "sighting-3",
    bird: "House finch",
    rarity: "Common",
    location: "Old Greenwich, CT",
    source: "Maple Feeder Cam",
    loggedAt: "Monday",
    points: 10
  },
  {
    id: "sighting-4",
    bird: "Blue jay",
    rarity: "Uncommon",
    location: "Old Greenwich, CT",
    source: "Maple Feeder Cam",
    loggedAt: "Tuesday",
    points: 25
  },
  {
    id: "sighting-5",
    bird: "Cooper's hawk",
    rarity: "Rare",
    location: "Old Greenwich, CT",
    source: "Maple Feeder Cam",
    loggedAt: "Wednesday",
    points: 60
  }
];

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    name: "Migration Watch",
    metric: "Log 8 unique species this week",
    reward: 200,
    progress: 6,
    goal: 8
  },
  {
    id: "challenge-2",
    name: "Motion Master",
    metric: "Post 12 motion-triggered clips",
    reward: 160,
    progress: 9,
    goal: 12
  },
  {
    id: "challenge-3",
    name: "Flock Talk",
    metric: "Comment on 10 friends' clips",
    reward: 90,
    progress: 6,
    goal: 10
  }
];

export const rivalFeederStats: FeederRivalStats[] = [
  {
    friendId: "friend-1",
    feederName: "Birch Box",
    visits: 17,
    rarityYield: 185,
    speciesCount: 9,
    signatureBird: "Black-capped chickadee",
    record: "2-0",
    momentum: "heating-up"
  },
  {
    friendId: "friend-2",
    feederName: "Porch Rail",
    visits: 14,
    rarityYield: 150,
    speciesCount: 7,
    signatureBird: "Northern cardinal",
    record: "1-1",
    momentum: "holding"
  },
  {
    friendId: "friend-3",
    feederName: "Hudson Suet Line",
    visits: 11,
    rarityYield: 132,
    speciesCount: 8,
    signatureBird: "Red-bellied woodpecker",
    record: "1-1",
    momentum: "heating-up"
  },
  {
    friendId: "friend-4",
    feederName: "Madison Window Tray",
    visits: 9,
    rarityYield: 84,
    speciesCount: 6,
    signatureBird: "House finch",
    record: "0-2",
    momentum: "cooling"
  }
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    title: "No-waste cardinal mix",
    category: "Seed",
    reason: "Cardinal and grosbeak clips spike after sunflower-heavy mornings.",
    price: "$22",
    matchScore: 94,
    imageUrl: "https://images.unsplash.com/photo-1592420114272-8fe8352d4f09?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "rec-2",
    title: "Squirrel-proof hopper feeder",
    category: "Feeder",
    reason: "Your best clips happen near the maple feeder, but 31 percent include non-bird motion.",
    price: "$68",
    matchScore: 88,
    imageUrl: "https://images.unsplash.com/photo-1605951001023-472ecd5a512f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "rec-3",
    title: "Cedar camera nest box",
    category: "Camera",
    reason: "Friends with box cams are earning more uncommon-species points this week.",
    price: "$119",
    matchScore: 82,
    imageUrl: "https://images.unsplash.com/photo-1605725882140-7ba173f9bc53?auto=format&fit=crop&w=700&q=80"
  }
];
