# Camera Provider Adapters

Updated: August 17, 2026

## Purpose

This doc records the cloud-safe adapter contracts for hard, popular camera integrations. GitHub remains the canonical source, Vercel runs the server routes, and real camera credentials stay either in server-only environment variables or in a user-owned local relay.

The shipped contract entrypoint is:

- `GET /api/cameras/provider-adapters`

It returns:

- provider adapter contracts
- route paths and methods
- Vercel environment variable checklist
- official source audit
- cloud policy for official cloud, local relay, partner/export, and manual fallback paths

The environment checklist includes shared account-safety requirements such as `FLOCK_SESSION_SIGNING_SECRET` and durable camera-store variables, plus provider-specific OAuth, webhook, relay, and storage requirements.

## Adapter Routes

| Provider | Route | Status Today | Why |
|---|---|---|---|
| Ring | `GET /api/cameras/ring/oauth/start` | `configuration-required` / `vendor-review-required` | Official Ring partner API setup, OAuth config, webhook validation, and review are required. |
| Ring | `POST /api/cameras/ring/webhooks` | `configuration-required` / `vendor-review-required` | Signed webhook handling is gated until the webhook secret and vendor setup exist. |
| Google Nest | `GET /api/cameras/nest/oauth/start` | `configuration-required` / `vendor-review-required` | Device Access project and OAuth config are required. |
| Google Nest | `POST /api/cameras/nest/events` | `configuration-required` / `vendor-review-required` | Device Access event handling is gated until Google setup and validation exist. |
| Birdfy / Netvue | `POST /api/cameras/birdfy/partner-request` | `partner-review-required` | No public developer API is documented; use partner access, user-approved export, share import, or manual upload. |
| Bird Buddy | `POST /api/cameras/bird-buddy/partner-request` | `partner-review-required` | Use partner access or user-approved postcard/share export. Do not automate private app access. |
| Wyze | `POST /api/cameras/wyze/model-check` | `supported-rtsp-model` or `unsupported-model` | RTSP is model and firmware specific, so Wyze must be checked before relay setup. |
| Reolink | `POST /api/cameras/devices`, `POST /api/cameras/relay-manifests`, and `POST /api/cameras/relay-uploads` | `relay-required` | User-owned local relay reads RTSP/ONVIF and uploads signed clip records to Vercel. |
| Tapo | `POST /api/cameras/devices`, `POST /api/cameras/relay-manifests`, and `POST /api/cameras/relay-uploads` | `relay-required` | User-owned local relay reads RTSP/ONVIF and uploads signed clip records to Vercel. |
| Supported Wyze RTSP models | `POST /api/cameras/wyze/model-check`, `POST /api/cameras/relay-manifests`, and `POST /api/cameras/relay-uploads` | `model-check-required` | A supported model can receive a relay manifest after the RTSP eligibility check and device registration. |
| Manual upload | `POST /api/cameras/clip-ingests` | `available-now` | Always-available fallback for unsupported cameras. |

## Vercel Environment Checklist

Required before production cloud integrations:

| Variable | Provider(s) | Purpose |
|---|---|---|
| `FLOCK_CAMERA_STORE_REST_URL` | shared | Durable account-owned camera state. |
| `FLOCK_CAMERA_STORE_REST_TOKEN` | shared | Server-only token for the camera state store. |
| `FLOCK_SESSION_SIGNING_SECRET` | shared | Temporary server-signed account ownership seam until real auth is wired. |
| `FLOCK_RELAY_SIGNING_SECRET` | Reolink, Tapo, Wyze | Production HMAC verification for local relay uploads. |
| `FLOCK_CLIP_STORAGE_BUCKET` | Reolink, Tapo, Wyze, future imports | Private clip asset storage. |
| `FLOCK_RING_CLIENT_ID` | Ring | Official Ring OAuth client id. |
| `FLOCK_RING_CLIENT_SECRET` | Ring | Official Ring OAuth client secret. |
| `FLOCK_RING_REDIRECT_URI` | Ring | OAuth redirect URI deployed on Vercel. |
| `FLOCK_RING_WEBHOOK_SECRET` | Ring | Signed webhook validation. |
| `FLOCK_GOOGLE_CLIENT_ID` | Nest | Google OAuth client id. |
| `FLOCK_GOOGLE_CLIENT_SECRET` | Nest | Google OAuth client secret. |
| `FLOCK_NEST_REDIRECT_URI` | Nest | OAuth redirect URI deployed on Vercel. |
| `FLOCK_NEST_DEVICE_ACCESS_PROJECT_ID` | Nest | Google Device Access project id. |
| `FLOCK_GOOGLE_PUBSUB_TOPIC` | Nest | Device Access event topic. |

Optional until production:

- Birdfy and Bird Buddy partner contact/config variables can be added after a real partner/export workflow exists.

## Wyze RTSP Model Check

The shipped checker only treats these exact model families as relay-eligible:

- Wyze Cam v2
- Wyze Cam v3
- Wyze Cam Pan

Anything else returns `localRelayEligible: false` and `fallbackProviderId: manual-upload`.

This is intentional. Wyze support is popular but fragmented, and the app should not imply universal Wyze camera support.

## Hard Gates

- Do not collect vendor camera passwords in Flock.
- Do not store RTSP or ONVIF camera URLs in the browser.
- Do not scrape or reverse engineer private mobile apps.
- Do not enable Ring or Nest OAuth until official app configuration and review are complete.
- Do not accept real provider webhooks until signature validation is implemented and tested.
- Do not publish private clips outside review and privacy rules.

## Verified Sources

- Ring partner API documentation: https://developer.amazon.com/docs/ring/api-documentation.html
- Google Nest Device Access camera docs: https://developers.google.com/nest/device-access/api/camera-wired
- Reolink CGI/RTSP/ONVIF support: https://support.reolink.com/articles/900000617826-Which-Reolink-Products-Support-CGI-RTSP-ONVIF/
- Tapo RTSP/ONVIF support: https://www.tp-link.com/us/support/faq/2680/
- Wyze Cam RTSP support: https://support.wyze.com/hc/en-us/articles/360026245231-Wyze-Cam-RTSP
- Birdfy app introduction: https://support.birdfy.com/help/birdfy-app/Introduction-BirdfyApp/
- Bird Buddy postcards: https://support.mybirdbuddy.com/hc/en-us/articles/9175854254865-Postcards-Collecting-Photos-and-Videos
- Bird Buddy sharing: https://support.mybirdbuddy.com/hc/en-us/articles/4406551221521-Sharing-photos-and-videos
