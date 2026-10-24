# SubTrack — Tech Stack, Architecture and Build Plan

> Instruction for the AI agent: this file defines HOW to build SubTrack. Read `01_PRD.md` (what) and `02_DESIGN.md` (look and feel) first. Build in the phases from section 10, verifying each phase runs before moving on. Do not ask the user questions; use the defaults documented here.

---

## 1. Stack (100% free)

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 14 (App Router)**, React 18, TypeScript | Server Components + Server Actions |
| Styling | **Tailwind CSS 3.4** | Tokens as CSS variables (see design doc) |
| Icons | **lucide-react** | |
| Charts | **Recharts** | Area chart, donut, sparkline |
| Fonts | `next/font/google` (Inter) | |
| Animation | CSS transitions; optional `framer-motion` | Respect reduced motion |
| Forms/validation | **react-hook-form + zod** | Same zod schemas on client and server |
| Date handling | **date-fns** | |
| Toasts | **sonner** | |
| Command palette | **cmdk** | ⌘K dialog |
| Database + Auth | **Supabase** (PostgreSQL, free tier) via `@supabase/ssr` and `@supabase/supabase-js` | |
| Fallback storage | **localStorage** (demo mode) behind a repository interface | App works with no backend |
| Testing | **Vitest** for `lib/calc.ts` | |
| Hosting | **Vercel Hobby** | GitHub-connected CI/CD |
| Dev environment | macOS Apple Silicon, Node.js 20 LTS, pnpm or npm, VS Code / Antigravity / Cursor | |

## 2. Architecture (3-tier, for the synopsis)

| Tier | Responsibility | Implementation |
|---|---|---|
| Presentation | UI, charts, forms, client-side filtering | React components in `components/`, pages in `app/` |
| Application / Logic | Validation, billing maths, alert generation, auth checks | Server Actions in `app/actions/`, pure functions in `lib/calc.ts`, zod schemas in `lib/schemas.ts` |
| Data | Persistent storage with row-level security | Supabase PostgreSQL (or localStorage repository in demo mode) |

**Repository pattern:** define a `SubscriptionRepository` interface (`list`, `create`, `update`, `remove`, `markUsed`). Implement `SupabaseRepository` and `LocalRepository`. A factory picks one based on whether the session is a demo session or whether Supabase env vars are present. UI code never imports Supabase directly.

## 3. Project Structure

```
subtrack/
├── app/
│   ├── layout.tsx                 # fonts, ambient glow background, Toaster
│   ├── globals.css                # tokens + base styles
│   ├── page.tsx                   # landing page
│   ├── (auth)/login/page.tsx
│   ├── (auth)/signup/page.tsx
│   ├── (app)/layout.tsx           # AppShell: sidebar + header
│   ├── (app)/dashboard/page.tsx   # Overview bento grid
│   ├── (app)/vault/page.tsx       # Sub Vault
│   ├── (app)/radar/page.tsx       # Bleed Radar
│   ├── (app)/split/page.tsx       # Smart Split preview
│   ├── (app)/settings/page.tsx
│   ├── (app)/admin/page.tsx
│   └── actions/                   # server actions: auth, subscriptions
├── components/
│   ├── shell/                     # SidebarPill, HeaderBar, CommandPalette, AvatarBadge
│   ├── dashboard/                 # BleedCard, ZombieCard, TrialRadarCard, BurnRateCard, VibeCheckCard, DebitRail
│   ├── vault/                     # SubscriptionTable, Grid, Row, FilterPills
│   ├── subscription/              # SubscriptionModal, BrandPresetChips
│   └── ui/                        # BentoCard, GradientButton, Pill, ConfirmDialog, EmptyState, Skeleton, SegmentedControl
├── lib/
│   ├── calc.ts                    # normalisation, totals, zombie, trial, roll-forward, forecast
│   ├── alerts.ts                  # alert generation rules
│   ├── schemas.ts                 # zod
│   ├── presets.ts                 # brand presets
│   ├── seed.ts                    # demo data
│   ├── format.ts                  # Intl INR formatting, date helpers
│   ├── repositories/              # interface, supabase, local, factory
│   └── supabase/                  # browser + server clients
├── middleware.ts                  # route protection
├── supabase/schema.sql            # tables + RLS (section 5)
├── docs/                          # these three documents
├── tailwind.config.ts
├── .env.example
└── package.json
```

## 4. Data Model (ER diagram entities)

| Table | Columns |
|---|---|
| `profiles` | `id uuid PK (= auth.users.id)`, `name text`, `email text`, `currency_pref text default 'INR'`, `default_reminder_days int default 3`, `role text default 'user'`, `created_at timestamptz` |
| `categories` | `id uuid PK`, `name text unique`, `color_code text`, `is_default bool` |
| `subscriptions` | `id uuid PK`, `user_id uuid FK → profiles`, `category_id uuid FK → categories`, `service_name text`, `cost numeric(10,2)`, `currency text`, `billing_cycle text` (weekly/monthly/quarterly/yearly), `first_bill_date date`, `next_billing_date date`, `status text` (active/paused/cancelled), `is_free_trial bool`, `trial_end_date date null`, `reminder_days int`, `cancel_url text null`, `notes text null`, `last_used_at timestamptz null`, `created_at timestamptz` |
| `price_history` | `id uuid PK`, `sub_id uuid FK → subscriptions`, `cost numeric`, `effective_date date` |
| `alerts` | `id uuid PK`, `sub_id uuid FK → subscriptions`, `user_id uuid FK`, `type text` (trial/renewal/zombie/price_hike), `message text`, `alert_date date`, `is_read bool default false` |

Relationships: User 1—N Subscriptions; Category 1—N Subscriptions; Subscription 1—N Alerts; Subscription 1—N PriceHistory.

## 5. `supabase/schema.sql` (generate exactly this, then enable RLS)

```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text, email text,
  currency_pref text default 'INR',
  default_reminder_days int default 3,
  role text default 'user',
  created_at timestamptz default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  color_code text not null,
  is_default boolean default true
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  category_id uuid references categories(id),
  service_name text not null,
  cost numeric(10,2) not null check (cost >= 0),
  currency text default 'INR',
  billing_cycle text not null check (billing_cycle in ('weekly','monthly','quarterly','yearly')),
  first_bill_date date,
  next_billing_date date not null,
  status text not null default 'active' check (status in ('active','paused','cancelled')),
  is_free_trial boolean default false,
  trial_end_date date,
  reminder_days int default 3,
  cancel_url text,
  notes text,
  last_used_at timestamptz,
  created_at timestamptz default now()
);

create table price_history (
  id uuid primary key default gen_random_uuid(),
  sub_id uuid not null references subscriptions(id) on delete cascade,
  cost numeric(10,2) not null,
  effective_date date not null default current_date
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  sub_id uuid not null references subscriptions(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('trial','renewal','zombie','price_hike')),
  message text not null,
  alert_date date not null default current_date,
  is_read boolean default false,
  unique (sub_id, type, alert_date)
);

-- Row Level Security
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table price_history enable row level security;
alter table alerts enable row level security;
alter table categories enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own subs" on subscriptions for all using (auth.uid() = user_id);
create policy "own alerts" on alerts for all using (auth.uid() = user_id);
create policy "own price history" on price_history for all
  using (exists (select 1 from subscriptions s where s.id = sub_id and s.user_id = auth.uid()));
create policy "read categories" on categories for select using (true);

insert into categories (name, color_code) values
 ('Streaming','#8B5CF6'),('Gym/Health','#EC4899'),('Cloud','#34D399'),
 ('Gaming','#475569'),('AI Tools','#22D3EE'),('Work','#F59E0B'),
 ('Utilities','#94A3B8'),('Other','#64748B');

-- Auto-create profile on signup
create function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end; $$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure handle_new_user();
```

## 6. Core Logic (`lib/calc.ts`): implement as pure, unit-tested functions

```ts
export type Cycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export const toMonthly = (cost: number, cycle: Cycle): number => {
  switch (cycle) {
    case 'weekly': return (cost * 52) / 12;
    case 'monthly': return cost;
    case 'quarterly': return cost / 3;
    case 'yearly': return cost / 12;
  }
};

export const monthlyBleed = (subs: Sub[]) =>
  subs.filter(s => s.status === 'active')
      .reduce((sum, s) => sum + toMonthly(s.cost, s.billing_cycle), 0);

export const isZombie = (s: Sub, now = new Date()) => {
  if (s.status !== 'active') return false;
  const ref = s.last_used_at ?? s.created_at;
  return differenceInDays(now, new Date(ref)) >= 30;
};

export const rollForward = (next: Date, cycle: Cycle, now = new Date()): Date => {
  let d = next;
  while (d < now) {
    d = cycle === 'weekly' ? addWeeks(d, 1)
      : cycle === 'monthly' ? addMonths(d, 1)
      : cycle === 'quarterly' ? addMonths(d, 3)
      : addYears(d, 1);
  }
  return d;
};
```
Also implement: `daysUntil`, `trialsEndingSoon(subs, 7)`, `upcomingDebits(subs, n)`, `categoryBreakdown(subs)` (returns name, amount, percent), `monthlySeries(subs, year)` (12 points; past months from history/creation, future months forecast), `percentChange(current, previous)`, `zombieSavings(subs)`.

**Unit tests (Vitest) must cover:** each cycle conversion, paused/cancelled excluded from the bleed, zombie boundary at exactly 30 days, roll-forward across month end (31 Jan + 1 month), percent change when previous is 0.

## 7. Server Actions (`app/actions/subscriptions.ts`)

`createSubscription`, `updateSubscription`, `deleteSubscription`, `setStatus`, `markUsed`, `exportCsv`. Each: (1) get the session user, (2) validate with zod, (3) call the repository, (4) `revalidatePath('/dashboard')` and `/vault`. Return `{ ok: true, data }` or `{ ok: false, error }`. Never throw raw DB errors to the UI.

In demo mode (localStorage), the same functions run client-side through the `LocalRepository`; the UI calls a thin hook `useSubscriptions()` that abstracts which path is used and keeps state in React context for instant updates.

## 8. Environment Variables (`.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
If these are empty, the app automatically runs in **demo mode** with localStorage and seed data (see PRD section 9). Never commit real keys.

## 9. Install and Run Commands

```bash
npx create-next-app@14 subtrack --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*"
cd subtrack
npm i lucide-react recharts date-fns zod react-hook-form @hookform/resolvers sonner cmdk @supabase/supabase-js @supabase/ssr
npm i -D vitest
npm run dev     # http://localhost:3000
npm run build   # must pass before every phase is considered done
```

Deploy: push to GitHub, import the repo in Vercel, add the two env vars, deploy. Vercel gives the live URL for the viva.

## 10. Build Phases (execute in order; each phase must build and run)

| Phase | Deliverable | Done when |
|---|---|---|
| 1 | Scaffold, tokens in `globals.css`, Tailwind config, fonts, ambient background, `BentoCard`, `GradientButton`, `Pill` | Blank themed page matches colours |
| 2 | `lib/calc.ts`, `format.ts`, `seed.ts`, `schemas.ts`, tests | `npm test` passes |
| 3 | Repository layer + demo mode + `useSubscriptions` | Seed data loads and persists on refresh |
| 4 | App shell: SidebarPill, HeaderBar, routing, mobile tab bar | Navigation works on all breakpoints |
| 5 | **Dashboard** with all 6 cards using real calculated data | Looks like the Figma screenshot (₹3,849, 3 zombies, 48 hrs) |
| 6 | **Sub Vault**: table, grid, search, filters, sort, status switch, delete confirm | Instant filtering, no reload |
| 7 | **Add/Edit modal** with presets, validation, live preview | Adding a sub updates the dashboard instantly |
| 8 | **Bleed Radar** page, alerts generation + notification list | Price hike and savings cards work |
| 9 | Command palette (⌘K), toasts, empty/loading/error states, CSV export | Every list has all states |
| 10 | Supabase schema, auth pages, middleware, SupabaseRepository, admin page | Signup, login and per-user data work |
| 11 | Smart Split preview, Settings, landing page | All routes exist |
| 12 | Accessibility + responsive pass, Lighthouse, deploy to Vercel | Checklist in design doc passes |

## 11. Master Prompt to Paste into Antigravity

Put the three files in `docs/` in an empty project folder, open it in Antigravity, then paste this:

```text
You are a senior full-stack engineer. Read docs/01_PRD.md, docs/02_DESIGN.md and docs/03_TECH_STACK.md fully before writing any code. They are the complete specification.

Build the SubTrack app in this folder using Next.js 14 App Router, TypeScript, Tailwind, Recharts, lucide-react and Supabase, with a localStorage demo mode as a fallback exactly as described.

Work through the 12 build phases in section 10 of docs/03_TECH_STACK.md in order. After each phase: run `npm run build` (and `npm test` where relevant), fix all errors, then briefly summarise what was completed and continue automatically to the next phase without asking me questions. Use the defaults documented in the files for any ambiguity.

Match the visual design in docs/02_DESIGN.md precisely (dark #090A0F, glassmorphic bento cards, violet/pink neon glows, emerald positives). Seed demo data so the dashboard shows ₹3,849/mo, 3 zombie subscriptions saving ₹899, and a Prime trial ending in 48 hrs.

When finished, give me: how to run it, how to connect Supabase (run supabase/schema.sql), and how to deploy to Vercel.
```

If the agent stops midway, say: **"Continue from the next unfinished phase in docs/03_TECH_STACK.md."**

## 12. Definition of Done

- [ ] `npm run build` and `npm test` pass
- [ ] All routes load without console errors: `/`, `/login`, `/signup`, `/dashboard`, `/vault`, `/radar`, `/split`, `/settings`, `/admin`
- [ ] CRUD works in both demo mode and Supabase mode
- [ ] Dashboard numbers come from `lib/calc.ts`, not hard-coded
- [ ] Responsive at 1440, 1024, 768, 390 px
- [ ] Deployed to Vercel with a public URL
- [ ] Screenshots of the 4 main screens captured for Section 11 of the synopsis (Figures 11.1 to 11.4)
