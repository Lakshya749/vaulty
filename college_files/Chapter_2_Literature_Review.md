# CHAPTER 2: LITERATURE REVIEW

### 2.1 Evolution of Subscription and Recurring Expense Tracking
Over the past two decades, personal financial accounting has evolved through several distinct paradigms:

* **Manual Physical Ledgers (Pre-Digital Era):** Historically, household budgeting relied on physical register books, cash envelopes, and handwritten expense sheets. While effective for localized cash transactions, this methodology lacks automation, offers zero foresight into future recurring debits, and completely fails to scale in modern digital transaction environments.
* **Spreadsheet-Based Tracking (Excel & Google Sheets):** In the early 2000s, spreadsheet software became the standard digital alternative for budget tracking. Spreadsheets provide computational flexibility through custom formulas (`SUM`, `VLOOKUP`). However, user research reveals major friction points: manual entry is time-consuming, spreadsheet mobile experiences are clunky, formulas frequently break when modifying rows, and spreadsheets lack real-time date calculation mechanisms to roll forward renewals or alert users about expiring trials.
* **Automated Banking Aggregators:** Over the last decade, fintech solutions emerged that connect directly to banking APIs via Open Banking frameworks or SMS scraping. While automated, these applications exhibit severe security and privacy drawbacks. Users are increasingly uncomfortable granting third-party access to their primary bank accounts or personal text messages. Furthermore, banking aggregators reflect debits *after* they have already cleared the account, providing retrospective accounting rather than proactive prevention of unwanted renewals.

---

### 2.2 Shift Towards User-Centric Spend Intelligence Systems
Recent academic literature and industry analyses emphasize a shift toward "Spend Intelligence" rather than mere expense logging. Research demonstrates that the psychological phenomenon known as **"subscription blindness"** occurs when micro-payments (e.g., ₹149, ₹299, ₹649) recur silently in the background. Because each debit appears relatively modest in isolation, consumers fail to realize their cumulative monthly financial impact.

A critical requirement identified in modern financial software is **normalized burn-rate visibility**. Users require a single, unpolluted number representing their active monthly commitments, irrespective of whether individual plans bill weekly, monthly, quarterly, or annually. Additionally, consumer advocacy studies highlight the "Trial Trap"—a business model wherein service providers rely on user forgetfulness to convert promotional free trials into full-priced ongoing liabilities. An effective software solution must prioritize proactive reminders over post-facto balance sheets.

<div align="center">11</div>

<br><hr><br>

### 2.3 Role of Modern Web Technologies and Client-Side Computation
The development of modern component-driven web frameworks has fundamentally reshaped how financial dashboards are built. Several key technological transitions informed the design of Vaulty:

* **Next.js 14 & React Server Components (RSC):** Modern web applications can now blend server-side rendering for instant page loading with client-side reactivity for real-time data filtering. By computing analytics and mathematical transformations using pure functional TypeScript modules, applications eliminate unnecessary network latency.
* **Component-Driven Declarative UI (Tailwind CSS):** Historically, rich financial dashboards were burdened by heavy CSS frameworks that slowed down initial render times. Tailwind CSS enables utility-first styling with minimal CSS bundles, allowing responsive, high-contrast user interfaces with sub-second First Contentful Paint (FCP).
* **Decoupled Relational Backends (Supabase & PostgreSQL):** Cloud-hosted PostgreSQL with Row Level Security (RLS) offers enterprise-grade authorization at the database layer. Every database row is linked directly to an authenticated user ID (`auth.uid()`), ensuring that user financial records are cryptographically insulated without requiring heavy intermediate application servers.

---

### 2.4 Comparative Analysis of Existing Solutions
To identify technical and feature gaps, a detailed comparative analysis was conducted between traditional tools, commercial aggregators, and the proposed **Vaulty** system:

| Feature / Metric | Manual Spreadsheets (Excel) | Banking Aggregators (CRED, Fold) | Standalone Vaults (Bobby, Truebill) | **Proposed System (Vaulty)** |
| :--- | :--- | :--- | :--- | :--- |
| **Data Privacy** | High (stored locally) | Low (accesses bank/SMS) | Moderate | **High (Zero bank access, user-controlled)** |
| **Normalized Monthly Bleed** | Manual formula required | Rarely normalized | Often behind paywall | **Fully automated (`lib/calc.ts`)** |
| **Zombie Detection (>30 Days)** | None | None | None | **Automated detection & savings calculation** |
| **Trial Trap Radar** | None | Partial (SMS-based) | Basic date reminder | **Dedicated countdown radar ($\le 48$ hr urgent)** |
| **Brand Preset Engine** | None | Limited | Fixed set | **11+ popular Indian/Global digital presets** |
| **Offline / Demo Mode** | Offline file only | Inoperable offline | Requires cloud account | **Dual-engine (Supabase + `localStorage`)** |
| **Direct Cancellation Links** | None | None | Paid auto-cancel concierge | **Direct deep-links to service cancel portals** |
| **Cost to Student** | Paid / Office License | Free (monetizes user data) | Monthly subscription | **100% Free & Open Academic Implementation** |

<div align="center">12</div>

<br><hr><br>

The comparative analysis reveals that existing solutions either require severe privacy sacrifices (surrendering SMS and bank credentials) or demand cumbersome manual upkeep (in spreadsheets) that users inevitably abandon after a few days. 

Vaulty addresses this precise intersection: it provides an elegant, zero-credential, privacy-preserving tracking engine that performs instant mathematical normalizations, flags dormant services, and provides proactive trial countdowns—all wrapped in a fast, modern web application.

<div align="center">13</div>
