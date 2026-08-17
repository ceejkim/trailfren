import {
  CheckCircle2,
  Cloud,
  KeyRound,
  LockKeyhole,
  RadioTower,
  RotateCw,
  ShieldCheck,
  UploadCloud,
  Wifi
} from "lucide-react";
import type {
  CameraClipIngestResult,
  CameraConnectionRequest,
  CameraDeviceRegistrationResult,
  CameraPrivacyMode,
  CameraProvider,
  CameraProviderId,
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
  syncSession?: CameraSyncSession;
  connectionRequest?: CameraConnectionRequest;
  registration?: CameraDeviceRegistrationResult;
  ingestResult?: CameraClipIngestResult;
  relayUpload?: CameraRelayUploadResult;
  onProviderChange: (providerId: CameraProviderId) => void;
  onPrivacyChange: (privacyMode: CameraPrivacyMode) => void;
  onMotionUploadsChange: (enabled: boolean) => void;
  onStartConnection: () => void;
  onRegisterDevice: () => void;
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

function getPrimaryAction({
  provider,
  connectionRequest,
  registration,
  relayUpload,
  onStartConnection,
  onRegisterDevice,
  onPreviewMotionUpload,
  onPreviewRelayUpload
}: Pick<
  CameraSyncWizardProps,
  | "provider"
  | "connectionRequest"
  | "registration"
  | "relayUpload"
  | "onStartConnection"
  | "onRegisterDevice"
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
  syncSession,
  connectionRequest,
  registration,
  ingestResult,
  relayUpload,
  onProviderChange,
  onPrivacyChange,
  onMotionUploadsChange,
  onStartConnection,
  onRegisterDevice,
  onPreviewMotionUpload,
  onPreviewRelayUpload
}: CameraSyncWizardProps) {
  const action = getPrimaryAction({
    provider,
    connectionRequest,
    registration,
    relayUpload,
    onStartConnection,
    onRegisterDevice,
    onPreviewMotionUpload,
    onPreviewRelayUpload
  });
  const ActionIcon = action.icon;
  const ProviderIcon = getProviderIcon(provider);
  const activeUpload = relayUpload ?? ingestResult;

  return (
    <section className="panel wide camera-sync-wizard" aria-label="Camera sync setup">
      <div className="wizard-header">
        <div className="section-heading">
          <RadioTower size={20} />
          <div>
            <h2>Camera Sync</h2>
            <p>{userName} can approve one camera path and send bird-triggered clips into private review.</p>
          </div>
        </div>
        <div className="wizard-account">
          <CheckCircle2 size={17} />
          <div>
            <span>Account</span>
            <strong>{userHandle}</strong>
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
            <WizardStatus label="Upload" value={activeUpload?.status ?? "Waiting"} complete={Boolean(activeUpload)} />
          </div>
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
