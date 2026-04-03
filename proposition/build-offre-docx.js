const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageBreak, PageNumber,
  TabStopPosition, TabStopType
} = require("docx");

// ── COLORS ──
const PINK = "E91E8C";
const DARK = "1A1A1A";
const GRAY = "666666";
const LIGHT_BG = "F5F5F5";
const WHITE = "FFFFFF";
const GREEN = "00A86B";
const AMBER = "E6A200";

// ── HELPERS ──
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 36, font: "Arial", color: PINK })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Arial", color: DARK })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: opts.color || DARK, bold: opts.bold || false, italics: opts.italics || false })]
  });
}

function richPara(runs) {
  return new Paragraph({
    spacing: { after: 160 },
    children: runs.map(r => new TextRun({ size: 22, font: "Arial", color: DARK, ...r }))
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: DARK })]
  });
}

function richBullet(runs, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 80 },
    children: runs.map(r => new TextRun({ size: 22, font: "Arial", color: DARK, ...r }))
  });
}

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20, font: "Arial", color: DARK })] })]
  });
}

function cell(textOrParagraphs, width, opts = {}) {
  const children = Array.isArray(textOrParagraphs)
    ? textOrParagraphs
    : [new Paragraph({ children: [new TextRun({ text: textOrParagraphs, size: 20, font: "Arial", color: opts.color || DARK, bold: opts.bold || false })] })];
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children
  });
}

function makeTable(colWidths, headerTexts, rows) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({ children: headerTexts.map((t, i) => headerCell(t, colWidths[i])) }),
      ...rows.map(row => new TableRow({
        children: row.map((c, i) => {
          if (typeof c === "object" && c._cell) return c._cell;
          return cell(c, colWidths[i]);
        })
      }))
    ]
  });
}

// Helper for custom cells in makeTable
function customCell(textOrParagraphs, opts = {}) {
  return { _cell: cell(textOrParagraphs, 0, opts) };
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 100 }, children: [] });
}

function noteBox(text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "FFD966" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFD966" }, left: { style: BorderStyle.SINGLE, size: 1, color: "FFD966" }, right: { style: BorderStyle.SINGLE, size: 1, color: "FFD966" } },
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: "FFF8E1", type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Arial", color: DARK, italics: true })] })]
      })]
    })]
  });
}

// ── BUILD DOCUMENT ──
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: PINK },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u25CF", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25CB", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ]
      },
      {
        reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ]
      },
    ]
  },
  sections: [
    // ════════════════════════════════════════
    // PAGE 1 — COVER
    // ════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "AXION", bold: true, size: 16, font: "Arial", color: PINK, italics: true }),
              new TextRun({ text: "  Smart Swiss Operations", size: 16, font: "Arial", color: GRAY }),
              new TextRun({ text: "          Offre ABAX Info \u2014 R\u00e9f. AXION-ABAX-2026-001", size: 16, font: "Arial", color: GRAY }),
            ]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Confidentiel \u2014 AXION Smart Swiss Operations | Page ", size: 16, font: "Arial", color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, font: "Arial", color: GRAY }),
            ]
          })]
        })
      },
      children: [
        // AXION Logo text
        emptyLine(),
        emptyLine(),
        emptyLine(),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [new TextRun({ text: "AXION", bold: true, size: 28, font: "Arial", color: PINK, italics: true }),
                     new TextRun({ text: "\nSmart Swiss Operations", size: 20, font: "Arial", color: GRAY, break: 1 })]
        }),
        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "OFFRE DE SERVICE", bold: true, size: 56, font: "Arial", color: DARK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: "Projet ABAX Acceleration", bold: true, size: 48, font: "Arial", color: DARK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ text: "Visibilit\u00e9, Acquisition & Performance Op\u00e9rationnelle", size: 26, font: "Arial", color: GRAY, italics: true })]
        }),
        // Meta table
        new Table({
          width: { size: 7000, type: WidthType.DXA },
          columnWidths: [2400, 4600],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Client", bold: true, size: 22, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 4600, type: WidthType.DXA }, margins: cellMargins,
                children: [
                  new Paragraph({ children: [new TextRun({ text: "ABAX Info", bold: true, size: 22, font: "Arial" })] }),
                  new Paragraph({ children: [new TextRun({ text: "Informatique & Services IT", size: 20, font: "Arial", color: GRAY })] }),
                  new Paragraph({ children: [new TextRun({ text: "Suisse romande & France", size: 20, font: "Arial", color: GRAY })] }),
                ] })
            ] }),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Prestataire", bold: true, size: 22, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 4600, type: WidthType.DXA }, margins: cellMargins,
                children: [
                  new Paragraph({ children: [new TextRun({ text: "AXION", bold: true, size: 22, font: "Arial" })] }),
                  new Paragraph({ children: [new TextRun({ text: "Smart Swiss Operations \u2014 Suisse romande", size: 20, font: "Arial", color: GRAY })] }),
                ] })
            ] }),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "R\u00e9f\u00e9rence", bold: true, size: 22, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 4600, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "AXION-ABAX-2026-001", size: 22, font: "Arial" })] })] })
            ] }),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true, size: 22, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 4600, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "2 avril 2026", size: 22, font: "Arial" })] })] })
            ] }),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Validit\u00e9", bold: true, size: 22, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 4600, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "30 jours", size: 22, font: "Arial" })] })] })
            ] }),
          ]
        }),
        emptyLine(),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Mod\u00e8le : Partenariat de Croissance", bold: true, size: 24, font: "Arial", color: PINK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "ABAX Info reste propri\u00e9taire de toutes les donn\u00e9es et du CRM", size: 20, font: "Arial", color: GRAY, italics: true })]
        }),

        // ════════════════════════════════════════
        // PAGE 2 — PARTIE 1
        // ════════════════════════════════════════
        pageBreak(),

        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: "PARTIE 1 - OFFRE DE SERVICE", bold: true, size: 36, font: "Arial", color: DARK })]
        }),

        heading1("1. Contexte & Enjeux"),

        para("ABAX Info, acteur reconnu des services informatiques en Suisse romande et en France, dispose d\u2019une expertise technique solide et d\u2019un taux de r\u00e9tention client exceptionnel. L\u2019entreprise n\u2019a jamais perdu de clients pour des raisons de qualit\u00e9 de service."),

        para("Pourtant, ABAX Info fait face \u00e0 des d\u00e9fis strat\u00e9giques identifi\u00e9s lors du Discovery Workshop du 5 mars 2026 et confirm\u00e9s lors du suivi du 27 mars 2026 :"),

        heading2("Probl\u00e9matiques identifi\u00e9es"),

        richBullet([{ text: "Visibilit\u00e9 insuffisante", bold: true }, { text: " \u2014 Site internet sous-optimis\u00e9 pour le SEO/GEO, pr\u00e9sence LinkedIn irr\u00e9guli\u00e8re, Google My Business non exploit\u00e9" }]),
        richBullet([{ text: "Acquisition client non structur\u00e9e", bold: true }, { text: " \u2014 Pas de syst\u00e8me de prospection syst\u00e9matique ; d\u00e9pendance au bouche-\u00e0-oreille" }]),
        richBullet([{ text: "Offre non standardis\u00e9e", bold: true }, { text: " \u2014 Services ultra-personnalis\u00e9s entra\u00eenant une perte de temps ; absence de catalogue structur\u00e9" }]),
        richBullet([{ text: "Manque de KPI op\u00e9rationnels", bold: true }, { text: " \u2014 Impossibilit\u00e9 de mesurer la rentabilit\u00e9 des collaborateurs (ClickUP, Autotask)" }]),
        richBullet([{ text: "Base de connaissance absente", bold: true }, { text: " \u2014 Pr\u00e9requis pour aligner \u00e9quipes techniques et commerciales" }]),

        // ════════════════════════════════════════
        // PAGE 3 — SOLUTION
        // ════════════════════════════════════════
        pageBreak(),

        heading1("2. Solution Propos\u00e9e \u2014 3 Piliers"),

        para("AXION propose un accompagnement structur\u00e9 en 3 piliers compl\u00e9mentaires pour transformer ces d\u00e9fis en leviers de croissance."),

        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [3009, 3009, 3008],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 3009, type: WidthType.DXA }, shading: { fill: "E8F4FD", type: ShadingType.CLEAR }, margins: cellMargins,
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "\uD83D\uDD0D", size: 36 })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "Pilier 1", bold: true, size: 24, font: "Arial", color: "0077B6" })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "VISIBILIT\u00c9", bold: true, size: 20, font: "Arial", color: "0077B6" })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "Rayonnement & R\u00e9putation", size: 18, font: "Arial", color: GRAY })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "445 CHF/mois", bold: true, size: 26, font: "Arial", color: "0077B6" })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "au lieu de 900 CHF/mois *", size: 16, font: "Arial", color: GRAY })] }),
                ] }),
              new TableCell({ borders, width: { size: 3009, type: WidthType.DXA }, shading: { fill: "E8F8EF", type: ShadingType.CLEAR }, margins: cellMargins,
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "\uD83D\uDE80", size: 36 })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "Pilier 2", bold: true, size: 24, font: "Arial", color: GREEN })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "CROISSANCE", bold: true, size: 20, font: "Arial", color: GREEN })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "Syst\u00e8me d\u2019Acquisition", size: 18, font: "Arial", color: GRAY })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "20 % commission", bold: true, size: 26, font: "Arial", color: GREEN })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "sur chaque client sign\u00e9", size: 16, font: "Arial", color: GRAY })] }),
                ] }),
              new TableCell({ borders, width: { size: 3008, type: WidthType.DXA }, shading: { fill: "FFF8E1", type: ShadingType.CLEAR }, margins: cellMargins,
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "\uD83D\uDCCA", size: 36 })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "Pilier 3", bold: true, size: 24, font: "Arial", color: AMBER })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "OP\u00c9RATIONS", bold: true, size: 20, font: "Arial", color: AMBER })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "KPI & Performance", size: 18, font: "Arial", color: GRAY })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "\u00c0 d\u00e9finir", bold: true, size: 26, font: "Arial", color: AMBER })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "d\u00e9marrage juin 2026", size: 16, font: "Arial", color: GRAY })] }),
                ] }),
            ] })
          ]
        }),

        emptyLine(),

        // ── PILIER 1 DETAIL ──
        heading2("Pilier 1 \u2014 Visibilit\u00e9 & Rayonnement"),

        para("L\u2019objectif est de positionner ABAX Info comme la r\u00e9f\u00e9rence en services IT pour les PME de Suisse romande, en exploitant l\u2019ensemble des canaux de visibilit\u00e9 num\u00e9rique."),

        makeTable([2500, 6526],
          ["Composante", "Description"],
          [
            ["SEO & GEO", "Diagnostic d\u00e9taill\u00e9 (livr\u00e9), plan d\u2019action 90 jours, optimisation continue du site internet, structure de contenu align\u00e9e sur les moteurs de recherche et les LLM (ChatGPT, Gemini, Claude)"],
            ["Google My Business", "Optimisation de la fiche, gestion des avis, SEO local pour maximiser la visibilit\u00e9 r\u00e9gionale"],
            ["LinkedIn", "Strat\u00e9gie \u00e9ditoriale, cr\u00e9ation d\u2019au minimum 1 publication/semaine, r\u00e9gularit\u00e9 pour nourrir l\u2019algorithme"],
            ["Blog & Contenu", "Alimentation r\u00e9guli\u00e8re du site avec des articles optimis\u00e9s SEO, planification mensuelle glissante"],
            ["Reporting", "Suivi mensuel des indicateurs de visibilit\u00e9 (trafic, positions, engagement LinkedIn)"],
          ]
        ),

        emptyLine(),

        // Pricing box
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [9026],
          rows: [new TableRow({
            children: [new TableCell({
              borders: { top: { style: BorderStyle.SINGLE, size: 2, color: GREEN }, bottom: { style: BorderStyle.SINGLE, size: 2, color: GREEN }, left: { style: BorderStyle.SINGLE, size: 2, color: GREEN }, right: { style: BorderStyle.SINGLE, size: 2, color: GREEN } },
              width: { size: 9026, type: WidthType.DXA },
              shading: { fill: "E8F8EF", type: ShadingType.CLEAR },
              margins: { top: 160, bottom: 160, left: 240, right: 240 },
              children: [
                new Paragraph({ spacing: { after: 80 }, children: [
                  new TextRun({ text: "Tarif standard : ", size: 22, font: "Arial", color: GRAY }),
                  new TextRun({ text: "900 CHF/mois", size: 22, font: "Arial", color: GRAY, strike: true }),
                  new TextRun({ text: "  \u2192  ", size: 22, font: "Arial" }),
                  new TextRun({ text: "Tarif partenaire : 445 CHF/mois", bold: true, size: 26, font: "Arial", color: GREEN }),
                  new TextRun({ text: "  (\u00e9conomie de 50 %)", size: 20, font: "Arial", color: GREEN }),
                ] }),
                new Paragraph({ children: [
                  new TextRun({ text: "* Le tarif pr\u00e9f\u00e9rentiel de 445 CHF/mois s\u2019applique jusqu\u2019\u00e0 la signature du premier contrat client g\u00e9n\u00e9r\u00e9 par le syst\u00e8me d\u2019acquisition (Pilier 2). Le tarif revient ensuite \u00e0 900 CHF/mois.", size: 18, font: "Arial", color: GRAY, italics: true }),
                ] }),
              ]
            })]
          })]
        }),

        // ── PILIER 2 DETAIL ──
        pageBreak(),

        heading2("Pilier 2 \u2014 Croissance & Acquisition"),

        para("Mise en place d\u2019un syst\u00e8me d\u2019acquisition automatis\u00e9 permettant \u00e0 ABAX Info de g\u00e9n\u00e9rer un flux continu de prospects qualifi\u00e9s, sans d\u00e9pendance \u00e0 une agence externe et en conservant la pleine ma\u00eetrise du CRM et du scoring."),

        makeTable([2500, 6526],
          ["Composante", "Description"],
          [
            ["Sourcing de prospects", "Identification automatis\u00e9e de prospects qualifi\u00e9s (ICP/persona) dans la r\u00e9gion cible \u2014 dirigeants de PME, Suisse romande"],
            ["Scoring & Qualification", "Syst\u00e8me de scoring intelligent bas\u00e9 sur les briques technologiques d\u2019ABAX Info et le profil du prospect"],
            ["S\u00e9quences d\u2019emails", "S\u00e9quences automatis\u00e9es, personnalis\u00e9es et codifi\u00e9es pour maximiser le taux de conversion"],
            ["CRM & Pipeline", "Mise en place et alimentation du CRM \u2014 ABAX Info reste propri\u00e9taire de toutes les donn\u00e9es"],
            ["R\u00e9activation base existante", "Exploitation de la base clients actuelle pour d\u00e9tecter des opportunit\u00e9s d\u2019upsell et r\u00e9activer d\u2019anciens contacts"],
            ["Reporting", "Suivi de la performance des canaux d\u2019acquisition, optimisation continue du tunnel de conversion"],
          ]
        ),

        emptyLine(),

        heading2("Mod\u00e8le \u00e9conomique \u2014 Commission sur r\u00e9sultats"),

        makeTable([3000, 6026],
          ["\u00c9l\u00e9ment", "Condition"],
          [
            ["Co\u00fbt de setup", "CHF 0.- \u2014 Aucun frais d\u2019installation"],
            ["Commission par nouveau client", "20 % du chiffre d\u2019affaires factur\u00e9 pour chaque nouveau client sign\u00e9 gr\u00e2ce au syst\u00e8me d\u2019acquisition"],
            ["Dur\u00e9e de la commission", "Pendant toute la dur\u00e9e de vie du contrat client \u2014 tant que le client g\u00e9n\u00e9r\u00e9 reste factur\u00e9 par ABAX Info"],
            ["P\u00e9rim\u00e8tre", "Uniquement les nouveaux clients directement attribuables au syst\u00e8me d\u2019acquisition AXION"],
          ]
        ),

        emptyLine(),
        noteBox("Alignement gagnant-gagnant : Ce mod\u00e8le garantit qu\u2019AXION n\u2019est r\u00e9mun\u00e9r\u00e9 que lorsque le syst\u00e8me g\u00e9n\u00e8re des r\u00e9sultats concrets pour ABAX Info. La commission de 20 % est coh\u00e9rente avec les pratiques du march\u00e9 (15-35 % pour les apporteurs d\u2019affaires classiques) tout en offrant un service complet et continu bien sup\u00e9rieur \u00e0 un simple apport d\u2019affaires ponctuel."),

        // ── PILIER 3 DETAIL ──
        emptyLine(),
        heading2("Pilier 3 \u2014 Op\u00e9rations & Performance"),

        para("Mise en place d\u2019un tableau de bord op\u00e9rationnel bas\u00e9 sur les donn\u00e9es existantes (ClickUP et Autotask) pour mesurer la rentabilit\u00e9 des collaborateurs, identifier les besoins en formation et piloter l\u2019activit\u00e9."),

        makeTable([2500, 6526],
          ["Composante", "Description"],
          [
            ["KPI Collaborateurs", "Rentabilit\u00e9, temps pass\u00e9 par type d\u2019intervention, potentiel de progression, besoins en formation"],
            ["KPI Service", "Temps de r\u00e9ponse aux tickets, satisfaction client, volume d\u2019incidents"],
            ["Reporting client", "Statut mensuel automatis\u00e9 \u00e0 destination des clients d\u2019ABAX Info \u2014 valeur per\u00e7ue et r\u00e9tention"],
            ["Base de connaissance", "Pr\u00e9requis : structuration du catalogue de services en briques technologiques et de service (3 niveaux)"],
          ]
        ),

        emptyLine(),
        noteBox("D\u00e9marrage en juin 2026 : Le Pilier 3 sera d\u00e9fini en d\u00e9tail lors d\u2019un atelier d\u00e9di\u00e9. Les KPI d\u00e9couleront naturellement de la mise en place de la base de connaissance. Approche it\u00e9rative : d\u2019abord des chiffres bruts pour l\u2019analyse, puis des recommandations prescriptives."),

        // ════════════════════════════════════════
        // PLANNING
        // ════════════════════════════════════════
        pageBreak(),

        heading1("3. Planning & Jalons"),

        makeTable([2000, 3500, 3526],
          ["Phase", "Date", "Livrables"],
          [
            ["Signature", "Avril 2026", "Contrat et kickoff planning"],
            ["Lancement P1 + P2", "Avril 2026", "Activation SEO/GEO, GMB, LinkedIn, setup CRM, sourcing 30 premiers prospects"],
            ["Pr\u00e9sentation \u00e9quipe", "Mai 2026", "Atelier interne, communication feuille de route simplifi\u00e9e"],
            ["Lancement P3", "Juin 2026", "Atelier KPI, connexion ClickUP + Autotask, premiers dashboards"],
            ["Objectif rentr\u00e9e", "Septembre 2026", "3 piliers actifs et mesurables, flux de leads qualifi\u00e9s en continu"],
          ]
        ),

        emptyLine(),
        noteBox("\uD83D\uDD04 Ateliers hebdomadaires : Un cr\u00e9neau fixe le vendredi de 10h \u00e0 12h est r\u00e9serv\u00e9 pour les ateliers collaboratifs. Un espace client en ligne sera mis en place pour le partage des livrables, comptes-rendus et agendas."),

        // ════════════════════════════════════════
        // INVESTISSEMENT
        // ════════════════════════════════════════
        pageBreak(),

        heading1("4. Investissement"),

        para("Le mod\u00e8le \u00e9conomique est con\u00e7u pour minimiser le risque financier d\u2019ABAX Info et aligner les int\u00e9r\u00eats des deux parties sur la croissance."),

        heading2("Synth\u00e8se de l\u2019offre de service"),

        makeTable([3000, 2500, 2000, 1526],
          ["Composante", "Montant", "Fr\u00e9quence", "D\u00e9marrage"],
          [
            ["P1 \u2014 Visibilit\u00e9 & Rayonnement", "CHF 445.-/mois *", "Mensuel", "Avril 2026"],
            ["P2 \u2014 Croissance & Acquisition (setup)", "CHF 0.-", "Unique", "Avril 2026"],
            ["P2 \u2014 Croissance & Acquisition (commission)", "20 % du CA factur\u00e9", "Par client, dur\u00e9e de vie", "Avril 2026"],
            ["P3 \u2014 Op\u00e9rations & KPI", "\u00c0 d\u00e9finir", "\u2014", "Juin 2026"],
            ["Licences SaaS (estimatif)", "\u2248 CHF 50.-", "Mensuel", "Avril 2026"],
          ]
        ),

        para("Tous les montants sont exprim\u00e9s hors taxes (H.T.). La tarification des licences SaaS est une valeur estimative non contractuelle.", { italics: true, color: GRAY }),

        heading2("Modalit\u00e9s de paiement"),

        richBullet([{ text: "Pilier 1 (Visibilit\u00e9) : ", bold: true }, { text: "Facturation mensuelle par AXION, \u00e0 terme \u00e9chu" }]),
        richBullet([{ text: "Pilier 2 (Commission) : ", bold: true }, { text: "Facturation mensuelle par AXION sur la base du chiffre d\u2019affaires factur\u00e9 par ABAX Info aux clients g\u00e9n\u00e9r\u00e9s par le syst\u00e8me d\u2019acquisition. Un reporting mensuel partag\u00e9 permettra de valider les montants" }]),
        richBullet([{ text: "Licences : ", bold: true }, { text: "Factur\u00e9es directement par les \u00e9diteurs SaaS respectifs" }]),

        // ════════════════════════════════════════
        // METHODOLOGIE
        // ════════════════════════════════════════
        pageBreak(),

        heading1("5. Approche & M\u00e9thodologie"),

        para("AXION applique sa m\u00e9thode propri\u00e9taire \u00ab Tourbillon 5A \u00bb garantissant une d\u00e9marche structur\u00e9e et des r\u00e9sultats mesurables."),

        makeTable([2000, 3000, 4026],
          ["Phase", "Description", "Application ABAX"],
          [
            ["1. Analyser", "Cartographie de l\u2019existant", "Diagnostic SEO/GEO (livr\u00e9), audit pr\u00e9sence digitale, d\u00e9finition ICP"],
            ["2. Am\u00e9liorer", "Optimisation avant automatisation", "Structuration catalogue de services, standardisation en briques"],
            ["3. Automatiser", "Workflows, IA, int\u00e9grations", "Syst\u00e8me d\u2019acquisition (sourcing, scoring, s\u00e9quences), reporting"],
            ["4. Accompagner", "Formation, change management", "Ateliers hebdomadaires, pr\u00e9sentation \u00e9quipe, espace client"],
            ["5. Augmenter", "Extension, am\u00e9lioration continue", "KPI op\u00e9rationnels, base de connaissance, nouveaux canaux"],
          ]
        ),

        // ════════════════════════════════════════
        // POURQUOI AXION
        // ════════════════════════════════════════

        heading1("6. Pourquoi AXION"),

        richBullet([{ text: "Expertise SEO/GEO et syst\u00e8mes d\u2019acquisition", bold: true }, { text: " pour les PME de services IT en Suisse" }]),
        richBullet([{ text: "M\u00e9thodologie \u00e9prouv\u00e9e \u00ab Tourbillon 5A \u00bb", bold: true }, { text: " centr\u00e9e sur les r\u00e9sultats mesurables" }]),
        richBullet([{ text: "Mod\u00e8le align\u00e9 sur la performance :", bold: true }, { text: " commission sur r\u00e9sultats, pas de frais fixes excessifs" }]),
        richBullet([{ text: "Propri\u00e9t\u00e9 des donn\u00e9es :", bold: true }, { text: " ABAX Info conserve la ma\u00eetrise totale du CRM et de toutes les donn\u00e9es" }]),
        richBullet([{ text: "Proximit\u00e9 g\u00e9ographique", bold: true }, { text: " (Suisse romande) et ateliers hebdomadaires" }]),
        richBullet([{ text: "Accompagnement complet :", bold: true }, { text: " du diagnostic \u00e0 l\u2019ex\u00e9cution, en passant par la formation" }]),

        // ════════════════════════════════════════
        // PROCHAINES ETAPES
        // ════════════════════════════════════════

        heading1("7. Prochaines \u00c9tapes"),

        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "Validation de la pr\u00e9sente offre par ABAX Info", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "Signature du contrat et planification du kickoff", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "Activation de l\u2019espace client en ligne", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "Premier atelier hebdomadaire \u2014 vendredi 10h-12h", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "D\u00e9marrage simultan\u00e9 des Piliers 1 (Visibilit\u00e9) et 2 (Acquisition)", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "Ciblage initial : g\u00e9n\u00e9ration de 30 prospects qualifi\u00e9s", size: 22, font: "Arial" })] }),

        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [new TextRun({ text: "Cette offre est valable 30 jours \u00e0 compter de sa date d\u2019\u00e9mission.", bold: true, size: 22, font: "Arial", color: PINK, italics: true })]
        }),

        // ════════════════════════════════════════
        // PARTIE 2 — ANNEXES
        // ════════════════════════════════════════
        pageBreak(),

        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: "PARTIE 2 - ANNEXES CONTRACTUELLES", bold: true, size: 36, font: "Arial", color: DARK })]
        }),

        heading1("Annexe A \u2014 Propri\u00e9t\u00e9 intellectuelle"),

        para("ABAX Info reste propri\u00e9taire de l\u2019ensemble des donn\u00e9es, du CRM, du syst\u00e8me de scoring et de toutes les configurations cr\u00e9\u00e9es sp\u00e9cifiquement dans le cadre du projet."),
        para("AXION conserve la propri\u00e9t\u00e9 de ses m\u00e9thodologies (dont la m\u00e9thode Tourbillon 5A), outils internes, savoir-faire et solutions g\u00e9n\u00e9riques d\u00e9velopp\u00e9es. AXION se r\u00e9serve le droit de r\u00e9utiliser les architectures et patterns d\u2019automatisation d\u00e9velopp\u00e9s, \u00e0 l\u2019exclusion des donn\u00e9es et informations confidentielles propres \u00e0 ABAX Info."),

        heading1("Annexe B \u2014 Confidentialit\u00e9"),

        para("Les parties s\u2019engagent \u00e0 maintenir strictement confidentielles toutes les informations sensibles de nature commerciale, financi\u00e8re ou strat\u00e9gique \u00e9chang\u00e9es dans le cadre du projet, notamment : listes de clients et fournisseurs, conditions tarifaires, donn\u00e9es personnelles, processus propri\u00e9taires et tout \u00e9l\u00e9ment explicitement marqu\u00e9 comme confidentiel."),
        para("Cette obligation restera en vigueur pendant une dur\u00e9e de 3 ans apr\u00e8s la fin de la collaboration."),

        heading1("Annexe C \u2014 Dur\u00e9e et r\u00e9siliation"),

        richPara([{ text: "Pilier 1 (Visibilit\u00e9) : ", bold: true }, { text: "Engagement minimum de 9 mois \u00e0 compter du d\u00e9marrage. A l\u2019issue, renouvellement tacite par p\u00e9riodes de 3 mois, r\u00e9siliable avec un pr\u00e9avis de 2 mois par lettre recommand\u00e9e ou email avec confirmation de lecture." }]),
        richPara([{ text: "Pilier 2 (Acquisition) : ", bold: true }, { text: "Engagement minimum de 12 mois. La commission reste due pendant toute la dur\u00e9e de vie des contrats clients g\u00e9n\u00e9r\u00e9s, m\u00eame apr\u00e8s r\u00e9siliation du partenariat. R\u00e9siliable avec un pr\u00e9avis de 3 mois apr\u00e8s la p\u00e9riode d\u2019engagement." }]),
        richPara([{ text: "Pilier 3 (Op\u00e9rations) : ", bold: true }, { text: "Conditions \u00e0 d\u00e9finir lors du cadrage en juin 2026." }]),

        heading1("Annexe D \u2014 Attribution des clients"),

        para("Un nouveau client est consid\u00e9r\u00e9 comme \u00ab g\u00e9n\u00e9r\u00e9 par le syst\u00e8me d\u2019acquisition \u00bb lorsqu\u2019il est entr\u00e9 dans le pipeline via l\u2019un des canaux mis en place par AXION (s\u00e9quences d\u2019emails, formulaires du site optimis\u00e9, r\u00e9ponse \u00e0 une publication LinkedIn cr\u00e9\u00e9e par AXION)."),
        para("Un reporting mensuel partag\u00e9 et transparent permettra de valider l\u2019attribution. En cas de d\u00e9saccord, les parties se concerteront de bonne foi."),

        heading1("Annexe E \u2014 Droit applicable et for juridique"),

        richPara([{ text: "Droit applicable : ", bold: true }, { text: "Le pr\u00e9sent contrat est r\u00e9gi par le droit suisse, \u00e0 l\u2019exclusion de toute autre l\u00e9gislation." }]),
        richPara([{ text: "For juridique : ", bold: true }, { text: "Tout litige d\u00e9coulant du pr\u00e9sent contrat sera de la comp\u00e9tence exclusive des tribunaux ordinaires du canton de Vaud, Suisse." }]),
        richPara([{ text: "Langue : ", bold: true }, { text: "Le pr\u00e9sent contrat est r\u00e9dig\u00e9 en fran\u00e7ais. En cas de traduction, seule la version fran\u00e7aise fait foi." }]),

        // ════════════════════════════════════════
        // SIGNATURES
        // ════════════════════════════════════════
        pageBreak(),

        heading1("Signatures"),

        para("En signant ce document, les parties acceptent l\u2019ensemble des termes et conditions de la pr\u00e9sente offre."),

        emptyLine(),

        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [4513, 4513],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, shading: { fill: LIGHT_BG, type: ShadingType.CLEAR }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Pour ABAX Info", bold: true, size: 22, font: "Arial", color: PINK })] })] }),
              new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, shading: { fill: LIGHT_BG, type: ShadingType.CLEAR }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Pour AXION", bold: true, size: 22, font: "Arial", color: PINK })] })] }),
            ] }),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins,
                children: [
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Nom :", size: 20, font: "Arial", color: GRAY })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Fonction :", size: 20, font: "Arial", color: GRAY })] }),
                  emptyLine(),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Date :", size: 20, font: "Arial", color: GRAY })] }),
                  emptyLine(),
                  new Paragraph({ children: [new TextRun({ text: "Signature :", size: 20, font: "Arial", color: GRAY })] }),
                  emptyLine(), emptyLine(), emptyLine(),
                ] }),
              new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins,
                children: [
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Nom : S\u00e9bastien FOURNIER", size: 20, font: "Arial" })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Fonction : Co-Founder AXION", size: 20, font: "Arial" })] }),
                  emptyLine(),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Date :", size: 20, font: "Arial", color: GRAY })] }),
                  emptyLine(),
                  new Paragraph({ children: [new TextRun({ text: "Signature :", size: 20, font: "Arial", color: GRAY })] }),
                  emptyLine(), emptyLine(), emptyLine(),
                ] }),
            ] }),
          ]
        }),
      ]
    }
  ]
});

// ── GENERATE ──
const outPath = process.argv[2] || "C:/Users/Maintenant Prêt/AXION/clients/ABAX_INFO/proposition/AXION_Offre_ABAX_Acceleration_2026-001.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("OK: " + outPath);
});
