# CHAPTER 3: DESIGN OF PROJECT MODEL

### 3.1 System Design
The design of Vaulty is grounded in modular, decoupled software engineering principles. The primary design objective is to provide instant computational responsiveness while preserving strict data integrity and privacy.

The system is structured around three core operational layers:
1. **The User Interaction & Presentation Layer:** Responsible for rendering interactive visual dashboards, providing intuitive data entry forms, handling client-side filtering, and presenting responsive charts.
2. **The Computational & Logic Engine:** Implemented as a set of pure TypeScript functions (`lib/calc.ts` and `lib/alerts.ts`). This layer handles all domain logic independently of the UI framework or database provider, guaranteeing reproducibility and facilitating automated testing.
3. **The Data Abstraction Layer:** Governed by the **Repository Pattern**. An abstract interface (`SubscriptionRepository`) decouples application code from the concrete data source. This allows the system to seamlessly switch between cloud-synced PostgreSQL (via Supabase) and browser-local persistence (`localStorage`) without changing a single line of component code.

---

### 3.2 Architecture of the Proposed System
Vaulty adopts a modern **3-Tier Architecture** tailored for Next.js 14 App Router applications:

```
+-----------------------------------------------------------------------+
|                       PRESENTATION TIER (UI)                          |
|  - Bento Grid Overview          - Sub Vault Table & Grid View         |
|  - Bleed Radar & Spend Donut    - Add/Edit Subscription Modal         |
|  - Command Palette (⌘K)         - Responsive Navigation Shell         |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    APPLICATION & LOGIC TIER                           |
|  - Pure Calculation Engine (lib/calc.ts)                              |
|  - Alert Generation Logic (lib/alerts.ts)                             |
|  - Schema Validation (Zod & React Hook Form)                          |
|  - Server Actions (app/actions/subscriptions.ts)                      |
|  - Repository Factory & useSubscriptions Hook                         |
+-----------------------------------------------------------------------+
                                   |
                  +----------------+----------------+
                  |                                 |
                  v                                 v
+-----------------------------------+  +--------------------------------+
|       SUPABASE CLOUD STORAGE      |  |     LOCAL REPOSITORY           |
|  - PostgreSQL Database            |  |  - Browser localStorage        |
|  - Supabase Auth (JWT Sessions)   |  |  - Instant Seed Bootstrapping  |
|  - Row Level Security (RLS)       |  |  - 100% Offline Resilience     |
+-----------------------------------+  +--------------------------------+
```
<div align="center"><b>Figure 3.1: High-Level System Architecture of Vaulty</b></div>

<br>

```
[ User Request / Event ]
           |
           v
[ Next.js 14 Page / Client Component ]
           |
           v
[ Form Validation Layer: Zod Schema ]
           |
           v
[ Domain Calculation Engine: lib/calc.ts ]
           |
           v
[ SubscriptionRepository Interface ]
        /              \
       v                v
[ Supabase Client ]   [ LocalStorage Repository ]
       |                        |
[ PostgreSQL DB ]     [ Browser Storage ]
```
<div align="center"><b>Figure 3.2: 3-Tier Layered Architecture Flowchart</b></div>

<div align="center">14</div>

<br><hr><br>

### 3.3 Working of the System

The operational lifecycle of Vaulty follows a structured, deterministic flow:

1. **Authentication / Session Initialization:**
   * When a user arrives, the application verifies active authentication tokens.
   * If authenticated via Supabase, cloud records are fetched. If the user selects **"Continue as demo user"**, the system initializes `LocalRepository`, seeding Arjun's profile data into `localStorage` with zero latency.
2. **Subscription Ingestion & Quick Presets:**
   * The user clicks `+ Add New Subs`. 
   * Selecting a brand preset chip (e.g., *Netflix*, *Spotify*, *Claude Pro*) pre-fills the service name, category, brand accent color, and direct cancellation portal URL.
   * The user inputs cost, selects billing frequency (`Weekly`, `Monthly`, `Quarterly`, `Yearly`), specifies trial status, and saves.
3. **Mathematical Normalization (`lib/calc.ts`):**
   * All active subscription costs are converted to a standard 30-day equivalent:
     $$\text{Weekly: } \frac{\text{Cost} \times 52}{12}, \quad \text{Quarterly: } \frac{\text{Cost}}{3}, \quad \text{Yearly: } \frac{\text{Cost}}{12}$$
   * Paused and Cancelled subscriptions are filtered out of spend totals.
4. **Automated Intelligence Scans:**
   * **Zombie Check:** Flags any active service where $(\text{Today} - \text{last\_used\_at}) \ge 30\text{ days}$.
   * **Trial Radar Scan:** Calculates days remaining until trial expiry; flags trials under 7 days (urgent warning at $\le 48$ hours).
   * **Roll-Forward Engine:** If a recorded `next_billing_date` has elapsed, the system deterministically rolls the date forward according to the subscription cycle until it lies in the future.
5. **Dashboard Rendering:**
   * Bento grid cards, area trajectory charts, and donut segment shares update dynamically via React Context.

```
+--------------------+        Credentials / Demo Mode        +--------------------+
|                    | -----------------------------------> |                    |
|       User         |                                      |   Authentication   |
|                    | <----------------------------------- |      Service       |
+--------------------+            Session Token             +--------------------+
          |
          | Add / Update / Delete Subscription
          v
+---------------------------------------------------------------------------------+
|                                Vaulty Core Engine                               |
|                                                                                 |
|  [ Input Validation ] ---> [ Normalization Engine ] ---> [ Intelligence Scan ]  |
|     (Zod Schema)                (lib/calc.ts)                (Zombie & Trials)  |
+---------------------------------------------------------------------------------+
          |                                                         |
          v                                                         v
+--------------------+                                    +--------------------+
|  Repository Layer  |                                    |  Dashboard Cards   |
| (PostgreSQL/Local) |                                    | (Burn Rate, Donut) |
+--------------------+                                    +--------------------+
```
<div align="center"><b>Figure 3.3: Context-Level Data Flow Diagram (DFD Level 0 & Level 1)</b></div>

<div align="center">15</div>

<br><hr><br>

### 3.4 Tools and Technologies Used

The proposed model leverages an integrated set of modern web technologies chosen for type safety, computational performance, and zero-cost hosting:

| Technology | Role / Responsibility | Selection Rationale |
| :--- | :--- | :--- |
| **Next.js 14** | Full-Stack Web Framework | App Router provides React Server Components and fast client transitions |
| **TypeScript** | Programming Language | Strict type safety prevents null-pointer and financial calculation errors |
| **Tailwind CSS 3.4** | Utility-First Styling | Precise implementation of dark-mode tokens, borders, and responsive layouts |
| **Supabase** | Cloud Database & Auth | Managed PostgreSQL with Row Level Security (RLS) for data isolation |
| **Recharts** | Interactive Visualization | Declarative SVG charting for burn-rate area curves and category donuts |
| **Zod** | Schema Validation | Unified, type-safe validation shared between client forms and server actions |
| **React Hook Form** | Form State Management | Performant, uncontrolled form rendering minimizing unnecessary re-renders |
| **date-fns** | Date Computation | Pure, immutable date calculation functions handling leap years and cycle offsets |
| **Lucide React** | Iconography | Lightweight, consistent SVG icon set matching modern fintech interfaces |
| **Vitest** | Unit Testing Suite | High-speed unit test runner verifying calculation accuracy |

<div align="center">16</div>

<br><hr><br>

### 3.5 Expected Output
The system is designed to produce clear, reliable, and actionable outputs:

1. **Deterministic Financial Totals:**
   * Precise calculation of monthly wallet bleed across multiple recurring plans (e.g., verifying seed total at **₹3,849/mo**).
   * Accurate annualized expenditure forecasts ($\text{Bleed} \times 12 = \text{₹46,188/yr}$).
2. **Actionable Dormant Expense Alerts:**
   * Real-time count of detected zombie subscriptions (e.g., 3 dormant services with a calculated reclaimable saving of **₹899/mo**).
   * Interactive "Review the Undead" quick-filter to examine or cancel dormant accounts.
3. **Proactive Trial Countdown Radar:**
   * Dynamic countdown pill identifying the nearest expiring trial (e.g., *Amazon Prime trial ends in 48 hrs*), accompanied by an impending debit warning.
4. **Structured CSV Export:**
   * Instant generation of downloadable comma-separated values (CSV) containing comprehensive subscription records for external accounting.
5. **High-Performance Visual Interface:**
   * Sub-1.2-second First Contentful Paint (FCP) and instantaneous search and filter responses (<100ms) on desktop and mobile viewports.

<div align="center">17</div>

<br><hr><br>

In summary, the system model balances structural simplicity with rigorous architectural design. By isolating mathematical calculation logic into pure modules and utilizing the repository pattern for data access, Vaulty guarantees high reliability, complete user privacy, and an exceptional user experience.

<div align="center">18</div>
