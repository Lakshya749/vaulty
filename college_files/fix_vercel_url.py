import os, re

files_to_update = [
    "README.md",
    "college_files/02_Proforma.md",
    "college_files/generate_html_report.py",
    "college_files/build_full_docx_reports.py",
]

for file_path in files_to_update:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace vaulty-lac.vercel.app with http://localhost:3000
        new_content = content.replace("https://vaulty-lac.vercel.app", "http://localhost:3000")
        new_content = new_content.replace(" (or <a href=\"http://localhost:3000\" target=\"_blank\" class=\"ext-link\">http://localhost:3000</a>)", "")
        new_content = new_content.replace(" (or http://localhost:3000)", "")
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file_path}")

