# CHAPTER 1: INTRODUCTION

### 1.1 Introduction
In recent years, the digital economy has witnessed an unprecedented transformation from one-time asset ownership to recurring, service-based subscription models. Consumers, particularly college students, young professionals, and digital-first individuals, regularly subscribe to multiple online services across digital entertainment (e.g., Netflix, Spotify, Prime Video), cloud productivity (e.g., Google One, iCloud), artificial intelligence tools (e.g., ChatGPT Plus, Claude Pro), and health and lifestyle platforms (e.g., Cult.fit).

While subscriptions offer continuous access to software and media without large upfront capital, they create a significant personal finance challenge known as **"subscription bleed."** Because recurring debits occur automatically via Unified Payments Interface (UPI) autopay mandates, credit cards, or net banking, individuals frequently lose visibility over the total amount deducted on a monthly or annual basis. Furthermore, users frequently enroll in promotional zero-cost trial periods that automatically convert to costly recurring plans without explicit pre-debit confirmations.

**Vaulty** is developed as a focused, lightweight, and intelligent personal subscription tracking and renewal management web application. Designed specifically to solve this problem, Vaulty aggregates all recurring liabilities onto a unified dashboard, normalizes varying billing cycles into a clear monthly "burn rate," detects neglected or unused subscriptions ("zombie subscriptions"), and provides an interactive radar to alert users before promotional trials convert into unwanted debits.

---

### 1.2 Advantage
The Vaulty platform provides several distinct practical and technical advantages over traditional personal finance management methods such as generic spreadsheets or manual diary entries:

1. **Normalized Spend Metrics:** Different services bill along varied periodic intervals—weekly, monthly, quarterly, and annually. Vaulty automatically normalizes all payment intervals into a standard Monthly Wallet Bleed figure using verified mathematical formulas.
2. **Automated Zombie Detection:** The system continuously monitors user activity intervals. Active subscriptions that have not recorded usage for over 30 days are automatically flagged as "zombies," highlighting immediate potential monthly savings.
3. **Trial Trap Radar:** Promotional free trials are tracked with strict countdown timers. Critical alerts trigger within 48 hours of trial expiry, allowing users to make an informed cancellation decision before auto-debit occurs.
4. **Zero Bank Credential Exposure:** Unlike aggressive financial aggregators that demand bank credentials or SMS read permissions, Vaulty is built on a privacy-first model where the user retains complete control over their recorded financial profiles.
5. **Dual Persistence Mode:** Vaulty features a robust repository architecture that supports both cloud-synced persistent storage (Supabase PostgreSQL with Row Level Security) and an offline-first browser demonstration mode using `localStorage`.

<div align="center">9</div>

<br><hr><br>

### 1.3 Objectives of the Project
The primary academic and engineering objectives accomplished during the development of Vaulty include:

* Designing and implementing a responsive, single-page application dashboard using modern web standards (Next.js 14 App Router, TypeScript, and Tailwind CSS).
* Engineering a pure mathematical calculation engine (`lib/calc.ts`) that precisely calculates normalized monthly costs, multi-month expenditure trajectories, and annual projections.
* Implementing automated, non-invasive alert generation logic to notify users of impending renewal dates and expiring free trials.
* Developing a clean relational data model in PostgreSQL featuring Row Level Security (RLS) policies to enforce strict data isolation between registered user accounts.
* Building a seamless brand-preset database that accelerates subscription entry to under thirty seconds per service.

---

### 1.4 Scope of the Project
The scope of this project encompasses:
* **User Management:** Secure authentication using email and password, complemented by an instant one-click demonstration mode for evaluation.
* **Subscription Vault:** Full CRUD operations (Create, Read, Update, Delete) with status toggles (`Active`, `Paused`, `Cancelled`), category tagging, notes, and direct cancellation portal links.
* **Spend Intelligence:** Visual analytics featuring a monthly burn-rate area chart, category allocation donut charts, and an upcoming debit horizontal rail.
* **Notification System:** In-app alerts warning of trials expiring within 7 days (urgent warning at $\le 48$ hours) and standard renewals within user-configured reminder windows.

*Out of Scope:* Real-time automated bank API scrapping and programmatic auto-cancellation on third-party merchant servers (due to banking API constraints and regulatory compliance).

---

### 1.5 Applications
Vaulty addresses key practical scenarios across multiple user demographics:
* **College Students and Young Professionals:** Managing discretionary spending across video streaming, music, AI tools, and gaming platforms.
* **Freelancers and Independent Creators:** Tracking recurring software-as-a-service (SaaS) expenses such as cloud storage, domain renewals, design suites, and developer APIs.
* **Household Budgeters:** Maintaining a centralized record of shared family subscriptions, broadband utilities, and gym memberships.

---

### 1.6 Conclusion
Vaulty bridges the gap between complex, invasive budgeting platforms and tedious manual spreadsheets. By combining strict computational accuracy with a modern, high-contrast user interface, the project provides an accessible, secure, and actionable financial utility that effectively curbs recurring financial waste.

<div align="center">10</div>
