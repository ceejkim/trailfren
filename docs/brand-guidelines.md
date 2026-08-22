# Trailfren / Flock Brand Guidelines

Trailfren is the parent platform for wildlife camera communities. Flock is the first product expression: a bird-camera social app where people review real backyard moments, share them with trusted friends, and make sightings count in a friendly weekly game.

The brand should feel simple, professional, intuitive, friendly, and privacy-aware. It should not feel like a gaming skin, a generic SaaS dashboard, or a nature blog. The best visual metaphor is a modern field station scorecard: calm enough to trust, lively enough to make a rare bird feel worth sharing.

## Brand Promise

See what visited. Share what matters. Keep every camera moment under your control.

## Naming

- `Trailfren`: parent platform and future multi-wildlife network.
- `Flock`: consumer-facing bird community and social product.
- `BirdWatch`: current MVP/workspace label. Use as a subtitle only when needed.
- `Feeder power`: weekly game score based on visits, rarity yield, and verified species variety.

## Design Principles

- Simple first: one primary action per surface, plain labels, no decorative complexity in workflows.
- Professional by default: predictable spacing, restrained cards, clear hierarchy, visible status, no gimmicky game chrome.
- Friendly in the details: warm microcopy, approachable empty states, real bird language, human-scale scores.
- Intuitive under pressure: camera, privacy, review, share, and league states must be readable at a glance.
- Private by design: camera feeds and clip ownership should look protected, revocable, and explicit.

## Core Palette

Use this as the stable product palette. Green is the trust layer; blue, gold, and coral prevent the product from becoming a single-hue interface.

| Token | Hex | Role |
| --- | --- | --- |
| Canopy Ink | `#17211D` | Primary text, final-match surfaces, protected-state emphasis |
| Spruce | `#234235` | Navigation, primary structure, secondary action background |
| Mist | `#F3F6F1` | App canvas and calm page background |
| Paper | `#FFFFFF` | Cards, forms, panels, readable surfaces |
| Field Lime | `#D9F36F` | Primary action, active state, current-user highlights |
| Lake Blue | `#5C8ECF` | Camera/sync/info accents and the first bracket rail |

## Supporting Colors

| Token | Hex | Use |
| --- | --- | --- |
| Rarity Gold | `#F0C94D` | Rare sightings, bracket winners, achievement warmth |
| Grosbeak Coral | `#D76545` | High-energy game accents, alerts that are not errors |
| Fern Success | `#266B45` | Confirmed actions, approved review, positive status |
| Clay Warning | `#6C5216` | Configuration warnings and soft caution |
| Cardinal Error | `#8B2F1B` | Errors, failed auth, blocked action |
| Line | `#DCE4DD` | Dividers, borders, low-emphasis component edges |

## Color Rules

- Use Field Lime for one primary action per view. Do not use it as a broad background.
- Use Canopy Ink for protected or decisive moments, such as final bracket cards and secure-auth panels.
- Use Lake Blue for camera connection, sync, and informational states.
- Use Rarity Gold only when rarity, winning, or progress is the content.
- Use Grosbeak Coral sparingly to show energy, not danger.
- Keep most screens 70 percent neutral surfaces, 20 percent forest/ink structure, 10 percent accents.

## Typography

Current MVP typography should remain system-first for speed and clarity:

- Product UI: `Inter`, system sans-serif fallback.
- Numeric/game surfaces: Inter 800 to 900 weight, tabular-style spacing where available.
- Species and clip names: sentence case, semibold, never all caps.
- Labels and metadata: small uppercase is acceptable only for structural labels like `Feeder power`, `Visits`, and `Rarity yield`.

Future brand exploration can add a restrained editorial serif for public marketing pages or species storytelling, but not inside dense app workflows until the MVP is stable.

## Layout

- App screens should feel like a working tool, not a landing page.
- Use full-width work areas with compact panels. Avoid putting cards inside cards.
- Keep cards at `8px` radius or less.
- Use stable grid dimensions for metrics, bracket rows, clip cards, nav items, and buttons.
- Put privacy, review, and sharing controls close to the clip or camera state they affect.
- Mobile should stack into a single clear reading path: status, action, evidence, next step.

## Signature Element

The signature visual system is the Field Station Scorecard:

- A calm surface with a strong left rail or top rail.
- Three visible scoring inputs for game mechanics.
- Clear seed/rank language.
- Actual bird/camera content as the emotional center.
- No decorative blobs, abstract gradients, or stock-like nature atmosphere.

This gives the product a memorable identity without making it feel unserious.

## Product Voice

The voice is direct, warm, and specific.

Use:

- `Review latest clip`
- `Share with friends`
- `Private until approved`
- `120 to catch Ari`
- `Birdfy export pending`

Avoid:

- `Submit`
- `Engage community`
- `Unlock virality`
- `Seamless AI-powered ecosystem`
- `Public feed enabled`

## Core Workflows

Every primary workflow should follow this pattern:

1. State what is happening.
2. Show what the user controls.
3. Explain the privacy boundary.
4. Offer one clear next action.

Examples:

- Camera sync: `Choose camera` -> `Approve safe path` -> `Private review` -> `Share after review`.
- Clip review: `Analyze latest clip` -> `Approve ID` -> `Choose audience` -> `Count toward power`.
- Game loop: `See power` -> `Understand formula` -> `Compare bracket` -> `Improve next visit`.

## Components

- Primary buttons: Field Lime background, Canopy Ink text, icon plus action label.
- Secondary buttons: subtle green-gray background with icon and clear verb.
- Icon buttons: lucide icons, fixed square dimensions, tooltip title.
- Status badges: use color only with text, never color alone.
- Metrics: icon tile plus value plus plain label.
- Clip cards: real image first, then species, camera, location, confidence, score contribution, social actions.
- Brackets: show both competitors, score, winner highlight, and margin.
- Forms: short labels, one purpose per field, explicit error text.

## Privacy And Trust

Trust is part of the brand, not a legal afterthought.

- Camera media is private until explicitly shared.
- Vendor credentials are never requested unless an official OAuth path exists.
- Unsupported vendors should be described as `partner/export pending`, not `connected`.
- Delete, revoke, and privacy states should be visible before beta.
- Any public or league sharing action must make audience clear.

## Accessibility

- Maintain strong contrast for body text and action labels.
- Never rely on color alone for rarity, status, or bracket winners.
- Keep focus states visible on every interactive element.
- Respect reduced motion.
- Avoid viewport-scaled font sizes for compact UI.
- Button text must fit on mobile without wrapping into unreadable shapes.

## Motion

Motion should be quiet and useful:

- Use small transitions for hover, focus, and bracket advancement.
- Use no motion for privacy or error states unless it helps the user locate the issue.
- Avoid ambient loops, floating decoration, and attention-grabbing animation in the app shell.

## Imagery

- Use actual bird, feeder, habitat, or camera imagery.
- Prefer crisp, inspectable media over dark atmospheric crops.
- Clip thumbnails should feel like evidence, not decoration.
- Marketing imagery can be warmer, but the app should prioritize what the user captured.

## Implementation Tokens

Recommended CSS variable direction:

```css
:root {
  --color-ink: #17211d;
  --color-spruce: #234235;
  --color-canvas: #f3f6f1;
  --color-surface: #ffffff;
  --color-action: #d9f36f;
  --color-info: #5c8ecf;
  --color-rarity: #f0c94d;
  --color-energy: #d76545;
  --color-success: #266b45;
  --color-line: #dce4dd;
}
```

## Quality Checklist

- Can a new user identify the primary action in 3 seconds?
- Is the camera privacy state visible before sharing or scoring?
- Does the screen still look professional if all images fail to load?
- Does every game score explain where it came from?
- Are active, loading, empty, error, and success states covered?
- Does mobile preserve the same decision order as desktop?
- Does the page use at least one non-green accent when the content calls for it?

