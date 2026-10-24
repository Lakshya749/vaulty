import os, sys, html, subprocess

code_files = [
    ("lib/calc.ts", "Core Mathematical Engine & Billing Normalization Algorithms"),
    ("tests/calc.test.ts", "Vitest Mathematical Theorem Verification Suite (7/7 Passed)"),
    ("lib/seed.ts", "Calibrated Seed Baseline Dataset (Persona: Arjun ₹3,849/mo)"),
    ("lib/presets.ts", "Indian Brand Presets & Quick Entry Configurations"),
    ("app/page.tsx", "Production Landing Page Interface"),
    ("app/(app)/dashboard/page.tsx", "Bento Grid Financial Analytics Dashboard"),
    ("app/(app)/vault/page.tsx", "Subscription Vault Ledger & Filtering Engine"),
    ("app/(app)/radar/page.tsx", "Bleed Radar & Expense Intelligence Interface"),
    ("app/(app)/split/page.tsx", "Smart Split Cost-Sharing & WhatsApp / UPI Integration"),
    ("supabase/schema.sql", "PostgreSQL Relational Schema with Row-Level Security (RLS)"),
]

html_parts = []
html_parts.append("""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>VAULTY — Complete Source Code Listing</title>
<style>
  @page {
    size: A4;
    margin: 15mm 15mm 15mm 15mm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 8.5pt;
    line-height: 1.35;
    color: #111;
    background: #fff;
    margin: 0;
  }
  .cover-page {
    height: 265mm;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .file-section {
    page-break-after: always;
  }
  .file-header {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .file-title {
    font-size: 11pt;
    font-weight: bold;
    color: #0f172a;
  }
  .file-desc {
    font-size: 9pt;
    color: #475569;
  }
  pre {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
</head>
<body>
""")

# Cover Page
html_parts.append("""
<div class="cover-page">
  <div style="font-size: 14pt; font-weight: bold; color: #64748b; letter-spacing: 2px; margin-bottom: 15px;">
    CHAUDHARY CHARAN SINGH UNIVERSITY, MEERUT • BCA-508
  </div>
  <div style="font-size: 32pt; font-weight: 900; color: #0f172a; margin-bottom: 10px;">
    VAULTY
  </div>
  <div style="font-size: 16pt; font-weight: bold; color: #4338ca; margin-bottom: 25px;">
    Complete Source Code Implementation & Test Suites
  </div>
  <div style="border: 2px solid #0f172a; border-radius: 10px; padding: 20px 30px; text-align: left; max-width: 500px; margin: 0 auto; font-size: 11pt; line-height: 1.8;">
    <b>Project Title:</b> VAULTY — Subscription & Renewal Management<br>
    <b>Subject:</b> BCA Minor Project (BCA-508)<br>
    <b>Candidate:</b> LAKSHYA SINGH<br>
    <b>Roll Number:</b> 240919106122<br>
    <b>Course:</b> BCA 5th Semester (2024–2027)<br>
    <b>Guide:</b> Prof. Nihal Kumar<br>
    <b>Institution:</b> IMS Noida (Affiliated to CCSU Meerut)
  </div>
</div>
""")

# Code Sections
for file_rel, desc in code_files:
    full_path = os.path.join("/Users/lakshyasingh/Desktop/vaulty", file_rel)
    if os.path.exists(full_path):
        with open(full_path, "r", encoding="utf-8") as f:
            code_text = f.read()
        
        esc_code = html.escape(code_text)
        html_parts.append(f"""
<div class="file-section">
  <div class="file-header">
    <div class="file-title">File: {file_rel}</div>
    <div class="file-desc">{desc}</div>
  </div>
  <pre><code>{esc_code}</code></pre>
</div>
""")

html_parts.append("</body></html>")

out_html = "/Users/lakshyasingh/Desktop/vaulty/college_files/code_listing.html"
with open(out_html, "w", encoding="utf-8") as f:
    f.write("".join(html_parts))

out_pdf = "/Users/lakshyasingh/Desktop/vaulty/college_files/VAULTY_Complete_Source_Code_Listing.pdf"
cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    f"--print-to-pdf={out_pdf}",
    f"file://{out_html}"
]
subprocess.run(cmd, check=True)
print(f"Code PDF generated at {out_pdf} ({os.path.getsize(out_pdf)} bytes)")
