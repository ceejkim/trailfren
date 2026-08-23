# Privacy And Sharing Rules For Beta

Updated: August 23, 2026

## Default Rule

Every camera-originated clip starts private. A clip can become visible to friends
or leagues only after review.

## Visibility States

- `private`: visible only to the owner.
- `friends`: visible to approved friends after review.
- `league`: visible in league/game surfaces after review.

The current app already uses these privacy modes. The beta rule is that camera
sync never skips private review for real clips.

## Sharing Rules

- Comments and reactions are allowed only inside the selected audience.
- A user can delete their own clip, sighting, comment, or camera connection.
- Deleted clips should remove private media objects and hide derived sightings.
- League scoring can keep aggregate points, but should not keep a public clip if
  the owner deletes it.
- Private camera location labels should stay coarse, such as "Backyard feeder",
  not precise addresses.

## Camera Vendor Rules

- Do not collect Birdfy, Bird Buddy, Ring, Nest, Wyze, Reolink, Tapo, or other
  vendor passwords.
- Do not store raw RTSP/ONVIF URLs in browser or cloud records.
- Do not scrape private vendor APIs or bypass app/vendor permissions.
- Use official OAuth, local relay, partner/export, share/import, or manual upload
  paths only.

## Beta Moderation Rules

Before inviting beta users, add or confirm:

- owner deletion path
- report/hide path for inappropriate comments or shared clips
- private-by-default camera onboarding copy
- retention decision for rejected/no-bird clips
- contact path for account deletion or data export requests

## Approval Gate

Any feature that changes who can see camera footage, where private media is
stored, or how vendor accounts are accessed needs Charles's explicit approval
before implementation or deployment.
