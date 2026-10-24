# Vaulty (SubTrack) ⚡

> **Personal Subscription & Spend Intelligence Web Application**  
> *BCA-508 Minor Project — Academic Session 2024–2027 (5th Semester)*  
> **Student:** Lakshya Singh | **Roll No:** 240919106122 | **Guide:** Prof. Nihal Kumar  
> **Institution:** Institute of Management Studies (IMS), Noida  
> **Affiliated University:** Chaudhary Charan Singh University (CCSU), Meerut  

---

## 🔗 Official Project Links & Deliverables

- **Live Cloud Web Application:** [http://localhost:3000](http://localhost:3000)
- **GitHub Source Code Repository:** [https://github.com/Lakshya749/vaulty](https://github.com/Lakshya749/vaulty)
- **33-Page Official Report (PDF with Clickable Links):** [`VAULTY_Minor_Project_Report.pdf`](VAULTY_Minor_Project_Report.pdf)
- **Official Word Document (.docx):** [`college_files/VAULTY_MINOR_PROJECT_REPORT_COMPLETE.docx`](college_files/VAULTY_MINOR_PROJECT_REPORT_COMPLETE.docx)
- **Student Email:** [lakshyasingh.bcr24224@imsnoida.com](mailto:lakshyasingh.bcr24224@imsnoida.com)

---

## 🎯 Executive Overview

**Vaulty** is a modern, dark glassmorphic web application tailored for students, young professionals, and developers to track recurring digital liabilities, detect "zombie" subscriptions, defend against predatory free trial conversions, and intelligently split shared services.

Built strictly according to project specifications (`01_PRD.md`, `02_DESIGN.md`, `03_TECH_STACK.md`), Vaulty combines an offline-first client architecture with optional Supabase PostgreSQL persistence and a pure mathematical calculation engine with 100% test coverage.

---

## 🚀 Key Highlights & Calibrated Seed Baseline

- **Primary Persona:** Arjun (22-year-old developer & college student)
- **Live Monthly Bleed:** Exactly **₹3,849/month**
  - Netflix 4K (₹649/mo)
  - Spotify Duo (₹149/mo)
  - Claude Pro ($20 USD normalized to ₹1,700/mo)
  - Cult.fit Gym (₹899/mo)
  - Google One 100GB (₹130/mo)
  - Xbox Game Pass PC (₹322/mo equivalent from ₹967/quarter)
- **Zombie Subscriptions Detected:** **3 services** (Cult.fit Gym, Xbox Game Pass, iCloud 200GB — unused for >30 days). Terminating these saves **₹899/month** (₹10,788/year).
- **Free Trial Radar Defense:** **Amazon Prime** (₹299/mo) auto-renews in **48 hours**. 1-click cancellation deep-link provided before credit card is charged.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server-side rendering, React Server Components, high performance |
| **Language** | TypeScript 5 (Strict Mode) | Full type safety across models, calculation engine, and repositories |
| **Styling** | Tailwind CSS 3.4 & Custom Tokens | Bespoke `#090A0F` dark glassmorphic theme with neon accents |
| **Data Engine** | Dual Persistence Layer | Supabase PostgreSQL with RLS + Offline-First LocalStorage fallback |
| **Math Engine** | `date-fns` & Pure Functions | 7 core mathematical theorems tested via Vitest |
| **Visualization** | Recharts | Interactive AreaChart, Donut Chart, and dynamic sparklines |
| **Search & Command** | `cmdk` | Global `⌘K` / `Ctrl+K` interactive search and navigation palette |
| **Form & Validation**| React Hook Form + Zod | Schema-validated modal forms with dynamic live preview |

---

## 📂 Project Architecture

```
vaulty/
├── app/
│   ├── (app)/
│   │   ├── dashboard/page.tsx      # Bento Grid Dashboard (6 Cards)
│   │   ├── vault/page.tsx          # Sub Vault (Table/Grid, Filters, CSV Export)
│   │   ├── radar/page.tsx          # Bleed Radar, Watchdog & Savings Simulator
│   │   ├── split/page.tsx          # Smart Split, UPI & WhatsApp reminders
│   │   ├── settings/page.tsx       # User Preferences, Budgets & Danger Zone
│   │   ├── admin/page.tsx          # Viva & Theorem Verification Console
│   │   └── layout.tsx              # Application layout with Navigation Shell
│   ├── (auth)/
│   │   ├── login/page.tsx          # 1-Click Demo Login + Supabase Auth
│   │   ├── signup/page.tsx         # User Registration
│   │   └── layout.tsx              # Auth Layout
│   ├── fonts/                      # Offline Inter Variable WOFF2 font
│   ├── globals.css                 # Glassmorphic utilities & design tokens
│   ├── layout.tsx                  # Root layout with SubscriptionProvider
│   └── page.tsx                    # Modern Marketing Landing Page
├── components/
│   ├── dashboard/                  # BleedCard, ZombieCard, TrialRadarCard, etc.
│   ├── providers/                  # SubscriptionProvider with optimistic UI
│   ├── radar/                      # Watchdog, Simulator, TrialActionCenter, AlertList
│   ├── shell/                      # SidebarPill, MobileTabBar, HeaderBar, CommandPalette
│   ├── subscription/               # SubscriptionModal with brand presets
│   ├── ui/                         # BentoCard, GradientButton, Pill, ConfirmDialog
│   └── vault/                      # SubscriptionTable, SubscriptionGrid
├── lib/
│   ├── alerts.ts                   # In-app notification center engine
│   ├── calc.ts                     # Pure mathematical calculation engine
│   ├── format.ts                   # INR currency & date formatters
│   ├── presets.ts                  # 11 Indian brand presets
│   ├── repositories/               # LocalStorage & Supabase repository implementations
│   ├── schemas.ts                  # Zod validation schemas
│   └── seed.ts                     # Calibrated persona seed data
├── supabase/
│   └── schema.sql                  # PostgreSQL schema with Row-Level Security
├── tests/
│   └── calc.test.ts                # 7 automated Vitest unit tests
├── college_files/                  # 33-Page Official Project Report PDF, HTML & Docs
└── college_word_files/             # Individual Microsoft Word (.docx) Chapter Files
```

---

## ⚡ Quick Start on macOS

### 1. Launch with One Click
Double-click `start.command` in the project root directory.  
It will automatically start the server and open [http://localhost:3000](http://localhost:3000) in your browser.

Or via terminal:
```bash
./run.sh
```

### 2. Run Test Suite
Double-click `test.command` or run:
```bash
npm test
```
Executes all 7 automated unit tests covering billing normalization, monthly bleed calculation, zombie thresholds, renewal date roll-forward, and seed metrics.

### 3. Rebuild College Report
Double-click `build_report.command` or run:
```bash
python3 college_files/generate_html_report.py
```
Recompiles the interactive HTML, Word (.docx), and 33-page master PDF with 152 clickable links.

---

## 🎓 Academic Viva & Examination Guide

- **Viva Page Route:** Navigate to `/admin` in the running app to inspect live theorem proofs, database RLS status, and platform telemetry.
- **Master Report PDF:** Available at `VAULTY_Minor_Project_Report.pdf` (33 pages compiled with system architecture, ER diagrams, test matrices, and clickable references).
