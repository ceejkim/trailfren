# Camera Account Sync Wizard

Updated: August 17, 2026

## Purpose

The Cameras tab now has a single user-facing setup flow:

1. Confirm the signed-in Flock account.
2. Choose the camera ecosystem.
3. Press one provider-specific sync or approval button.
4. Register the device or queue the official/partner approval path.
5. Let motion-triggered clips land in private review before scoring or sharing.

This keeps the product simple while still being honest about camera access constraints.

## User Flow

- Birdfy / Netvue and Bird Buddy: user-approved export, share/import, email import, or partner access. Flock does not ask for vendor passwords.
- Ring and Google Nest: official account approval path. Tokens and webhook secrets must be stored server-side after vendor setup is approved.
- Reolink, Tapo, and supported Wyze: local relay path. Camera credentials and RTSP/ONVIF URLs stay in the relay near the camera.
- Manual upload: universal fallback that feeds the same private review pipeline.

## Implemented Files

- `src/CameraSyncWizard.tsx`
- `src/cameraSyncWizard.css`
- `api/cameras/sync-sessions.js`
- `src/types.ts`
- `src/cameraApi.ts`
- `src/App.tsx`

## API Contract

`POST /api/cameras/sync-sessions` creates a stateless sync orchestration session. It does not persist secrets or touch camera feeds.

Accepted fields:

- `userId`
- `providerId`
- `privacyMode`
- `motionUploadsEnabled`

Rejected fields:

- passwords
- secrets
- tokens
- API keys
- refresh values
- unredacted RTSP/ONVIF URLs

Returned fields include:

- `syncSession.id`
- `syncSession.mode`
- `syncSession.status`
- `syncSession.approvalPath`
- `syncSession.deviceRegistrationRequired`
- `syncSession.relayRequired`
- `syncSession.oauthRequired`
- `syncSession.partnerAccessRequired`
- `syncSession.checklist`

## Current Access Reality

- Birdfy records motion clips and stores recorded content in its own cloud; no public developer API is documented in the official support material. Use user-approved export/share or partner access.
- Bird Buddy terms restrict unauthorized automation and commercial use while allowing user-created content sharing within terms. Use partner/export/share workflows, not app scraping.
- Ring has an official developer path with account authorization, events, webhooks, and video access, but production use needs vendor setup and review.
- Nest Device Access supports camera events and live stream traits for supported models, with OAuth/project setup and model-specific stream support.
- Reolink and Tapo are the strongest local relay targets because official support material documents RTSP/ONVIF availability for many models.
- Wyze RTSP remains model/firmware-specific and should stay behind a model check and local relay path.

## Next Slice

The next backend slice should make sync sessions durable:

- authenticated account ownership
- persistent camera devices
- persistent relay enrollments
- server-held relay signing secrets
- real sync-session reconciliation in the UI

Keep real camera credentials, private feeds, paid vendor programs, and OAuth secrets approval-gated.
