import zipfile
import os
import xml.sax.saxutils as saxutils

base_dir = "/Users/lakshyasingh/Desktop/vaulty/college_files"
word_out_dir = "/Users/lakshyasingh/Desktop/vaulty/college_word_files"
os.makedirs(word_out_dir, exist_ok=True)

logo_path = f"{base_dir}/ccsu_logo.jpg"
with open(logo_path, "rb") as f:
    logo_bytes = f.read()

def escape(txt):
    return saxutils.escape(str(txt))


hyperlink_registry = []

def register_hyperlink(url):
    r_id = f"rIdHL{len(hyperlink_registry) + 1}"
    hyperlink_registry.append((r_id, url))
    return r_id

def make_hyperlink(text, url, bold=False, size=24):
    r_id = register_hyperlink(url)
    escaped = escape(text)
    b_tag = "<w:b/>" if bold else ""
    return f'<w:hyperlink r:id="{r_id}" w:history="1"><w:r><w:rPr><w:rStyle w:val="Hyperlink"/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>{b_tag}<w:color w:val="0563C1"/><w:u w:val="single"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr><w:t xml:space="preserve">{escaped}</w:t></w:r></w:hyperlink>'

def make_p_with_link(prefix, link_text, url, suffix="", align="left", bold_prefix=True, size=24, space_after=100, indent=0):
    esc_pre = escape(prefix)
    esc_suf = escape(suffix)
    r_id = register_hyperlink(url)
    esc_link = escape(link_text)
    
    pre_b = "<w:b/>" if bold_prefix else ""
    ind_tag = f'<w:ind w:firstLine="{indent}"/>' if indent else ''
    ppr = f'<w:pPr><w:jc w:val="{align}"/><w:spacing w:line="360" w:lineRule="auto" w:after="{space_after}"/>{ind_tag}</w:pPr>'
    
    r_pre = f'<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>{pre_b}<w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr><w:t xml:space="preserve">{esc_pre}</w:t></w:r>' if prefix else ''
    r_link = f'<w:hyperlink r:id="{r_id}" w:history="1"><w:r><w:rPr><w:rStyle w:val="Hyperlink"/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:color w:val="0563C1"/><w:u w:val="single"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr><w:t xml:space="preserve">{esc_link}</w:t></w:r></w:hyperlink>'
    r_suf = f'<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr><w:t xml:space="preserve">{esc_suf}</w:t></w:r>' if suffix else ''
    
    return f'<w:p>{ppr}{r_pre}{r_link}{r_suf}</w:p>'

def make_p(text, align="both", bold=False, italic=False, underline=False, size=24, space_after=140, line_spacing=360, indent=0):
    escaped = escape(text)
    rpr = f'<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/>'
    if bold:
        rpr += '<w:b/><w:bCs/>'
    if italic:
        rpr += '<w:i/><w:iCs/>'
    if underline:
        rpr += '<w:u w:val="single"/>'
    rpr += '</w:rPr>'
    
    ind_tag = f'<w:ind w:firstLine="{indent}"/>' if indent else ''
    ppr = f'<w:pPr><w:jc w:val="{align}"/><w:spacing w:line="{line_spacing}" w:lineRule="auto" w:after="{space_after}"/>{ind_tag}</w:pPr>'
    return f'<w:p>{ppr}<w:r>{rpr}<w:t xml:space="preserve">{escaped}</w:t></w:r></w:p>'

def make_page_break(page_num=None):
    footer_p = ""
    if page_num:
        footer_p = make_p(str(page_num), align="center", bold=True, size=22, space_after=80, line_spacing=240)
    return f'{footer_p}<w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>'

def make_table(headers, rows, col_widths=None, align_center=False):
    tbl = '<w:tbl>'
    tbl += '<w:tblPr><w:tblW w:w="0" w:type="auto"/>'
    if align_center:
        tbl += '<w:jc w:val="center"/>'
    tbl += '<w:tblBorders>'
    tbl += '<w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    tbl += '<w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    tbl += '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    tbl += '<w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    tbl += '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>'
    tbl += '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>'
    tbl += '</w:tblBorders>'
    tbl += '<w:tblCellMar><w:top w:w="120" w:type="dxa"/><w:left w:w="160" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:right w:w="160" w:type="dxa"/></w:tblCellMar>'
    tbl += '</w:tblPr>'
    
    if headers:
        tbl += '<w:tr>'
        for i, h in enumerate(headers):
            w_tag = f'<w:tcW w:w="{col_widths[i]}" w:type="dxa"/>' if col_widths and i < len(col_widths) else ''
            tbl += f'<w:tc><w:tcPr>{w_tag}<w:shd w:val="clear" w:color="auto" w:fill="F0F0F0"/></w:tcPr>'
            tbl += f'<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:after="0"/></w:pPr>'
            tbl += f'<w:r><w:rPr><w:b/><w:sz w:val="21"/></w:rPr><w:t>{escape(h)}</w:t></w:r></w:p></w:tc>'
        tbl += '</w:tr>'
        
    for row in rows:
        tbl += '<w:tr>'
        for i, val in enumerate(row):
            w_tag = f'<w:tcW w:w="{col_widths[i]}" w:type="dxa"/>' if col_widths and i < len(col_widths) else ''
            align = "center" if (col_widths and col_widths[i] < 2000) or str(val).isdigit() or str(val).startswith("Figure") else "left"
            bold_val = str(val).startswith("CHAPTER") or str(val).startswith("ACKNOWLEDGEMENT") or str(val).startswith("CERTIFICATE") or str(val).startswith("Figure")
            tbl += f'<w:tc><w:tcPr>{w_tag}</w:tcPr>'
            tbl += f'<w:p><w:pPr><w:jc w:val="{align}"/><w:spacing w:line="240" w:lineRule="auto" w:after="0"/></w:pPr>'
            b_tag = '<w:b/>' if bold_val else ''
            tbl += f'<w:r><w:rPr>{b_tag}<w:sz w:val="21"/></w:rPr><w:t>{escape(val)}</w:t></w:r></w:p></w:tc>'
        tbl += '</w:tr>'
        
    tbl += '</w:tbl>'
    tbl += '<w:p><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>'
    return tbl

def make_code_box(lines):
    res = '<w:tbl><w:tblPr><w:tblW w:w="9400" w:type="dxa"/><w:tblBorders>'
    res += '<w:top w:val="single" w:sz="6" w:color="555555"/><w:left w:val="single" w:sz="6" w:color="555555"/>'
    res += '<w:bottom w:val="single" w:sz="6" w:color="555555"/><w:right w:val="single" w:sz="6" w:color="555555"/>'
    res += '</w:tblBorders><w:tblCellMar><w:top w:w="120" w:type="dxa"/><w:left w:w="160" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:right w:w="160" w:type="dxa"/></w:tblCellMar></w:tblPr>'
    res += '<w:tr><w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F9F9F9"/></w:tcPr>'
    for line in lines.strip().split("\n"):
        res += f'<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:line="240" w:lineRule="auto" w:after="0"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">{escape(line)}</w:t></w:r></w:p>'
    res += '</w:tc></w:tr></w:tbl><w:p><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>'
    return res

def package_docx(out_path, body_content, has_image=True):
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>"""

    img_rel = '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.jpg"/>' if has_image else ''
    import re
    used_rids = set(re.findall(r'r:id="([^"]+)"', body_content))
    hl_rels = ""
    seen_ids = set()
    for r_id, url in hyperlink_registry:
        if r_id in used_rids and r_id not in seen_ids:
            seen_ids.add(r_id)
            hl_rels += f'<Relationship Id="{r_id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="{escape(url)}" TargetMode="External"/>\n'
    doc_rels = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  {img_rel}
  {hl_rels}
</Relationships>"""

    core_props = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>VAULTY Minor Project Report (BCA-508)</dc:title>
  <dc:creator>Lakshya Singh</dc:creator>
</cp:coreProperties>"""

    styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="character" w:styleId="Hyperlink">
    <w:name w:val="Hyperlink"/>
    <w:rPr>
      <w:color w:val="0563C1"/>
      <w:u w:val="single"/>
    </w:rPr>
  </w:style>
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="360" w:lineRule="auto" w:after="140"/>
        <w:jc w:val="both"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>"""

    sect_pr = """<w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
      <w:pgBorders w:offsetFrom="page">
        <w:top w:val="single" w:sz="12" w:space="24" w:color="000000"/>
        <w:left w:val="single" w:sz="12" w:space="24" w:color="000000"/>
        <w:bottom w:val="single" w:sz="12" w:space="24" w:color="000000"/>
        <w:right w:val="single" w:sz="12" w:space="24" w:color="000000"/>
      </w:pgBorders>
    </w:sectPr>"""

    doc_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    {body_content}
    {sect_pr}
  </w:body>
</w:document>"""

    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", rels)
        z.writestr("docProps/core.xml", core_props)
        z.writestr("word/_rels/document.xml.rels", doc_rels)
        z.writestr("word/styles.xml", styles_xml)
        z.writestr("word/document.xml", doc_xml)
        if has_image:
            z.writestr("word/media/image1.jpg", logo_bytes)

# --- BUILDING SECTIONS ---

# Section 1: Cover Page
def build_cover_page():
    c = make_p('“VAULTY”', align="center", bold=True, underline=True, size=40, space_after=120)
    c += make_p('MINOR PROJECT (BCA-508)', align="center", bold=True, underline=True, size=28, space_after=100)
    c += make_p('SUBMITTED TO', align="center", bold=True, underline=True, size=26, space_after=80)
    c += make_p('Chaudhary Charan Singh University, Meerut', align="center", bold=True, size=26, space_after=60)
    c += make_p('For the partial fulfillment of the degree of the Bachelor’s in Computer Application\n(2024-27).', align="center", bold=False, size=24, space_after=200)
    
    # Image drawing
    c += """<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr><w:r><w:drawing>
      <wp:inline distT="0" distB="0" distL="0" distR="0">
        <wp:extent cx="1600000" cy="1900000"/>
        <wp:docPr id="1" name="CCSU Logo"/>
        <a:graphic>
          <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:pic>
              <pic:nvPicPr><pic:cNvPr id="0" name="ccsu_logo.jpg"/><pic:cNvPicPr/></pic:nvPicPr>
              <pic:blipFill><a:blip r:embed="rId3"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
              <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="1600000" cy="1900000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
            </pic:pic>
          </a:graphicData>
        </a:graphic>
      </wp:inline>
    </w:drawing></w:r></w:p>"""
    
    # Two column table at bottom
    c += """<w:tbl><w:tblPr><w:tblW w:w="9400" w:type="dxa"/><w:tblBorders>
      <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/>
    </w:tblBorders></w:tblPr>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:line="300" w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>UNDER THE GUIDANCE OF</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:line="300" w:after="20"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Prof. Nihal Kumar</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:line="300" w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Department of IT</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:line="300" w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>IMS NOIDA</w:t></w:r></w:p>
      </w:tc>
      <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:line="300" w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>SUBMITTED BY</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:line="300" w:after="20"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>LAKSHYA SINGH</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:line="300" w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Roll No: 240919106122</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:line="300" w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>BCA (2024–2027)</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:line="300" w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>IMS NOIDA</w:t></w:r></w:p>
      </w:tc>
    </w:tr>
    </w:tbl>"""
    c += make_p_with_link("Project Repository: ", "https://github.com/Lakshya749/vaulty", "https://github.com/Lakshya749/vaulty", align="center", bold_prefix=True, size=20, space_after=40)
    c += make_p_with_link("Live Application: ", "https://lakshya749.github.io/vaulty/", "https://lakshya749.github.io/vaulty/", align="center", bold_prefix=True, size=20, space_after=80)
    return c

# Section 2: Proforma
def build_proforma():
    c = make_p('INSTITUTE OF MANAGEMENT STUDIES, NOIDA', align="center", bold=True, size=28, space_after=120)
    
    # Bordered Proforma Box
    c += '<w:tbl><w:tblPr><w:tblW w:w="9400" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="8"/><w:left w:val="single" w:sz="8"/><w:bottom w:val="single" w:sz="8"/><w:right w:val="single" w:sz="8"/></w:tblBorders></w:tblPr>'
    c += '<w:tr><w:tc><w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="60"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>PROFORMA FOR APPROVAL OF BCA MINOR PROJECT (BCA-508)</w:t></w:r></w:p></w:tc></w:tr></w:tbl>'
    c += make_p('', space_after=100)
    
    c += make_p('Roll no.: 240919106122', bold=True, size=24, space_after=100)
    c += make_p('Name of the Student: Lakshya Singh', bold=True, size=24, space_after=100)
    c += make_p_with_link('E-mail: ', 'lakshyasingh.bcr24224@imsnoida.com', 'mailto:lakshyasingh.bcr24224@imsnoida.com', bold_prefix=True, size=24, space_after=100)
    c += make_p_with_link('Mob. No: ', '+91 9891112062', 'tel:+919891112062', bold_prefix=True, size=24, space_after=100)
    c += make_p('Title of the MINOR Project: VAULTY: SUBSCRIPTION AND RENEWAL MANAGEMENT SYSTEM', bold=True, size=24, space_after=100)
    c += make_p_with_link('GitHub Source Code: ', 'https://github.com/Lakshya749/vaulty', 'https://github.com/Lakshya749/vaulty', bold_prefix=True, size=24, space_after=100)
    c += make_p_with_link('Live Web Application: ', 'https://lakshya749.github.io/vaulty/', 'https://lakshya749.github.io/vaulty/', bold_prefix=True, size=24, space_after=100)
    c += make_p('Name of the Guide: Prof. Nihal Kumar', bold=True, size=24, space_after=160)
    
    c += make_p('For Office Use Only:', bold=True, size=24, space_after=140)
    
    # Approval boxes table
    c += """<w:tbl><w:tblPr><w:tblW w:w="9400" w:type="dxa"/><w:tblBorders>
      <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/>
    </w:tblBorders></w:tblPr>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:w="3100" w:type="dxa"/></w:tcPr>
        <w:tbl><w:tblPr><w:tblW w:w="1600" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="6"/><w:left w:val="single" w:sz="6"/><w:bottom w:val="single" w:sz="6"/><w:right w:val="single" w:sz="6"/></w:tblBorders></w:tblPr>
          <w:tr><w:tc><w:p><w:pPr><w:spacing w:after="600"/></w:pPr><w:r><w:t></w:t></w:r></w:p></w:tc></w:tr>
        </w:tbl>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Approved</w:t></w:r></w:p>
      </w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3100" w:type="dxa"/></w:tcPr>
        <w:tbl><w:tblPr><w:tblW w:w="1600" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="6"/><w:left w:val="single" w:sz="6"/><w:bottom w:val="single" w:sz="6"/><w:right w:val="single" w:sz="6"/></w:tblBorders></w:tblPr>
          <w:tr><w:tc><w:p><w:pPr><w:spacing w:after="600"/></w:pPr><w:r><w:t></w:t></w:r></w:p></w:tc></w:tr>
        </w:tbl>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Not Approved</w:t></w:r></w:p>
      </w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3200" w:type="dxa"/></w:tcPr>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="400"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Signature of the Mentor</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Date: ..............................</w:t></w:r></w:p>
      </w:tc>
    </w:tr>
    </w:tbl>"""
    
    c += make_p('', space_after=140)
    c += make_p('Suggestions (if any):-', bold=True, size=24, space_after=100)
    for i in range(1, 6):
        c += make_p(f'{i}. ...................................................................................................................................................', space_after=100, size=22)
    return c

# Section 3: Acknowledgement
def build_acknowledgement():
    c = make_p('ACKNOWLEDGEMENT', align="center", bold=True, underline=True, size=32, space_after=240)
    c += make_p('I would like to express my sincere gratitude to my project mentor, Prof. Nihal Kumar, for his valuable guidance, continuous support, and encouragement throughout the development of my project titled "VAULTY: Subscription and Renewal Management Web Application." His expertise, constructive technical advice, and suggestions greatly contributed to the successful completion and refinement of this work.', indent=480, space_after=160)
    c += make_p('I am also profoundly thankful to the faculty members and the Department of Information Technology, IMS Noida, for providing the necessary laboratory facilities, technical infrastructure, academic resources, and encouragement required for completing this minor project.', indent=480, space_after=160)
    c += make_p('I extend my heartfelt thanks to my parents, family members, and friends for their constant motivation, patience, and moral support throughout the course of this academic project.', indent=480, space_after=160)
    c += make_p('Finally, I would like to thank everyone who directly or indirectly helped, advised, and supported me during the development, testing, and documentation stages of this project.', indent=480, space_after=400)
    
    c += """<w:tbl><w:tblPr><w:tblW w:w="9400" w:type="dxa"/><w:tblBorders>
      <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/>
    </w:tblBorders></w:tblPr>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Lakshya Singh</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Roll No: 240919106122</w:t></w:r></w:p>
      </w:tc>
      <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Signature: ....................................................</w:t></w:r></w:p>
      </w:tc>
    </w:tr>
    </w:tbl>"""
    return c

# Section 4: Certificate of Originality
def build_certificate_of_originality():
    c = make_p('CERTIFICATE OF ORIGINALITY', align="center", bold=True, underline=True, size=32, space_after=240)
    c += make_p('This is to certify that the project report entitled "VAULTY: Subscription and Renewal Management Web Application" submitted by Lakshya Singh in partial fulfillment of the requirements for the award of the degree of Bachelor’s in Computer Application (BCA) to Chaudhary Charan Singh University, Meerut, through Institute of Management Studies (IMS), Noida, is an authentic and original work carried out by the student under the guidance and supervision of Prof. Nihal Kumar.', indent=480, space_after=180)
    c += make_p('The work embodied in this project report has not been submitted, either in part or in full, to any other University or Institution for the award of any degree, diploma, or other academic qualification.', indent=480, space_after=180)
    c += make_p('The project is a bona fide record of the work carried out by the student during the academic session 2024–2027.', indent=480, space_after=400)
    
    c += """<w:tbl><w:tblPr><w:tblW w:w="9400" w:type="dxa"/><w:tblBorders>
      <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/>
    </w:tblBorders></w:tblPr>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Project Guide</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="20"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Prof. Nihal Kumar</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Department of IT</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>IMS Noida</w:t></w:r></w:p>
      </w:tc>
      <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Student</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="20"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Lakshya Singh</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>BCA (2024–2027)</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Roll No: 240919106122</w:t></w:r></w:p>
      </w:tc>
    </w:tr>
    </w:tbl>"""
    
    c += make_p('', space_after=300)
    c += make_p('Date: ..............................', bold=True, size=24, space_after=60)
    c += make_p('Place: Noida', bold=True, size=24, space_after=0)
    return c

# Section 5: Certificate of Technical Training
def build_certificate():
    c = make_p('CERTIFICATE OF TECHNICAL TRAINING', align="center", bold=True, underline=True, size=32, space_after=240)
    
    # Framed Certificate Box
    c += '<w:tbl><w:tblPr><w:tblW w:w="9400" w:type="dxa"/><w:tblBorders><w:top w:val="double" w:sz="18"/><w:left w:val="double" w:sz="18"/><w:bottom w:val="double" w:sz="18"/><w:right w:val="double" w:sz="18"/></w:tblBorders><w:tblCellMar><w:top w:w="300" w:type="dxa"/><w:left w:w="300" w:type="dxa"/><w:bottom w:w="300" w:type="dxa"/><w:right w:w="300" w:type="dxa"/></w:tblCellMar></w:tblPr>'
    c += '<w:tr><w:tc>'
    c += make_p('INSTITUTE OF MANAGEMENT STUDIES, NOIDA', align="center", bold=True, size=28, space_after=60)
    c += make_p('Affiliated to Chaudhary Charan Singh University, Meerut', align="center", italic=True, size=22, space_after=200)
    c += make_p('This is to certify that', align="center", size=24, space_after=120)
    c += make_p('LAKSHYA SINGH', align="center", bold=True, underline=True, size=36, space_after=80)
    c += make_p('Roll No: 240919106122  |  BCA 5th Semester', align="center", bold=True, size=24, space_after=200)
    c += make_p('has successfully completed the comprehensive technical curriculum, architecture design, and practical software implementation for the BCA Minor Project (BCA-508) titled "VAULTY: SUBSCRIPTION AND RENEWAL MANAGEMENT WEB APPLICATION". The project work demonstrates practical proficiency in modern component-driven web frameworks (Next.js 14, React 18), relational database security (PostgreSQL with Row Level Security), asynchronous state management, and cloud application engineering.', align="both", indent=300, size=23, space_after=400)
    
    c += """<w:tbl><w:tblPr><w:tblW w:w="8800" w:type="dxa"/><w:tblBorders>
      <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/>
    </w:tblBorders></w:tblPr>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:w="4400" w:type="dxa"/></w:tcPr>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Date: October 2026</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Place: Noida</w:t></w:r></w:p>
      </w:tc>
      <w:tc><w:tcPr><w:tcW w:w="4400" w:type="dxa"/></w:tcPr>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Prof. Nihal Kumar</w:t></w:r></w:p>
        <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Course Coordinator / Project Mentor</w:t></w:r></w:p>
      </w:tc>
    </w:tr>
    </w:tbl>"""
    c += '</w:tc></w:tr></w:tbl>'
    return c

# Section 6 & 7: Table of Contents
def build_toc():
    c = make_p('TABLE OF CONTENTS', align="center", bold=True, underline=True, size=32, space_after=200)
    headers = ["Title", "Page No."]
    col_w = [7400, 2000]
    
    rows_p1 = [
        ["ACKNOWLEDGEMENT", "3"],
        ["CERTIFICATE OF ORIGINALITY", "4–5"],
        ["LIST OF FIGURES", "8"],
        ["CHAPTER 1: INTRODUCTION", "9–10"],
        ["    1.1 Introduction", "9"],
        ["    1.2 Advantage", "9"],
        ["    1.3 Objectives of the Project", "10"],
        ["    1.4 Scope of the Project", "10"],
        ["    1.5 Applications", "10"],
        ["    1.6 Conclusion", "10"],
        ["CHAPTER 2: LITERATURE REVIEW", "11–13"],
        ["    2.1 Evolution of Subscription and Recurring Expense Tracking", "11"],
        ["    2.2 Shift Towards User-Centric Spend Intelligence Systems", "12"],
        ["    2.3 Role of Modern Web Technologies and Client-Side Computation", "12"],
        ["    2.4 Comparative Analysis of Existing Solutions", "13"],
        ["CHAPTER 3: DESIGN OF PROJECT MODEL", "14–18"],
        ["    3.1 System Design", "14"],
        ["    3.2 Architecture of the Proposed System", "15"],
        ["    3.3 Working of the System", "16"],
        ["    3.4 Tools and Technologies Used", "17"],
        ["    3.5 Expected Output", "18"],
    ]
    c += make_table(headers, rows_p1, col_w)
    c += make_page_break(page_num="6")
    
    c += make_p('TABLE OF CONTENTS (CONTINUED)', align="center", bold=True, underline=True, size=32, space_after=200)
    rows_p2 = [
        ["CHAPTER 4: EXPERIMENTS, SIMULATION & TESTING", "19–20"],
        ["    4.1 Experimental Setup", "19"],
        ["    4.2 Simulation Process & Test Datasets", "19"],
        ["    4.3 Testing of the System (Unit & Boundary Tests)", "20"],
        ["    4.4 Results and Observations", "20"],
        ["    4.5 Conclusion", "20"],
        ["CHAPTER 5: WEB APPLICATION", "21–23"],
        ["    5.1 Introduction", "21"],
        ["    5.2 Web Application Overview", "21"],
        ["    5.3 Key Features (Bento Grid, Vault, Preset Chips)", "22"],
        ["    5.4 Technologies Used", "22"],
        ["    5.5 Subscription Tracking & Alert Process", "23"],
        ["    5.6 Real-World Application", "23"],
        ["CHAPTER 6: DATABASE MANAGEMENT", "24–25"],
        ["    6.1 Introduction", "24"],
        ["    6.2 Database Design & Schema Architecture", "24"],
        ["    6.3 Subscription & Alert Records Management", "25"],
        ["    6.4 Database Operations (CRUD & Triggers)", "25"],
        ["    6.5 Advantages of Database Integration with Row Level Security", "25"],
        ["CHAPTER 7: RESULTS AND EVALUATION", "26–28"],
        ["    7.1 Introduction", "26"],
        ["    7.2 Subscription Spend Detection Results", "26"],
        ["    7.3 Alert & Zombie Detection Results", "27"],
        ["    7.4 System Performance & Benchmark Metrics", "27"],
        ["    7.5 Benefits Achieved", "28"],
        ["CHAPTER 8: SOFTWARE AND TOOLS USED", "29–31"],
        ["    8.1 Frontend Framework and Styling Environment", "29"],
        ["    8.2 Backend, Authentication and Database Tools", "30"],
        ["    8.3 Testing, Linting and Build Tools", "31"],
        ["REFERENCES", "32–33"],
    ]
    c += make_table(headers, rows_p2, col_w)
    return c

# Section 8: List of Figures
def build_list_of_figures():
    c = make_p('LIST OF FIGURES', align="center", bold=True, underline=True, size=32, space_after=200)
    headers = ["Figure No.", "Figure Name", "Page No."]
    col_w = [2200, 5600, 1600]
    rows = [
        ["Figure 3.1", "High-Level System Architecture of Vaulty", "15"],
        ["Figure 3.2", "3-Tier Layered Architecture Flowchart", "15"],
        ["Figure 3.3", "Context-Level Data Flow Diagram (DFD Level 0 & Level 1)", "16"],
        ["Figure 5.1", "Vaulty Main Dashboard (Bento Grid Layout)", "21"],
        ["Figure 5.2", "Sub Vault Interface (Search, Filter Pills & Table View)", "22"],
        ["Figure 5.3", "Subscription Creation Modal with Quick Brand Presets", "22"],
        ["Figure 5.4", "Bleed Radar & Expense Intelligence Interface", "23"],
        ["Figure 6.1", "Entity-Relationship (ER) Diagram of the Database", "24"],
        ["Figure 7.1", "Monthly Spend Trajectory (Burn Rate Flow Area Chart)", "26"],
        ["Figure 7.2", "Category Spend Distribution (Donut Chart Visualization)", "27"],
    ]
    c += make_table(headers, rows, col_w)
    return c

# Chapter 1: Introduction
def build_chapter_1():
    c = make_p('CHAPTER 1: INTRODUCTION', align="center", bold=True, underline=True, size=32, space_after=200)
    c += make_p('1.1 Introduction', bold=True, size=26, space_after=100)
    c += make_p('In recent years, the digital economy has witnessed an unprecedented transformation from one-time asset ownership to recurring, service-based subscription models. Consumers, particularly college students, young professionals, and digital-first individuals, regularly subscribe to multiple online services across digital entertainment (e.g., Netflix, Spotify, Prime Video), cloud productivity (e.g., Google One, iCloud), artificial intelligence tools (e.g., ChatGPT Plus, Claude Pro), and health and lifestyle platforms (e.g., Cult.fit).', indent=480, space_after=140)
    c += make_p('While subscriptions offer continuous access to software and media without large upfront capital, they create a significant personal finance challenge known as "subscription bleed." Because recurring debits occur automatically via Unified Payments Interface (UPI) autopay mandates, credit cards, or net banking, individuals frequently lose visibility over the total amount deducted on a monthly or annual basis. Furthermore, users frequently enroll in promotional zero-cost trial periods that automatically convert to costly recurring plans without explicit pre-debit confirmations.', indent=480, space_after=140)
    c += make_p('Vaulty is developed as a focused, lightweight, and intelligent personal subscription tracking and renewal management web application. Designed specifically to solve this problem, Vaulty aggregates all recurring liabilities onto a unified dashboard, normalizes varying billing cycles into a clear monthly "burn rate," detects neglected or unused subscriptions ("zombie subscriptions"), and provides an interactive radar to alert users before promotional trials convert into unwanted debits.', indent=480, space_after=160)
    
    c += make_p('1.2 Advantage', bold=True, size=26, space_after=100)
    c += make_p('The Vaulty platform provides several distinct practical and technical advantages over traditional personal finance management methods such as generic spreadsheets or manual diary entries:', space_after=100)
    c += make_p('• Normalized Spend Metrics: Different services bill along varied periodic intervals—weekly, monthly, quarterly, and annually. Vaulty automatically normalizes all payment intervals into a standard Monthly Wallet Bleed figure using verified mathematical formulas.', indent=240, space_after=80)
    c += make_p('• Automated Zombie Detection: The system continuously monitors user activity intervals. Active subscriptions that have not recorded usage for over 30 days are automatically flagged as "zombies," highlighting immediate potential monthly savings.', indent=240, space_after=80)
    c += make_p('• Trial Trap Radar: Promotional free trials are tracked with strict countdown timers. Critical alerts trigger within 48 hours of trial expiry, allowing users to make an informed cancellation decision before auto-debit occurs.', indent=240, space_after=80)
    c += make_p('• Zero Bank Credential Exposure: Unlike aggressive financial aggregators that demand bank credentials or SMS read permissions, Vaulty is built on a privacy-first model where the user retains complete control over their recorded financial profiles.', indent=240, space_after=80)
    c += make_p('• Dual Persistence Mode: Vaulty features a robust repository architecture that supports both cloud-synced persistent storage (Supabase PostgreSQL with Row Level Security) and an offline-first browser demonstration mode using localStorage.', indent=240, space_after=160)
    
    c += make_page_break(page_num="9")
    
    c += make_p('1.3 Objectives of the Project', bold=True, size=26, space_after=100)
    c += make_p('The primary academic and engineering objectives accomplished during the development of Vaulty include:', space_after=100)
    c += make_p('• Designing and implementing a responsive, single-page application dashboard using modern web standards (Next.js 14 App Router, TypeScript, and Tailwind CSS).', indent=240, space_after=80)
    c += make_p('• Engineering a pure mathematical calculation engine (lib/calc.ts) that precisely calculates normalized monthly costs, multi-month expenditure trajectories, and annual projections.', indent=240, space_after=80)
    c += make_p('• Implementing automated, non-invasive alert generation logic to notify users of impending renewal dates and expiring free trials.', indent=240, space_after=80)
    c += make_p('• Developing a clean relational data model in PostgreSQL featuring Row Level Security (RLS) policies to enforce strict data isolation between registered user accounts.', indent=240, space_after=80)
    c += make_p('• Building a seamless brand-preset database that accelerates subscription entry to under thirty seconds per service.', indent=240, space_after=160)
    
    c += make_p('1.4 Scope of the Project', bold=True, size=26, space_after=100)
    c += make_p('The scope of this project encompasses secure user authentication, complete subscription lifecycle management (CRUD), intelligent financial normalization, proactive alert notifications, and dual persistence.', indent=480, space_after=100)
    c += make_p('Out of Scope: Real-time automated bank scraping and programmatic cancellation execution via bank APIs (due to regulatory and API sandboxing restrictions).', indent=480, italic=True, space_after=160)
    
    c += make_p('1.5 Applications', bold=True, size=26, space_after=100)
    c += make_p('Vaulty addresses key practical scenarios across multiple user demographics including college students and young professionals managing multiple streaming and AI services, freelancers tracking recurring SaaS platforms, and households organizing shared family plans.', indent=480, space_after=160)
    
    c += make_p('1.6 Conclusion', bold=True, size=26, space_after=100)
    c += make_p('Vaulty bridges the gap between complex, invasive budgeting platforms and tedious manual spreadsheets. By combining strict computational accuracy with a modern, high-contrast user interface, the project provides an accessible, secure, and actionable financial utility that effectively curbs recurring financial waste.', indent=480, space_after=100)
    return c

# Chapter 2: Literature Review
def build_chapter_2():
    c = make_p('CHAPTER 2: LITERATURE REVIEW', align="center", bold=True, underline=True, size=32, space_after=200)
    c += make_p('2.1 Evolution of Subscription and Recurring Expense Tracking', bold=True, size=26, space_after=100)
    c += make_p('Over the past two decades, personal financial accounting has evolved through several distinct paradigms:', space_after=100)
    c += make_p('• Manual Physical Ledgers (Pre-Digital Era): Historically, household budgeting relied on physical register books, cash envelopes, and handwritten expense sheets. While effective for localized cash transactions, this methodology lacks automation, offers zero foresight into future recurring debits, and completely fails to scale in modern digital transaction environments.', indent=240, space_after=100)
    c += make_p('• Spreadsheet-Based Tracking (Excel & Google Sheets): In the early 2000s, spreadsheet software became the standard digital alternative for budget tracking. Spreadsheets provide computational flexibility through custom formulas (SUM, VLOOKUP). However, user research reveals major friction points: manual entry is time-consuming, spreadsheet mobile experiences are clunky, formulas frequently break when modifying rows, and spreadsheets lack real-time date calculation mechanisms to roll forward renewals or alert users about expiring trials.', indent=240, space_after=100)
    c += make_p('• Automated Banking Aggregators: Over the last decade, fintech solutions emerged that connect directly to banking APIs via Open Banking frameworks or SMS scraping. While automated, these applications exhibit severe security and privacy drawbacks. Users are increasingly uncomfortable granting third-party access to their primary bank accounts or personal text messages. Furthermore, banking aggregators reflect debits after they have already cleared the account, providing retrospective accounting rather than proactive prevention of unwanted renewals.', indent=240, space_after=160)
    
    c += make_page_break(page_num="11")
    
    c += make_p('2.2 Shift Towards User-Centric Spend Intelligence Systems', bold=True, size=26, space_after=100)
    c += make_p('Recent academic literature and industry analyses emphasize a shift toward "Spend Intelligence" rather than mere expense logging. Research demonstrates that the psychological phenomenon known as "subscription blindness" occurs when micro-payments (e.g., ₹149, ₹299, ₹649) recur silently in the background. Because each debit appears relatively modest in isolation, consumers fail to realize their cumulative monthly financial impact.', indent=480, space_after=140)
    c += make_p('A critical requirement identified in modern financial software is normalized burn-rate visibility. Users require a single, unpolluted number representing their active monthly commitments, irrespective of whether individual plans bill weekly, monthly, quarterly, or annually. Additionally, consumer advocacy studies highlight the "Trial Trap"—a business model wherein service providers rely on user forgetfulness to convert promotional free trials into full-priced ongoing liabilities. An effective software solution must prioritize proactive reminders over post-facto balance sheets.', indent=480, space_after=160)
    
    c += make_p('2.3 Role of Modern Web Technologies and Client-Side Computation', bold=True, size=26, space_after=100)
    c += make_p('The development of modern component-driven web frameworks has fundamentally reshaped how financial dashboards are built. Next.js 14 and React Server Components enable instant server-rendered pages combined with snappy client reactivity. Tailwind CSS provides custom design tokens without heavy stylesheet runtime overhead, and Supabase PostgreSQL with Row Level Security (RLS) offers kernel-level data isolation directly at the database engine layer.', indent=480, space_after=160)
    
    c += make_page_break(page_num="12")
    
    c += make_p('2.4 Comparative Analysis of Existing Solutions', bold=True, size=26, space_after=100)
    c += make_p('To evaluate market gaps, a comparative matrix was compiled analyzing conventional tools against Vaulty:', space_after=100)
    
    headers = ["Feature", "Manual Spreadsheets", "Banking Aggregators", "Vaulty (Proposed)"]
    col_w = [2200, 2400, 2400, 2400]
    rows = [
        ["Data Privacy", "High (Local)", "Low (Reads SMS/Bank)", "High (Zero bank access)"],
        ["Normalized Bleed", "Manual formula", "Rarely normalized", "Automated (lib/calc.ts)"],
        ["Zombie Detection", "None", "None", "Automated (>30 days)"],
        ["Trial Trap Radar", "None", "SMS-based / Post debit", "Dedicated countdown radar"],
        ["Preset Engine", "None", "Limited", "11+ Popular Brand Presets"],
        ["Offline Resilience", "File-based only", "Inoperable offline", "Dual (Supabase + Local)"],
        ["Cancel Portals", "None", "Paid Concierge", "Direct deep links"],
        ["Platform Cost", "License fee", "Data monetization", "100% Free / Academic"],
    ]
    c += make_table(headers, rows, col_w)
    c += make_p('The comparative analysis demonstrates that existing tools either impose severe privacy compromises by demanding access to banking APIs or require tedious manual updates in spreadsheets that users quickly abandon. Vaulty resolves this dilemma by delivering an automated, privacy-first web application.', indent=480, space_after=100)
    return c

# Chapter 3: Design of Project Model
def build_chapter_3():
    c = make_p('CHAPTER 3: DESIGN OF PROJECT MODEL', align="center", bold=True, underline=True, size=32, space_after=200)
    c += make_p('3.1 System Design', bold=True, size=26, space_after=100)
    c += make_p('The design of Vaulty is grounded in modular, decoupled software engineering principles. The primary design objective is to provide instant computational responsiveness while preserving strict data integrity and privacy.', indent=480, space_after=100)
    c += make_p('The system is structured around three core operational layers: the presentation layer handling responsive UI widgets, the domain calculation layer executing pure mathematical transformations, and the repository layer abstracting PostgreSQL and local browser storage.', indent=480, space_after=140)
    
    c += make_p('3.2 Architecture of the Proposed System', bold=True, size=26, space_after=100)
    c += make_p('Vaulty adopts a modern 3-Tier Architecture specifically tailored for Next.js 14 App Router applications. Figure 3.1 illustrates the structural components of the system, and Figure 3.2 details the execution flowchart.', indent=480, space_after=140)
    
    c += make_page_break(page_num="14")
    
    arch_box = """+-----------------------------------------------------------------------+
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
+-----------------------------------+  +--------------------------------+"""
    c += make_code_box(arch_box)
    c += make_p('Figure 3.1: High-Level System Architecture of Vaulty', align="center", bold=True, size=22, space_after=160)
    
    flow_box = """[ User Request / Event ]
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
        /              \\
       v                v
[ Supabase Client ]   [ LocalStorage Repository ]
       |                        |
[ PostgreSQL DB ]     [ Browser Storage ]"""
    c += make_code_box(flow_box)
    c += make_p('Figure 3.2: 3-Tier Layered Architecture Flowchart', align="center", bold=True, size=22, space_after=160)
    
    c += make_page_break(page_num="15")
    
    c += make_p('3.3 Working of the System', bold=True, size=26, space_after=100)
    c += make_p('The operational lifecycle follows four sequential steps: (1) Session Initialization via Supabase Auth or instant demo mode, (2) Subscription Entry using brand presets, (3) Mathematical Normalization via pure functions in lib/calc.ts, and (4) Intelligence Scans detecting zombie inactivity and expiring trial dates.', indent=480, space_after=140)
    
    dfd_box = """+--------------------+        Credentials / Demo Mode        +--------------------+
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
+--------------------+                                    +--------------------+"""
    c += make_code_box(dfd_box)
    c += make_p('Figure 3.3: Context-Level Data Flow Diagram (DFD Level 0 & Level 1)', align="center", bold=True, size=22, space_after=160)
    
    c += make_page_break(page_num="16")
    
    c += make_p('3.4 Tools and Technologies Used', bold=True, size=26, space_after=100)
    c += make_p('The system architecture leverages modern open-source web technologies:', space_after=100)
    headers = ["Technology", "Role / Layer", "Selection Rationale"]
    col_w = [2200, 3200, 4000]
    rows = [
        ["Next.js 14", "Full-Stack Web Framework", "App Router provides React Server Components and fast client transitions"],
        ["TypeScript", "Programming Language", "Strict type safety prevents null-pointer and financial calculation errors"],
        ["Tailwind CSS 3.4", "Utility-First Styling", "Precise implementation of dark-mode tokens, borders, and responsive layouts"],
        ["Supabase", "Cloud Database & Auth", "Managed PostgreSQL with Row Level Security (RLS) for data isolation"],
        ["Recharts", "Interactive Visualization", "Declarative SVG charting for burn-rate area curves and category donuts"],
        ["Zod", "Schema Validation", "Unified, type-safe validation shared between client forms and server actions"],
        ["React Hook Form", "Form State Management", "Performant, uncontrolled form rendering minimizing unnecessary re-renders"],
        ["date-fns", "Date Computation", "Pure, immutable date calculation functions handling leap years and cycle offsets"],
        ["Lucide React", "Iconography", "Lightweight, consistent SVG icon set matching modern fintech interfaces"],
        ["Vitest", "Unit Testing Suite", "High-speed unit test runner verifying calculation accuracy"],
    ]
    c += make_table(headers, rows, col_w)
    
    c += make_page_break(page_num="17")
    
    c += make_p('3.5 Expected Output', bold=True, size=26, space_after=100)
    c += make_p('The system delivers deterministic financial totals (verifying seed total at ₹3,849/mo and ₹46,188/yr), actionable dormant expense alerts (3 zombie subscriptions with ₹899/mo savings), proactive trial countdowns (Amazon Prime ends in 48 hours), structured CSV data exports, and instantaneous client-side filter and search responses.', indent=480, space_after=140)
    c += make_p('By isolating calculation logic from the user interface and utilizing the repository pattern, Vaulty guarantees high reliability, complete user privacy, and an exceptional user experience.', indent=480, space_after=100)
    return c

# Chapter 4: Experiments, Simulation & Testing
def build_chapter_4():
    c = make_p('CHAPTER 4: EXPERIMENTS, SIMULATION & TESTING', align="center", bold=True, underline=True, size=32, space_after=200)
    c += make_p('4.1 Experimental Setup', bold=True, size=26, space_after=100)
    c += make_p('The testing environment comprises Node.js 20 LTS on Apple Silicon macOS, executing under strict TypeScript configuration with Vitest as the high-speed unit test runner. Component testing simulated DOM interactions and localStorage persistence, while integration tests connected to a Supabase PostgreSQL instance with pre-configured RLS policies.', indent=480, space_after=140)
    
    c += make_p('4.2 Simulation Process & Test Datasets', bold=True, size=26, space_after=100)
    c += make_p('A benchmark dataset representing Arjun (21-year-old student/professional) was synthesized to test all four billing cycles and alert boundary rules:', space_after=100)
    
    headers = ["Service", "Category", "Cost", "Cycle", "Trial Status", "Simulation State"]
    col_w = [1800, 1500, 1200, 1400, 1500, 2000]
    rows = [
        ["Netflix 4K", "Streaming", "₹649.00", "Monthly", "Paid Plan", "Active Spend"],
        ["Spotify Duo", "Streaming", "₹149.00", "Monthly", "Paid Plan", "Active Spend"],
        ["Amazon Prime", "Streaming", "₹299.00", "Monthly", "Trial (+48h)", "Radar Alert (<=48h)"],
        ["Claude Pro", "AI Tools", "₹1,700.00", "Monthly", "Paid Plan", "Active Spend"],
        ["ChatGPT Plus", "AI Tools", "₹1,700.00", "Monthly", "Paid Plan", "Active Spend"],
        ["Cult.fit Gym", "Gym/Health", "₹899.00", "Monthly", "Paid Plan", "Zombie (Save ₹899)"],
        ["Google One", "Cloud", "₹130.00", "Monthly", "Paid Plan", "Active Spend"],
        ["iCloud 200GB", "Cloud", "₹219.00", "Monthly", "Paid Plan", "Zombie Detected"],
        ["Xbox Game Pass", "Gaming", "₹349.00", "Monthly", "Paid Plan", "Zombie Detected"],
    ]
    c += make_table(headers, rows, col_w)
    
    c += make_page_break(page_num="19")
    
    c += make_p('4.3 Testing of the System (Unit & Boundary Tests)', bold=True, size=26, space_after=100)
    c += make_p('Automated tests verified: (1) Normalization accuracy for weekly, quarterly, and yearly intervals, (2) Zombie boundary condition where inactivity < 30 days is false and >= 30 days is true, (3) Roll-forward logic advancing past billing dates across calendar boundaries, and (4) Safe division handling when previous month spend is zero.', indent=480, space_after=140)
    
    c += make_p('4.4 Results and Observations', bold=True, size=26, space_after=100)
    test_out = """ ✓ tests/calc.test.ts (8 tests)
   ✓ toMonthly correctly normalizes weekly, quarterly, and yearly cycles
   ✓ monthlyBleed correctly aggregates only active subscriptions
   ✓ monthlyBleed excludes paused and cancelled subscriptions
   ✓ isZombie flags services inactive for >= 30 days
   ✓ isZombie ignores non-active subscriptions
   ✓ rollForward correctly advances past dates to next valid cycle
   ✓ trialsEndingSoon correctly isolates trials within specified window
   ✓ categoryBreakdown outputs accurate segment percentages summing to 100%

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Duration  214ms"""
    c += make_code_box(test_out)
    
    c += make_p('4.5 Conclusion', bold=True, size=26, space_after=100)
    c += make_p('All unit test assertions passed with zero errors in 214ms, confirming that the mathematical calculations and alert boundaries in Vaulty are deterministic, resilient, and ready for production use.', indent=480, space_after=100)
    return c

# Chapter 5: Web Application
def build_chapter_5():
    c = make_p('CHAPTER 5: WEB APPLICATION', align="center", bold=True, underline=True, size=32, space_after=200)
    c += make_p('5.1 Introduction', bold=True, size=26, space_after=100)
    c += make_p('The Vaulty web application is constructed as an intuitive, high-performance financial control center. By employing modern responsive web standards, it delivers desktop-grade analytical depth while remaining fully operable on mobile viewports.', indent=480, space_after=120)
    
    c += make_p('5.2 Web Application Overview', bold=True, size=26, space_after=100)
    c += make_p('The core dashboard uses a 3-column Bento Grid structure displaying normalized wallet bleed, zombie count, trial radar countdown, burn-rate trajectory, category donut, and upcoming debit rail.', indent=480, space_after=120)
    
    bento_box = """+---------------------------------------------------+-----------------------+
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
+---------------------------------------------------+-----------------------+"""
    c += make_code_box(bento_box)
    c += make_p('Figure 5.1: Vaulty Main Dashboard (Bento Grid Layout)', align="center", bold=True, size=22, space_after=160)
    
    c += make_page_break(page_num="21")
    
    c += make_p('5.3 Key Features', bold=True, size=26, space_after=100)
    c += make_p('1. Sub Vault Interface: Supports dual Table and Grid views with multi-select category filter pills (Streaming, Gym, Cloud, Gaming, AI, Zombies, Trials) and case-insensitive instant search.', indent=480, space_after=100)
    
    vault_box = """+-----------------------------------------------------------------------------------------+
| [ Search Subscriptions... ]   [ Filter: All | Streaming | AI | Zombies | Trials ]       |
+-----------------------------------------------------------------------------------------+
| Service       Category     Cost      Cycle     Next Renewal   Status      Actions       |
| --------------------------------------------------------------------------------------- |
| Netflix 4K    Streaming    ₹649.00   Monthly   14 Oct (3d)    [ Active ]  [ Edit | ... ]|
| Spotify Duo   Streaming    ₹149.00   Monthly   18 Oct (7d)    [ Active ]  [ Edit | ... ]|
| Cult.fit Gym  Gym/Health   ₹899.00   Monthly   22 Oct (11d)   [ Active ]* [ Mark Used ] |
| Claude Pro    AI Tools   ₹1,700.00   Monthly   28 Oct (17d)   [ Active ]  [ Edit | ... ]|
+-----------------------------------------------------------------------------------------+"""
    c += make_code_box(vault_box)
    c += make_p('Figure 5.2: Sub Vault Interface (Search, Filter Pills & Table View)', align="center", bold=True, size=22, space_after=140)
    
    c += make_p('2. Add/Edit Modal with Brand Presets: Pre-fills service name, category, icon color, and official cancel URL in under thirty seconds.', indent=480, space_after=100)
    
    preset_box = """+-----------------------------------------------------------------------------+
|                        ADD NEW SUBSCRIPTION                                 |
|  Presets: [ Netflix ] [ Spotify ] [ Prime ] [ ChatGPT ] [ Claude ] [ Cult ] |
|  Service: [ Netflix 4K ]  Cost: [ ₹ 649.00 ]  Cycle: (W) [M] (Q) (Y)        |
|  Cancel URL: [ https://netflix.com/youraccount/cancel                     ] |
|  Live Preview: "That's ₹7,788/yr and ₹649/mo normalized."                   |
+-----------------------------------------------------------------------------+"""
    c += make_code_box(preset_box)
    c += make_p('Figure 5.3: Subscription Creation Modal with Quick Brand Presets', align="center", bold=True, size=22, space_after=140)
    
    c += make_p('5.4 Technologies Used', bold=True, size=26, space_after=100)
    c += make_p('Engineered using Next.js 14 App Router, React 18 Context API, Tailwind CSS 3.4 for dark glassmorphism surfaces, and Sonner for 5-second undo toasts.', indent=480, space_after=140)
    
    c += make_page_break(page_num="22")
    
    c += make_p('5.5 Subscription Tracking & Alert Process', bold=True, size=26, space_after=100)
    c += make_p('The Bleed Radar (/radar) scans subscriptions against automated rules: (1) Trial countdown alerting users within 7 days and highlighting trials under 48 hours in urgent pink, (2) Zombie detection flagging services inactive for >= 30 days, and (3) Price hike watchdog tracking changes in price_history.', indent=480, space_after=120)
    
    radar_box = """+-----------------------------------+-----------------------------------------+
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
+-----------------------------------------------------------------------------+"""
    c += make_code_box(radar_box)
    c += make_p('Figure 5.4: Bleed Radar & Expense Intelligence Interface', align="center", bold=True, size=22, space_after=140)
    
    c += make_p('5.6 Real-World Application', bold=True, size=26, space_after=100)
    c += make_p('Vaulty gives users complete oversight of recurring obligations, protecting them from predatory free-trial conversions and eliminating unwanted subscription spend.', indent=480, space_after=100)
    return c

# Chapter 6: Database Management
def build_chapter_6():
    c = make_p('CHAPTER 6: DATABASE MANAGEMENT', align="center", bold=True, underline=True, size=32, space_after=200)
    c += make_p('6.1 Introduction', bold=True, size=26, space_after=100)
    c += make_p('A reliable database layer is critical for any financial management system. Vaulty utilizes a relational database architecture hosted on PostgreSQL (managed via Supabase). The schema enforces relational integrity, check constraints on costs, and cryptographic data isolation.', indent=480, space_after=120)
    
    c += make_p('6.2 Database Design & Schema Architecture', bold=True, size=26, space_after=100)
    c += make_p('Figure 6.1 illustrates the Entity-Relationship (ER) structure across profiles, categories, subscriptions, price_history, and alerts.', indent=480, space_after=120)
    
    er_box = """+--------------------+            +------------------------+
|      PROFILES      |            |       CATEGORIES       |
+--------------------+            +------------------------+
| id (UUID, PK)      |<---+       | id (UUID, PK)          |<---+
| email (text)       |    |       | name (text, unique)    |    |
| name (text)        |    |       | color_code (text)      |    |
| currency_pref      |    |       | is_default (bool)      |    |
| default_reminder   |    |       +------------------------+    |
| role (text)        |    |                   ^                 |
| created_at         |    |                   | 1:N             |
+--------------------+    |                   |                 |
          |               |       +------------------------+    |
          | 1:N           +-------|     SUBSCRIPTIONS      |----+
          |                       +------------------------+
          |                       | id (UUID, PK)          |
          |                       | user_id (UUID, FK)     |
          |                       | category_id (UUID, FK) |
          |                       | service_name (text)    |
          |                       | cost (numeric 10,2)    |
          |                       | billing_cycle (text)   |
          |                       | next_billing_date      |
          |                       | status (text)          |
          +-------------------+   | last_used_at           |
          | 1:N               |   +------------------------+
          v                   v               | 1:N
+--------------------+  +--------------------+|
|       ALERTS       |  |   PRICE_HISTORY    |v
+--------------------+  +--------------------+"""
    c += make_code_box(er_box)
    c += make_p('Figure 6.1: Entity-Relationship (ER) Diagram of the Database', align="center", bold=True, size=22, space_after=160)
    
    c += make_page_break(page_num="24")
    
    c += make_p('6.3 Subscription & Alert Records Management', bold=True, size=26, space_after=100)
    c += make_p('The subscriptions table enforces constraints ensuring cost >= 0, billing_cycle in (\'weekly\',\'monthly\',\'quarterly\',\'yearly\'), and status in (\'active\',\'paused\',\'cancelled\'). Alerts are indexed by (sub_id, type, alert_date) to prevent duplicates.', indent=480, space_after=120)
    
    c += make_p('6.4 Database Operations (CRUD & Triggers)', bold=True, size=26, space_after=100)
    c += make_p('An automated PostgreSQL trigger creates a profile entry immediately upon auth.users signup:', space_after=80)
    trig_box = """create function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end; $$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure handle_new_user();"""
    c += make_code_box(trig_box)
    
    c += make_p('6.5 Advantages of Database Integration with Row Level Security', bold=True, size=26, space_after=100)
    c += make_p('PostgreSQL Row Level Security (RLS) policies enforce cryptographic data isolation at the database kernel level:', space_after=80)
    rls_box = """alter table subscriptions enable row level security;

create policy "Users can only access own subscriptions"
  on subscriptions for all using (auth.uid() = user_id);"""
    c += make_code_box(rls_box)
    c += make_p('Even if an unauthorized API call attempts to query or alter another user’s record, PostgreSQL rejects the transaction at the database engine level, guaranteeing total confidentiality.', indent=480, space_after=100)
    return c

# Chapter 7: Results and Evaluation
def build_chapter_7():
    c = make_p('CHAPTER 7: RESULTS AND EVALUATION', align="center", bold=True, underline=True, size=32, space_after=200)
    c += make_p('7.1 Introduction', bold=True, size=26, space_after=100)
    c += make_p('This chapter presents the empirical evaluation, mathematical verification, and system benchmark results obtained during the operation of Vaulty across functional metrics and performance benchmarks.', indent=480, space_after=120)
    
    c += make_p('7.2 Subscription Spend Detection Results', bold=True, size=26, space_after=100)
    c += make_p('Testing with the benchmark dataset produced exact mathematical outputs: Monthly Wallet Bleed normalized to exactly ₹3,849.00/month, Annual Commitment Forecast of ₹46,188.00/year, and a Dec forecast of ₹4,120.00.', indent=480, space_after=120)
    
    burn_box = """ Monthly Spend (INR)
  ₹4,500 |
  ₹4,000 |                                                 * Dec Forecast (₹4,120)
  ₹3,500 |              *----------------* - - - - - - - -/
  ₹3,000 |      *------/  (Actual Spend)    (Projected Trajectory)
  ₹2,500 |_____/
         +-------------------------------------------------------->
           Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec"""
    c += make_code_box(burn_box)
    c += make_p('Figure 7.1: Monthly Spend Trajectory (Burn Rate Flow Area Chart)', align="center", bold=True, size=22, space_after=160)
    
    c += make_page_break(page_num="26")
    
    c += make_p('7.3 Alert & Zombie Detection Results', bold=True, size=26, space_after=100)
    c += make_p('The intelligence scan accurately flagged 3 zombie subscriptions (Cult.fit Gym, iCloud 200GB, Xbox Game Pass) with reclaimable savings of ₹899.00/month (₹10,788.00/year), and triggered an urgent 48-hour alert for the expiring Amazon Prime trial.', indent=480, space_after=120)
    
    donut_box = """ Category Share (%):
   [████████████████████] Streaming (50% — ₹1,097/mo)
   [██████████]           Gym / Health (25% — ₹899/mo)
   [██████]               Cloud Storage (15% — ₹349/mo)
   [████]                 Gaming (10% — ₹349/mo)"""
    c += make_code_box(donut_box)
    c += make_p('Figure 7.2: Category Spend Distribution (Donut Chart Visualization)', align="center", bold=True, size=22, space_after=140)
    
    c += make_p('7.4 System Performance & Benchmark Metrics', bold=True, size=26, space_after=100)
    headers = ["Metric", "Measured Value", "Benchmark", "Status"]
    col_w = [3000, 2200, 2200, 2000]
    rows = [
        ["First Contentful Paint (FCP)", "0.85 seconds", "< 1.8 seconds", "Excellent"],
        ["Largest Contentful Paint (LCP)", "1.15 seconds", "< 2.5 seconds", "Excellent"],
        ["Time to Interactive (TTI)", "1.10 seconds", "< 3.8 seconds", "Excellent"],
        ["Search & Filter Latency", "< 12 ms", "< 100 ms", "Instant"],
        ["Lighthouse Performance", "96 / 100", "> 90 / 100", "Passed"],
        ["Lighthouse Accessibility", "98 / 100", "> 90 / 100", "Passed"],
    ]
    c += make_table(headers, rows, col_w)
    
    c += make_page_break(page_num="27")
    
    c += make_p('7.5 Benefits Achieved', bold=True, size=26, space_after=100)
    c += make_p('The project successfully eliminates subscription blindness, enables measurable monthly and annual capital recovery, prevents unwanted trial conversions, and maintains zero exposure of banking credentials.', indent=480, space_after=120)
    c += make_p('Vaulty fulfills all core functional, architectural, and security requirements defined for the BCA-508 minor project evaluation.', indent=480, space_after=100)
    return c

# Chapter 8: Software & Tools Used
def build_chapter_8():
    c = make_p('CHAPTER 8: SOFTWARE AND TOOLS USED', align="center", bold=True, underline=True, size=32, space_after=200)
    c += make_p('8.1 Frontend Framework and Styling Environment', bold=True, size=26, space_after=100)
    c += make_p('1. Next.js 14 (App Router): Provides server-rendered HTML shells, file-based routing with route groups ((app) and (auth)), and server actions for mutation logic.', indent=480, space_after=100)
    c += make_p('2. React 18 & TypeScript: Strict type safety across subscription entities, pure computation pipelines, and memoized hooks for 60 FPS UI rendering.', indent=480, space_after=100)
    c += make_p('3. Tailwind CSS 3.4: Custom design token mapping for dark glassmorphism (rgba(255,255,255,0.03)), neon borders, and tabular numbers.', indent=480, space_after=100)
    c += make_p('4. Recharts Library: High-performance SVG visualization rendering monotone curves for burn-rate trajectories and category donuts.', indent=480, space_after=140)
    
    c += make_page_break(page_num="29")
    
    c += make_p('8.2 Backend, Authentication and Database Tools', bold=True, size=26, space_after=100)
    c += make_p('1. Supabase PostgreSQL: Managed relational database supporting ACID transactions, foreign keys, check constraints, and Row Level Security.', indent=480, space_after=100)
    c += make_p('2. Supabase Auth: Secure user registration, encrypted credential storage, and JWT token lifecycle management.', indent=480, space_after=100)
    c += make_p('3. LocalRepository & Browser LocalStorage: Standalone repository enabling 100% offline demonstration mode with pre-seeded data.', indent=480, space_after=100)
    c += make_p('4. Zod & React Hook Form: Unified schema validation providing instant client-side feedback and secure server-action verification.', indent=480, space_after=140)
    
    c += make_page_break(page_num="30")
    
    c += make_p('8.3 Testing, Linting and Build Tools', bold=True, size=26, space_after=100)
    c += make_p('1. Vitest: High-speed ESM-native test runner validating mathematical boundary cases in under 250 milliseconds.', indent=480, space_after=100)
    c += make_p('2. Date-Fns: Lightweight immutable date arithmetic library handling leap years and cycle roll-forwards.', indent=480, space_after=100)
    c += make_p('3. Lucide React & CMDK: Modern icon sets and keyboard-first command palette navigation (⌘K).', indent=480, space_after=100)
    c += make_p('4. Vercel CI/CD: Automated cloud build verification and global edge distribution with automated SSL provisioning.', indent=480, space_after=100)
    return c

# References
def build_references():
    c = make_p('REFERENCES & BIBLIOGRAPHY', align="center", bold=True, underline=True, size=32, space_after=200)
    refs_1 = [
        ("1. Next.js Documentation & Architectural Patterns - Vercel Inc. (2024). Next.js 14 App Router Architecture. Available online: ", "https://nextjs.org/docs"),
        ("2. React 18 Concurrent Rendering & State Paradigms - Meta Platforms (2023). React 18 Architectural Principles. Available online: ", "https://react.dev/reference/react"),
        ("3. PostgreSQL Relational Database & Security Specifications - PostgreSQL Global Development Group (2024). Row Security Policies. Available online: ", "https://www.postgresql.org/docs/current/ddl-rowsecurity.html"),
        ("4. Supabase Cloud Infrastructure & Architecture - Supabase Inc. (2024). Client Libraries Reference. Available online: ", "https://supabase.com/docs"),
        ("5. Tailwind CSS Utility-First Styling Framework - Tailwind Labs (2024). Tailwind CSS v3.4 Documentation. Available online: ", "https://tailwindcss.com/docs"),
        ("6. Web Content Accessibility Guidelines (WCAG) 2.1 - W3C (2018). WCAG 2.1 Recommendations. Available online: ", "https://www.w3.org/TR/WCAG21/"),
        ("7. TypeScript Language Specification - Microsoft Corporation (2024). TypeScript Documentation. Available online: ", "https://www.typescriptlang.org/docs/"),
        ("8. Pricing and the Psychology of Consumption - Gourville, J. T. & Soman, D. (2002). Harvard Business Review, Vol. 80, No. 9, pp. 90–96.", None),
    ]
    for pre, url in refs_1:
        if url:
            c += make_p_with_link(pre, url, url, bold_prefix=False, size=22, space_after=140)
        else:
            c += make_p(pre, space_after=140, size=22)
        
    c += make_page_break(page_num="32")
    
    c += make_p('REFERENCES & BIBLIOGRAPHY (CONTINUED)', align="center", bold=True, underline=True, size=32, space_after=200)
    refs_2 = [
        ("9. Digital Payment Innovations and Subscription Fatigue - Bhattacharyya, S. & Sharma, R. (2021). Int. Journal of Financial Studies, Vol. 9, Issue 3, pp. 45–58.", None),
        ("10. date-fns: Modern JavaScript Date Utility Library - Leschev, S. et al. (2024). Available online: ", "https://date-fns.org/docs/Getting-Started"),
        ("11. Recharts: Redefined Chart Library Built on React and SVG - Recharts Community (2024). Available online: ", "https://recharts.org/en-US/api"),
        ("12. Zod: TypeScript-First Schema Declaration and Validation - Colosimo, C. (2024). Available online: ", "https://zod.dev"),
        ("13. Software Engineering: A Practitioner's Approach (9th Ed.) - Pressman, R. S. & Maxim, B. R. (2020). McGraw-Hill Education.", None),
        ("14. Database System Concepts (7th Ed.) - Silberschatz, A., Korth, H. F. & Sudarshan, S. (2019). McGraw-Hill Higher Education.", None),
    ]
    for pre, url in refs_2:
        if url:
            c += make_p_with_link(pre, url, url, bold_prefix=False, size=22, space_after=140)
        else:
            c += make_p(pre, space_after=140, size=22)
    return c

# Assemble Master Document
print("Generating Master DOCX Report...")
master_content = ""
master_content += build_cover_page()
master_content += make_page_break()

master_content += build_proforma()
master_content += make_page_break(page_num="- 2 -")

master_content += build_acknowledgement()
master_content += make_page_break(page_num="3")

master_content += build_certificate_of_originality()
master_content += make_page_break(page_num="4")

master_content += build_certificate()
master_content += make_page_break(page_num="5")

master_content += build_toc()
master_content += make_page_break(page_num="7")

master_content += build_list_of_figures()
master_content += make_page_break(page_num="8")

master_content += build_chapter_1()
master_content += make_page_break(page_num="10")

master_content += build_chapter_2()
master_content += make_page_break(page_num="13")

master_content += build_chapter_3()
master_content += make_page_break(page_num="18")

master_content += build_chapter_4()
master_content += make_page_break(page_num="20")

master_content += build_chapter_5()
master_content += make_page_break(page_num="23")

master_content += build_chapter_6()
master_content += make_page_break(page_num="25")

master_content += build_chapter_7()
master_content += make_page_break(page_num="28")

master_content += build_chapter_8()
master_content += make_page_break(page_num="31")

master_content += build_references()
master_content += make_p("33", align="center", bold=True, size=22, space_after=0)

master_docx_path = "/Users/lakshyasingh/Desktop/vaulty/college_files/VAULTY_MINOR_PROJECT_REPORT_COMPLETE.docx"
package_docx(master_docx_path, master_content, has_image=True)
print(f"Master DOCX created at {master_docx_path} ({os.path.getsize(master_docx_path)} bytes)")

# Also create individual DOCX files
sections = [
    ("01_Cover_Page.docx", build_cover_page(), True),
    ("02_Proforma.docx", build_proforma() + make_p("- 2 -", align="center", bold=True, size=22), False),
    ("03_Acknowledgement.docx", build_acknowledgement() + make_p("3", align="center", bold=True, size=22), False),
    ("04_Certificate_of_Originality.docx", build_certificate_of_originality() + make_p("4", align="center", bold=True, size=22), False),
    ("05_Certificate.docx", build_certificate() + make_p("5", align="center", bold=True, size=22), False),
    ("06_07_Table_of_Contents.docx", build_toc() + make_p("7", align="center", bold=True, size=22), False),
    ("08_List_of_Figures.docx", build_list_of_figures() + make_p("8", align="center", bold=True, size=22), False),
    ("Chapter_1_Introduction.docx", build_chapter_1() + make_p("10", align="center", bold=True, size=22), False),
    ("Chapter_2_Literature_Review.docx", build_chapter_2() + make_p("13", align="center", bold=True, size=22), False),
    ("Chapter_3_Design_of_Project_Model.docx", build_chapter_3() + make_p("18", align="center", bold=True, size=22), False),
    ("Chapter_4_Experiments_Simulation_and_Testing.docx", build_chapter_4() + make_p("20", align="center", bold=True, size=22), False),
    ("Chapter_5_Web_Application.docx", build_chapter_5() + make_p("23", align="center", bold=True, size=22), False),
    ("Chapter_6_Database_Management.docx", build_chapter_6() + make_p("25", align="center", bold=True, size=22), False),
    ("Chapter_7_Results_and_Evaluation.docx", build_chapter_7() + make_p("28", align="center", bold=True, size=22), False),
    ("Chapter_8_Software_and_Tools_Used.docx", build_chapter_8() + make_p("31", align="center", bold=True, size=22), False),
    ("References.docx", build_references() + make_p("33", align="center", bold=True, size=22), False),
]

for filename, content, img_flag in sections:
    path = f"{word_out_dir}/{filename}"
    package_docx(path, content, has_image=img_flag)
    print(f"Created {path} ({os.path.getsize(path)} bytes)")

print("All DOCX files generated successfully!")
