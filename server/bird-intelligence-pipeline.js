import { createId, getPrivacyMode, getProvider, rarityPoints } from "./camera-sync-architecture.js";

const EBIRD_API_SOURCE_URL = "https://documenter.getpostman.com/view/664302/S1ENwy59";
const EBIRD_DATA_SOURCE_URL = "https://support.ebird.org/en/support/solutions/articles/48000838205-download-ebird-data";

const speciesProfiles = [
  {
    commonName: "Northern cardinal",
    scientificName: "Cardinalis cardinalis",
    rarity: "Common",
    habitats: ["backyard", "feeder", "edge"]
  },
  {
    commonName: "Tufted titmouse",
    scientificName: "Baeolophus bicolor",
    rarity: "Uncommon",
    habitats: ["backyard", "feeder", "woodland"]
  },
  {
    commonName: "Downy woodpecker",
    scientificName: "Dryobates pubescens",
    rarity: "Rare",
    habitats: ["woodland", "suet", "tree"]
  },
  {
    commonName: "Black-capped chickadee",
    scientificName: "Poecile atricapillus",
    rarity: "Common",
    habitats: ["feeder", "woodland", "winter"]
  },
  {
    commonName: "Eastern bluebird",
    scientificName: "Sialia sialis",
    rarity: "Uncommon",
    habitats: ["yard", "field", "nest box"]
  },
  {
    commonName: "Red-bellied woodpecker",
    scientificName: "Melanerpes carolinus",
    rarity: "Rare",
    habitats: ["woodland", "suet", "feeder"]
  }
];

const providerSuggestionOrder = {
  birdfy: ["Tufted titmouse", "Northern cardinal", "Black-capped chickadee"],
  "bird-buddy": ["Tufted titmouse", "Black-capped chickadee", "Northern cardinal"],
  reolink: ["Northern cardinal", "Downy woodpecker", "Red-bellied woodpecker"],
  tapo: ["Northern cardinal", "Downy woodpecker", "Eastern bluebird"],
  wyze: ["Northern cardinal", "Black-capped chickadee", "Downy woodpecker"],
  ring: ["Northern cardinal", "Eastern bluebird", "Black-capped chickadee"],
  nest: ["Northern cardinal", "Eastern bluebird", "Tufted titmouse"],
  "manual-upload": ["Northern cardinal", "Tufted titmouse", "Black-capped chickadee"]
};

function clean(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizePercent(value, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.round(clamp(value > 1 ? value : value * 100, 0, 100));
}

function getSpeciesProfile(commonName) {
  const normalized = clean(commonName)?.toLowerCase();
  return speciesProfiles.find((profile) => profile.commonName.toLowerCase() === normalized);
}

function getProviderId(body) {
  const candidate = clean(body.providerId) || clean(body.reviewItem?.providerId) || clean(body.clip?.providerId);
  if (!candidate) return "manual-upload";

  try {
    return getProvider(candidate).id;
  } catch {
    return "manual-upload";
  }
}

function getSeedSpecies(body) {
  return clean(body.species) || clean(body.commonName) || clean(body.sighting?.bird) || clean(body.clip?.bird);
}

function getDetectionConfidence(body) {
  if (body.birdDetected === false || body.noBird === true) return 8;
  const clipConfidence = normalizePercent(body.clip?.confidence, 82);
  return normalizePercent(body.birdConfidence ?? body.motionConfidence ?? body.confidence, clipConfidence);
}

function getSuggestionNames(body, providerId) {
  const seed = getSeedSpecies(body);
  const ordered = [seed, ...(providerSuggestionOrder[providerId] ?? providerSuggestionOrder["manual-upload"])].filter(Boolean);
  const seen = new Set();
  return ordered.filter((name) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getRarityForSpecies(commonName, locationLabel = "Private backyard") {
  const profile = getSpeciesProfile(commonName) ?? {
    commonName,
    scientificName: undefined,
    rarity: "Uncommon",
    habitats: ["unknown"]
  };
  return {
    commonName: profile.commonName,
    scientificName: profile.scientificName,
    rarity: profile.rarity,
    points: rarityPoints[profile.rarity],
    locationLabel,
    source: "demo-local-frequency-map",
    futureSource: "ebird-regional-frequency",
    sourceUrl: EBIRD_API_SOURCE_URL,
    rationale: "Uses the local deterministic frequency map until EBIRD_API_KEY and regional scoring rules are configured."
  };
}

export function getBirdIntelligencePlan() {
  return {
    version: "bird-intelligence-v1",
    status: "adapter-boundary-ready",
    adapters: [
      {
        id: "frame-extractor",
        kind: "frame-extraction",
        mode: "relay-or-background-job",
        input: ["clipUrl", "thumbnailUrl", "frameSampleUrls"],
        output: ["representativeFrameUrls", "sampleCount", "extractionStatus"],
        hardGate: "Requires private clip object storage before processing real customer video."
      },
      {
        id: "bird-detector",
        kind: "bird-no-bird",
        mode: "model-swappable",
        input: ["representativeFrameUrls", "motionMetadata"],
        output: ["birdDetected", "confidence"],
        hardGate: "Requires an approved model provider or local relay inference runtime."
      },
      {
        id: "species-identifier",
        kind: "species-id",
        mode: "model-swappable",
        input: ["birdFrames", "locationHint", "captureTime"],
        output: ["speciesSuggestions"],
        hardGate: "Requires model credentials, quality thresholding, and manual review for low confidence."
      },
      {
        id: "rarity-scorer",
        kind: "rarity-score",
        mode: "ebird-ready",
        input: ["speciesCode", "regionCode", "observationDate"],
        output: ["rarity", "points", "regionalFrequency"],
        hardGate: "Requires EBIRD_API_KEY plus regional scoring policy before production scoring."
      },
      {
        id: "manual-review",
        kind: "user-correction",
        mode: "implemented",
        input: ["analysisId", "reviewItemId", "action", "species"],
        output: ["reviewStatus", "manualCorrection", "scoreOverride"]
      }
    ],
    thresholds: {
      birdDetectedMinimum: 25,
      autoReadySpeciesConfidence: 90,
      leagueScoringRequires: "approved-or-corrected-review"
    },
    ebird: {
      apiSourceUrl: EBIRD_API_SOURCE_URL,
      dataSourceUrl: EBIRD_DATA_SOURCE_URL,
      requiredEnv: "EBIRD_API_KEY",
      currentMode: "documented-boundary",
      notes: [
        "Use recent and summary API outputs for regional rarity hints.",
        "Use the larger eBird data products only after the required project/request process.",
        "Do not expose API keys or precise sensitive species locations to the browser."
      ]
    }
  };
}

export function createBirdReviewAnalysis(body) {
  const providerId = getProviderId(body);
  const provider = getProvider(providerId);
  const reviewItemId = clean(body.reviewItemId) || clean(body.reviewItem?.id) || createId("review");
  const clipId = clean(body.clipId) || clean(body.clip?.id) || createId("clip");
  const sightingId = clean(body.sightingId) || clean(body.sighting?.id);
  const privacyMode = getPrivacyMode(body.privacyMode || body.reviewItem?.privacyMode);
  const locationLabel = clean(body.locationLabel) || clean(body.clip?.location) || clean(body.sighting?.location) || "Private backyard";
  const detectionConfidence = getDetectionConfidence(body);
  const birdDetected = detectionConfidence >= 25;
  const suggestionNames = birdDetected ? getSuggestionNames(body, providerId) : [];
  const speciesSuggestions = suggestionNames.slice(0, 3).map((commonName, index) => {
    const rarity = getRarityForSpecies(commonName, locationLabel);
    const confidence = normalizePercent(body.speciesConfidence, Math.max(42, detectionConfidence - index * 9));
    return {
      commonName: rarity.commonName,
      scientificName: rarity.scientificName,
      confidence,
      rarity: rarity.rarity,
      points: rarity.points,
      source: index === 0 ? "motion-clip-seed" : "provider-prior",
      rationale: index === 0 ? "Primary candidate from clip metadata or current provider profile." : `Alternate likely for ${provider.name}.`
    };
  });
  const bestSuggestion = speciesSuggestions[0] ?? null;
  const status = !birdDetected ? "no-bird" : bestSuggestion && bestSuggestion.confidence >= 90 ? "ready" : "needs-review";
  const now = new Date().toISOString();

  return {
    id: createId("analysis"),
    reviewItemId,
    clipId,
    sightingId,
    providerId,
    source: clean(body.source) || clean(body.reviewItem?.source) || "camera-review",
    status,
    birdDetected,
    confidence: bestSuggestion?.confidence ?? detectionConfidence,
    selectedSpecies: bestSuggestion?.commonName ?? null,
    speciesSuggestions,
    rarityScore: bestSuggestion
      ? {
          rarity: bestSuggestion.rarity,
          points: bestSuggestion.points,
          source: "demo-local-frequency-map",
          futureSource: "ebird-regional-frequency"
        }
      : {
          rarity: null,
          points: 0,
          source: "no-bird",
          futureSource: "manual-review"
        },
    needsManualReview: status !== "ready",
    manualCorrection: null,
    privacyMode,
    frames: {
      extractionStatus: Array.isArray(body.frameSampleUrls) && body.frameSampleUrls.length > 0 ? "sampled" : "metadata-only",
      sampleCount: Array.isArray(body.frameSampleUrls) ? body.frameSampleUrls.length : 0
    },
    adapters: getBirdIntelligencePlan().adapters.map((adapter) => ({
      id: adapter.id,
      kind: adapter.kind,
      mode: adapter.mode
    })),
    pipeline: [
      { step: "capture", status: "complete", owner: provider.mode },
      { step: "frame-extraction", status: "pending-real-media", owner: "background-job" },
      { step: "bird-detection", status: birdDetected ? "candidate-bird" : "no-bird", owner: "bird-detector" },
      { step: "species-id", status: bestSuggestion ? "candidate-ready" : "skipped", owner: "species-identifier" },
      { step: "rarity-score", status: bestSuggestion ? "demo-scored" : "skipped", owner: "rarity-scorer" },
      { step: "manual-review", status: status === "ready" ? "optional" : "required", owner: "user" }
    ],
    createdAt: now,
    updatedAt: now
  };
}

export function createManualBirdCorrection(body) {
  const analysisId = clean(body.analysisId);
  const reviewItemId = clean(body.reviewItemId);
  if (!analysisId) throw new Error("analysisId is required for a bird review correction.");
  if (!reviewItemId) throw new Error("reviewItemId is required for a bird review correction.");

  const action = body.action === "approve" || body.action === "mark-no-bird" ? body.action : "correct-species";
  const birdDetected = action !== "mark-no-bird";
  const speciesName = birdDetected
    ? clean(body.species) || clean(body.commonName) || clean(body.selectedSpecies) || clean(body.bestSuggestion?.commonName) || "Northern cardinal"
    : null;
  const rarity = speciesName ? getRarityForSpecies(speciesName, clean(body.locationLabel) || "Private backyard") : null;
  const now = new Date().toISOString();

  return {
    id: createId("correction"),
    analysisId,
    reviewItemId,
    reviewerId: clean(body.reviewerId) || clean(body.userId) || "demo-user",
    action,
    reviewStatus: birdDetected ? "approved" : "rejected",
    analysisStatus: "corrected",
    birdDetected,
    species: rarity
      ? {
          commonName: rarity.commonName,
          scientificName: rarity.scientificName
        }
      : null,
    confidence: 100,
    rarityScore: rarity
      ? {
          rarity: rarity.rarity,
          points: rarity.points,
          source: "manual-correction"
        }
      : {
          rarity: null,
          points: 0,
          source: "manual-no-bird"
        },
    notes: clean(body.notes) || (birdDetected ? "Reviewer approved bird identity for scoring." : "Reviewer marked this motion event as no bird."),
    correctedAt: now
  };
}
