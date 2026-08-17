import { KeyRound, RadioTower, ShieldCheck, UploadCloud } from "lucide-react";
import { createCameraDeviceRegistration, createDemoRelayUpload } from "./cameraApi";
import type {
  CameraDeviceRegistrationResult,
  CameraPrivacyMode,
  CameraProvider,
  CameraRelayUploadResult
} from "./types";

type CameraRelayPanelProps = {
  userId: string;
  locationLabel: string;
  provider: CameraProvider;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
  registration?: CameraDeviceRegistrationResult;
  relayUpload?: CameraRelayUploadResult;
  onDeviceRegistered: (registration: CameraDeviceRegistrationResult) => void;
  onRelayUploadAccepted: (relayUpload: CameraRelayUploadResult) => void;
};

export function CameraRelayPanel({
  userId,
  locationLabel,
  provider,
  privacyMode,
  motionUploadsEnabled,
  registration,
  relayUpload,
  onDeviceRegistered,
  onRelayUploadAccepted
}: CameraRelayPanelProps) {
  function registerDevice() {
    const nextRegistration = createCameraDeviceRegistration({
      userId,
      provider,
      privacyMode,
      motionUploadsEnabled,
      locationLabel
    });
    onDeviceRegistered(nextRegistration);
  }

  function previewSignedRelayUpload() {
    if (!registration?.device) return;
    const nextRelayUpload = createDemoRelayUpload({
      userId,
      provider,
      device: registration.device,
      privacyMode
    });
    onRelayUploadAccepted(nextRelayUpload);
  }

  const relayReady = Boolean(registration?.relay);

  return (
    <section className="panel relay-contract-panel">
      <div className="section-heading compact">
        <RadioTower size={18} />
        <span>Device Relay</span>
      </div>
      <div className="relay-summary">
        <strong>{provider.name}</strong>
        <p>{provider.requiresLocalRelay ? "Local relay upload contract" : provider.connectionLabel}</p>
      </div>
      <button className="secondary-button" onClick={registerDevice} type="button">
        <ShieldCheck size={17} />
        Register device record
      </button>

      {registration && (
        <div className="request-record device-record">
          <strong>{registration.device.displayName}</strong>
          <span>{registration.device.connectionStatus}</span>
          <span>{registration.device.transport}</span>
          <span>{registration.reviewMessage}</span>
        </div>
      )}

      {registration?.relay && (
        <div className="relay-contract-card">
          <div>
            <KeyRound size={17} />
            <strong>{registration.relay.signatureHeader}</strong>
          </div>
          <span>{registration.relay.uploadUrl}</span>
          <span>{registration.relay.signingKeyStatus}</span>
        </div>
      )}

      <button className="secondary-button" disabled={!relayReady} onClick={previewSignedRelayUpload} type="button">
        <UploadCloud size={17} />
        Preview signed relay upload
      </button>

      {relayUpload && (
        <div className="request-record ingest-record">
          <strong>Relay upload {relayUpload.uploadId}</strong>
          <span>{relayUpload.status}</span>
          <span>{relayUpload.reviewMessage}</span>
        </div>
      )}
    </section>
  );
}
