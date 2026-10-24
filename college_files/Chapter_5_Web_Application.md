# CHAPTER 5: WEB APPLICATION

### 5.1 Introduction
The Vaulty web application is constructed as an intuitive, high-performance financial control center. By employing modern responsive web standards, it delivers desktop-grade analytical depth while remaining fully operable on mobile viewports.

---

### 5.2 Web Application Overview
The core layout follows an ultra-clean **Bento Grid architecture** that arranges critical financial insights into visually distinct, high-contrast modules. A floating navigation sidebar provides instantaneous routing between core sections: Overview, Sub Vault, Bleed Radar, Smart Split, and Settings.

```
+---------------------------------------------------+-----------------------+
|  CARD 1: Monthly Wallet Bleed                     |  CARD 2: Zombie Subs  |
|  - Hero: ₹3,849 / mo                              |  - 3 Found Lurking    |
|  - Delta: Down 12% (Clean Vibes!)                 |  - Save ₹899?         |
|  - Interactive 6-Month Sparkline Chart            |  - Review Undead ->   |
+-------------------------+-------------------------+-----------------------+
|  CARD 3: Trial Trap     |  CARD 4: Burn Rate Flow                         |
|  - Radar Graphic Sweep  |  - Jan-Dec Area Trajectory (Recharts)           |
|  - Prime ends in 48 hrs |  - Solid Actuals / Dashed Future Forecast       |
|  - Urgent Debit Warning |  - Dec Forecast: ₹4,120                         |
+-------------------------+-------------------------------------------------+
|  CARD 5: Vibe Check Donut                         |  CARD 6: Debits Rail  |
|  - Category Breakdown (Streaming 50%, Gym 25%...) |  - Horiz. Snap Cards  |
|  - Center Total: ₹3,849 / mo                      |  - Cancel Link Flow   |
+---------------------------------------------------+-----------------------+
```
<div align="center"><b>Figure 5.1: Vaulty Main Dashboard (Bento Grid Layout)</b></div>

---

### 5.3 Key Features

#### 1. The Sub Vault (Central Subscription Ledger)
The Sub Vault (`/vault`) serves as the administrative hub for managing recurring services. It supports two primary presentation modes:
* **Interactive Table View:** High-density view displaying brand logo, service title, category badge, recurring cost, billing cadence, next renewal date, status switch (`Active` / `Paused`), and quick actions menu (`Edit`, `Mark Used Today`, `Cancel Link`, `Delete`).
* **Card Grid View:** Visually rich card tiles highlighting individual brand colors and renewal countdowns.
* **Instant Filter Pills & Search:** Instantaneous client-side filtering by category (*All*, *Streaming*, *Gym/Health*, *Cloud*, *Gaming*, *AI Tools*), special filter tags (*Zombies*, *Trials*), and real-time substring search.

```
+-----------------------------------------------------------------------------------------+
| [ Search Subscriptions... ]   [ Filter: All | Streaming | AI | Zombies | Trials ]       |
+-----------------------------------------------------------------------------------------+
| Service       Category     Cost      Cycle     Next Renewal   Status      Actions       |
| --------------------------------------------------------------------------------------- |
| Netflix 4K    Streaming    ₹649.00   Monthly   14 Oct (3d)    [ Active ]  [ Edit | ... ]|
| Spotify Duo   Streaming    ₹149.00   Monthly   18 Oct (7d)    [ Active ]  [ Edit | ... ]|
| Cult.fit Gym  Gym/Health   ₹899.00   Monthly   22 Oct (11d)   [ Active ]* [ Mark Used ] |
| Claude Pro    AI Tools   ₹1,700.00   Monthly   28 Oct (17d)   [ Active ]  [ Edit | ... ]|
+-----------------------------------------------------------------------------------------+
* Flagged with Ghost Icon (Zombie Subscription)
```
<div align="center"><b>Figure 5.2: Sub Vault Interface (Search, Filter Pills & Table View)</b></div>

<div align="center">21</div>

<br><hr><br>

#### 2. Subscription Creation Modal with Quick Brand Presets
To minimize friction when recording services, Vaulty provides a pre-populated brand preset selector. Selecting a preset chip (*Netflix*, *Spotify*, *Amazon Prime*, *ChatGPT Plus*, *Claude Pro*, *Cult.fit*, *Google One*, *iCloud*, etc.) automatically initializes:
* Service name and category assignment
* Brand accent color codes
* Official cancellation portal hyperlink

```
+-----------------------------------------------------------------------------+
|                        ADD NEW SUBSCRIPTION                                 |
|                                                                             |
|  Presets: [ Netflix ] [ Spotify ] [ Prime ] [ ChatGPT ] [ Claude ] [ Cult ] |
|                                                                             |
|  Service Name: [ Netflix 4K             ]   Category: [ Streaming         ] |
|  Recurring Cost: [ ₹ 649.00             ]   Cycle:    (W) [M] (Q) (Y)       |
|  First Bill Date: [ 2026-08-14          ]   Next Renewal: [ 2026-10-14    ] |
|  [X] Free Trial Plan?   Trial End: [ N/A  ]  Reminder Window: [ 3 Days     ]|
|  Cancel URL: [ https://netflix.com/youraccount/cancel                     ] |
|                                                                             |
|  -------------------------------------------------------------------------  |
|  Live Preview: "That's ₹7,788/yr and ₹649/mo normalized."                   |
|  [ Cancel ]                                          [ Save Subscription ]  |
+-----------------------------------------------------------------------------+
```
<div align="center"><b>Figure 5.3: Subscription Creation Modal with Quick Brand Presets</b></div>

---

### 5.4 Technologies Used
The web application is engineered with modern frontend libraries:
* **Next.js 14 App Router:** Implements file-based route groups `(app)` and `(auth)`, providing optimal code splitting and shared layouts.
* **React 18 Context API:** Facilitates instant state propagation between modals, filters, and dashboard cards without prop drilling.
* **Tailwind CSS 3.4:** Enables a polished, dark glassmorphism aesthetic (`backdrop-filter: blur(20px)`, subtle white borders, and glowing neon accents).
* **Sonner Toast System:** Provides non-intrusive status notifications, including a 5-second undo toast when deleting subscriptions.
* **CMDK Command Palette:** Enables keyboard-first power navigation via `⌘K` / `Ctrl+K`.

<div align="center">22</div>

<br><hr><br>

### 5.5 Subscription Tracking & Alert Process
The Bleed Radar (`/radar`) implements an intelligent monitoring workflow that scans user subscriptions against three automated rule sets:

1. **Trial Conversion Watch:** Compares `trial_end_date` against system date. Subscriptions ending within 7 days enter warning status; those under 48 hours receive high-urgency pink highlighting.
2. **Zombie Flagging:** Tracks `last_used_at`. Subscriptions exceeding 30 days of inactivity are flagged with a ghost icon, and their monthly sum is highlighted as immediate recoverable savings.
3. **Price Hike Watchdog:** Compares current cost against entries in `price_history`. Any recorded price increase generates an informational alert (e.g., *"+₹20 since last cycle"*).

```
+-----------------------------------+-----------------------------------------+
|     CATEGORY ANALYTICS DONUT      |          PRICE HIKE WATCHDOG            |
|                                   |  - Spotify Duo: +₹20 since Aug 2026     |
|   Streaming: ₹1,097 (50%)         |  -------------------------------------  |
|   Gym/Health: ₹899  (25%)         |           PROJECTED SAVINGS             |
|   Cloud:      ₹349  (15%)         |  - Cancel 3 Zombies: Save ₹899/mo       |
|   Gaming:     ₹349  (10%)         |    (Annualized Savings: ₹10,788/yr)     |
+-----------------------------------+-----------------------------------------+
|                           IN-APP NOTIFICATION CENTER                        |
|  [!] URGENT: Amazon Prime trial ends in 48 hours. Cancel to save ₹299.      |
|  [*] UPCOMING: Netflix 4K renews in 3 days on 14 October (₹649.00).         |
|  [?] DORMANT: You haven't used Cult.fit in 38 days. Review plan?            |
+-----------------------------------------------------------------------------+
```
<div align="center"><b>Figure 5.4: Bleed Radar & Expense Intelligence Interface</b></div>

---

### 5.6 Real-World Application
Vaulty provides an immediately practical utility in modern digital lifestyle management. By placing all recurring commitments on a single, easy-to-read screen, it stops accidental auto-debits, protects users from predatory trial conversion tactics, and encourages mindful digital spending.

<div align="center">23</div>
