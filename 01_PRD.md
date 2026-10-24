# SubTrack — Product Requirements Document (PRD)

> Version 1.0 · Minor Project BCA-508 · IMS Noida / CCS University
> Instruction for the AI agent: treat this file as the source of truth for WHAT to build. `02_DESIGN.md` covers HOW it looks, and `03_TECH_STACK.md` covers HOW it is built.

---

## 1. Product Summary

**SubTrack** is a personal subscription and renewal management web app for Gen Z users. It puts every recurring payment (Netflix, Spotify, ChatGPT, gym, cloud storage, etc.) on one dashboard, shows the monthly "burn rate", warns about free trials about to convert to paid, and flags unused ("zombie") subscriptions that can be cancelled.

**One-line pitch:** "Stop bleeding money on subscriptions you forgot about."

## 2. Problem Statement

| Problem | Impact |
|---|---|
| People hold 5–10+ active subscriptions across many apps | No single view of total recurring spend |
| Free trials auto-convert to paid plans | Unwanted auto-debits |
| Subscriptions go unused for weeks | Money wasted every month |
| Yearly plans renew silently | Surprise large debits |

## 3. Target Users

**Primary persona: Arjun, 21, college student / first-job Gen Z user (India).**
- Pays for 6+ subscriptions (streaming, music, AI tools, gym, cloud).
- Uses UPI/cards with auto-debit, forgets renewal dates.
- Wants quick, scannable insight, not a spreadsheet.
- Currency: INR (₹) by default.

**Secondary persona: Admin** (project-evaluation requirement). Views total users and system metrics. Manages categories.

## 4. Goals and Non-Goals

### Goals (MVP)
1. Let a user add, edit, pause, cancel and delete subscriptions (full CRUD).
2. Calculate monthly and yearly recurring spend accurately.
3. Warn about trials ending within 7 days and renewals within 7 days.
4. Detect zombie subscriptions (no usage marked in 30+ days).
5. Visualise spend: burn-rate area chart and category donut.
6. Work well on desktop and mobile, dark mode first.

### Non-Goals (explicitly out of MVP)
- Real bank/UPI connection or Open Banking sync.
- Actually cancelling a subscription on the user's behalf (we only open the service's cancel link).
- Real WhatsApp/SMS sending. Alerts are in-app only.
- Native mobile apps.
- Real bill splitting (the "Smart Split" page is a polished placeholder with sample UI).

## 5. Scope Decisions (already decided, do not ask)

| Topic | Decision |
|---|---|
| Authentication | Email + password via Supabase Auth. Fallback demo mode: "Continue as demo user" using localStorage with seed data |
| Currency | INR default; USD and EUR selectable; stored per user; no live FX (static rates in a constant) |
| Billing cycles | Weekly, Monthly, Quarterly, Yearly |
| Statuses | Active, Paused, Cancelled |
| Categories (seeded) | Streaming, Gym/Health, Cloud, Gaming, AI Tools, Work, Utilities, Other |
| Zombie rule | Subscription is Active and `last_used_at` is older than 30 days (or null and created more than 30 days ago) |
| Trial rule | `is_free_trial = true` and `trial_end_date` in the future |
| Alert windows | Renewal within 7 days; trial ends within 7 days (urgent styling under 48 hrs) |
| Theme | Dark mode only for MVP (matches Figma). Light theme is future scope |
| Language | English UI with Gen Z microcopy |

## 6. Functional Requirements

Priority: **P0** = must ship, **P1** = should ship, **P2** = nice to have.

### 6.1 Authentication
| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| AUTH-1 | Sign up with name, email, password | P0 | Account is created; user lands on the dashboard; invalid email or password under 8 chars shows inline error |
| AUTH-2 | Log in / log out | P0 | Wrong credentials show "Email or password is incorrect"; logout returns to the landing page |
| AUTH-3 | Demo mode | P0 | One click loads seeded data without signup |
| AUTH-4 | Protected routes | P0 | Unauthenticated users hitting `/dashboard/*` are redirected to `/login` |

### 6.2 Subscription Management (Sub Vault)
| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| SUB-1 | Add subscription | P0 | Fields: service name, category, cost, currency, billing cycle, first bill date, next billing date, free-trial toggle (+ trial end date), reminder days, optional cancel URL, notes. Saved record appears instantly in the list and updates dashboard totals |
| SUB-2 | Brand presets | P1 | Selecting a preset (Netflix, Spotify, Prime, ChatGPT Plus, Claude Pro, YouTube Premium, Disney+ Hotstar, iCloud, Google One, Xbox Game Pass, Cult.fit) autofills name, category, icon colour, cancel URL |
| SUB-3 | Edit subscription | P0 | Same form, pre-filled; changes reflect immediately |
| SUB-4 | Status toggle | P0 | Active / Paused / Cancelled. Paused and Cancelled are excluded from spend totals |
| SUB-5 | Delete with confirmation | P0 | Confirmation dialog states the service name; undo toast for 5 seconds |
| SUB-6 | Search | P0 | Case-insensitive, filters as the user types, no page reload |
| SUB-7 | Category filter pills | P0 | Multi-select; "All" resets |
| SUB-8 | Sort | P1 | By next renewal (default), cost high-low, name A-Z |
| SUB-9 | Table and grid view toggle | P1 | Preference remembered |
| SUB-10 | Mark as "used today" | P1 | Updates `last_used_at`, removes zombie flag |
| SUB-11 | Export summary | P1 | Download CSV of all subscriptions |

### 6.3 Dashboard (Overview)
| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| DASH-1 | Monthly Wallet Bleed card | P0 | Shows normalised monthly total of Active subs, change vs last month in %, sparkline of last 6 months, "LIVE" chip |
| DASH-2 | Zombie Subscriptions card | P0 | Count, potential monthly saving, "Review the undead" opens a filtered Vault view |
| DASH-3 | Trial Trap Radar card | P0 | Radar visual; nearest trial shown as a countdown pill (e.g. "Prime trial ends in 48 hrs"); empty state when none |
| DASH-4 | Burn Rate Flow chart | P0 | Area chart Jan to Dec: actual months solid, future months dashed forecast; tooltip; Dec forecast figure shown top right |
| DASH-5 | Vibe Check donut | P0 | Category share with legend and percentages; centre shows total |
| DASH-6 | Upcoming Debits rail | P0 | Horizontally scrollable cards sorted by next date: service, date, price, "Cancel Link" pill (opens confirmation, then the service's URL in a new tab) |
| DASH-7 | Greeting header | P1 | "Yo, {firstName} — here's the damage." plus month label and "Synced Xm ago" |
| DASH-8 | Quick search (⌘K / Ctrl+K) | P1 | Command palette searching subscriptions and pages |

### 6.4 Bleed Radar and Analytics
| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| RAD-1 | Category analytics | P0 | Donut plus ranked category list with amounts |
| RAD-2 | Price hike watchdog | P1 | Each subscription stores price history; if the latest cost is higher than the previous, show "+₹X since {date}" badge |
| RAD-3 | Projected savings | P1 | "If you cancel these zombies you save ₹X/mo (₹Y/yr)" |
| RAD-4 | Notification centre | P0 | Bell/list of generated alerts, mark as read |

### 6.5 Smart Split (placeholder)
| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| SPL-1 | Static page with sample "Spotify Duo split with Riya" card and a "Coming soon" badge | P2 | Does not break the app; clearly labelled as a preview |

### 6.6 Settings
| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| SET-1 | Edit name, currency, default reminder days | P0 | Persists |
| SET-2 | Delete all my data | P1 | Confirmation with typed phrase |

### 6.7 Admin (for the college use-case diagram)
| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| ADM-1 | `/admin` page (role = admin) | P1 | Total users, total subscriptions, signups in last 7 days, most common categories |
| ADM-2 | Manage categories | P1 | Add / rename / recolour categories |

## 7. Business Logic Definitions

**Normalised monthly cost**
| Billing cycle | Formula |
|---|---|
| Weekly | cost × 52 / 12 |
| Monthly | cost |
| Quarterly | cost / 3 |
| Yearly | cost / 12 |

- **Monthly Wallet Bleed** = sum of normalised monthly cost of all Active subscriptions.
- **Projected annual cost** = Monthly Wallet Bleed × 12.
- **Change vs last month** = (this month total − last month total) / last month total. Computed from `price_history` and status/creation dates. Seed data must make this produce "Down 12%".
- **Zombie saving** = sum of normalised monthly cost of zombie subscriptions.
- **Next billing date roll-forward**: if `next_billing_date` is in the past, advance it by the billing cycle until it is in the future.
- **Forecast** (months after current): current Bleed plus known upcoming price changes or trial conversions. If none, flat line with dashed style.

## 8. Alert Generation Rules

| Alert type | Trigger | Message example |
|---|---|---|
| Trial ending | Trial end within 7 days | "Prime trial ends in 48 hrs. Cancel now or you'll pay ₹299." |
| Renewal soon | next_billing_date within `reminder_days` (default 3) | "Netflix 4K renews on 14 Oct for ₹649." |
| Zombie | Became zombie | "You haven't used Gaana Plus in 30 days. Save ₹99/mo?" |
| Price hike | New cost greater than old cost | "Spotify Duo went up by ₹20." |

Alerts are created when the dashboard loads (client-side calculation for MVP) and stored in the `alerts` table or localStorage. No duplicates for the same sub + type + date.

## 9. Seed Data (so the demo looks exactly like the Figma)

| Service | Category | Cost | Cycle | Notes |
|---|---|---|---|---|
| Netflix 4K | Streaming | ₹649 | Monthly | |
| Spotify Duo | Streaming | ₹149 | Monthly | |
| Amazon Prime | Streaming | ₹299 | Monthly | Free trial, ends in 48 hrs |
| Claude Pro | AI Tools | ₹1,700 | Monthly | |
| ChatGPT Plus | AI Tools | ₹1,700 | Monthly | |
| Cult.fit Gym | Gym/Health | ₹899 | Monthly | Zombie |
| Google One | Cloud | ₹130 | Monthly | |
| iCloud 200GB | Cloud | ₹219 | Monthly | Zombie |
| Xbox Game Pass | Gaming | ₹349 | Monthly | Zombie |

Tune values so the total shows **₹3,849/mo**, zombies show **3** with a **₹899** saving, and category split is approximately **Streaming 50 / Gym 25 / Cloud 15 / Gaming 10** for the donut display. If real maths conflicts with these display numbers, the seed data should be adjusted, never the display logic. Arjun is the demo user.

## 10. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | First contentful paint under 1.2 s; search/filter under 100 ms; charts animate at 60 fps |
| Accessibility | WCAG 2.1 AA contrast; full keyboard navigation; chart text summaries; reduced-motion support |
| Responsiveness | Works from 360 px to 1920 px wide |
| Security | Passwords handled by Supabase Auth (never stored by us); Row Level Security so users see only their own rows; input validated on client and server |
| Browser support | Latest Chrome, Safari, Edge, Firefox |
| Cost | 100% free tier services |

## 11. Analytics Events (console/log only for MVP)

`signup_completed`, `login_completed`, `subscription_added`, `subscription_edited`, `subscription_status_changed`, `subscription_deleted`, `cancel_link_clicked`, `zombie_review_opened`, `quick_search_opened`, `csv_exported`.

## 12. Success Metrics (for viva)

- Add a subscription in under 30 seconds.
- Dashboard totals are correct for all four billing cycles (unit tested).
- Zero console errors on all four screens.
- Lighthouse Performance 90+ and Accessibility 90+.

## 13. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Supabase setup trouble | localStorage demo mode works without any backend |
| Date maths bugs | Pure, unit-tested helper functions in `lib/calc.ts` |
| Scope creep | Anything marked P2 or Non-Goal is skipped unless time remains |

## 14. Open Questions (answered with defaults; revisit only if needed)

1. Real email reminders? Default: no, in-app only (future scope).
2. Multiple users sharing one subscription? Default: no, Smart Split is a preview only.
3. Light theme? Default: not in MVP.
