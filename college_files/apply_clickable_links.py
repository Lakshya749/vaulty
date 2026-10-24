import re

with open("college_files/generate_html_report.py", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add CSS styles
css_insertion = """  a.toc-link {
    color: #000;
    text-decoration: none;
    display: inline-block;
    width: 100%;
  }
  a.toc-link:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
  a.ext-link {
    color: #1d4ed8;
    text-decoration: underline;
    word-break: break-all;
  }
  a.ext-link:hover {
    color: #0b379b;
  }
"""

if "a.toc-link" not in code:
    code = code.replace("  hr.divider {", css_insertion + "  hr.divider {")

# 2. Page 1: Cover Page Links
page1_old = """      <div class="sig-block" style="text-align: right;">
        <b>SUBMITTED BY</b><br><br>
        <b>LAKSHYA SINGH</b><br>
        Roll No: 240919106122<br>
        BCA (2024–2027)<br>
        IMS NOIDA
      </div>"""

page1_new = """      <div class="sig-block" style="text-align: right;">
        <b>SUBMITTED BY</b><br><br>
        <b>LAKSHYA SINGH</b><br>
        Roll No: 240919106122<br>
        BCA (2024–2027)<br>
        IMS NOIDA<br>
        <span style="font-size:10pt;"><a href="mailto:lakshyasingh.bcr24224@imsnoida.com" class="ext-link">lakshyasingh.bcr24224@imsnoida.com</a></span>
      </div>"""
code = code.replace(page1_old, page1_new)

# Add GitHub and Live App footer on Cover Page
if "Project Repository:" not in code:
    cover_footer_old = """    </div>
  </div>
</div>

<!-- PAGE 2: PROFORMA -->"""
    cover_footer_new = """    </div>
    <div style="text-align:center; font-size:10pt; border-top:1px dashed #aaa; padding-top:8px; margin-top:20px;">
      <b>Project Repository:</b> <a href="https://github.com/Lakshya749/vaulty" target="_blank" class="ext-link">https://github.com/Lakshya749/vaulty</a> &nbsp;|&nbsp;
      <b>Live Application:</b> <a href="https://vaulty-lac.vercel.app" target="_blank" class="ext-link">https://vaulty-lac.vercel.app</a>
    </div>
  </div>
</div>

<!-- PAGE 2: PROFORMA -->"""
    code = code.replace(cover_footer_old, cover_footer_new)

# 3. Page 2: Proforma Links
page2_old = """    <div class="form-row"><b>Roll no.:</b> 240919106122</div>
    <div class="form-row"><b>Name of the Student:</b> Lakshya Singh</div>
    <div class="form-row"><b>E-mail:</b> lakshyasingh.bcr24224@imsnoida.com</div>
    <div class="form-row"><b>Mob. No:</b> +91 9891112062</div>
    <div class="form-row"><b>Title of the MINOR Project:</b> VAULTY: SUBSCRIPTION AND RENEWAL MANAGEMENT SYSTEM</div>
    <div class="form-row"><b>Name of the Guide:</b> Prof. Nihal Kumar</div>"""

page2_new = """    <div class="form-row"><b>Roll no.:</b> 240919106122</div>
    <div class="form-row"><b>Name of the Student:</b> Lakshya Singh</div>
    <div class="form-row"><b>E-mail:</b> <a href="mailto:lakshyasingh.bcr24224@imsnoida.com" class="ext-link">lakshyasingh.bcr24224@imsnoida.com</a></div>
    <div class="form-row"><b>Mob. No:</b> <a href="tel:+919891112062" style="color:inherit; text-decoration:none;">+91 9891112062</a></div>
    <div class="form-row"><b>Title of the MINOR Project:</b> VAULTY: SUBSCRIPTION AND RENEWAL MANAGEMENT SYSTEM</div>
    <div class="form-row"><b>GitHub Source Code:</b> <a href="https://github.com/Lakshya749/vaulty" target="_blank" class="ext-link">https://github.com/Lakshya749/vaulty</a></div>
    <div class="form-row"><b>Live Web Application:</b> <a href="https://vaulty-lac.vercel.app" target="_blank" class="ext-link">https://vaulty-lac.vercel.app</a> (or <a href="http://localhost:3000" target="_blank" class="ext-link">http://localhost:3000</a>)</div>
    <div class="form-row"><b>Name of the Guide:</b> Prof. Nihal Kumar</div>"""
code = code.replace(page2_old, page2_new)

# 4. Front matter headings with IDs
code = code.replace('<div class="chapter-heading" style="margin-top:20px;">ACKNOWLEDGEMENT</div>', '<div class="chapter-heading" id="ack" style="margin-top:20px;">ACKNOWLEDGEMENT</div>')
code = code.replace('<div class="chapter-heading" style="margin-top:20px;">CERTIFICATE OF ORIGINALITY</div>', '<div class="chapter-heading" id="cert" style="margin-top:20px;">CERTIFICATE OF ORIGINALITY</div>')
code = code.replace('<div class="chapter-heading" style="margin-top:20px;">CERTIFICATE OF TECHNICAL TRAINING</div>', '<div class="chapter-heading" id="training" style="margin-top:20px;">CERTIFICATE OF TECHNICAL TRAINING</div>')
code = code.replace('<div class="chapter-heading" style="margin-top:15px;">TABLE OF CONTENTS</div>', '<div class="chapter-heading" id="toc" style="margin-top:15px;">TABLE OF CONTENTS</div>')
code = code.replace('<div class="chapter-heading" style="margin-top:15px;">TABLE OF CONTENTS (CONTINUED)</div>', '<div class="chapter-heading" id="toc2" style="margin-top:15px;">TABLE OF CONTENTS (CONTINUED)</div>')
code = code.replace('<div class="chapter-heading" style="margin-top:15px;">LIST OF FIGURES</div>', '<div class="chapter-heading" id="figures" style="margin-top:15px;">LIST OF FIGURES</div>')

# 5. Chapter headings with IDs
code = code.replace('<div class="chapter-heading">CHAPTER 1: INTRODUCTION</div>', '<div class="chapter-heading" id="ch1">CHAPTER 1: INTRODUCTION</div>')
code = code.replace('<div class="chapter-heading">CHAPTER 2: LITERATURE REVIEW</div>', '<div class="chapter-heading" id="ch2">CHAPTER 2: LITERATURE REVIEW</div>')
code = code.replace('<div class="chapter-heading">CHAPTER 3: DESIGN OF PROJECT MODEL</div>', '<div class="chapter-heading" id="ch3">CHAPTER 3: DESIGN OF PROJECT MODEL</div>')
code = code.replace('<div class="chapter-heading">CHAPTER 4: EXPERIMENTS, SIMULATION & TESTING</div>', '<div class="chapter-heading" id="ch4">CHAPTER 4: EXPERIMENTS, SIMULATION & TESTING</div>')
code = code.replace('<div class="chapter-heading">CHAPTER 5: WEB APPLICATION</div>', '<div class="chapter-heading" id="ch5">CHAPTER 5: WEB APPLICATION</div>')
code = code.replace('<div class="chapter-heading">CHAPTER 6: DATABASE MANAGEMENT</div>', '<div class="chapter-heading" id="ch6">CHAPTER 6: DATABASE MANAGEMENT</div>')
code = code.replace('<div class="chapter-heading">CHAPTER 7: RESULTS AND EVALUATION</div>', '<div class="chapter-heading" id="ch7">CHAPTER 7: RESULTS AND EVALUATION</div>')
code = code.replace('<div class="chapter-heading">CHAPTER 8: SOFTWARE AND TOOLS USED</div>', '<div class="chapter-heading" id="ch8">CHAPTER 8: SOFTWARE AND TOOLS USED</div>')
code = code.replace('<div class="chapter-heading">REFERENCES & BIBLIOGRAPHY</div>', '<div class="chapter-heading" id="ref">REFERENCES & BIBLIOGRAPHY</div>')
code = code.replace('<div class="chapter-heading">REFERENCES & BIBLIOGRAPHY (CONTINUED)</div>', '<div class="chapter-heading" id="ref2">REFERENCES & BIBLIOGRAPHY (CONTINUED)</div>')

# 6. Section headings with IDs
sections = [
    ("1.1 Introduction", "sec1-1"),
    ("1.2 Advantage", "sec1-2"),
    ("1.3 Objectives of the Project", "sec1-3"),
    ("1.4 Scope of the Project", "sec1-4"),
    ("1.5 Applications", "sec1-5"),
    ("1.6 Conclusion", "sec1-6"),
    ("2.1 Evolution of Subscription and Recurring Expense Tracking", "sec2-1"),
    ("2.2 Shift Towards User-Centric Spend Intelligence Systems", "sec2-2"),
    ("2.3 Role of Modern Web Technologies and Client-Side Computation", "sec2-3"),
    ("2.4 Comparative Analysis of Existing Solutions", "sec2-4"),
    ("3.1 System Design", "sec3-1"),
    ("3.2 Architecture of the Proposed System", "sec3-2"),
    ("3.3 Working of the System", "sec3-3"),
    ("3.4 Tools and Technologies Used", "sec3-4"),
    ("3.5 Expected Output", "sec3-5"),
    ("4.1 Experimental Setup", "sec4-1"),
    ("4.2 Simulation Process & Test Datasets", "sec4-2"),
    ("4.3 Testing of the System (Unit & Boundary Tests)", "sec4-3"),
    ("4.4 Results and Observations", "sec4-4"),
    ("4.5 Conclusion", "sec4-5"),
    ("5.1 Introduction", "sec5-1"),
    ("5.2 Web Application Overview", "sec5-2"),
    ("5.3 Key Features", "sec5-3"),
    ("5.4 Technologies Used", "sec5-4"),
    ("5.5 Subscription Tracking & Alert Process", "sec5-5"),
    ("5.6 Real-World Application", "sec5-6"),
    ("6.1 Introduction", "sec6-1"),
    ("6.2 Database Design & Schema Architecture", "sec6-2"),
    ("6.3 Subscription & Alert Records Management", "sec6-3"),
    ("6.4 Database Operations (CRUD & Triggers)", "sec6-4"),
    ("6.5 Advantages of Database Integration with Row Level Security", "sec6-5"),
    ("7.1 Introduction", "sec7-1"),
    ("7.2 Subscription Spend Detection Results", "sec7-2"),
    ("7.3 Alert & Zombie Detection Results", "sec7-3"),
    ("7.4 System Performance & Benchmark Metrics", "sec7-4"),
    ("7.5 Benefits Achieved", "sec7-5"),
    ("8.1 Frontend Framework and Styling Environment", "sec8-1"),
    ("8.2 Backend, Authentication and Database Tools", "sec8-2"),
    ("8.3 Testing, Linting and Build Tools", "sec8-3"),
]

for title, s_id in sections:
    target = f'<div class="section-heading">{title}</div>'
    replacement = f'<div class="section-heading" id="{s_id}">{title}</div>'
    code = code.replace(target, replacement)

# 7. Figure captions with IDs
figures = [
    ("Figure 3.1: High-Level System Architecture of Vaulty", "fig3-1"),
    ("Figure 3.2: 3-Tier Layered Architecture Flowchart", "fig3-2"),
    ("Figure 3.3: Context-Level Data Flow Diagram (DFD Level 0 & Level 1)", "fig3-3"),
    ("Figure 5.1: Vaulty Main Dashboard (Bento Grid Layout)", "fig5-1"),
    ("Figure 5.2: Sub Vault Interface (Search, Filter Pills & Table View)", "fig5-2"),
    ("Figure 5.3: Subscription Creation Modal with Quick Brand Presets", "fig5-3"),
    ("Figure 5.4: Bleed Radar & Expense Intelligence Interface", "fig5-4"),
    ("Figure 6.1: Entity-Relationship (ER) Diagram of the Database", "fig6-1"),
    ("Figure 7.1: Monthly Spend Trajectory (Burn Rate Flow Area Chart)", "fig7-1"),
    ("Figure 7.2: Category Spend Distribution (Donut Chart Visualization)", "fig7-2"),
]

for title, f_id in figures:
    target = f'<div class="fig-caption">{title}</div>'
    replacement = f'<div class="fig-caption" id="{f_id}">{title}</div>'
    code = code.replace(target, replacement)

# 8. Interactive links callout in Chapter 5
ch5_callout = """    <div style="border:1.5px solid #2563eb; background:#f0f7ff; padding:10px 14px; border-radius:6px; margin:12px 0; font-size:11pt; line-height:1.5;">
      <b>Interactive Project Links:</b><br>
      &bull; <b>Live Web App Deployment:</b> <a href="https://vaulty-lac.vercel.app" target="_blank" class="ext-link">https://vaulty-lac.vercel.app</a><br>
      &bull; <b>GitHub Source Code Repository:</b> <a href="https://github.com/Lakshya749/vaulty" target="_blank" class="ext-link">https://github.com/Lakshya749/vaulty</a>
    </div>"""

if "Interactive Project Links:" not in code:
    code = code.replace('<div class="section-heading" id="sec5-2">5.2 Web Application Overview</div>', ch5_callout + '\n\n    <div class="section-heading" id="sec5-2">5.2 Web Application Overview</div>')

# 9. Table of Contents Links (Page 6 & 7)
toc_p1_old = """      <tbody>
        <tr><td><b>ACKNOWLEDGEMENT</b></td><td style="text-align:center;"><b>3</b></td></tr>
        <tr><td><b>CERTIFICATE OF ORIGINALITY</b></td><td style="text-align:center;"><b>4–5</b></td></tr>
        <tr><td><b>LIST OF FIGURES</b></td><td style="text-align:center;"><b>8</b></td></tr>
        <tr><td><b>CHAPTER 1: INTRODUCTION</b></td><td style="text-align:center;"><b>9–10</b></td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;1.1 Introduction</td><td style="text-align:center;">9</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;1.2 Advantage</td><td style="text-align:center;">9</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;1.3 Objectives of the Project</td><td style="text-align:center;">10</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;1.4 Scope of the Project</td><td style="text-align:center;">10</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;1.5 Applications</td><td style="text-align:center;">10</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;1.6 Conclusion</td><td style="text-align:center;">10</td></tr>
        <tr><td><b>CHAPTER 2: LITERATURE REVIEW</b></td><td style="text-align:center;"><b>11–13</b></td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;2.1 Evolution of Subscription and Recurring Expense Tracking</td><td style="text-align:center;">11</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;2.2 Shift Towards User-Centric Spend Intelligence Systems</td><td style="text-align:center;">12</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;2.3 Role of Modern Web Technologies and Client-Side Computation</td><td style="text-align:center;">12</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;2.4 Comparative Analysis of Existing Solutions</td><td style="text-align:center;">13</td></tr>
        <tr><td><b>CHAPTER 3: DESIGN OF PROJECT MODEL</b></td><td style="text-align:center;"><b>14–18</b></td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;3.1 System Design</td><td style="text-align:center;">14</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;3.2 Architecture of the Proposed System</td><td style="text-align:center;">15</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;3.3 Working of the System</td><td style="text-align:center;">16</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;3.4 Tools and Technologies Used</td><td style="text-align:center;">17</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;3.5 Expected Output</td><td style="text-align:center;">18</td></tr>
      </tbody>"""

toc_p1_new = """      <tbody>
        <tr><td><a href="#ack" class="toc-link"><b>ACKNOWLEDGEMENT</b></a></td><td style="text-align:center;"><a href="#ack" class="toc-link"><b>3</b></a></td></tr>
        <tr><td><a href="#cert" class="toc-link"><b>CERTIFICATE OF ORIGINALITY</b></a></td><td style="text-align:center;"><a href="#cert" class="toc-link"><b>4–5</b></a></td></tr>
        <tr><td><a href="#figures" class="toc-link"><b>LIST OF FIGURES</b></a></td><td style="text-align:center;"><a href="#figures" class="toc-link"><b>8</b></a></td></tr>
        <tr><td><a href="#ch1" class="toc-link"><b>CHAPTER 1: INTRODUCTION</b></a></td><td style="text-align:center;"><a href="#ch1" class="toc-link"><b>9–10</b></a></td></tr>
        <tr><td><a href="#sec1-1" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;1.1 Introduction</a></td><td style="text-align:center;"><a href="#sec1-1" class="toc-link">9</a></td></tr>
        <tr><td><a href="#sec1-2" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;1.2 Advantage</a></td><td style="text-align:center;"><a href="#sec1-2" class="toc-link">9</a></td></tr>
        <tr><td><a href="#sec1-3" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;1.3 Objectives of the Project</a></td><td style="text-align:center;"><a href="#sec1-3" class="toc-link">10</a></td></tr>
        <tr><td><a href="#sec1-4" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;1.4 Scope of the Project</a></td><td style="text-align:center;"><a href="#sec1-4" class="toc-link">10</a></td></tr>
        <tr><td><a href="#sec1-5" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;1.5 Applications</a></td><td style="text-align:center;"><a href="#sec1-5" class="toc-link">10</a></td></tr>
        <tr><td><a href="#sec1-6" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;1.6 Conclusion</a></td><td style="text-align:center;"><a href="#sec1-6" class="toc-link">10</a></td></tr>
        <tr><td><a href="#ch2" class="toc-link"><b>CHAPTER 2: LITERATURE REVIEW</b></a></td><td style="text-align:center;"><a href="#ch2" class="toc-link"><b>11–13</b></a></td></tr>
        <tr><td><a href="#sec2-1" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;2.1 Evolution of Subscription and Recurring Expense Tracking</a></td><td style="text-align:center;"><a href="#sec2-1" class="toc-link">11</a></td></tr>
        <tr><td><a href="#sec2-2" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;2.2 Shift Towards User-Centric Spend Intelligence Systems</a></td><td style="text-align:center;"><a href="#sec2-2" class="toc-link">12</a></td></tr>
        <tr><td><a href="#sec2-3" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;2.3 Role of Modern Web Technologies and Client-Side Computation</a></td><td style="text-align:center;"><a href="#sec2-3" class="toc-link">12</a></td></tr>
        <tr><td><a href="#sec2-4" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;2.4 Comparative Analysis of Existing Solutions</a></td><td style="text-align:center;"><a href="#sec2-4" class="toc-link">13</a></td></tr>
        <tr><td><a href="#ch3" class="toc-link"><b>CHAPTER 3: DESIGN OF PROJECT MODEL</b></a></td><td style="text-align:center;"><a href="#ch3" class="toc-link"><b>14–18</b></a></td></tr>
        <tr><td><a href="#sec3-1" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;3.1 System Design</a></td><td style="text-align:center;"><a href="#sec3-1" class="toc-link">14</a></td></tr>
        <tr><td><a href="#sec3-2" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;3.2 Architecture of the Proposed System</a></td><td style="text-align:center;"><a href="#sec3-2" class="toc-link">15</a></td></tr>
        <tr><td><a href="#sec3-3" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;3.3 Working of the System</a></td><td style="text-align:center;"><a href="#sec3-3" class="toc-link">16</a></td></tr>
        <tr><td><a href="#sec3-4" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;3.4 Tools and Technologies Used</a></td><td style="text-align:center;"><a href="#sec3-4" class="toc-link">17</a></td></tr>
        <tr><td><a href="#sec3-5" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;3.5 Expected Output</a></td><td style="text-align:center;"><a href="#sec3-5" class="toc-link">18</a></td></tr>
      </tbody>"""
code = code.replace(toc_p1_old, toc_p1_new)

toc_p2_old = """      <tbody>
        <tr><td><b>CHAPTER 4: EXPERIMENTS, SIMULATION & TESTING</b></td><td style="text-align:center;"><b>19–20</b></td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;4.1 Experimental Setup</td><td style="text-align:center;">19</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;4.2 Simulation Process & Test Datasets</td><td style="text-align:center;">19</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;4.3 Testing of the System (Unit & Boundary Tests)</td><td style="text-align:center;">20</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;4.4 Results and Observations</td><td style="text-align:center;">20</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;4.5 Conclusion</td><td style="text-align:center;">20</td></tr>
        <tr><td><b>CHAPTER 5: WEB APPLICATION</b></td><td style="text-align:center;"><b>21–23</b></td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;5.1 Introduction</td><td style="text-align:center;">21</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;5.2 Web Application Overview</td><td style="text-align:center;">21</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;5.3 Key Features (Bento Grid, Vault, Preset Chips)</td><td style="text-align:center;">22</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;5.4 Technologies Used</td><td style="text-align:center;">22</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;5.5 Subscription Tracking & Alert Process</td><td style="text-align:center;">23</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;5.6 Real-World Application</td><td style="text-align:center;">23</td></tr>
        <tr><td><b>CHAPTER 6: DATABASE MANAGEMENT</b></td><td style="text-align:center;"><b>24–25</b></td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;6.1 Introduction</td><td style="text-align:center;">24</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;6.2 Database Design & Schema Architecture</td><td style="text-align:center;">24</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;6.3 Subscription & Alert Records Management</td><td style="text-align:center;">25</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;6.4 Database Operations (CRUD & Triggers)</td><td style="text-align:center;">25</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;6.5 Advantages of Database Integration with Row Level Security</td><td style="text-align:center;">25</td></tr>
        <tr><td><b>CHAPTER 7: RESULTS AND EVALUATION</b></td><td style="text-align:center;"><b>26–28</b></td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;7.1 Introduction</td><td style="text-align:center;">26</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;7.2 Subscription Spend Detection Results</td><td style="text-align:center;">26</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;7.3 Alert & Zombie Detection Results</td><td style="text-align:center;">27</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;7.4 System Performance & Benchmark Metrics</td><td style="text-align:center;">27</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;7.5 Benefits Achieved</td><td style="text-align:center;">28</td></tr>
        <tr><td><b>CHAPTER 8: SOFTWARE AND TOOLS USED</b></td><td style="text-align:center;"><b>29–31</b></td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;8.1 Frontend Framework and Styling Environment</td><td style="text-align:center;">29</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;8.2 Backend, Authentication and Database Tools</td><td style="text-align:center;">30</td></tr>
        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;8.3 Testing, Linting and Build Tools</td><td style="text-align:center;">31</td></tr>
        <tr><td><b>REFERENCES</b></td><td style="text-align:center;"><b>32–33</b></td></tr>
      </tbody>"""

toc_p2_new = """      <tbody>
        <tr><td><a href="#ch4" class="toc-link"><b>CHAPTER 4: EXPERIMENTS, SIMULATION & TESTING</b></a></td><td style="text-align:center;"><a href="#ch4" class="toc-link"><b>19–20</b></a></td></tr>
        <tr><td><a href="#sec4-1" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;4.1 Experimental Setup</a></td><td style="text-align:center;"><a href="#sec4-1" class="toc-link">19</a></td></tr>
        <tr><td><a href="#sec4-2" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;4.2 Simulation Process & Test Datasets</a></td><td style="text-align:center;"><a href="#sec4-2" class="toc-link">19</a></td></tr>
        <tr><td><a href="#sec4-3" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;4.3 Testing of the System (Unit & Boundary Tests)</a></td><td style="text-align:center;"><a href="#sec4-3" class="toc-link">20</a></td></tr>
        <tr><td><a href="#sec4-4" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;4.4 Results and Observations</a></td><td style="text-align:center;"><a href="#sec4-4" class="toc-link">20</a></td></tr>
        <tr><td><a href="#sec4-5" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;4.5 Conclusion</a></td><td style="text-align:center;"><a href="#sec4-5" class="toc-link">20</a></td></tr>
        <tr><td><a href="#ch5" class="toc-link"><b>CHAPTER 5: WEB APPLICATION</b></a></td><td style="text-align:center;"><a href="#ch5" class="toc-link"><b>21–23</b></a></td></tr>
        <tr><td><a href="#sec5-1" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;5.1 Introduction</a></td><td style="text-align:center;"><a href="#sec5-1" class="toc-link">21</a></td></tr>
        <tr><td><a href="#sec5-2" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;5.2 Web Application Overview</a></td><td style="text-align:center;"><a href="#sec5-2" class="toc-link">21</a></td></tr>
        <tr><td><a href="#sec5-3" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;5.3 Key Features (Bento Grid, Vault, Preset Chips)</a></td><td style="text-align:center;"><a href="#sec5-3" class="toc-link">22</a></td></tr>
        <tr><td><a href="#sec5-4" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;5.4 Technologies Used</a></td><td style="text-align:center;"><a href="#sec5-4" class="toc-link">22</a></td></tr>
        <tr><td><a href="#sec5-5" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;5.5 Subscription Tracking & Alert Process</a></td><td style="text-align:center;"><a href="#sec5-5" class="toc-link">23</a></td></tr>
        <tr><td><a href="#sec5-6" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;5.6 Real-World Application</a></td><td style="text-align:center;"><a href="#sec5-6" class="toc-link">23</a></td></tr>
        <tr><td><a href="#ch6" class="toc-link"><b>CHAPTER 6: DATABASE MANAGEMENT</b></a></td><td style="text-align:center;"><a href="#ch6" class="toc-link"><b>24–25</b></a></td></tr>
        <tr><td><a href="#sec6-1" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;6.1 Introduction</a></td><td style="text-align:center;"><a href="#sec6-1" class="toc-link">24</a></td></tr>
        <tr><td><a href="#sec6-2" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;6.2 Database Design & Schema Architecture</a></td><td style="text-align:center;"><a href="#sec6-2" class="toc-link">24</a></td></tr>
        <tr><td><a href="#sec6-3" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;6.3 Subscription & Alert Records Management</a></td><td style="text-align:center;"><a href="#sec6-3" class="toc-link">25</a></td></tr>
        <tr><td><a href="#sec6-4" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;6.4 Database Operations (CRUD & Triggers)</a></td><td style="text-align:center;"><a href="#sec6-4" class="toc-link">25</a></td></tr>
        <tr><td><a href="#sec6-5" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;6.5 Advantages of Database Integration with Row Level Security</a></td><td style="text-align:center;"><a href="#sec6-5" class="toc-link">25</a></td></tr>
        <tr><td><a href="#ch7" class="toc-link"><b>CHAPTER 7: RESULTS AND EVALUATION</b></a></td><td style="text-align:center;"><a href="#ch7" class="toc-link"><b>26–28</b></a></td></tr>
        <tr><td><a href="#sec7-1" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;7.1 Introduction</a></td><td style="text-align:center;"><a href="#sec7-1" class="toc-link">26</a></td></tr>
        <tr><td><a href="#sec7-2" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;7.2 Subscription Spend Detection Results</a></td><td style="text-align:center;"><a href="#sec7-2" class="toc-link">26</a></td></tr>
        <tr><td><a href="#sec7-3" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;7.3 Alert & Zombie Detection Results</a></td><td style="text-align:center;"><a href="#sec7-3" class="toc-link">27</a></td></tr>
        <tr><td><a href="#sec7-4" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;7.4 System Performance & Benchmark Metrics</a></td><td style="text-align:center;"><a href="#sec7-4" class="toc-link">27</a></td></tr>
        <tr><td><a href="#sec7-5" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;7.5 Benefits Achieved</a></td><td style="text-align:center;"><a href="#sec7-5" class="toc-link">28</a></td></tr>
        <tr><td><a href="#ch8" class="toc-link"><b>CHAPTER 8: SOFTWARE AND TOOLS USED</b></a></td><td style="text-align:center;"><a href="#ch8" class="toc-link"><b>29–31</b></a></td></tr>
        <tr><td><a href="#sec8-1" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;8.1 Frontend Framework and Styling Environment</a></td><td style="text-align:center;"><a href="#sec8-1" class="toc-link">29</a></td></tr>
        <tr><td><a href="#sec8-2" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;8.2 Backend, Authentication and Database Tools</a></td><td style="text-align:center;"><a href="#sec8-2" class="toc-link">30</a></td></tr>
        <tr><td><a href="#sec8-3" class="toc-link">&nbsp;&nbsp;&nbsp;&nbsp;8.3 Testing, Linting and Build Tools</a></td><td style="text-align:center;"><a href="#sec8-3" class="toc-link">31</a></td></tr>
        <tr><td><a href="#ref" class="toc-link"><b>REFERENCES</b></a></td><td style="text-align:center;"><a href="#ref" class="toc-link"><b>32–33</b></a></td></tr>
      </tbody>"""
code = code.replace(toc_p2_old, toc_p2_new)

# 10. List of Figures Links (Page 8)
figures_old = """      <tbody>
        <tr><td style="text-align:center;"><b>Figure 3.1</b></td><td>High-Level System Architecture of Vaulty</td><td style="text-align:center;">15</td></tr>
        <tr><td style="text-align:center;"><b>Figure 3.2</b></td><td>3-Tier Layered Architecture Flowchart</td><td style="text-align:center;">15</td></tr>
        <tr><td style="text-align:center;"><b>Figure 3.3</b></td><td>Context-Level Data Flow Diagram (DFD Level 0 & Level 1)</td><td style="text-align:center;">16</td></tr>
        <tr><td style="text-align:center;"><b>Figure 5.1</b></td><td>Vaulty Main Dashboard (Bento Grid Layout)</td><td style="text-align:center;">21</td></tr>
        <tr><td style="text-align:center;"><b>Figure 5.2</b></td><td>Sub Vault Interface (Search, Filter Pills & Table View)</td><td style="text-align:center;">22</td></tr>
        <tr><td style="text-align:center;"><b>Figure 5.3</b></td><td>Subscription Creation Modal with Quick Brand Presets</td><td style="text-align:center;">22</td></tr>
        <tr><td style="text-align:center;"><b>Figure 5.4</b></td><td>Bleed Radar & Expense Intelligence Interface</td><td style="text-align:center;">23</td></tr>
        <tr><td style="text-align:center;"><b>Figure 6.1</b></td><td>Entity-Relationship (ER) Diagram of the Database</td><td style="text-align:center;">24</td></tr>
        <tr><td style="text-align:center;"><b>Figure 7.1</b></td><td>Monthly Spend Trajectory (Burn Rate Flow Area Chart)</td><td style="text-align:center;">26</td></tr>
        <tr><td style="text-align:center;"><b>Figure 7.2</b></td><td>Category Spend Distribution (Donut Chart Visualization)</td><td style="text-align:center;">27</td></tr>
      </tbody>"""

figures_new = """      <tbody>
        <tr><td style="text-align:center;"><a href="#fig3-1" class="toc-link"><b>Figure 3.1</b></a></td><td><a href="#fig3-1" class="toc-link">High-Level System Architecture of Vaulty</a></td><td style="text-align:center;"><a href="#fig3-1" class="toc-link">15</a></td></tr>
        <tr><td style="text-align:center;"><a href="#fig3-2" class="toc-link"><b>Figure 3.2</b></a></td><td><a href="#fig3-2" class="toc-link">3-Tier Layered Architecture Flowchart</a></td><td style="text-align:center;"><a href="#fig3-2" class="toc-link">15</a></td></tr>
        <tr><td style="text-align:center;"><a href="#fig3-3" class="toc-link"><b>Figure 3.3</b></a></td><td><a href="#fig3-3" class="toc-link">Context-Level Data Flow Diagram (DFD Level 0 & Level 1)</a></td><td style="text-align:center;"><a href="#fig3-3" class="toc-link">16</a></td></tr>
        <tr><td style="text-align:center;"><a href="#fig5-1" class="toc-link"><b>Figure 5.1</b></a></td><td><a href="#fig5-1" class="toc-link">Vaulty Main Dashboard (Bento Grid Layout)</a></td><td style="text-align:center;"><a href="#fig5-1" class="toc-link">21</a></td></tr>
        <tr><td style="text-align:center;"><a href="#fig5-2" class="toc-link"><b>Figure 5.2</b></a></td><td><a href="#fig5-2" class="toc-link">Sub Vault Interface (Search, Filter Pills & Table View)</a></td><td style="text-align:center;"><a href="#fig5-2" class="toc-link">22</a></td></tr>
        <tr><td style="text-align:center;"><a href="#fig5-3" class="toc-link"><b>Figure 5.3</b></a></td><td><a href="#fig5-3" class="toc-link">Subscription Creation Modal with Quick Brand Presets</a></td><td style="text-align:center;"><a href="#fig5-3" class="toc-link">22</a></td></tr>
        <tr><td style="text-align:center;"><a href="#fig5-4" class="toc-link"><b>Figure 5.4</b></a></td><td><a href="#fig5-4" class="toc-link">Bleed Radar & Expense Intelligence Interface</a></td><td style="text-align:center;"><a href="#fig5-4" class="toc-link">23</a></td></tr>
        <tr><td style="text-align:center;"><a href="#fig6-1" class="toc-link"><b>Figure 6.1</b></a></td><td><a href="#fig6-1" class="toc-link">Entity-Relationship (ER) Diagram of the Database</a></td><td style="text-align:center;"><a href="#fig6-1" class="toc-link">24</a></td></tr>
        <tr><td style="text-align:center;"><a href="#fig7-1" class="toc-link"><b>Figure 7.1</b></a></td><td><a href="#fig7-1" class="toc-link">Monthly Spend Trajectory (Burn Rate Flow Area Chart)</a></td><td style="text-align:center;"><a href="#fig7-1" class="toc-link">26</a></td></tr>
        <tr><td style="text-align:center;"><a href="#fig7-2" class="toc-link"><b>Figure 7.2</b></a></td><td><a href="#fig7-2" class="toc-link">Category Spend Distribution (Donut Chart Visualization)</a></td><td style="text-align:center;"><a href="#fig7-2" class="toc-link">27</a></td></tr>
      </tbody>"""
code = code.replace(figures_old, figures_new)

# 11. References URLs
ref_urls = [
    ("<code>https://nextjs.org/docs</code>", '<a href="https://nextjs.org/docs" target="_blank" class="ext-link">https://nextjs.org/docs</a>'),
    ("<code>https://react.dev/reference/react</code>", '<a href="https://react.dev/reference/react" target="_blank" class="ext-link">https://react.dev/reference/react</a>'),
    ("<code>https://www.postgresql.org/docs/current/ddl-rowsecurity.html</code>", '<a href="https://www.postgresql.org/docs/current/ddl-rowsecurity.html" target="_blank" class="ext-link">https://www.postgresql.org/docs/current/ddl-rowsecurity.html</a>'),
    ("<code>https://supabase.com/docs</code>", '<a href="https://supabase.com/docs" target="_blank" class="ext-link">https://supabase.com/docs</a>'),
    ("<code>https://tailwindcss.com/docs</code>", '<a href="https://tailwindcss.com/docs" target="_blank" class="ext-link">https://tailwindcss.com/docs</a>'),
    ("<code>https://www.w3.org/TR/WCAG21/</code>", '<a href="https://www.w3.org/TR/WCAG21/" target="_blank" class="ext-link">https://www.w3.org/TR/WCAG21/</a>'),
    ("<code>https://www.typescriptlang.org/docs/</code>", '<a href="https://www.typescriptlang.org/docs/" target="_blank" class="ext-link">https://www.typescriptlang.org/docs/</a>'),
    ("<code>https://date-fns.org/docs/Getting-Started</code>", '<a href="https://date-fns.org/docs/Getting-Started" target="_blank" class="ext-link">https://date-fns.org/docs/Getting-Started</a>'),
    ("<code>https://recharts.org/en-US/api</code>", '<a href="https://recharts.org/en-US/api" target="_blank" class="ext-link">https://recharts.org/en-US/api</a>'),
    ("<code>https://zod.dev</code>", '<a href="https://zod.dev" target="_blank" class="ext-link">https://zod.dev</a>'),
]

for old_url, new_url in ref_urls:
    code = code.replace(old_url, new_url)

with open("college_files/generate_html_report.py", "w", encoding="utf-8") as f:
    f.write(code)

print("generate_html_report.py updated successfully!")
