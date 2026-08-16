export type Rarity = "Common" | "Uncommon" | "Rare" | "Legendary";

export type UserProfile = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  bio: string;
  favoriteBird: string;
  inviteCode: string;
  points: number;
  streak: number;
};

export type Friend = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  status: "following" | "pending" | "suggested";
  points: number;
  clips: number;
};

export type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type Clip = {
  id: string;
  cameraName: string;
  bird: string;
  rarity: Rarity;
  location: string;
  capturedAt: string;
  imageUrl: string;
  duration: string;
  confidence: number;
  motionOnly: boolean;
  owner: string;
  points: number;
  reactions: number;
  comments: Comment[];
};

export type Sighting = {
  id: string;
  bird: string;
  rarity: Rarity;
  location: string;
  source: string;
  loggedAt: string;
  points: number;
};

export type Challenge = {
  id: string;
  name: string;
  metric: string;
  reward: number;
  progress: number;
  goal: number;
};

export type Recommendation = {
  id: string;
  title: string;
  category: string;
  reason: string;
  price: string;
  matchScore: number;
  imageUrl: string;
};
