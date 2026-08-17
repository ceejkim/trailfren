export type Rarity = "Common" | "Uncommon" | "Rare" | "Legendary";

export type CameraProviderId =
  | "birdfy"
  | "bird-buddy"
  | "ring"
  | "nest"
  | "reolink"
  | "tapo"
  | "wyze"
  | "manual-upload";

export type CameraIntegrationPhase = "partner-export" | "official-cloud" | "local-relay" | "manual";

export type CameraConnectionMode = "partner-request" | "official-oauth" | "local-relay" | "manual-upload";

export type CameraConnectionStatus = "queued" | "oauth-started" | "relay-required" | "partner-review" | "manual-ready";

export type CameraClipIngestStatus = "received" | "processing" | "needs-review" | "ready";

export type CameraSyncStatus = "not-started" | "needs-approval" | "waiting-on-provider" | "relay-required" | "synced";

export type CameraPrivacyMode = "private" | "friends" | "league";

export type CameraStreamTransport = "rtsp" | "onvif" | "cloud-oauth" | "partner-export" | "manual-upload";

export type CameraDeviceConnectionStatus =
  | "needs-relay"
  | "needs-oauth"
  | "partner-review"
  | "manual-ready"
  | "connected"
  | "paused";

export type RelayUploadStatus = "signature-required" | "accepted" | "needs-review" | "rejected";

export type CameraProvider = {
  id: CameraProviderId;
  name: string;
  category: string;
  phase: CameraIntegrationPhase;
  connectionLabel: string;
  primaryAction: string;
  syncSummary: string;
  motionFlow: string;
  limitations: string[];
  supportsMotionClips: boolean;
  requiresOAuth: boolean;
  requiresLocalRelay: boolean;
  docsUrl: string;
};

export type CameraConnectionRequest = {
  id: string;
  userId: string;
  providerId: CameraProviderId;
  providerName: string;
  mode: CameraConnectionMode;
  status: CameraConnectionStatus;
  requestedAt: string;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
  nextStep: string;
  callbackPath: string;
};

export type CameraDevice = {
  id: string;
  ownerId: string;
  providerId: CameraProviderId;
  providerName: string;
  displayName: string;
  locationLabel: string;
  privacyMode: CameraPrivacyMode;
  connectionStatus: CameraDeviceConnectionStatus;
  transport: CameraStreamTransport;
  motionOnly: boolean;
  redactedEndpoint?: string;
  relayId?: string;
  registeredAt: string;
  lastSeenAt?: string;
};

export type CameraRelayEnrollment = {
  relayId: string;
  deviceId: string;
  uploadUrl: string;
  healthUrl: string;
  signatureHeader: "x-flock-relay-signature";
  signingKeyStatus: "demo-required" | "server-secret-required";
  instructions: string[];
};

export type CameraDeviceRegistrationResult = {
  device: CameraDevice;
  relay?: CameraRelayEnrollment;
  reviewMessage: string;
};

export type CameraClipIngestRequest = {
  id: string;
  userId: string;
  providerId: CameraProviderId;
  providerName: string;
  deviceId: string;
  cameraName: string;
  capturedAt: string;
  durationSeconds: number;
  motionEventId?: string;
  thumbnailUrl?: string;
  clipUrl?: string;
  privacyMode: CameraPrivacyMode;
};

export type CameraClipIngestResult = {
  ingestId: string;
  status: CameraClipIngestStatus;
  clip: Clip;
  sighting: Sighting;
  reviewMessage: string;
};

export type CameraRelayUploadRequest = {
  userId: string;
  providerId: CameraProviderId;
  deviceId: string;
  relayId: string;
  motionEventId: string;
  capturedAt: string;
  durationSeconds: number;
  cameraName: string;
  thumbnailUrl?: string;
  clipUrl?: string;
  privacyMode: CameraPrivacyMode;
};

export type CameraRelayUploadResult = {
  uploadId: string;
  status: RelayUploadStatus;
  deviceId: string;
  relayId: string;
  motionEventId: string;
  acceptedAt: string;
  clip: Clip;
  sighting: Sighting;
  reviewMessage: string;
};

export type CameraSyncState = {
  providerId: CameraProviderId;
  status: CameraSyncStatus;
  approvalLabel: string;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
  connectionRequestId?: string;
  registeredDeviceId?: string;
  relayId?: string;
  relayUploadUrl?: string;
  latestIngestId?: string;
  latestRelayUploadId?: string;
  latestIngestAt?: string;
  nextStep?: string;
  lastSyncedAt?: string;
};

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
