# SubTrack — Design Documentation

> Instruction for the AI agent: this file defines the complete visual and interaction design. It was derived from a Figma Make prototype (Linear.app meets Revolut, Bento grid, dark glassmorphism). Match it closely. The Figma prototype used Vite + `src/App.tsx`; **rebuild it in Next.js 14 (App Router)** as described in `03_TECH_STACK.md`, reusing the same look.

---

## 1. Design Vision

- **Vibe:** Ultra-modern Gen Z fintech. Energetic, playful microcopy, but numbers must stay crisp and trustworthy.
- **References:** Linear.app (precision, restraint), Revolut (bold money numbers).
- **Principles**
  1. Money number first: the biggest thing on screen is always a rupee amount.
  2. Warnings are actionable, never scary: every alert has a next step.
  3. Glow is a spice, not the meal: neon only on borders, CTAs, charts and key indicators.
  4. Everything scannable in 3 seconds.

## 2. Design Tokens

### 2.1 Colours
| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#090A0F` | App background |
| `--bg-elevated` | `#0F1118` | Sidebar, modals |
| `--surface` | `rgba(255,255,255,0.03)` | Card fill (glass) |
| `--surface-hover` | `rgba(255,255,255,0.05)` | Card hover |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Default card border |
| `--border-glow-violet` | `rgba(139,92,246,0.45)` | Accent border / focus |
| `--border-glow-pink` | `rgba(236,72,153,0.40)` | Alert / danger border |
| `--violet-500` | `#8B5CF6` | Primary |
| `--violet-400` | `#A78BFA` | Links, secondary text accents |
| `--fuchsia-500` | `#D946EF` | Gradient middle, logo tile |
| `--pink-500` | `#EC4899` | Gradient end, warnings, zombie |
| `--emerald-400` | `#34D399` | Positive (savings, "down 12%"), live status |
| `--acid-green` | `#4ADE80` | Donut accent segment |
| `--amber-400` | `#FBBF24` | Caution (trial under 7 days) |
| `--red-400` | `#F87171` | Error / destructive |
| `--text-primary` | `#F5F5FA` | Headings, numbers |
| `--text-secondary` | `#A1A3B5` | Body, labels |
| `--text-muted` | `#6B6D80` | Captions, axis labels |

**Primary gradient (CTA, logo):** `linear-gradient(135deg, #7C3AED 0%, #C026D3 55%, #EC4899 100%)`
**Page ambient glow:** two blurred radial gradients (violet top-left, pink bottom-right) at ~12% opacity behind content.

**Chart colours (in order):** Streaming `#8B5CF6`, Gym/Health `#EC4899`, Cloud `#34D399`, Gaming `#475569` (neutral slate), AI Tools `#22D3EE`, Other `#94A3B8`.

### 2.2 Typography
| Role | Font | Size / weight |
|---|---|---|
| Display / hero number | Inter (or "Plus Jakarta Sans") | 56px / 700, tight tracking -0.03em |
| H1 greeting | Inter | 32px / 700 |
| Card title | Inter | 16px / 600 |
| Body | Inter | 14px / 400 |
| Caption / eyebrow | Inter | 11px / 600, uppercase, tracking 0.12em |
| Numbers | Use `font-variant-numeric: tabular-nums` everywhere |

Load fonts with `next/font/google`.

### 2.3 Spacing, radius, shadow
| Token | Value |
|---|---|
| Spacing scale | 4, 8, 12, 16, 24, 32, 48 px |
| Card padding | 24px (20px on mobile) |
| Bento gap | 20px |
| Radius card | 28px |
| Radius button / pill | 999px |
| Radius input | 14px |
| Radius modal | 24px |
| Glass blur | `backdrop-filter: blur(20px)` |
| Card shadow | `0 8px 40px rgba(0,0,0,0.45)` |
| Violet glow | `0 0 32px rgba(139,92,246,0.35)` |
| Pink glow | `0 0 32px rgba(236,72,153,0.30)` |

## 3. Layout

### 3.1 App shell (desktop, 1440×900)
- **Floating sidebar pill** at left: 72px wide, rounded 36px, 16px from viewport edges, full height minus 32px. Contents top to bottom:
  - Logo tile: 44px rounded-14 gradient square with a glowing white lightning-bolt icon (Lucide `Zap`).
  - Nav icons (48px hit area, tooltip on hover with label): **Overview** (`LayoutGrid`), **Sub Vault** (`CreditCard`), **Bleed Radar** (`Radar`, with small pink dot when there are unread alerts), **Smart Split** (`ScanLine` or `Users`), **Settings** (`Settings`).
  - Active item: violet tinted pill background, 1px violet glow border, small vertical violet bar on the far left edge.
  - Bottom: avatar badge with initials ("AK") and green online dot; a tiny "Free Tier" chip appears on hover/expanded state (on mobile and in the profile menu it is always visible).
- **Main area** is to the right with 32px padding, max width 1280px.

### 3.2 Header row
- Left: breadcrumb `Dashboard / Overview` (muted / primary) followed by a pill badge: green dot + **LIVE BURN RATE: ACTIVE** (emerald text, emerald 20% border, emerald 8% fill).
- Right: Search icon button (shows ⌘K hint on hover; opens command palette) and gradient CTA **+ Add New Subs** (pill, primary gradient, violet glow).

### 3.3 Greeting block
- Eyebrow: `MONEY HQ · {MONTH YEAR}`
- H1: `Yo, {firstName} — here's the damage.`
- Right aligned small text: `Synced 2m ago` with green dot.

### 3.4 Bento grid (3 columns on desktop, 20px gap)

```
+----------------------------------+--------------------+
| Card 1  Monthly Wallet Bleed     | Card 2  Zombie     |
| (span 2)                         | Subscriptions (1)  |
+--------------------+-------------+--------------------+
| Card 3  Trial Trap | Card 4  Burn Rate Flow (span 2)  |
| Radar (1)          |                                  |
+--------------------+----------------------------------+
| Card 5  Vibe Check | Card 6  Upcoming Debits (span 2) |
| donut (1)          | horizontal scroll rail           |
+--------------------+----------------------------------+
```
This matches the Figma prototype. Row heights: row 1 about 300px, row 2 about 340px, row 3 about 300px.

## 4. Card Specifications

All cards: glass surface, 1px subtle border, radius 28px, padding 24px, soft top-left inner highlight (`inset 0 1px 0 rgba(255,255,255,0.06)`). Hover: border brightens to violet glow, translateY(-2px), 200ms.

### Card 1: Monthly Wallet Bleed (span 2)
- Title top-left; **LIVE** pill top-right (pink text, pink border, tiny).
- Hero: `₹3,849` at 56px bold with `/ mo` in muted 18px.
- Delta line: emerald down-arrow + **12%** (bold emerald) + "from last month, clean vibes!" (secondary).
- Right side: sparkline (pink to violet gradient stroke, soft violet gradient fill fading to transparent), ~360×110px, no axes, tooltip on hover.

### Card 2: Zombie Subscriptions
- Title + ghost icon button top-right (pink tinted square, `Ghost` icon).
- Big `3` (56px) + muted "found lurking".
- Text: "Unused in 30 days." followed by **Save ₹899?** in pink bold.
- Link: **Review the undead →** (violet-400, arrow nudges 4px on hover). Navigates to Vault with the Zombie filter on.

### Card 3: Trial Trap Radar
- Title + radar icon button top-right.
- Centre: animated radar graphic: concentric circles, a rotating violet sweep (conic gradient), a violet centre dot, a pink blip. Sweep rotates 6s linear infinite (disabled under reduced motion).
- Bottom: full-width pill with clock icon: "Prime trial ends in **48 hrs**" (violet tinted; turns pink/amber when under 48 hrs, hover shows "Cancel before ₹299 debit").
- Empty: "No trials lurking. Radar is clear."

### Card 4: Burn Rate Flow (span 2)
- Title + subtitle "Your monthly spend trajectory". Top right: eyebrow `DEC FORECAST` and `₹4,120`.
- Recharts `AreaChart`, Jan to Dec, smooth (`monotone`) stroke with gradient pink to violet, glow via SVG filter or drop-shadow, fill gradient violet 35% to 0%. Last point: larger violet dot with ring. Months after the current month use a dashed stroke.
- X axis: muted 11px month labels; no Y axis labels; faint dotted horizontal grid.
- Tooltip: glass pill showing month and `₹X`.

### Card 5: Vibe Check / Category Split
- Title + "Category split" subtitle + `…` menu.
- Donut (Recharts `PieChart`, innerRadius 70%, 3px gap between segments, rounded caps): Streaming 50 (violet), Gym/Health 25 (pink), Cloud 15 (emerald/acid), Gaming 10 (slate).
- Centre text: total ₹ and "per month".
- Legend below: dot, name, percentage, amount.

### Card 6: Upcoming Debits (span 2)
- Header: "Upcoming Debits" + "View all" link.
- Horizontal scroll-snap rail of cards (each 220×150px, glass, radius 20px): brand icon tile (service colour), name (Netflix 4K, Spotify Duo, Claude Pro, ChatGPT Plus), "Renews 14 Oct" with a "in 3 days" chip, price `₹649`, and **Cancel Link** pill button (outline, pink hover). Fade mask on right edge. Show scroll arrows on desktop.
- Cancel flow: clicking opens a confirmation dialog ("Open Netflix's cancellation page? We can't cancel for you, but we'll take you there.") then opens the URL in a new tab and offers "Mark as Cancelled in SubTrack".

## 5. Other Screens

### 5.1 Sub Vault (Figure 11.2)
- Header: title, subtitle "{n} subscriptions, ₹X/mo", Search input, Table/Grid toggle, Export CSV button.
- Category filter pills (All, Streaming, Gym/Health, Cloud, Gaming, AI Tools, plus Zombies and Trials filters).
- Table columns: Service (icon + name), Category chip, Cost, Cycle, Next renewal, Status toggle (switch: Active/Paused), Actions (⋯: Edit, Mark used today, Cancel link, Delete).
- Row hover: surface highlight; zombie rows show a small ghost badge; trial rows show an amber "Trial" badge.
- Grid view: the same data as cards.
- Empty state: ghost illustration, "No subs here. Your wallet is safe… for now.", CTA Add New Subs.

### 5.2 Add / Edit Subscription Modal (Figure 11.3)
- Centered glass modal, 560px wide, backdrop blur + dark scrim. Slide up + fade 200ms.
- Top: row of **brand preset chips** (Netflix, Spotify, Prime, ChatGPT, Claude, YouTube, Hotstar, iCloud…) that autofill fields. "Custom" chip.
- Fields: Service name, Category (select), Cost with currency prefix, **Billing cycle segmented toggle** (Weekly / Monthly / Quarterly / Yearly), First bill date, Next renewal date (auto-computed, editable), **Free trial switch** revealing Trial end date, **Reminder** select (1, 3, 7 days before), Cancel URL (optional), Notes.
- Footer: Cancel (ghost) and **Save Subscription** (gradient). Inline validation: red-400 text under field, field border red.
- Live preview strip at the top of the footer: "That's ₹X/yr and ₹Y/mo".

### 5.3 Bleed Radar and Category Analytics (Figure 11.4)
- Left: large donut with ranked category list.
- Right column cards: **Price Hike Watchdog** (list of subs whose price increased, with +₹ badge), **Projected Savings** (zombie subs, total saving per month and year, "Cancel all zombies" review action), **Upcoming 30 days** timeline.
- Alerts list with filters (All, Unread) at the bottom.

### 5.4 Smart Split
- Preview page: sample split card, "Coming soon" badge, notify-me button (no backend).

### 5.5 Settings
- Profile (name, email), Currency, Default reminder, Danger zone (delete data). Plan card showing "Free Tier".

### 5.6 Landing / Login
- Dark hero with large headline "Stop bleeding money on subscriptions.", gradient CTA "Try the demo", Login / Sign up modal with email + password and "Continue as demo user".

### 5.7 Admin
- Same shell; 4 stat cards (Users, Subscriptions, New this week, Top category) and a category management table.

## 6. Component Inventory

`AppShell`, `SidebarPill`, `NavItem`, `AvatarBadge`, `HeaderBar`, `Breadcrumb`, `LiveBadge`, `SearchButton`, `CommandPalette`, `GradientButton`, `GhostButton`, `IconButton`, `Pill`, `Chip`, `BentoCard`, `StatNumber`, `Sparkline`, `RadarGraphic`, `AreaChartCard`, `DonutChartCard`, `DebitCard`, `DebitRail`, `SubscriptionTable`, `SubscriptionGrid`, `SubscriptionRow`, `StatusSwitch`, `CategoryFilterPills`, `SubscriptionModal`, `BrandPresetChips`, `SegmentedControl`, `FormField`, `ConfirmDialog`, `Toast`, `EmptyState`, `Skeleton`, `AlertList`.

## 7. Component States

| State | Treatment |
|---|---|
| Default | Glass surface, subtle border |
| Hover | Border to violet glow, lift 2px, 200ms ease-out |
| Focus-visible | 2px violet-400 outline with 2px offset (never remove) |
| Active/pressed | Scale 0.98 |
| Loading | Skeleton shimmer blocks matching card layout; buttons show spinner and are disabled |
| Empty | Icon, one witty line, one clear action |
| Error | Red-400 border/text with plain-language message and "Try again" |
| Disabled | 40% opacity, no pointer events, `aria-disabled` |
| Selected | Violet tinted fill with violet border |

## 8. Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| ≥1280px (desktop) | Floating sidebar left, 3-column bento |
| 768–1279px (tablet) | Sidebar collapses to icon-only pill, 2-column bento; Bleed spans 2, others 1 |
| <768px (mobile) | Sidebar becomes a floating **bottom tab bar** (5 icons, glass pill), single column, cards stacked, header CTA becomes a floating "+" button bottom-right above the tab bar, tables become card lists, modal becomes a full-height bottom sheet |

## 9. Motion

- Page load: cards fade up with 60ms stagger (opacity 0 to 1, translateY 12 to 0, 400ms).
- Number count-up on hero metric (800ms).
- Charts draw in over 700ms.
- Radar sweep loop (6s).
- Modal: scale 0.97 to 1 + fade, 200ms.
- Toasts slide in from bottom right, auto dismiss 4s.
- **Respect `prefers-reduced-motion`:** disable sweep, count-up, stagger, and hover lift.
- Use `framer-motion` only if needed; CSS transitions preferred.

## 10. Data Visualisation Rules

- Never rely on colour alone: legends include labels and percentages.
- Every chart has an `aria-label` plus a visually-hidden text summary (e.g. "Monthly spend rose from ₹3,200 in January to a forecast ₹4,120 in December").
- Tooltips appear on hover and keyboard focus.
- Currency always formatted via `Intl.NumberFormat('en-IN')`.
- Forecast portions are dashed and labelled "Forecast".

## 11. Accessibility

- Contrast: body text on surfaces at least 4.5:1 (`--text-secondary` on `--bg-base` passes); do not place `--text-muted` on glass for essential info.
- All icon-only buttons have `aria-label`; nav uses `<nav aria-label="Primary">` and `aria-current="page"`.
- Modals trap focus, close on Esc, restore focus on close; use `role="dialog"` and `aria-modal`.
- ⌘K / Ctrl+K opens the palette; arrow keys navigate, Enter selects, Esc closes.
- Status toggles use `role="switch"` with `aria-checked`.
- Minimum touch target 44×44px.
- Toasts use `role="status"` (errors use `role="alert"`).

## 12. Content and Microcopy Guidelines

Tone: witty, direct, short. Never shame the user about spending. Money amounts are always plain and exact.

| Context | Copy |
|---|---|
| Greeting | "Yo, {name} — here's the damage." |
| Positive delta | "from last month, clean vibes!" |
| Zombie | "Unused in 30 days. Save ₹899?" / "Review the undead" |
| Trial | "Prime trial ends in 48 hrs" |
| Empty vault | "No subs here. Your wallet is safe… for now." |
| Delete confirm | "Delete Netflix 4K? This can't be undone after 5 seconds." |
| Save success toast | "Added Spotify Duo. Bleed is now ₹3,998/mo." |
| Error | "Something broke on our side. Try again?" |
| Cancel link info | "We can't cancel for you, but we'll take you straight to the page." |

Sidebar labels exactly: Overview, Sub Vault, Bleed Radar, Smart Split, Settings.

## 13. Developer Handoff Checklist

- [ ] Tokens defined once in `globals.css` (CSS variables) and mapped in `tailwind.config.ts`
- [ ] All four main screens plus landing/login match the descriptions above
- [ ] Charts have tooltips, summaries and reduced-motion handling
- [ ] All states (loading, empty, error) implemented for every list/card
- [ ] Keyboard: tab order logical, ⌘K palette works, Esc closes dialogs
- [ ] Verified at 1440×900, 1024, 768, and 390 px widths
- [ ] No horizontal page scroll anywhere (only the Upcoming Debits rail scrolls)
