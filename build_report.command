#!/bin/bash
cd "$(dirname "$0")"

echo "=================================================="
echo "⚡ Compiling VAULTY Minor Project Report (BCA-508)"
echo "Candidate: Lakshya Singh | Roll No: 240919106122"
echo "College: IMS Noida (CCSU)"
echo "=================================================="

echo "1. Generating Master HTML report with interactive anchors..."
python3 college_files/generate_html_report.py

echo "2. Compiling 33-Page Master PDF via headless Chrome engine..."
if [ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-sandbox --disable-gpu --print-to-pdf="$(pwd)/VAULTY_Minor_Project_Report.pdf" "file://$(pwd)/college_files/VAULTY_MINOR_PROJECT_REPORT_COMPLETE.html"
  cp "$(pwd)/VAULTY_Minor_Project_Report.pdf" "$(pwd)/college_files/VAULTY_MINOR_PROJECT_REPORT_COMPLETE.pdf"
  echo "✅ Master PDF compiled successfully: VAULTY_Minor_Project_Report.pdf"
else
  echo "⚠️ Google Chrome not found at /Applications/Google Chrome.app. HTML report generated at college_files/VAULTY_MINOR_PROJECT_REPORT_COMPLETE.html"
fi

echo "3. Generating Master Microsoft Word (.docx) document..."
python3 college_files/build_full_docx_reports.py
echo "✅ Master DOCX compiled at college_files/VAULTY_MINOR_PROJECT_REPORT_COMPLETE.docx"

echo "=================================================="
echo "🎉 Compilation Complete! Opening Master PDF..."
echo "=================================================="
open "$(pwd)/VAULTY_Minor_Project_Report.pdf"
