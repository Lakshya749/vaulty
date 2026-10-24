# CHAPTER 8: SOFTWARE AND TOOLS USED

### 8.1 Frontend Framework and Styling Environment

#### 1. Next.js 14 (App Router)
Next.js 14 represents the state of the art in React-based full-stack frameworks. Key architectural advantages utilized in Vaulty include:
* **Server and Client Component Hybridization:** Critical UI chrome renders instantly on the server, while interactive charts and filter inputs mount smoothly on the client.
* **Server Actions:** Secure server mutations replace traditional verbose REST API endpoints, allowing streamlined CRUD operations with built-in cache revalidation (`revalidatePath`).
* **Route Groups:** Logical folder segregation using `(app)` for authenticated dashboard views and `(auth)` for public authentication forms.

#### 2. React 18 & TypeScript
* **TypeScript 5.x:** Enforces compile-time type validation across all subscription entities, calculation parameters, and database schemas. Null-pointer exceptions and arithmetic type coercion bugs are eliminated before runtime.
* **React 18 Hooks:** Utilized `useMemo` and `useCallback` for optimizing calculation engines, ensuring zero dropped frames during 60 FPS chart animations and user search typing.

#### 3. Tailwind CSS 3.4
Tailwind CSS provides a modern utility-first stylesheet architecture:
* **Custom Design Tokens:** Implemented CSS custom properties for dark glassmorphism surfaces (`rgba(255, 255, 255, 0.03)`), neon borders, and precise fintech typography.
* **Micro-Interactions:** Smooth hover transitions (`scale 0.98` on click, `lift 2px` on card hover) built natively with zero external animation bloat.

#### 4. Recharts Visualization Library
* Built on top of SVG elements, Recharts renders scalable, crisp charts on retina and standard displays.
* Implements smooth monotone cubic spline curves for the burn-rate trajectory and segmented pie geometries for category distributions.

<div align="center">29</div>

<br><hr><br>

### 8.2 Backend, Authentication and Database Tools

#### 1. Supabase (Managed PostgreSQL)
Supabase provides the cloud database backend for Vaulty:
* **PostgreSQL Relational Engine:** Provides full ACID compliance, foreign key constraints, check constraints on costs, and automated date functions.
* **Supabase Auth:** Manages secure user signups, logins, password encryption, and JSON Web Token (JWT) session generation, ensuring passwords are never handled directly by the application layer.
* **Row Level Security (RLS):** Enforces fine-grained, policy-based access control directly within the PostgreSQL engine.

#### 2. LocalRepository & Browser LocalStorage
To satisfy the dual-persistence requirement, Vaulty implements a complete client-side repository:
* Implements the identical `SubscriptionRepository` interface as the cloud provider.
* Automatically seeds benchmark data on first launch when running in offline or demonstration mode.
* Serializes mutations instantly to browser `localStorage`, ensuring full persistence across page refreshes without requiring network connectivity.

#### 3. Zod & React Hook Form
* **Zod:** A TypeScript-first schema declaration and validation library. A single schema definition validates user input on both the client form and the server action.
* **React Hook Form:** Manages uncontrolled form state with the `@hookform/resolvers/zod` bridge, ensuring sub-100ms form validation feedback and clean inline error indicators.

<div align="center">30</div>

<br><hr><br>

### 8.3 Testing, Linting and Build Tools

#### 1. Vitest Test Runner
* Vitest provides a high-speed, ESM-native unit testing runner.
* Enables automated execution of mathematical boundary assertions (`calc.test.ts`), verifying cycle conversions and zombie threshold calculations in under 250 milliseconds.

#### 2. Date-Fns Utility Library
* A lightweight, immutable date manipulation library.
* Provides pure functions (`differenceInDays`, `addMonths`, `addYears`, `format`) ensuring accurate handling of calendar boundaries, leap years, and billing cycle roll-forwards without timezone discrepancies.

#### 3. Lucide React & CMDK
* **Lucide React:** Supplies tree-shakeable, modern SVG iconography for category identifiers and navigational controls.
* **CMDK:** Powers the floating Command Palette (`⌘K`), delivering rapid keyboard accessibility for searching subscriptions and navigating routes.

#### 4. Vercel Cloud Platform
* Provides continuous integration and continuous deployment (CI/CD) directly from the project Git repository.
* Automatically executes production builds (`npm run build`) and generates globally distributed edge deployments with automated SSL certificate provisioning.

<div align="center">31</div>
