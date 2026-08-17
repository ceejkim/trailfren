# Flock Camera Integration Matrix

Updated: August 17, 2026

## Product Principle

Flock should win by being honest about camera support. The app should support open standards first, official cloud APIs second, partner/export workflows third, and manual upload as the fallback. It should not scrape private apps, reverse engineer camera clouds, or imply support where the vendor does not provide a durable integration path.

## Integration Priority

1. **RTSP/ONVIF local-network cameras**
   - Best early path for real bird-camera ingestion.
   - Good fit for Reolink, Tapo, supported Wyze models, and other open local cameras.
   - Requires a local relay or user-owned edge process because Vercel cannot directly reach a user's private LAN camera.

2. **Official cloud APIs**
   - Best path for mainstream consumer security cameras.
   - Good fit for Ring and Nest.
   - Requires OAuth, developer registration, environment variables, webhook handling, certification/review, and careful privacy UX.

3. **Bird-native partner/export/share paths**
   - Best path for Bird Buddy and Birdfy/Netvue until official developer APIs are available.
   - Should focus on user-initiated import, partner outreach, public/shared clips, or email/export workflows.
   - Avoid app scraping or private API assumptions.

4. **Manual upload**
   - Necessary fallback for every camera ecosystem.
   - Also useful for beta users who want league scoring before full camera automation exists.

## Provider Matrix

| Provider | Popularity / Birding Relevance | Official Path | MVP Support | Risks / Constraints | Flock Position |
|---|---:|---|---|---|---|
| Reolink | High for DIY backyard/security camera users | RTSP/ONVIF on supported models | High | Battery WiFi support may require Home Hub; LTE models may not support CGI/RTSP/ONVIF | First standards-based real camera target |
| Tapo | High for affordable consumer cameras | RTSP/ONVIF for many models | High | Local network required; user must create camera account; battery/solar caveats | First standards-based real camera target |
| Wyze | Very popular, but fragmented RTSP support | RTSP only on supported models/firmware | Medium | Newer models may lack RTSP; support differs by firmware/model | Support only explicitly documented RTSP models |
| Ring | Very popular and technically challenging | Official Ring developer APIs | Medium | OAuth, webhooks, certification, stream limits, watermarking/review | Cloud API target after architecture is ready |
| Nest | Very popular and technically challenging | Google Device Access | Medium | Device Access setup, OAuth, permissions, live-stream handling | Cloud API target after architecture is ready |
| Bird Buddy | Very high bird-native relevance | App, livestream/membership, sharing/guest features | Medium-low | EULA restricts reverse engineering/commercial misuse; developer API not obvious | Partner/export/share path only until official access |
| Birdfy / Netvue | High bird-native relevance | App/support docs; no clear public developer API found | Medium-low | No obvious public API; avoid scraping private app/cloud | Partner/export/share path only until official access |
| Manual upload | Universal | User uploads or logs sighting | High | Less automated; lower magic | Keep as always-available fallback |

## Day 1 Implementation Target

Add these to the app/repo:

- `CameraProvider`
- `CameraDevice`
- `CameraIntegrationStatus`
- `CameraConnectionRequirement`
- `StreamTransport`
- `CameraPrivacyMode`
- Provider metadata in `src/cameraProviders.ts`
- Updated sidebar/onboarding UI grouped by:
  - Works now
  - Requires local network relay
  - Requires official cloud account
  - Partner/export only
  - Manual fallback
- `docs/camera-integrations.md`
- `docs/vercel-deployment.md`

## Day 1 Type Sketch

```ts
export type CameraProviderId =
  | "reolink"
  | "tapo"
  | "wyze"
  | "ring"
  | "nest"
  | "bird-buddy"
  | "birdfy-netvue"
  | "manual-upload";

export type IntegrationPhase =
  | "available-now"
  | "local-relay-required"
  | "official-api-required"
  | "partner-export-only"
  | "manual";

export type StreamTransport =
  | "rtsp"
  | "onvif"
  | "webrtc"
  | "whep"
  | "vendor-webhook"
  | "manual-upload"
  | "partner-export";

export type CameraPrivacyMode = "private" | "friends" | "league" | "public";

export type CameraProvider = {
  id: CameraProviderId;
  name: string;
  phase: IntegrationPhase;
  transports: StreamTransport[];
  requiresLocalRelay: boolean;
  requiresOAuth: boolean;
  requiresPartnerAccess: boolean;
  credentialStorage: "none" | "server-only" | "vendor-oauth";
  launchRecommendation: "day-1" | "beta" | "partner" | "later";
  constraints: string[];
};
```

## Vercel Notes

- Vercel is fine for the React app, API routes, OAuth callbacks, webhook ingestion, and metadata persistence.
- Vercel should not be expected to connect directly to `rtsp://192.168.x.x/...` cameras inside a user's home network.
- RTSP/ONVIF requires a local relay, desktop helper, NAS/Home Assistant bridge, or user-owned edge service.
- Camera credentials should be server-only or stored in the user-owned relay, never browser localStorage.
- OAuth providers need environment variables and redirect URL configuration.
- Webhook providers need signature validation and event replay protection.

## Day 4 Adapter Contracts

The current Day 4 slice adds cloud-safe adapter contracts rather than fake vendor integrations:

- `GET /api/cameras/provider-adapters`
- `GET /api/cameras/ring/oauth/start`
- `POST /api/cameras/ring/webhooks`
- `GET /api/cameras/nest/oauth/start`
- `POST /api/cameras/nest/events`
- `POST /api/cameras/birdfy/partner-request`
- `POST /api/cameras/bird-buddy/partner-request`
- `POST /api/cameras/wyze/model-check`

Reolink and Tapo continue through the local relay registration/upload routes because Vercel cannot safely connect to private LAN streams.

See `docs/camera-provider-adapters.md` for the full route and environment checklist.

## Source Notes

- Nest Device Access camera events/live stream: https://developers.google.com/nest/device-access/api/camera-wired
- Nest camera sharing limitations: https://support.google.com/googlehome/answer/9227530
- Ring partner API documentation: https://developer.amazon.com/docs/ring/api-documentation.html
- Reolink CGI/RTSP/ONVIF support: https://support.reolink.com/articles/900000617826-Which-Reolink-Products-Support-CGI-RTSP-ONVIF/
- Reolink RTSP setup: https://support.reolink.com/articles/360007010473-How-to-Live-View-Reolink-Cameras-via-VLC-Media-Player/
- Tapo RTSP/ONVIF FAQ: https://www.tp-link.com/us/support/faq/2680/
- Wyze Cam RTSP support: https://support.wyze.com/hc/en-us/articles/360026245231-Wyze-Cam-RTSP
- Birdfy app introduction: https://support.birdfy.com/help/birdfy-app/Introduction-BirdfyApp/
- Bird Buddy postcards: https://support.mybirdbuddy.com/hc/en-us/articles/9175854254865-Postcards-Collecting-Photos-and-Videos
- Bird Buddy sharing: https://support.mybirdbuddy.com/hc/en-us/articles/4406551221521-Sharing-photos-and-videos
- Bird Buddy EULA: https://mybirdbuddy.com/app-eula/
