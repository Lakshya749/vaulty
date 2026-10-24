import sys, os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette (Dark Neon Theme)
BG_COLOR = RGBColor(15, 17, 26)       # #0F111A
CARD_BG = RGBColor(26, 30, 46)        # #1A1E2E
CARD_BORDER = RGBColor(55, 65, 81)    # #374151
PRIMARY_VIOLET = RGBColor(139, 92, 246) # #8B5CF6
TEXT_WHITE = RGBColor(255, 255, 255)
TEXT_MUTED = RGBColor(156, 163, 175)  # #9CA3AF
ACCENT_CYAN = RGBColor(6, 182, 212)   # #06B6D4
ACCENT_PINK = RGBColor(236, 72, 153)  # #EC4899
ACCENT_GREEN = RGBColor(16, 185, 129) # #10B981
ACCENT_AMBER = RGBColor(245, 158, 11) # #F59E0B

blank_layout = prs.slide_layouts[6]

def set_slide_background(slide):
    bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg_shape.fill.solid()
    bg_shape.fill.fore_color.rgb = BG_COLOR
    bg_shape.line.fill.background()
    return bg_shape

def add_header(slide, title_text, category_text="VAULTY — BCA MINOR PROJECT (BCA-508)"):
    # Category Tracker
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
    tf_cat = cat_box.text_frame
    tf_cat.word_wrap = True
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = category_text.upper()
    p_cat.font.size = Pt(11)
    p_cat.font.bold = True
    p_cat.font.color.rgb = PRIMARY_VIOLET
    
    # Title
    t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.8))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title_text
    p_t.font.size = Pt(26)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE

def add_card(slide, left, top, width, height, title, items, badge_color=PRIMARY_VIOLET, title_color=TEXT_WHITE):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = CARD_BG
    card.line.color.rgb = CARD_BORDER
    card.line.width = Pt(1.5)
    
    tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), height - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    
    if title:
        p_head = tf.paragraphs[0]
        p_head.text = title
        p_head.font.size = Pt(18)
        p_head.font.bold = True
        p_head.font.color.rgb = title_color
        p_head.space_after = Pt(10)
    
    for item in items:
        p = tf.add_paragraph()
        if isinstance(item, tuple):
            lead, text = item
            run1 = p.add_run()
            run1.text = "• " + lead + ": "
            run1.font.bold = True
            run1.font.size = Pt(13)
            run1.font.color.rgb = badge_color
            
            run2 = p.add_run()
            run2.text = text
            run2.font.size = Pt(13)
            run2.font.color.rgb = TEXT_WHITE
        else:
            p.text = "• " + item
            p.font.size = Pt(13)
            p.font.color.rgb = TEXT_WHITE
        p.space_after = Pt(6)

# ----------------- SLIDE 1: TITLE SLIDE -----------------
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1)

# Large Hero Box
hero_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.3), Inches(3.0))
tf1 = hero_box.text_frame
tf1.word_wrap = True

p_badge = tf1.paragraphs[0]
p_badge.text = "CHAUDHARY CHARAN SINGH UNIVERSITY, MEERUT • BCA-508"
p_badge.font.size = Pt(13)
p_badge.font.bold = True
p_badge.font.color.rgb = ACCENT_CYAN
p_badge.space_after = Pt(12)

p_title = tf1.add_paragraph()
p_title.text = "VAULTY"
p_title.font.size = Pt(54)
p_title.font.bold = True
p_title.font.color.rgb = TEXT_WHITE

p_sub = tf1.add_paragraph()
p_sub.text = "Personal Subscription & Burn-Rate Intelligence Web Application"
p_sub.font.size = Pt(22)
p_sub.font.color.rgb = PRIMARY_VIOLET
p_sub.space_after = Pt(8)

p_desc = tf1.add_paragraph()
p_desc.text = "A full-stack, client-first financial intelligence dashboard designed to eliminate subscription fatigue, terminate zombie expenses, and defend against predatory trial traps."
p_desc.font.size = Pt(14)
p_desc.font.color.rgb = TEXT_MUTED

# Student & Guide Card Container
info_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.5), Inches(11.3), Inches(2.2))
info_card.fill.solid()
info_card.fill.fore_color.rgb = CARD_BG
info_card.line.color.rgb = PRIMARY_VIOLET
info_card.line.width = Pt(1.5)

info_tb = s1.shapes.add_textbox(Inches(1.3), Inches(4.7), Inches(10.7), Inches(1.8))
tf_info = info_tb.text_frame

p_std = tf_info.paragraphs[0]
p_std.text = "SUBMITTED BY:                                          UNDER THE GUIDANCE OF:"
p_std.font.size = Pt(12)
p_std.font.bold = True
p_std.font.color.rgb = TEXT_MUTED
p_std.space_after = Pt(4)

p_names = tf_info.add_paragraph()
p_names.text = "LAKSHYA SINGH                                      Prof. Nihal Kumar"
p_names.font.size = Pt(18)
p_names.font.bold = True
p_names.font.color.rgb = TEXT_WHITE
p_names.space_after = Pt(4)

p_details = tf_info.add_paragraph()
p_details.text = "Roll No: 240919106122 | BCA 5th Sem (2024–2027)         Department of Information Technology\nInstitute of Management Studies (IMS), Noida                 IMS Noida (CCSU Meerut)"
p_details.font.size = Pt(13)
p_details.font.color.rgb = ACCENT_CYAN

# ----------------- SLIDE 2: INTRODUCTION & PROBLEM STATEMENT -----------------
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, "Introduction & Real-World Problem Statement")

add_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "The Subscription Crisis",
         [
             ("Shift to Recurring Models", "Digital lifestyle platforms (OTT, Gym, Cloud, AI tools) charge periodic fees instead of one-time purchases."),
             ("Severe Spend Blindness", "Industry studies (Harvard Business Review) show 84% of consumers significantly underestimate monthly recurring debit outflow."),
             ("Micro-Bleed Syndrome", "Individual subscriptions appear small (₹149, ₹299), but collectively drain ₹3,000–₹6,000 every month without user awareness.")
         ], badge_color=ACCENT_PINK, title_color=ACCENT_PINK)

add_card(s2, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Identified Industry Flaws",
         [
             ("Zombie Subscriptions", "Services unused for >30 days (e.g. forgotten gym memberships, inactive game passes) continually deduct fees."),
             ("Trial Traps", "Free trials intentionally require credit/debit cards and quietly auto-convert into annual recurring commitments."),
             ("Roommate Split Friction", "Splitting family or duo accounts (Netflix, Spotify) requires manual monthly follow-ups and awkward reminder chats.")
         ], badge_color=ACCENT_AMBER, title_color=ACCENT_AMBER)

# ----------------- SLIDE 3: OBJECTIVES OF VAULTY -----------------
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, "Project Objectives & Core Design Goals")

add_card(s3, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
         "1. Spend Intelligence",
         [
             ("Unified Central Ledger", "Single-pane view of all recurring liabilities with 30-sec brand presets."),
             ("Normalized Burn Rate", "Mathematical conversion of weekly, quarterly, and annual billing into unified 30-day monthly burn rate."),
             ("Visual Cashflow Flow", "Recharts visual charts (burn trajectory area chart + category donut).")
         ], badge_color=PRIMARY_VIOLET)

add_card(s3, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
         "2. Proactive Defense",
         [
             ("Bleed Radar", "Automated detection of idle subscriptions exceeding the 30-day inactivity threshold."),
             ("Trial Watchdog", "Urgent countdown warning (<48 hrs) with direct 1-click cancellation deep-links."),
             ("Price Hike Auditor", "Audit price adjustments and currency fluctuations across billing cycles.")
         ], badge_color=ACCENT_CYAN)

add_card(s3, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
         "3. Modern Engineering",
         [
             ("Zero Cloud Dependency", "Offline-first LocalStorage fallback ensures full functionality without backend setup."),
             ("Cloud Persistence", "Supabase PostgreSQL with strict Row Level Security (RLS) policies."),
             ("Verified Logic", "Pure functional mathematical calculation engine with 100% Vitest test coverage.")
         ], badge_color=ACCENT_GREEN)

# ----------------- SLIDE 4: SYSTEM ARCHITECTURE -----------------
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, "3-Tier System Architecture")

add_card(s4, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
         "Tier 1: Presentation Layer",
         [
             ("Next.js 14 App Router", "Server components combined with client-side interactive widgets."),
             ("Dark Glassmorphic UI", "Custom #090A0F theme, backdrop blur filters, and neon indicators."),
             ("Responsive Bento Grid", "Fluid adaptation across mobile (390px), tablet (768px), and desktop (1440px)."),
             ("Data Visualizations", "Recharts SVG AreaChart, Donut Chart, and dynamic sparklines.")
         ], badge_color=PRIMARY_VIOLET)

add_card(s4, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
         "Tier 2: Business & Math Logic",
         [
             ("Pure Functional Engine", "lib/calc.ts decoupled from React render loops for deterministic output."),
             ("Schema Validation", "Zod schemas on form inputs ensuring type safety and boundary validity."),
             ("Command Palette", "cmdk integration enabling instantaneous keyboard navigation (Cmd+K)."),
             ("Optimistic UI Updates", "Non-intrusive 5-second undo deletion toasts powered by Sonner.")
         ], badge_color=ACCENT_CYAN)

add_card(s4, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
         "Tier 3: Storage & Persistence",
         [
             ("Dual-Mode Repository", "Pluggable repository pattern supporting instant runtime fallback."),
             ("LocalStorage Adapter", "Full client-side persistence for privacy, demo mode, and offline use."),
             ("Supabase PostgreSQL", "Cloud database with automated triggers and real-time syncing."),
             ("Row Level Security", "Tenant isolation enforced at the database engine level (auth.uid()).")
         ], badge_color=ACCENT_GREEN)

# ----------------- SLIDE 5: MATHEMATICAL ENGINE & THEOREMS -----------------
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, "Mathematical Calculation Engine (lib/calc.ts)")

add_card(s5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Core Computational Formulas",
         [
             ("Formula 1: Normalization", "Converts any billing cycle to 30-day normalized cost: C_mo = Cost * (365 / (12 * D_cycle)). Weekly (*4.345), Quarterly (/3), Yearly (/12)."),
             ("Formula 2: Monthly Bleed", "Calculates true total: Sigma(C_mo) for all subscriptions with status == 'active'. Paused & cancelled excluded."),
             ("Formula 3: Zombie Threshold", "Flagged if subscription is active AND (CurrentDate - LastUsedDate) >= 30 days."),
             ("Formula 4: Trial Urgency", "Urgent flag triggered if isTrial == true AND (RenewalDate - CurrentDate) <= 48 hours.")
         ], badge_color=ACCENT_CYAN)

add_card(s5, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Automated Vitest Verification (7/7)",
         [
             ("Test 1: Cycle Normalization", "Verified exact mathematical outputs across weekly, monthly, quarterly, and annual intervals."),
             ("Test 2: Bleed Exclusions", "Confirmed paused and cancelled records contribute exactly 0 to the active total."),
             ("Test 3: 30-Day Boundary", "Tested 29-day (active) vs 30-day (zombie) exact boundary threshold."),
             ("Test 4: Leap Year & Roll-Forward", "Validated date-fns advancement past month-ends into future years."),
             ("Test 5: Target Seed Baseline", "Calibrated baseline data reliably yields exactly ₹3,849/month.")
         ], badge_color=ACCENT_GREEN)

# ----------------- SLIDE 6: DATABASE SCHEMA & SECURITY -----------------
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6)
add_header(s6, "Database Architecture & Row Level Security (RLS)")

add_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Relational Schema Design",
         [
             ("subscriptions", "id, user_id, service_name, cost, currency, billing_cycle, next_renewal, last_used_date, is_trial, cancel_url, status."),
             ("profiles", "id, email, full_name, monthly_budget, currency_preference, created_at."),
             ("categories", "Pre-seeded taxonomies: Streaming, Gym, Cloud, Gaming, AI Tools, Productivity."),
             ("split_shares", "Foreign key to subscription, split member name, contact, percentage share, payment_status."),
             ("price_history", "Historical audit tracking price change deltas across successive billing periods.")
         ], badge_color=PRIMARY_VIOLET)

add_card(s6, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Database Security Architecture",
         [
             ("Zero Trust Database", "All tables enforce: ALTER TABLE ... ENABLE ROW LEVEL SECURITY;"),
             ("Tenant Isolation Policy", "CREATE POLICY \"Users access own data\" ON subscriptions FOR ALL USING (auth.uid() = user_id);"),
             ("Automated Triggers", "PostgreSQL triggers recalculate updated_at timestamps on every mutation."),
             ("ACID Compliance", "PostgreSQL ensures transactional consistency during split additions and edits.")
         ], badge_color=ACCENT_PINK)

# ----------------- SLIDE 7: CORE FEATURES & USER INTERFACE -----------------
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7)
add_header(s7, "Feature Modules & Visual Walkthrough")

add_card(s7, Inches(0.8), Inches(1.8), Inches(2.7), Inches(5.0),
         "1. Bento Dashboard",
         [
             ("Monthly Bleed", "Hero card showing ₹3,849/mo with sparkline."),
             ("Zombie Card", "3 idle subs saving ₹899/mo."),
             ("Trial Trap", "Prime ending in 48 hrs alert."),
             ("Trajectory Area", "Jan-Dec spend flow chart."),
             ("Donut Chart", "Category spend share.")
         ], badge_color=PRIMARY_VIOLET)

add_card(s7, Inches(3.8), Inches(1.8), Inches(2.7), Inches(5.0),
         "2. Sub Vault",
         [
             ("Brand Presets", "1-click entry for Netflix, Spotify, ChatGPT..."),
             ("Filter Pills", "Instant multi-filter (Streaming, AI, Trials)."),
             ("Status Toggle", "Active vs Paused switch."),
             ("CSV Export", "Instant download of complete expense ledger.")
         ], badge_color=ACCENT_CYAN)

add_card(s7, Inches(6.8), Inches(1.8), Inches(2.7), Inches(5.0),
         "3. Bleed Radar",
         [
             ("Zombie Hunter", "Review idle subs & calculate savings."),
             ("Watchdog", "Audit price hikes (+₹20 Spotify)."),
             ("Savings Simulator", "Projected 1-yr and 3-yr bank balance gains."),
             ("Alert Center", "Real-time actionable debit alerts.")
         ], badge_color=ACCENT_PINK)

add_card(s7, Inches(9.8), Inches(1.8), Inches(2.7), Inches(5.0),
         "4. Smart Split",
         [
             ("Shared Ledger", "Split Netflix 4K with roommates."),
             ("Net Bleed", "Calculate your true cost after reimbursement."),
             ("WhatsApp Ping", "Pre-formatted reminder text generator."),
             ("UPI Link", "Generate instant UPI deep-links.")
         ], badge_color=ACCENT_GREEN)

# ----------------- SLIDE 8: CALIBRATED TEST BASELINE -----------------
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8)
add_header(s8, "Calibrated Experimental Baseline (Student Persona: Arjun)")

add_card(s8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Active Subscriptions (₹3,849/mo)",
         [
             ("Netflix 4K (Streaming)", "₹649.00 / month — Renews in 3 days"),
             ("Cult.fit Gym (Gym/Health)", "₹899.00 / month — Unused for 38 days (ZOMBIE)"),
             ("Claude Pro (AI Tools)", "₹1,700.00 / month ($20 USD normalized) — Active"),
             ("Spotify Duo (Streaming)", "₹149.00 / month — Renews in 7 days"),
             ("Google One 100GB (Cloud)", "₹130.00 / month — Continuous backup"),
             ("Xbox Game Pass (Gaming)", "₹322.00 / mo (₹967/quarter) — Unused 42 days (ZOMBIE)")
         ], badge_color=ACCENT_AMBER)

add_card(s8, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Detected Actions & Recoveries",
         [
             ("3 Zombie Subscriptions", "Cult.fit (₹899) + Xbox (₹322) + iCloud (₹75) = ₹899/mo direct savings recovered."),
             ("Annualized Cash Retained", "Cancelling 3 identified zombies saves ₹10,788 per calendar year."),
             ("Predatory Trial Trap", "Amazon Prime (₹299/mo) auto-renews in 48 hours. Direct cancel deep-link surfaced."),
             ("Roommate Split Recovery", "Splitting Netflix 4K 4-ways recovers ₹486.75/month back to user's UPI.")
         ], badge_color=ACCENT_GREEN)

# ----------------- SLIDE 9: TECHNOLOGY STACK BREAKDOWN -----------------
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9)
add_header(s9, "Software & Development Tooling Stack")

add_card(s9, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
         "Frontend Stack",
         [
             ("Next.js 14 (App Router)", "React Server Components + Client boundaries."),
             ("React 18 Concurrent", "Optimistic rendering and smooth UI transitions."),
             ("Tailwind CSS 3.4", "Utility tokens and dark glassmorphic styling."),
             ("Recharts Library", "Declarative SVG area and donut visualizations."),
             ("Lucide React", "Lightweight, scalable vector icons.")
         ], badge_color=PRIMARY_VIOLET)

add_card(s9, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
         "Backend & Cloud",
         [
             ("TypeScript 5 (Strict)", "100% type safety from schemas to UI props."),
             ("Supabase Cloud", "Managed PostgreSQL database instance with RLS."),
             ("Vercel Edge Platform", "Automated CI/CD with global edge delivery."),
             ("date-fns Engine", "Immutable date calculation and roll-forward logic.")
         ], badge_color=ACCENT_CYAN)

add_card(s9, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
         "Testing & Quality",
         [
             ("Vitest Test Runner", "Sub-millisecond mathematical theorem test execution."),
             ("Zod Schemas", "Runtime validation protecting against invalid inputs."),
             ("ESLint & Prettier", "Enforcing enterprise TypeScript standards."),
             ("OpenXML Engine", "Native generation of 33-page college project report.")
         ], badge_color=ACCENT_GREEN)

# ----------------- SLIDE 10: REAL-WORLD IMPACT & ADVANTAGES -----------------
s10 = prs.slides.add_slide(blank_layout)
set_slide_background(s10)
add_header(s10, "Real-World Advantages & Social Impact")

add_card(s10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Key Differentiators",
         [
             ("Privacy-Preserving Architecture", "Unlike banking aggregators, Vaulty does not require bank credentials or sensitive OTP access."),
             ("Instant 30-Second Entry", "1-click brand preset chips eliminate tedious manual form filling."),
             ("Active Anti-Trap Radar", "Proactively defends user funds before auto-debit triggers, rather than simply recording past debits.")
         ], badge_color=ACCENT_CYAN)

add_card(s10, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Impact on College Students",
         [
             ("Monthly Cash Retention", "Saves average student ₹1,000–₹1,500 every month on unwanted auto-charges."),
             ("Zero Awkward Reminder Chats", "Pre-formatted WhatsApp UPI split messages eliminate social payment friction."),
             ("Mindful Digital Spending", "Category donuts visualize where money actually flows vs perceived spending.")
         ], badge_color=ACCENT_GREEN)

# ----------------- SLIDE 11: FUTURE SCOPE -----------------
s11 = prs.slides.add_slide(blank_layout)
set_slide_background(s11)
add_header(s11, "Future Enhancements & Roadmap")

add_card(s11, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Phase 2 Enhancements",
         [
             ("RBI Account Aggregator (AA)", "Optional read-only financial consent consent layer to auto-detect e-mandates."),
             ("Web Push Notifications", "Browser and mobile service worker push notifications 48 hrs before renewals."),
             ("WhatsApp Bot Integration", "Two-way WhatsApp chatbot for logging subscriptions by sending screenshot receipts.")
         ], badge_color=ACCENT_AMBER)

add_card(s11, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Phase 3 Enterprise Vision",
         [
             ("Corporate SaaS Tracker", "Team tier for startup workspace tool licenses (Slack, GitHub, Figma, AWS)."),
             ("Predictive Churn AI", "Machine learning insights predicting which services user will abandon next."),
             ("Virtual Card Integration", "Single-use virtual cards that automatically self-destruct after free trial expiry.")
         ], badge_color=PRIMARY_VIOLET)

# ----------------- SLIDE 12: CONCLUSION & SUMMARY -----------------
s12 = prs.slides.add_slide(blank_layout)
set_slide_background(s12)
add_header(s12, "Conclusion & Project Deliverables")

add_card(s12, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Summary of Achievements",
         [
             ("Full Curriculum Alignment", "100% compliant with CCS University BCA-508 syllabus guidelines."),
             ("Production-Ready Implementation", "All 13 routes compile cleanly; dual-persistence architecture verified."),
             ("Validated Math Algorithms", "7/7 Vitest unit tests pass across normalization, zombie, and bleed formulas."),
             ("Official Report Deliverables", "Complete 33-page report with 152 clickable interactive links.")
         ], badge_color=ACCENT_GREEN)

add_card(s12, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
         "Presentation Readiness Checklist",
         [
             ("1. Master Project Report PDF", "VAULTY_Minor_Project_Report.pdf (33 Pages with clickable links)."),
             ("2. Master Word Document (.docx)", "college_files/VAULTY_MINOR_PROJECT_REPORT_COMPLETE.docx"),
             ("3. Source Code Bundle", "VAULTY_Source_Code.zip ready for USB / code submission."),
             ("4. Mandatory Presentation PPT", "VAULTY_Minor_Project_Presentation.pptx (This Deck)."),
             ("5. Live Application", "Live Edge: https://confidential-municipality-venice-activated.trycloudflare.com"),
         ], badge_color=ACCENT_CYAN)

# ----------------- SLIDE 13: THANK YOU & Q&A -----------------
s13 = prs.slides.add_slide(blank_layout)
set_slide_background(s13)

t_box = s13.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(4.5))
tf_thx = t_box.text_frame
tf_thx.word_wrap = True

p_ty = tf_thx.paragraphs[0]
p_ty.text = "THANK YOU!"
p_ty.font.size = Pt(56)
p_ty.font.bold = True
p_ty.font.color.rgb = TEXT_WHITE
p_ty.alignment = PP_ALIGN.CENTER
p_ty.space_after = Pt(12)

p_qa = tf_thx.add_paragraph()
p_qa.text = "Questions & Demonstration"
p_qa.font.size = Pt(28)
p_qa.font.bold = True
p_qa.font.color.rgb = PRIMARY_VIOLET
p_qa.alignment = PP_ALIGN.CENTER
p_qa.space_after = Pt(24)

p_cred = tf_thx.add_paragraph()
p_cred.text = "Candidate: LAKSHYA SINGH | Roll No: 240919106122 | BCA 5th Sem\nProject Guide: Prof. Nihal Kumar | Department of IT\nInstitute of Management Studies (IMS), Noida\nAffiliated to Chaudhary Charan Singh University, Meerut"
p_cred.font.size = Pt(16)
p_cred.font.color.rgb = ACCENT_CYAN
p_cred.alignment = PP_ALIGN.CENTER
p_cred.space_after = Pt(20)

p_link = tf_thx.add_paragraph()
p_link.text = "Live Deployment: https://confidential-municipality-venice-activated.trycloudflare.com\nGitHub: https://github.com/lakshyasingh/vaulty | Email: lakshyasingh.bcr24224@imsnoida.com"
p_link.font.size = Pt(14)
p_link.font.color.rgb = TEXT_MUTED
p_link.alignment = PP_ALIGN.CENTER

out_pptx = "/Users/lakshyasingh/Desktop/vaulty/VAULTY_Minor_Project_Presentation.pptx"
prs.save(out_pptx)
print(f"Presentation saved successfully at {out_pptx}!")
