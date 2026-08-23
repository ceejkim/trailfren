# Camera Field-Test Plan

Updated: August 23, 2026

## Goal

Use real camera testing to prove what actually works, without collecting vendor
passwords, scraping apps, or exposing private clips.

## Before Testing

- Use a test account, not a main personal account when possible.
- Confirm clips default to `private`.
- Capture screenshots of app state, provider app state, and any error messages.
- Record camera model, firmware/app version, network type, and provider.
- Do not paste passwords, tokens, full RTSP URLs, or private feed links into
  Trailfren, GitHub, or Codex.

## Test Track A: Manual Upload

Success criteria:

- User can represent a camera source.
- A motion clip can enter private review.
- The clip can be scored or corrected manually.
- No public sharing happens before review.

Steps:

1. Choose Manual Upload in the camera wizard.
2. Start the connection path.
3. Preview an approved motion upload.
4. Run bird review and manual correction.
5. Confirm the clip and sighting appear only in the intended privacy mode.

## Test Track B: Reolink, Tapo, Or Supported Wyze

Success criteria:

- Device record can be created.
- Relay manifest can be generated.
- A signed relay upload is accepted.
- Device status changes to connected after upload.
- Camera credentials remain local-only.

Steps:

1. Choose the provider in Trailfren.
2. Start the connection path.
3. Register the relay device.
4. Create the relay manifest.
5. Run the local relay test once available.
6. Send one motion-event upload.
7. Confirm `GET /api/cameras/account-state` includes the device, relay manifest,
   relay upload, and review item.

Record:

- provider and model
- whether RTSP/ONVIF is available
- whether motion events can be detected without battery drain
- whether the relay can run continuously on a local machine or small device

## Test Track C: Birdfy Or Bird Buddy

Success criteria:

- Trailfren does not ask for vendor credentials.
- User can get a camera event out through an allowed share, export, postcard, or
  manual import path.
- The imported item enters private review.

Steps:

1. Trigger or wait for a real bird event in the vendor app.
2. Note whether the app sends a notification, postcard, share link, export, or
   downloadable clip.
3. Try the user-approved share/export/manual path.
4. Import or represent the clip in Trailfren.
5. Record where automation is blocked by the vendor.

## Test Track D: Ring Or Nest

Success criteria:

- Trailfren clearly gates the provider behind official setup.
- The app does not imply unofficial access.
- Missing OAuth/webhook credentials are visible in the adapter response.

Steps:

1. Choose Ring or Nest in Trailfren.
2. Start the official account path.
3. Confirm the route returns a gated status until official credentials exist.
4. Do not enter personal vendor credentials anywhere except the official provider
   flow after setup is approved.

## Result Template

Use this format after each test:

```text
Provider:
Camera model:
App/firmware version:
Network:
Trailfren path tested:
What worked:
What failed:
Battery concern:
Privacy concern:
Screenshots/logs captured:
MVP decision:
Next action:
```

## Triage Rules

- If a path requires private API guessing, mark it blocked.
- If a path requires official credentials, mark it vendor setup required.
- If a path works only with local relay, keep camera credentials local-only.
- If a path exposes public media by default, block beta release until privacy is
  fixed.
