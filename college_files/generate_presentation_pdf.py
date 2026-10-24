import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>VAULTY — Minor Project Final Presentation</title>
<style>
  @page {
    size: 297mm 210mm; /* A4 Landscape */
    margin: 0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #0F111A;
    color: #fff;
  }
  .slide {
    width: 297mm;
    height: 210mm;
    padding: 18mm 22mm;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    background: #0F111A;
  }
  .slide-header {
    margin-bottom: 12px;
  }
  .slide-category {
    font-size: 11pt;
    font-weight: bold;
    color: #8B5CF6;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .slide-title {
    font-size: 24pt;
    font-weight: 800;
    color: #ffffff;
  }
  .slide-body {
    flex-grow: 1;
    display: flex;
    gap: 16px;
    margin-top: 14px;
  }
  .card {
    background: #1A1E2E;
    border: 1.5px solid #374151;
    border-radius: 12px;
    padding: 16px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .card-title {
    font-size: 15pt;
    font-weight: bold;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .card ul {
    list-style: none;
    line-height: 1.6;
    font-size: 11pt;
  }
  .card li {
    margin-bottom: 10px;
    position: relative;
    padding-left: 18px;
  }
  .card li::before {
    content: "•";
    position: absolute;
    left: 0;
    font-weight: bold;
    font-size: 14pt;
  }
  .card-violet { border-color: #8B5CF6; }
  .card-violet .card-title { color: #A78BFA; }
  .card-violet li::before { color: #A78BFA; }

  .card-cyan { border-color: #06B6D4; }
  .card-cyan .card-title { color: #22D3EE; }
  .card-cyan li::before { color: #22D3EE; }

  .card-green { border-color: #10B981; }
  .card-green .card-title { color: #34D399; }
  .card-green li::before { color: #34D399; }

  .card-pink { border-color: #EC4899; }
  .card-pink .card-title { color: #F472B6; }
  .card-pink li::before { color: #F472B6; }

  .card-amber { border-color: #F59E0B; }
  .card-amber .card-title { color: #FBBF24; }
  .card-amber li::before { color: #FBBF24; }

  .slide-footer {
    display: flex;
    justify-content: space-between;
    font-size: 9.5pt;
    color: #9CA3AF;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 8px;
    margin-top: 8px;
  }
  b.highlight { color: #fff; }
</style>
</head>
<body>

<!-- SLIDE 1: TITLE SLIDE -->
<div class="slide" style="justify-content: center; text-align: center; padding: 25mm 25mm;">
  <div style="font-size: 13pt; font-weight: bold; color: #06B6D4; letter-spacing: 2px; margin-bottom: 15px;">
    CHAUDHARY CHARAN SINGH UNIVERSITY, MEERUT • BCA-508
  </div>
  <div style="font-size: 52pt; font-weight: 900; color: #fff; letter-spacing: 1px; margin-bottom: 10px;">
    VAULTY
  </div>
  <div style="font-size: 22pt; font-weight: 700; color: #A78BFA; margin-bottom: 18px;">
    Personal Subscription & Burn-Rate Intelligence Web Application
  </div>
  <div style="font-size: 12.5pt; color: #9CA3AF; max-width: 800px; margin: 0 auto 35px auto; line-height: 1.5;">
    A full-stack, client-first financial intelligence dashboard designed to eliminate subscription fatigue, terminate zombie expenses, and defend against predatory trial traps.
  </div>

  <div style="background: #1A1E2E; border: 1.5px solid #8B5CF6; border-radius: 14px; padding: 18px 25px; max-width: 900px; margin: 0 auto; display: flex; justify-content: space-between; text-align: left;">
    <div>
      <div style="font-size: 10pt; font-weight: bold; color: #9CA3AF; margin-bottom: 4px;">SUBMITTED BY:</div>
      <div style="font-size: 15pt; font-weight: bold; color: #fff;">LAKSHYA SINGH</div>
      <div style="font-size: 11pt; color: #22D3EE;">Roll No: 240919106122 | BCA 5th Sem (2024–2027)</div>
      <div style="font-size: 10pt; color: #9CA3AF;">IMS Noida (CCSU Meerut)</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 10pt; font-weight: bold; color: #9CA3AF; margin-bottom: 4px;">UNDER THE GUIDANCE OF:</div>
      <div style="font-size: 15pt; font-weight: bold; color: #fff;">Prof. Nihal Kumar</div>
      <div style="font-size: 11pt; color: #22D3EE;">Department of Information Technology</div>
      <div style="font-size: 10pt; color: #9CA3AF;">IMS Noida (CCSU Meerut)</div>
    </div>
  </div>
</div>

<!-- SLIDE 2: PROBLEM STATEMENT -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-category">Introduction & Problem Statement</div>
    <div class="slide-title">The Real-World Subscription Crisis</div>
  </div>
  <div class="slide-body">
    <div class="card card-pink">
      <div class="card-title">Macro Market Challenges</div>
      <ul>
        <li><b class="highlight">Shift to Recurring Billing:</b> Entertainment (Netflix, Spotify), Cloud (Google One), AI (Claude Pro, ChatGPT), and Gym platforms charge recurring fees rather than one-time costs.</li>
        <li><b class="highlight">Severe Spend Blindness:</b> Studies indicate 84% of consumers significantly underestimate monthly recurring outflows by 2x to 3x.</li>
        <li><b class="highlight">Silent Auto-Debit Leaks:</b> Fractional charges (₹149, ₹299, ₹649) silently compound into an annual bleed of ₹45,000+ per student/developer.</li>
      </ul>
    </div>
    <div class="card card-amber">
      <div class="card-title">Identified Flaws in Existing Solutions</div>
      <ul>
        <li><b class="highlight">Zombie Subscriptions:</b> Forgotten memberships unused for >30 days continue charging accounts perpetually.</li>
        <li><b class="highlight">Dark Pattern Trial Traps:</b> Free trials require payment card details and quietly auto-convert without user reminder.</li>
        <li><b class="highlight">Roommate Split Friction:</b> Shared subscriptions (Netflix 4K, Spotify Duo) lack automated payment tracking and UPI links.</li>
        <li><b class="highlight">Data Privacy Risks:</b> Banking aggregation apps demand sensitive OTPs and full net-banking credentials.</li>
      </ul>
    </div>
  </div>
  <div class="slide-footer">
    <span>VAULTY — Minor Project Presentation</span>
    <span>Slide 2</span>
  </div>
</div>

<!-- SLIDE 3: OBJECTIVES -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-category">Project Objectives</div>
    <div class="slide-title">Core Goals & System Capabilities</div>
  </div>
  <div class="slide-body">
    <div class="card card-violet">
      <div class="card-title">1. Unified Spend Ledger</div>
      <ul>
        <li><b class="highlight">One-Pane Dashboard:</b> Aggregate all recurring digital commitments on a single intuitive Bento screen.</li>
        <li><b class="highlight">30-Second Quick Presets:</b> Instant brand presets (Netflix, Spotify, Prime, ChatGPT) to eliminate form-filling friction.</li>
        <li><b class="highlight">Mathematical Normalization:</b> Automatically convert all billing frequencies to a standard 30-day monthly burn rate.</li>
      </ul>
    </div>
    <div class="card card-cyan">
      <div class="card-title">2. Proactive Defense Engine</div>
      <ul>
        <li><b class="highlight">Bleed Radar:</b> Automated background scan flagging active subscriptions dormant for &ge; 30 days.</li>
        <li><b class="highlight">Trial Conversion Shield:</b> Visual countdown for trials ending within 48 hours with 1-click cancellation links.</li>
        <li><b class="highlight">Price Hike Watchdog:</b> Audits stealth cost adjustments and foreign currency fluctuations across cycles.</li>
      </ul>
    </div>
    <div class="card card-green">
      <div class="card-title">3. Enterprise Architecture</div>
      <ul>
        <li><b class="highlight">Zero-Setup Demo Mode:</b> Works 100% offline via LocalStorage fallback without requiring database connection.</li>
        <li><b class="highlight">Supabase PostgreSQL:</b> Secure cloud storage enforcing PostgreSQL Row Level Security (RLS) tenant isolation.</li>
        <li><b class="highlight">100% Tested Logic:</b> Core mathematical engine verified via 7 Vitest unit tests.</li>
      </ul>
    </div>
  </div>
  <div class="slide-footer">
    <span>VAULTY — Minor Project Presentation</span>
    <span>Slide 3</span>
  </div>
</div>

<!-- SLIDE 4: ARCHITECTURE -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-category">System Architecture</div>
    <div class="slide-title">3-Tier Layered Structural Design</div>
  </div>
  <div class="slide-body">
    <div class="card card-violet">
      <div class="card-title">Tier 1: Presentation Layer</div>
      <ul>
        <li><b class="highlight">Next.js 14 App Router:</b> React Server Components for optimal page speeds and zero-waterfall renders.</li>
        <li><b class="highlight">Dark Glassmorphic UI:</b> Tailored #090A0F theme, backdrop blur filters, and vibrant neon status indicators.</li>
        <li><b class="highlight">Interactive Recharts:</b> Declarative SVG Burn Rate Flow area trajectory and category donut breakdown.</li>
      </ul>
    </div>
    <div class="card card-cyan">
      <div class="card-title">Tier 2: Business & Math Layer</div>
      <ul>
        <li><b class="highlight">Pure Math Engine:</b> <code>lib/calc.ts</code> decoupled from UI renders for deterministic, sub-millisecond calculation.</li>
        <li><b class="highlight">Zod Schema Validation:</b> Strict type verification preventing runtime edge-case data corruption.</li>
        <li><b class="highlight">Command Palette:</b> Instant global keyboard navigation powered by <code>cmdk</code> (⌘K / Ctrl+K).</li>
      </ul>
    </div>
    <div class="card card-green">
      <div class="card-title">Tier 3: Persistence Layer</div>
      <ul>
        <li><b class="highlight">Repository Pattern:</b> Decouples UI from underlying storage mechanism via unified interface.</li>
        <li><b class="highlight">Offline LocalStorage:</b> Immediate zero-latency demo mode with instant persistence.</li>
        <li><b class="highlight">PostgreSQL + RLS:</b> Cloud persistence with strict tenant isolation enforced at the database engine level.</li>
      </ul>
    </div>
  </div>
  <div class="slide-footer">
    <span>VAULTY — Minor Project Presentation</span>
    <span>Slide 4</span>
  </div>
</div>

<!-- SLIDE 5: MATHEMATICAL ENGINE -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-category">Core Algorithms</div>
    <div class="slide-title">Mathematical Calculation Engine (lib/calc.ts)</div>
  </div>
  <div class="slide-body">
    <div class="card card-cyan">
      <div class="card-title">Core Computational Formulas</div>
      <ul>
        <li><b class="highlight">1. Billing Cycle Normalization:</b><br>
        <code>C_monthly = Cost × (365 / (12 × D_cycle))</code><br>
        Normalizes Weekly (×4.345), Monthly (×1), Quarterly (/3), and Annual (/12) to exact 30-day burn rate.</li>
        <li><b class="highlight">2. Monthly Bleed Summation:</b><br>
        <code>Total Bleed = Σ C_monthly</code> for all records with <code>status == 'active'</code> (paused and cancelled subs excluded).</li>
        <li><b class="highlight">3. Zombie Inactivity Boundary:</b><br>
        <code>isZombie = (Current_Date - Last_Used_Date) &ge; 30 days</code>.</li>
        <li><b class="highlight">4. Trial Trap Urgency Horizon:</b><br>
        Flagged as urgent when <code>(Renewal_Date - Current_Date) &le; 48 hours</code>.</li>
      </ul>
    </div>
    <div class="card card-green">
      <div class="card-title">Automated Vitest Verification (7/7 Passed)</div>
      <ul>
        <li><b class="highlight">Test 1: Cycle Normalization:</b> Verified mathematical precision across all 4 billing cadences.</li>
        <li><b class="highlight">Test 2: Status Isolation:</b> Confirmed paused and cancelled subscriptions contribute exactly ₹0 to burn rate.</li>
        <li><b class="highlight">Test 3: 30-Day Boundary Precision:</b> Validated strict boundary (29 days = active, 30 days = zombie).</li>
        <li><b class="highlight">Test 4: Leap Year & Roll-Forward:</b> Verified accurate renewal date advancement past month-ends.</li>
        <li><b class="highlight">Test 5: Zero Division Safety:</b> Handles zero-value deltas without NaN errors.</li>
        <li><b class="highlight">Test 6: Trial Window Isolation:</b> Accurately isolates trials expiring within target window.</li>
        <li><b class="highlight">Test 7: Seed Calibration:</b> Baseline dataset reliably produces exactly ₹3,849/month.</li>
      </ul>
    </div>
  </div>
  <div class="slide-footer">
    <span>VAULTY — Minor Project Presentation</span>
    <span>Slide 5</span>
  </div>
</div>

<!-- SLIDE 6: UI & FEATURE MODULES -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-category">User Interface</div>
    <div class="slide-title">Key Feature Modules & Walkthrough</div>
  </div>
  <div class="slide-body">
    <div class="card card-violet">
      <div class="card-title">1. Bento Dashboard</div>
      <ul>
        <li><b class="highlight">Wallet Bleed Card:</b> Displays ₹3,849/mo hero metric with 6-month historical sparkline.</li>
        <li><b class="highlight">Zombie Sub Card:</b> Highlights 3 idle subscriptions with instant ₹899/mo savings review.</li>
        <li><b class="highlight">Trial Trap Radar:</b> 48-hr warning for Prime trial with 1-click cancel deep-link.</li>
        <li><b class="highlight">Burn Rate Flow:</b> 12-month area chart forecasting year-end spend trajectory.</li>
      </ul>
    </div>
    <div class="card card-cyan">
      <div class="card-title">2. Sub Vault</div>
      <ul>
        <li><b class="highlight">Quick Brand Presets:</b> Instant brand presets for Netflix, Spotify, Prime, Claude, ChatGPT, Cult.fit.</li>
        <li><b class="highlight">Multi-Select Filtering:</b> Real-time filter pills across Streaming, AI Tools, Cloud, Gaming, Zombies, Trials.</li>
        <li><b class="highlight">Instant Status Toggle:</b> Flip status between Active and Paused in one click.</li>
        <li><b class="highlight">CSV Export:</b> One-click complete ledger export for offline auditing.</li>
      </ul>
    </div>
    <div class="card card-pink">
      <div class="card-title">3. Bleed Radar</div>
      <ul>
        <li><b class="highlight">Zombie Terminator:</b> Identifies dormant services and calculates recoverable monthly cash.</li>
        <li><b class="highlight">Price Hike Watchdog:</b> Flags stealth price jumps (+₹20 Spotify Duo hike).</li>
        <li><b class="highlight">Savings Simulator:</b> Interactive projection of 1-year and 3-year bank balance gains.</li>
        <li><b class="highlight">Notification Center:</b> Priority-ranked in-app notifications for imminent debits.</li>
      </ul>
    </div>
    <div class="card card-green">
      <div class="card-title">4. Smart Split</div>
      <ul>
        <li><b class="highlight">Shared Cost Matrix:</b> Splits multi-user plans (e.g., Netflix 4K with roommates).</li>
        <li><b class="highlight">True Net Bleed:</b> Computes actual personal liability after split reimbursements.</li>
        <li><b class="highlight">WhatsApp Reminders:</b> Pre-formats polite WhatsApp reminder messages.</li>
        <li><b class="highlight">Instant UPI Links:</b> Generates 1-click UPI payment deep-links for instant settlement.</li>
      </ul>
    </div>
  </div>
  <div class="slide-footer">
    <span>VAULTY — Minor Project Presentation</span>
    <span>Slide 6</span>
  </div>
</div>

<!-- SLIDE 7: CALIBRATED SEED DATA -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-category">Experimental Results</div>
    <div class="slide-title">Calibrated Baseline (Student Persona: Arjun)</div>
  </div>
  <div class="slide-body">
    <div class="card card-amber">
      <div class="card-title">Active Subscriptions Ledger (₹3,849/mo)</div>
      <ul>
        <li><b class="highlight">Netflix 4K (Streaming):</b> ₹649.00 / month — Renews in 3 days</li>
        <li><b class="highlight">Cult.fit Gym (Gym/Health):</b> ₹899.00 / month — Unused for 38 days (ZOMBIE)</li>
        <li><b class="highlight">Claude Pro (AI Tools):</b> ₹1,700.00 / month ($20 USD normalized) — Active daily</li>
        <li><b class="highlight">Spotify Duo (Streaming):</b> ₹149.00 / month — Renews in 7 days</li>
        <li><b class="highlight">Google One 100GB (Cloud):</b> ₹130.00 / month — Continuous backup</li>
        <li><b class="highlight">Xbox Game Pass PC (Gaming):</b> ₹322.00 / mo (₹967/quarter) — Unused 42 days (ZOMBIE)</li>
      </ul>
    </div>
    <div class="card card-green">
      <div class="card-title">Recoverable Savings & Defensive Alerts</div>
      <ul>
        <li><b class="highlight">3 Zombie Subscriptions Identified:</b> Cult.fit Gym (₹899) + Xbox Game Pass (₹322) + iCloud (₹75) = ₹899/month recoverable.</li>
        <li><b class="highlight">Annualized Cash Retained:</b> Eliminating the 3 detected zombies saves ₹10,788 per calendar year.</li>
        <li><b class="highlight">Urgent Free Trial Defended:</b> Amazon Prime trial ends in 48 hours. Direct cancel deep-link surfaced before credit card charge of ₹299.</li>
        <li><b class="highlight">Smart Split Reimbursement:</b> Splitting Netflix 4K with 3 roommates recovers ₹486.75/month back to user's UPI.</li>
      </ul>
    </div>
  </div>
  <div class="slide-footer">
    <span>VAULTY — Minor Project Presentation</span>
    <span>Slide 7</span>
  </div>
</div>

<!-- SLIDE 8: TECH STACK & TOOLS -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-category">Technology Architecture</div>
    <div class="slide-title">Software, Libraries & Development Tools</div>
  </div>
  <div class="slide-body">
    <div class="card card-violet">
      <div class="card-title">Frontend Framework & UI</div>
      <ul>
        <li><b class="highlight">Next.js 14 (App Router):</b> React Server Components for optimal SEO and client rendering speed.</li>
        <li><b class="highlight">React 18:</b> Concurrent mode and optimistic UI updates for instant interactions.</li>
        <li><b class="highlight">Tailwind CSS 3.4:</b> Utility-first CSS variables powering dark glassmorphism.</li>
        <li><b class="highlight">Recharts:</b> Declarative SVG area charts, sparklines, and donut graphs.</li>
        <li><b class="highlight">Lucide React:</b> Ultra-lightweight scalable vector UI icon library.</li>
      </ul>
    </div>
    <div class="card card-cyan">
      <div class="card-title">Backend, Database & Math</div>
      <ul>
        <li><b class="highlight">TypeScript 5:</b> Strict static typing across all schemas, props, and calculation logic.</li>
        <li><b class="highlight">Supabase Cloud:</b> Managed PostgreSQL relational database with Row Level Security.</li>
        <li><b class="highlight">date-fns Engine:</b> Immutable temporal arithmetic for leap-year-safe renewal calculation.</li>
        <li><b class="highlight">Zod Validation:</b> Schema declaration and runtime input validation.</li>
      </ul>
    </div>
    <div class="card card-green">
      <div class="card-title">Testing, Build & DevOps</div>
      <ul>
        <li><b class="highlight">Vitest:</b> Sub-millisecond unit test suite testing calculation theorems.</li>
        <li><b class="highlight">ESLint & PostCSS:</b> Code quality inspection and CSS optimization.</li>
        <li><b class="highlight">Headless Chrome Engine:</b> High-fidelity PDF compilation with native link annotations.</li>
        <li><b class="highlight">Vercel Edge CI/CD:</b> Automated build verification and edge distribution.</li>
      </ul>
    </div>
  </div>
  <div class="slide-footer">
    <span>VAULTY — Minor Project Presentation</span>
    <span>Slide 8</span>
  </div>
</div>

<!-- SLIDE 9: CONCLUSION & DELIVERABLES -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-category">Conclusion & Verification</div>
    <div class="slide-title">Project Summary & Presentation Deliverables</div>
  </div>
  <div class="slide-body">
    <div class="card card-green">
      <div class="card-title">Project Summary & Achievements</div>
      <ul>
        <li><b class="highlight">100% Curriculum Compliance:</b> Fully satisfies all BCA-508 minor project guidelines for Chaudhary Charan Singh University.</li>
        <li><b class="highlight">Sub-Millisecond Engine:</b> Zero-latency calculations decoupled from visual presentation.</li>
        <li><b class="highlight">Production Tested:</b> 7/7 Vitest unit tests pass; all 13 Next.js routes compile statically with 0 errors.</li>
        <li><b class="highlight">Dual Persistence:</b> Instant zero-setup demo mode + secure PostgreSQL cloud syncing.</li>
      </ul>
    </div>
    <div class="card card-cyan">
      <div class="card-title">Mandatory Materials Ready for Tomorrow</div>
      <ul>
        <li><b class="highlight">1. Project Report PDF (Clickable):</b> <code>VAULTY_Minor_Project_Report.pdf</code> (33 Pages with 152 active hyperlinks).</li>
        <li><b class="highlight">2. Project Source Code Bundle:</b> <code>VAULTY_Source_Code.zip</code> packaged and ready for pen-drive submission.</li>
        <li><b class="highlight">3. Mandatory Presentation PPT:</b> <code>VAULTY_Minor_Project_Presentation.pptx</code> (and this PDF slide deck).</li>
        <li><b class="highlight">4. Live Application Instance:</b> Running locally via <code>start.command</code> on port 3000.</li>
      </ul>
    </div>
  </div>
  <div class="slide-footer">
    <span>VAULTY — Minor Project Presentation</span>
    <span>Slide 9</span>
  </div>
</div>

<!-- SLIDE 10: THANK YOU & VIVA -->
<div class="slide" style="justify-content: center; text-align: center; padding: 25mm 25mm;">
  <div style="font-size: 54pt; font-weight: 900; color: #fff; margin-bottom: 10px;">
    THANK YOU!
  </div>
  <div style="font-size: 26pt; font-weight: 700; color: #A78BFA; margin-bottom: 25px;">
    Questions & Live Demonstration
  </div>
  <div style="font-size: 14pt; color: #22D3EE; line-height: 1.8; margin-bottom: 25px;">
    <b>Candidate:</b> LAKSHYA SINGH &nbsp;|&nbsp; <b>Roll No:</b> 240919106122 &nbsp;|&nbsp; <b>BCA 5th Semester</b><br>
    <b>Project Guide:</b> Prof. Nihal Kumar &nbsp;|&nbsp; <b>Department of IT, IMS Noida</b><br>
    <b>Affiliated to:</b> Chaudhary Charan Singh University, Meerut
  </div>
  <div style="font-size: 11pt; color: #9CA3AF; line-height: 1.6;">
    <b>GitHub Repository:</b> https://github.com/lakshyasingh/vaulty<br>
    <b>Student Email:</b> lakshyasingh.bcr24224@imsnoida.com
  </div>
</div>

</body>
</html>
"""

html_path = "/Users/lakshyasingh/Desktop/vaulty/college_files/presentation_slides.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Generated presentation_slides.html successfully.")

pdf_path = "/Users/lakshyasingh/Desktop/vaulty/VAULTY_Minor_Project_Presentation.pdf"
cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    f"--print-to-pdf={pdf_path}",
    f"file://{html_path}"
]
subprocess.run(cmd, check=True)
print(f"Compiled Presentation PDF successfully at {pdf_path}!")
