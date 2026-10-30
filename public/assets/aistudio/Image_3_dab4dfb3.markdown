---
name: ChibiVerse
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff516a'
  on-tertiary-container: '#5b0017'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Outfit
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system captures an energetic, premium anime-inspired digital realm. It blends sleek cyberpunk minimalism with playful Japanese pop culture aesthetics, evoking excitement, collectible pride, and frictionless immersion. 

The visual style merges deep obsidian nightscapes with radiant neon-pastel accents and high-fidelity frosted glass. Translucent surface layers, delicate luminous strokes, and buoyant pill badges create a lightweight, responsive interface that feels like a next-generation anime collectibles vault or companion dashboard.

## Colors
The palette balances an ultra-deep cosmic backdrop with radiant, vibrant accents:
- **Base Canvas & Surfaces**: Deep Midnight Slate (`#0B0F19`) anchors the core canvas, layered with Obsidian Glass (`#131A2A`) at varying alpha thresholds (40%–80%) for surfaces and panels.
- **Vibrant Lavender (`#8B5CF6`)**: The primary brand accent, used for high-impact actions, key active states, and prominent character aura highlights.
- **Electric Cyan (`#06B6D4`)**: The secondary accent, signaling interactive feedback, technical readouts, telemetry, and quick filters.
- **Coral Pop (`#F43F5E`)**: The tertiary accent, driving favorites, critical alerts, heart stats, and playful interactive rewards.
- **Sunny Gold (`#FBBF24`)**: A dedicated auxiliary token for rare drops, stars, XP ranks, and VIP tier achievements.
- **Borders & Strokes**: Low-opacity neon rings utilizing 15%–30% alpha versions of primary and secondary hues to emulate a gentle anime edge rim light.

## Typography
Typography marries the geometric modern charisma of **Outfit** for expressive display titles, rank headers, and numerical counters with the ultra-legible, humanist curves of **Plus Jakarta Sans** for metadata and body copy. 

Headlines use tight negative tracking (-0.02em) to maintain crisp punchiness, while labels and micro-badges use slight positive letter spacing (+0.03em to +0.05em) in uppercase to guarantee rapid recognition across dense collection grids.

## Layout & Spacing
The layout follows a flexible 12-column grid on desktop (max-width: 1440px) that condenses to 8 columns on tablet and 4 columns on mobile:
- **Canvas Margins**: Desktop uses `2rem` (32px) margins; mobile shrinks to `1rem` (16px) for edge-to-edge readability.
- **Card Grids**: Vault items and character cards snap into responsive auto-fill grids with a baseline `gutter` of `1.5rem` (24px) down to `1rem` (16px) on mobile viewports.
- **Internal Padding**: Surface cards strictly use `space-md` (16px) or `space-lg` (24px) padding to give complex collectible renders breathing room without overcrowding interface chrome.

## Elevation & Depth
Depth relies on frosted glass layers paired with ambient neon perimeter glows:
- **Level 0 (Canvas)**: Solid deep slate background (`#0B0F19`) overlaid with subtle, static radial gradients in deep violet and indigo at 10% opacity.
- **Level 1 (Panels & Feed Cards)**: Semi-translucent glass (`#131A2A` at 65% opacity) with a `16px` backdrop blur (`backdrop-filter: blur(16px)`). Framed by a 1px perimeter border in `#8B5CF6` at 18% opacity.
- **Level 2 (Active Cards & Modals)**: Translucent glass (`#131A2A` at 85% opacity) with `24px` backdrop blur, a soft drop shadow (`0 20px 40px -15px rgba(0, 0, 0, 0.7)`), and a delicate perimeter glow (`0 0 20px rgba(139, 92, 246, 0.2)`).
- **Level 3 (Tooltips & Popovers)**: Solid high-contrast surface (`#1E2638`), 1px vibrant cyan border (`rgba(6, 182, 212, 0.4)`), accompanied by a tight ambient shadow (`0 10px 25px rgba(0, 0, 0, 0.5)`).

## Shapes
A unified rounded aesthetic softens the tech-heavy dark UI, creating an approachable, playful charm:
- **Cards & Sheets**: Utilize `rounded-2xl` (1rem to 1.5rem) to produce signature rounded glass containers.
- **Buttons, Badges & Chips**: Embrace fully curved pill capsules (`rounded-full`), enhancing touch ergonomics and cartoon-adjacent playfulness.
- **Input Fields & Search Bars**: Harmonize with standard container rounding at `0.75rem` to `1rem`.

## Components

### Buttons
- **Primary Action**: Pill-shaped (`rounded-full`) container with an electric gradient fill transitioning from Lavender (`#8B5CF6`) to Electric Cyan (`#06B6D4`). High-contrast white label, elevated with a subtle outer aura (`0 4px 14px rgba(139, 92, 246, 0.35)`). Active clicks deliver a snappy scale-down (`scale(0.97)`).
- **Secondary Action**: Translucent dark glass fill with a 1px border in cyan (`rgba(6, 182, 212, 0.3)`). Hover transitions to full cyan border with an interior glow.
- **Tertiary / Ghost**: Transparent fill, muted text, expanding into a soft lavender surface tint on hover.

### Badges & Pill Tags
- **Rarity Badges**: Pill-shaped micro-containers (`font-label-sm`, uppercase) with 15% opacity fills corresponding to tier:
  - *Common / Tech*: Electric Cyan (`#06B6D4`)
  - *Rare / Mystic*: Vibrant Lavender (`#8B5CF6`)
  - *Legendary / Chibi SSR*: Sunny Gold (`#FBBF24`)
  - *Exclusive / Event*: Coral Pink (`#F43F5E`)
- Badges feature a matching 1px solid stroke with an ambient mini-glow.

### Glass Cards (Vault & Character Tiles)
- Encased in `rounded-2xl` containers with `16px` backdrop blur over `#131A2A` (60% alpha).
- 1px hairline border transitioning vertically from primary lavender (25% opacity) to completely transparent at the bottom edge.
- Hover brings a soft translateY (-4px) and shifts the border glow to radiant cyan (`#06B6D4`).

### Form Inputs
- Rounded pill or soft rectangle (`0.75rem`), deep navy surface tint (`#0B0F19` at 80% opacity), inset 1px stroke in slate grey (`rgba(255, 255, 255, 0.1)`).
- Focused state shifts the border to Electric Cyan (`#06B6D4`) with a localized cyan light spread (`0 0 0 3px rgba(6, 182, 212, 0.2)`).

### Checkboxes & Radios
- Checkboxes: Soft rounded squircles (`6px`) with 1.5px cyan outline; active state fills with primary lavender and displays a crisp white checkmark.
- Radios: Circular pills with concentric neon dot indicators that scale smoothly from `scale(0)` to `scale(1)` upon selection.

### Stat Counters & XP Gauges
- Progress tracks use ultra-dark recessed grooves (`#0B0F19`) housing vibrant gradient liquid fills (Cyan to Lavender) terminating in a bright white pulse cap.