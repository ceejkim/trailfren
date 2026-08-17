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

export type CameraSyncSessionStatus =
  | "approval-required"
  | "device-registration-required"
  | "export-approval-required"
  | "manual-ready";

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

export type BirdReviewStatus = "needs-review" | "ready" | "no-bird" | "corrected";

export type BirdSpeciesSuggestion = {
  commonName: string;
  scientificName?: string;
  confidence: number;
  rarity: Rarity;
  points: number;
  source: "motion-clip-seed" | "provider-prior" | "manual-correction";
  rationale: string;
};

export type BirdManualCorrection = {
  id: string;
  ownerId?: string;
  analysisId: string;
  reviewItemId: string;
  reviewerId: string;
  action: "approve" | "correct-species" | "mark-no-bird";
  reviewStatus: "approved" | "rejected";
  analysisStatus: "corrected";
  birdDetected: boolean;
  species: {
    commonName: string;
    scientificName?: string;
  } | null;
  confidence: number;
  rarityScore: {
    rarity: Rarity | null;
    points: number;
    source: "manual-correction" | "manual-no-bird";
  };
  notes: string;
  correctedAt: string;
  storage?: CameraPersistenceMetadata;
};

export type BirdIntelligenceAnalysis = {
  id: string;
  ownerId?: string;
  reviewItemId: string;
  clipId: string;
  sightingId?: string;
  providerId: CameraProviderId;
  source: string;
  status: BirdReviewStatus;
  birdDetected: boolean;
  confidence: number;
  selectedSpecies: string | null;
  speciesSuggestions: BirdSpeciesSuggestion[];
  rarityScore: {
    rarity: Rarity | null;
    points: number;
    source: string;
    futureSource?: string;
  };
  needsManualReview: boolean;
  manualCorrection: BirdManualCorrection | null;
  privacyMode: CameraPrivacyMode;
  frames: {
    extractionStatus: "sampled" | "metadata-only";
    sampleCount: number;
  };
  adapters: {
    id: string;
    kind: string;
    mode: string;
  }[];
  pipeline: {
    step: string;
    status: string;
    owner: string;
  }[];
  createdAt: string;
  updatedAt: string;
  storage?: CameraPersistenceMetadata;
};

export type CameraPersistenceMetadata = {
  mode: string;
  durable: boolean;
  collection: string;
  ownerId: string;
  authMode: string;
  dataBoundary: string;
  next: string;
};

export type CameraReviewRecord = {
  id: string;
  ownerId: string;
  source: "relay-upload" | "clip-ingest";
  providerId: CameraProviderId;
  deviceId?: string;
  relayId?: string;
  uploadId: string;
  clipId: string;
  sightingId: string;
  status: "needs-review" | "approved" | "rejected";
  analysisId?: string;
  analysisStatus?: BirdReviewStatus;
  birdDetected?: boolean;
  confidence?: number;
  correctionId?: string;
  correctedSpecies?: string | null;
  privacyMode: CameraPrivacyMode;
  reviewMessage: string;
  createdAt: string;
  updatedAt?: string;
};

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
  storage?: CameraPersistenceMetadata;
};

export type CameraSyncSession = {
  id: string;
  userId: string;
  providerId: CameraProviderId;
  providerName: string;
  mode: CameraConnectionMode;
  status: CameraSyncSessionStatus;
  approvalPath: string;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
  deviceRegistrationRequired: boolean;
  relayRequired: boolean;
  oauthRequired: boolean;
  partnerAccessRequired: boolean;
  checklist: string[];
  architecture?: {
    triggerSource: string;
    uploadPath: string;
    credentialBoundary: string;
    transports: string[];
    launchStatus: string;
    hardGates: string[];
    sourceUrl: string;
  };
  storage?: CameraPersistenceMetadata;
  createdAt: string;
  expiresAt: string;
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
  storage?: CameraPersistenceMetadata;
};

export type CameraRelayEnrollment = {
  relayId: string;
  deviceId: string;
  ownerId?: string;
  uploadUrl: string;
  healthUrl: string;
  signatureHeader: "x-flock-relay-signature";
  signingKeyStatus: "demo-required" | "server-secret-required";
  signatureFormat?: string;
  enrolledAt?: string;
  instructions: string[];
  storage?: CameraPersistenceMetadata;
};

export type CameraDeviceRegistrationResult = {
  device: CameraDevice;
  relay?: CameraRelayEnrollment;
  reviewMessage: string;
  storage?: CameraPersistenceMetadata;
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
  userId?: string;
  status: CameraClipIngestStatus;
  clip: Clip;
  sighting: Sighting;
  reviewMessage: string;
  storage?: CameraPersistenceMetadata;
  reviewRecord?: CameraReviewRecord;
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
  userId?: string;
  status: RelayUploadStatus;
  deviceId: string;
  relayId: string;
  motionEventId: string;
  acceptedAt: string;
  architecture?: {
    triggerSource: string;
    uploadPath: string;
    credentialBoundary: string;
    signatureMode: string;
  };
  clip: Clip;
  sighting: Sighting;
  reviewMessage: string;
  storage?: CameraPersistenceMetadata;
  reviewRecord?: CameraReviewRecord;
};

export type CameraAccountState = {
  account: {
    userId: string;
    authMode: string;
    authenticated: boolean;
    hardGate: string | null;
  };
  storage: CameraPersistenceMetadata;
  counts: Record<string, number>;
  records: {
    syncSessions: CameraSyncSession[];
    connectionRequests: CameraConnectionRequest[];
    devices: CameraDevice[];
    relayEnrollments: CameraRelayEnrollment[];
    relayUploads: CameraRelayUploadResult[];
    clipIngests: CameraClipIngestResult[];
    reviewItems: CameraReviewRecord[];
    birdAnalyses: BirdIntelligenceAnalysis[];
    birdCorrections: BirdManualCorrection[];
  };
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
