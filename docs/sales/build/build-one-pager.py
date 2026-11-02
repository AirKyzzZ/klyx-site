from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle

OUT = str(Path(__file__).resolve().parent.parent / "offer-one-pager.pdf")
PAPER = HexColor("#FAF9F5")
INK = HexColor("#141413")
ACCENT = HexColor("#E8431F")
MUTED = HexColor("#5E5D59")
RULE = HexColor("#D9D6CC")

F = "/System/Library/Fonts/Supplemental/"
for name, file in [("Sans", "Arial.ttf"), ("Sans-Bold", "Arial Bold.ttf"), ("Mono", "Courier New.ttf"), ("Mono-Bold", "Courier New Bold.ttf")]:
    pdfmetrics.registerFont(TTFont(name, F + file))
pdfmetrics.registerFont(TTFont("Serif-It", "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"))

W, H = A4
M = 16 * mm

def bg(c, d):
    c.saveState()
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.rect(0, H - 3 * mm, W, 3 * mm, stroke=0, fill=1)
    c.setFillColor(MUTED)
    c.setFont("Mono", 7.5)
    c.drawString(M, 9 * mm, "Prix en € HT, « à partir de ». Klyx, Bordeaux. SIRET 941\u00a0572\u00a0364\u00a000029")
    c.drawRightString(W - M, 9 * mm, "klyx.fr")
    c.restoreState()

s = lambda name, **kw: ParagraphStyle(name, **{"fontName": "Sans", "textColor": INK, "fontSize": 10, "leading": 14, **kw})
brand = s("brand", fontName="Sans-Bold", fontSize=11, leading=14)
h1 = s("h1", fontName="Sans-Bold", fontSize=21, leading=26)
sub = s("sub", fontSize=12.5, leading=17, textColor=MUTED)
h2 = s("h2", fontName="Mono-Bold", fontSize=9.5, leading=12, textColor=ACCENT)
body = s("body")
small = s("small", fontSize=8.5, leading=11.5, textColor=MUTED)
cell = s("cell", fontSize=10, leading=13)
cellb = s("cellb", fontName="Sans-Bold", fontSize=10, leading=13)
price = s("price", fontName="Mono-Bold", fontSize=10.5, leading=13, alignment=2)
dur = s("dur", fontName="Mono", fontSize=9, leading=13, textColor=MUTED)
todo = '<font name="Mono" color="#E8431F" size="7.5">TODO(maxime)</font>'

def offers(title, rows):
    data = [[Paragraph(n, cellb), Paragraph(d, cell), Paragraph(t, dur), Paragraph(p, price)] for n, d, t, p in rows]
    t = Table(data, colWidths=[38 * mm, 82 * mm, 26 * mm, W - 2 * M - 146 * mm])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEABOVE", (0, 0), (-1, 0), 0.8, INK),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, RULE),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return [Paragraph(title, h2), Spacer(1, 3), t, Spacer(1, 14)]

story = [
    Paragraph("KLYX", brand),
    Spacer(1, 18),
    Paragraph('Des agents IA qui tournent en production,<br/><font name="Serif-It" color="#E8431F">pas des démos.</font>', h1),
    Spacer(1, 8),
    Paragraph("Sites, agents et automatisations livrés au forfait pour startups et agences. Devis gratuit, prix publics.", sub),
    Spacer(1, 10),
    Paragraph("Je suis Maxime Mansiet, développeur fullstack à Bordeaux. Je travaille seul, avec le code dans votre repo dès le premier jour.", body),
    Spacer(1, 10),
    Paragraph("Tous les prix sont en € HT, « à partir de ».", small),
    Spacer(1, 14),
]
story += offers("SITES", [
    ("Landing page", "Une page, brief de contenu, SEO de base, mise en ligne", "1-2 sem.", "900\u00a0€"),
    ("Site IA", "5 à 8 pages, SEO et référencement dans les IA (GEO)", "3-4 sem.", "2\u00a0900\u00a0€"),
    ("Site sur mesure", "Un site construit autour de votre besoin", todo, "5\u00a0700\u00a0€"),
])
story += offers("IA ET AGENTS", [
    ("Audit IA + roadmap", "Vos process passés en revue, les automatisations classées, une roadmap", "1-2 sem.", "1\u00a0500\u00a0€"),
    ("Sprint IA", "Un workflow en production, périmètre fixé avant de commencer", "2 sem.", "4\u00a0500\u00a0€"),
    ("Suivi mensuel", "Le workflow surveillé et amélioré chaque mois", "mensuel", todo),
])
story += offers("FORWARD DEPLOYED ENGINEER, À TEMPS PARTAGÉ", [
    ("Dans votre équipe", "2 à 3 jours par semaine : votre Slack, votre repo, vos points d'équipe. 4 semaines minimum, soit environ 5\u00a0600\u00a0€\u00a0HT. Deux clients maximum en même temps.", "4 sem. min.", "700\u00a0€\u00a0/\u00a0jour"),
])

def two_col(left, right):
    t = Table([[left, right]], colWidths=[(W - 2 * M) / 2] * 2)
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (0, -1), 14),
        ("RIGHTPADDING", (1, 0), (1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t

steps = [Paragraph("COMMENT ÇA SE PASSE", h2), Spacer(1, 4)] + [
    Paragraph(f'<font name="Mono-Bold" color="#E8431F">{i}</font>&nbsp;&nbsp;{txt}', s('step', spaceAfter=5)) for i, txt in [
        ("01", "<font name='Sans-Bold'>Appel de 30 minutes.</font> Votre besoin, votre stack, votre date."),
        ("02", "<font name='Sans-Bold'>Audit ou devis.</font> Un périmètre écrit et un prix fixe."),
        ("03", "<font name='Sans-Bold'>Build.</font> Code dans votre repo, point écrit chaque semaine."),
        ("04", "<font name='Sans-Bold'>Mesure.</font> On vérifie ce qui tourne, je documente la passation."),
    ]
]
guarantees = [Paragraph("CE QUI EST GARANTI", h2), Spacer(1, 4),
    Paragraph("Le devis est gratuit.", body), Spacer(1, 4),
    Paragraph(f"L'Audit IA est déduit du prix du Sprint si vous continuez. {todo} conditions exactes.", body),
    Spacer(1, 16),
    Paragraph("CONTACT", h2), Spacer(1, 4),
    Paragraph('<font name="Mono">klyx.fr</font>', body),
    Paragraph('<font name="Mono">contact@klyx.fr</font>', body),
    Paragraph(f"Réserver un appel : {todo} URL Cal.com", body),
    Paragraph(f"GitHub : {todo} lien du profil", body),
]
story += [Spacer(1, 4), two_col(steps, guarantees)]

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=14 * mm, bottomMargin=16 * mm,
                      title="Klyx, l'offre en une page", author="Maxime Mansiet")
doc.addPageTemplates([PageTemplate(id="p", frames=[Frame(M, 16 * mm, W - 2 * M, H - 30 * mm, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=bg)])
doc.build(story)
