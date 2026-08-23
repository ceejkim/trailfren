import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Database,
  KeyRound,
  LockKeyhole,
  RadioTower,
  RotateCw,
  ShieldCheck,
  UploadCloud,
  Wifi
} from "lucide-react";
import type {
  CameraAccountState,
  CameraClipIngestResult,
  CameraConnectionRequest,
  CameraDeviceRegistrationResult,
  CameraMvpReadiness,
  CameraPrivacyMode,
  CameraProvider,
  CameraProviderId,
  CameraRelayManifest,
  CameraRelayUploadResult,
  CameraSyncSession,
  CameraSyncState
} from "./types";

type CameraSyncWizardProps = {
  userName: string;
  userHandle: string;
  providers: CameraProvider[];
  provider: CameraProvider;
  cameraSync: CameraSyncState;
  accountState: CameraAccountState | null;
  accountStatus: "loading" | "ready" | "offline";
  syncSession?: CameraSyncSession;
  connectionRequest?: CameraConnectionRequest;
  registration?: CameraDeviceRegistrationResult;
  relayManifest?: CameraRelayManifest;
  ingestResult?: CameraClipIngestResult;
  relayUpload?: CameraRelayUploadResult;
  onProviderChange: (providerId: CameraProviderId) => void;
  onPrivacyChange: (privacyMode: CameraPrivacyMode) => void;
  onMotionUploadsChange: (enabled: boolean) => void;
  onStartConnection: () => void;
  onRegisterDevice: () => void;
  onCreateRelayManifest: () => void;
  onPreviewMotionUpload: () => void;
  onPreviewRelayUpload: () => void;
};

type WizardAction = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  icon: typeof RotateCw;
};

function getProviderIcon(provider: CameraProvider) {
  if (provider.requiresLocalRelay) return Wifi;
  if (provider.requiresOAuth) return Cloud;
  if (provider.phase === "partner-export") return ShieldCheck;
  return UploadCloud;
}

function getPathLabel(provider: CameraProvider) {
  if (provider.requiresLocalRelay) return "Local relay";
  if (provider.requiresOAuth) return "Official account";
  if (provider.phase === "partner-export") return "Partner/export";
  return "Manual";
}

function getReadinessLabel(status: CameraMvpReadiness["status"]) {
  if (status === "beta-infra-ready") return "Beta infra ready";
  if (status === "field-test-ready") return "Field-test ready";
  return "Blocked";
}

function getPrimaryAction({
  provider,
  connectionRequest,
  registration,
  relayManifest,
  relayUpload,
  onStartConnection,
  onRegisterDevice,
  onCreateRelayManifest,
  onPreviewMotionUpload,
  onPreviewRelayUpload
}: Pick<
  CameraSyncWizardProps,
  | "provider"
  | "connectionRequest"
  | "registration"
  | "relayManifest"
  | "relayUpload"
  | "onStartConnection"
  | "onRegisterDevice"
  | "onCreateRelayManifest"
  | "onPreviewMotionUpload"
  | "onPreviewRelayUpload"
>): WizardAction {
  if (!connectionRequest) {
    return {
      label: provider.primaryAction,
      icon: RotateCw,
      onClick: onStartConnection
    };
  }

  if (provider.requiresLocalRelay && !registration) {
    return {
      label: "Register relay device",
      icon: KeyRound,
      onClick: onRegisterDevice
    };
  }

  if (provider.requiresLocalRelay && !relayManifest) {
    return {
      label: "Create relay manifest",
      icon: RadioTower,
      onClick: onCreateRelayManifest
    };
  }

  if (provider.requiresLocalRelay && !relayUpload) {
    return {
      label: "Test motion upload",
      icon: UploadCloud,
      onClick: onPreviewRelayUpload
    };
  }

  return {
    label: "Preview approved motion upload",
    icon: UploadCloud,
    onClick: onPreviewMotionUpload
  };
}

export function CameraSyncWizard({
  userName,
  userHandle,
  providers,
  provider,
  cameraSync,
  accountState,
  accountStatus,
  syncSession,
  connectionRequest,
  registration,
  relayManifest,
  ingestResult,
  relayUpload,
  onProviderChange,
  onPrivacyChange,
  onMotionUploadsChange,
  onStartConnection,
  onRegisterDevice,
  onCreateRelayManifest,
  onPreviewMotionUpload,
  onPreviewRelayUpload
}: CameraSyncWizardProps) {
  const action = getPrimaryAction({
    provider,
    connectionRequest,
    registration,
    relayManifest,
    relayUpload,
    onStartConnection,
    onRegisterDevice,
    onCreateRelayManifest,
    onPreviewMotionUpload,
    onPreviewRelayUpload
  });
  const ActionIcon = action.icon;
  const ProviderIcon = getProviderIcon(provider);
  const activeUpload = relayUpload ?? ingestResult;
  const accountRecordCount = accountState
    ? Object.values(accountState.counts).reduce((sum, count) => sum + count, 0)
    : 0;
  const storeLabel =
    accountStatus === "loading"
      ? "Checking"
      : accountState
        ? accountState.storage.durable
          ? "Durable"
          : "Preview"
        : "Offline";
  const readiness = accountState?.readiness;
  const ReadinessIcon = readiness?.status === "beta-infra-ready" ? CheckCircle2 : AlertTriangle;
  const readinessItems = readiness ? (readiness.blockers.length > 0 ? readiness.blockers : readiness.attention).slice(0, 3) : [];

  return (
    <section className="panel wide camera-sync-wizard" aria-label="Camera sync setup">
      <div className="wizard-header">
        <div className="section-heading">
          <RadioTower size={20} />
          <div>
            <h2>Connect a camera</h2>
            <p>Choose a provider, approve its path, and send bird clips to private review.</p>
          </div>
        </div>
        <div className="wizard-account-stack">
          <div className="wizard-account">
            <CheckCircle2 size={17} />
            <div>
              <span>Account</span>
              <strong>{userHandle}</strong>
            </div>
          </div>
          <div className={accountState?.storage.durable ? "wizard-account wizard-store durable" : "wizard-account wizard-store"}>
            <Database size={17} />
            <div>
              <span>Store</span>
              <strong>{storeLabel}</strong>
              <em>{accountState ? `${accountRecordCount} records · ${accountState.storage.mode}` : accountStatus}</em>
            </div>
          </div>
        </div>
      </div>

      <div className="wizard-layout">
        <div className="wizard-provider-list" role="list" aria-label="Camera providers">
          {providers.map((candidate) => {
            const CandidateIcon = getProviderIcon(candidate);
            const selected = candidate.id === provider.id;
            return (
              <button
                aria-pressed={selected}
                className={selected ? "wizard-provider selected" : "wizard-provider"}
                key={candidate.id}
                onClick={() => onProviderChange(candidate.id)}
                type="button"
              >
                <CandidateIcon size={17} />
                <span>{candidate.name}</span>
                <em>{getPathLabel(candidate)}</em>
              </button>
            );
          })}
        </div>

        <div className="wizard-primary-path">
          <div className="wizard-provider-summary">
            <div>
              <ProviderIcon size={22} />
              <span>{getPathLabel(provider)}</span>
            </div>
            <strong>{provider.name}</strong>
            <p>{provider.motionFlow}</p>
          </div>

          <div className="wizard-controls">
            <label>
              <span>Privacy</span>
              <select value={cameraSync.privacyMode} onChange={(event) => onPrivacyChange(event.target.value as CameraPrivacyMode)}>
                <option value="private">Private</option>
                <option value="friends">Friends after review</option>
                <option value="league">League after review</option>
              </select>
            </label>
            <label className="toggle-row app-toggle">
              <input
                checked={cameraSync.motionUploadsEnabled}
                onChange={(event) => onMotionUploadsChange(event.target.checked)}
                type="checkbox"
              />
              <span>Auto-upload bird motion after approval</span>
            </label>
          </div>

          <button className="primary-button wizard-primary-button" disabled={action.disabled} onClick={action.onClick} type="button">
            <ActionIcon size={18} />
            {action.label}
          </button>

          <div className="wizard-status-grid">
            <WizardStatus label="Session" value={syncSession?.status ?? "Not started"} complete={Boolean(syncSession)} />
            <WizardStatus label="Request" value={connectionRequest?.status ?? "Waiting"} complete={Boolean(connectionRequest)} />
            <WizardStatus label="Device" value={registration?.device.connectionStatus ?? "Not registered"} complete={Boolean(registration)} />
            <WizardStatus label="Manifest" value={relayManifest?.status ?? "Waiting"} complete={Boolean(relayManifest)} />
            <WizardStatus label="Upload" value={activeUpload?.status ?? "Waiting"} complete={Boolean(activeUpload)} />
          </div>

          {readiness && (
            <div className={`wizard-readiness ${readiness.status}`}>
              <div>
                <ReadinessIcon size={18} />
                <span>MVP readiness</span>
                <strong>{getReadinessLabel(readiness.status)}</strong>
              </div>
              <p>{readiness.summary}</p>
              {readinessItems.length > 0 && (
                <ul>
                  {readinessItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="wizard-safety-strip">
        {provider.limitations.slice(0, 3).map((limitation) => (
          <span key={limitation}>
            <LockKeyhole size={14} />
            {limitation}
          </span>
        ))}
      </div>
    </section>
  );
}

function WizardStatus({ label, value, complete }: { label: string; value: string; complete: boolean }) {
  return (
    <div className={complete ? "wizard-status complete" : "wizard-status"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
