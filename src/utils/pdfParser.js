// ─────────────────────────────────────────────────────────────
//  PDF TEXT EXTRACTOR — ZERO DEPENDENCIES
//  No pdfjs. No worker. No CDN. No external fetch.
//  Pure JS: reads the raw PDF binary and extracts text streams.
//  Works on GitHub Pages, offline, everywhere, forever.
// ─────────────────────────────────────────────────────────────

/**
 * Extract readable text from a PDF File object.
 * Parses the raw PDF binary — no library needed.
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const raw   = new TextDecoder('latin1').decode(bytes);

  let text = '';

  // ── Strategy 1: Extract text from BT...ET blocks ──────────
  // PDF text operators: Tj, TJ, ' , "
  const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
  for (const block of btBlocks) {
    // Tj operator: (text)Tj
    const tjMatches = block.match(/\(([^)]*)\)\s*Tj/g) || [];
    for (const m of tjMatches) {
      const t = m.replace(/\(([^)]*)\)\s*Tj/, '$1');
      text += decodePdfString(t) + ' ';
    }
    // TJ operator: [(text) spacing (text)]TJ
    const tjArrayMatches = block.match(/\[([^\]]*)\]\s*TJ/g) || [];
    for (const m of tjArrayMatches) {
      const inner = m.replace(/\[([^\]]*)\]\s*TJ/, '$1');
      const parts = inner.match(/\(([^)]*)\)/g) || [];
      for (const p of parts) {
        text += decodePdfString(p.slice(1, -1)) + ' ';
      }
    }
    // ' operator: (text)'
    const quoteMatches = block.match(/\(([^)]*)\)\s*'/g) || [];
    for (const m of quoteMatches) {
      const t = m.replace(/\(([^)]*)\)\s*'/, '$1');
      text += decodePdfString(t) + '\n';
    }
  }

  // ── Strategy 2: Extract from compressed streams if text is sparse ──
  if (text.trim().length < 100) {
    // Look for plain text strings scattered in the PDF
    const stringMatches = raw.match(/\(([^\\\(\)]{3,})\)/g) || [];
    for (const m of stringMatches) {
      const t = m.slice(1, -1);
      // Only include strings that look like real words (printable ASCII)
      if (/^[\x20-\x7E\s]{3,}$/.test(t) && !/^[\d\s.]+$/.test(t)) {
        text += t + ' ';
      }
    }
  }

  // ── Strategy 3: Decode any UTF-16 BOM strings (ÿþ prefix) ──
  const utf16Matches = raw.match(/ÿþ([^)]+)/g) || [];
  for (const m of utf16Matches) {
    const inner = m.slice(2);
    let decoded = '';
    for (let i = 0; i < inner.length - 1; i += 2) {
      const code = inner.charCodeAt(i) + (inner.charCodeAt(i + 1) << 8);
      if (code > 31 && code < 127) decoded += String.fromCharCode(code);
      else if (code === 32 || code === 9 || code === 10) decoded += ' ';
    }
    if (decoded.trim().length > 2) text += decoded + ' ';
  }

  // ── Clean up extracted text ───────────────────────────────
  text = text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\t/g, ' ')
    .replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text;
}

/**
 * Decode PDF string escape sequences
 */
function decodePdfString(s) {
  return s
    .replace(/\\([0-7]{3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')');
}
