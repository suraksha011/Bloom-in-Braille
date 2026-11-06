export async function extractDocument(file) {
  if (!file) throw new Error('Choose a file first.');
  const maxBytes = 12 * 1024 * 1024;
  if (file.size > maxBytes) throw new Error('This file is larger than 12 MB. Please use a smaller document.');
  const name = file.name.toLowerCase();
  let text = '';
  if (name.endsWith('.txt') || file.type === 'text/plain') {
    text = await file.text();
  } else if (name.endsWith('.docx')) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    text = result.value || '';
  } else if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];
    let chars = 0;
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str || '').join(' ');
      chars += pageText.replace(/\s/g, '').length;
      pages.push(pageText);
    }
    text = pages.join('\n\n');
    if (chars < 20) return { text: '', scannedPdf: true, pages: pdf.numPages, warning: 'This PDF appears to be scanned or image-only. OCR is required before text can be prepared.' };
    return { text: text.trim(), scannedPdf: false, pages: pdf.numPages, warning: '' };
  } else {
    throw new Error('Unsupported file. Please upload TXT, DOCX or PDF.');
  }
  if (!text.trim()) throw new Error('No readable text was found in this document.');
  return { text: text.trim(), scannedPdf: false, pages: null, warning: '' };
}

export function estimateMaterials(wordCount, method) {
  const words = Math.max(1, Number(wordCount) || 1);
  // Transparent planning assumption only; real Braille pagination depends on code and layout.
  const estimatedPages = Math.max(1, Math.ceil(words / 65));
  const sheets = method === 'manual' ? estimatedPages * 2 : estimatedPages;
  const items = method === 'manual'
    ? [{ name: 'Braille paper', quantity: `${sheets} sheets`, cost: sheets * 4 }, { name: 'Slate', quantity: '1', cost: 220 }, { name: 'Stylus', quantity: '1', cost: 90 }, { name: 'Binding supplies', quantity: '1 set', cost: 120 }, { name: 'Cover material', quantity: '1', cost: 70 }]
    : [{ name: 'Embosser-compatible paper', quantity: `${sheets} sheets`, cost: sheets * 5 }, { name: 'Embosser access', quantity: 'Varies by provider', cost: 0 }, { name: 'Binding supplies', quantity: '1 set', cost: 150 }, { name: 'Cover material', quantity: '1', cost: 80 }];
  return { estimatedPages, items, total: items.reduce((sum, item) => sum + item.cost, 0), assumptions: 'Planning estimate only. Assumes approximately 65 source words per Braille page before layout review. Actual pagination, paper specification and local prices vary.' };
}
