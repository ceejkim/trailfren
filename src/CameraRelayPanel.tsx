import { KeyRound, RadioTower, ShieldCheck, UploadCloud } from "lucide-react";
import { useState } from "react";
import { requestCameraDeviceRegistration, requestDemoRelayUpload } from "./cameraApi";
import type {
  CameraDeviceRegistrationResult,
  CameraPrivacyMode,
  CameraProvider,
  CameraRelayManifest,
  CameraRelayUploadResult
} from "./types";

type CameraRelayPanelProps = {
  userId: string;
  locationLabel: string;
  provider: CameraProvider;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
  registration?: CameraDeviceRegistrationResult;
  relayManifest?: CameraRelayManifest;
  relayUpload?: CameraRelayUploadResult;
  onDeviceRegistered: (registration: CameraDeviceRegistrationResult) => void;
  onCreateRelayManifest: () => Promise<void> | void;
  onRelayUploadAccepted: (relayUpload: CameraRelayUploadResult) => void;
  onError: (message: string) => void;
};

function getActionError(error: unknown) {
  return error instanceof Error ? error.message : "Camera relay action failed.";
}

export function CameraRelayPanel({
  userId,
  locationLabel,
  provider,
  privacyMode,
  motionUploadsEnabled,
  registration,
  relayManifest,
  relayUpload,
  onDeviceRegistered,
  onCreateRelayManifest,
  onRelayUploadAccepted,
  onError
}: CameraRelayPanelProps) {
  const [busyAction, setBusyAction] = useState<"device" | "manifest" | "upload" | null>(null);

  async function registerDevice() {
    setBusyAction("device");
    onError("");
    try {
      const nextRegistration = await requestCameraDeviceRegistration({
        userId,
        provider,
        privacyMode,
        motionUploadsEnabled,
        locationLabel
      });
      onDeviceRegistered(nextRegistration);
    } catch (error) {
      onError(getActionError(error));
    } finally {
      setBusyAction(null);
    }
  }

  async function previewSignedRelayUpload() {
    if (!registration?.device) return;
    setBusyAction("upload");
    onError("");
    try {
      const nextRelayUpload = await requestDemoRelayUpload({
        userId,
        provider,
        device: registration.device,
        privacyMode
      });
      onRelayUploadAccepted(nextRelayUpload);
    } catch (error) {
      onError(getActionError(error));
    } finally {
      setBusyAction(null);
    }
  }

  async function createRelayManifest() {
    if (!registration?.relay) return;
    setBusyAction("manifest");
    onError("");
    try {
      await onCreateRelayManifest();
    } catch (error) {
      onError(getActionError(error));
    } finally {
      setBusyAction(null);
    }
  }

  const relayReady = Boolean(registration?.relay);
  const manifestReady = Boolean(relayManifest);

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
      <button className="secondary-button" disabled={busyAction === "device"} onClick={registerDevice} type="button">
        <ShieldCheck size={17} />
        {busyAction === "device" ? "Registering" : "Register device record"}
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

      <button className="secondary-button" disabled={!relayReady || busyAction === "manifest"} onClick={createRelayManifest} type="button">
        <RadioTower size={17} />
        {busyAction === "manifest" ? "Creating" : "Create relay manifest"}
      </button>

      {relayManifest && (
        <div className="relay-manifest-card">
          <div>
            <RadioTower size={17} />
            <strong>{relayManifest.status}</strong>
          </div>
          <span>{relayManifest.relayRuntime.eventStrategy}</span>
          <span>{relayManifest.cloudUpload.path}</span>
          <code>{relayManifest.sampleSignature}</code>
        </div>
      )}

      <button className="secondary-button" disabled={!manifestReady || busyAction === "upload"} onClick={previewSignedRelayUpload} type="button">
        <UploadCloud size={17} />
        {busyAction === "upload" ? "Uploading" : "Preview signed relay upload"}
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
