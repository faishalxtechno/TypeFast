import { CertificateData, TestResult } from '../types';

/**
 * Generates a unique Certificate ID in the format: TF-YYYY-XXXXXX
 * Example: TF-2026-8A72F4
 */
export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const chars = '0123456789ABCDEF';
  let randomHex = '';
  for (let i = 0; i < 6; i++) {
    randomHex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TF-${year}-${randomHex}`;
}

/**
 * Sanitizes and validates user-provided recipient name.
 * Prevents HTML/script injection, trims whitespace, limits length.
 */
export function sanitizeName(name: string): string {
  if (!name) return '';
  // Strip HTML tags and control characters
  const clean = name.replace(/<[^>]*>?/gm, '').replace(/[\r\n\t]/g, ' ');
  // Collapse consecutive whitespace and trim
  const trimmed = clean.replace(/\s+/g, ' ').trim();
  // Max length 50 characters
  return trimmed.slice(0, 50);
}

/**
 * Formats timestamp to a human-readable date e.g. "16 August 2026"
 */
export function formatCertificateDate(timestamp: number): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return new Date().toLocaleDateString();
  }
}

/**
 * Creates an immutable CertificateData object from a TestResult.
 */
export function createCertificate(result: TestResult, rawName: string): CertificateData {
  const cleanName = sanitizeName(rawName);
  return {
    id: generateCertificateId(),
    name: cleanName,
    wpm: result.wpm,
    rawWpm: result.rawWpm,
    accuracy: result.accuracy,
    errors: result.errors,
    duration: result.duration,
    difficulty: result.difficulty,
    date: formatCertificateDate(result.timestamp),
    timestamp: result.timestamp,
    testResultId: result.id
  };
}

/**
 * Renders an ultra high-resolution A4 landscape certificate onto an HTML5 Canvas.
 * Resolution: 2000 x 1414 (1.414:1 A4 proportion at high DPI).
 */
export function drawCertificateCanvas(cert: CertificateData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const width = 2000;
  const height = 1414;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Background: Pristine luxury gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#ffffff');
  bgGrad.addColorStop(0.5, '#f8fafc');
  bgGrad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Watermark Geometric Pattern
  ctx.save();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.03)';
  ctx.lineWidth = 1;
  for (let i = -width; i < width * 2; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Outer Emerald Border
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 16;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // 4. Inner Gold / Warm Accent Border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // 5. Corner Corner Ornaments
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = '#059669';
    ctx.fillRect(0, 0, 30, 6);
    ctx.fillRect(0, 0, 6, 30);
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(16, 16, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawCorner(70, 70, 0);
  drawCorner(width - 70, 70, 90);
  drawCorner(width - 70, height - 70, 180);
  drawCorner(70, height - 70, 270);

  // 6. Header Emblem / Logo
  ctx.save();
  // Emblem background
  const emblemX = width / 2;
  const emblemY = 160;
  const emblemGrad = ctx.createLinearGradient(emblemX - 35, emblemY - 35, emblemX + 35, emblemY + 35);
  emblemGrad.addColorStop(0, '#10b981');
  emblemGrad.addColorStop(1, '#059669');
  ctx.fillStyle = emblemGrad;
  ctx.beginPath();
  ctx.roundRect(emblemX - 35, emblemY - 35, 70, 70, 18);
  ctx.fill();

  // Lightning Bolt icon inside emblem
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(emblemX + 5, emblemY - 22);
  ctx.lineTo(emblemX - 18, emblemY + 2);
  ctx.lineTo(emblemX - 3, emblemY + 2);
  ctx.lineTo(emblemX - 6, emblemY + 22);
  ctx.lineTo(emblemX + 18, emblemY - 2);
  ctx.lineTo(emblemX + 3, emblemY - 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 7. Brand Title: TYPEFAST
  ctx.font = '800 48px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText('TYPEFAST', width / 2, 270);

  // 8. Subtitle: TYPING SPEED ACHIEVEMENT CERTIFICATE
  ctx.font = '700 24px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#059669';
  ctx.fillText('TYPING SPEED ACHIEVEMENT CERTIFICATE', width / 2, 315);

  // Divider Line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, 345);
  ctx.lineTo(width / 2 + 250, 345);
  ctx.stroke();

  // 9. Statement Text
  ctx.font = '400 22px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('This certificate is proudly awarded to', width / 2, 400);

  // 10. Recipient Name (Prominent Element)
  ctx.font = '800 68px Inter, Georgia, serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(cert.name.toUpperCase(), width / 2, 490);

  // Underline beneath recipient name
  const nameWidth = Math.min(ctx.measureText(cert.name.toUpperCase()).width + 100, width - 400);
  const nameUnderlineGrad = ctx.createLinearGradient(width / 2 - nameWidth / 2, 0, width / 2 + nameWidth / 2, 0);
  nameUnderlineGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
  nameUnderlineGrad.addColorStop(0.5, '#10b981');
  nameUnderlineGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.strokeStyle = nameUnderlineGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2 - nameWidth / 2, 520);
  ctx.lineTo(width / 2 + nameWidth / 2, 520);
  ctx.stroke();

  // 11. Description Text
  ctx.font = '400 21px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(
    'For successfully completing a TypeFast typing test with demonstrated typing speed and accuracy.',
    width / 2,
    575
  );

  // 12. Performance Badges Grid
  const cardWidth = 260;
  const cardHeight = 120;
  const gap = 24;
  const totalCardsWidth = 4 * cardWidth + 3 * gap;
  const startX = (width - totalCardsWidth) / 2;
  const cardY = 635;

  const stats = [
    { label: 'TYPING SPEED', value: `${cert.wpm} WPM`, sub: `Raw: ${cert.rawWpm} WPM`, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    { label: 'ACCURACY', value: `${cert.accuracy.toFixed(1)}%`, sub: `${cert.errors} Mistypes`, color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
    { label: 'TEST DURATION', value: `${cert.duration} Seconds`, sub: `${cert.duration}s Session`, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { label: 'DIFFICULTY', value: cert.difficulty.toUpperCase(), sub: 'Lexical Mode', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  ];

  stats.forEach((st, idx) => {
    const cx = startX + idx * (cardWidth + gap);

    // Box Background
    ctx.fillStyle = st.bg;
    ctx.beginPath();
    ctx.roundRect(cx, cardY, cardWidth, cardHeight, 16);
    ctx.fill();

    // Box Border
    ctx.strokeStyle = st.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Box Label
    ctx.font = '700 13px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText(st.label, cx + cardWidth / 2, cardY + 32);

    // Box Main Value
    ctx.font = '800 32px "JetBrains Mono", monospace';
    ctx.fillStyle = st.color;
    ctx.fillText(st.value, cx + cardWidth / 2, cardY + 76);

    // Box Subtitle
    ctx.font = '500 13px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(st.sub, cx + cardWidth / 2, cardY + 102);
  });

  // 13. Gold Verification Seal Stamp (Bottom Left Center)
  const sealX = 320;
  const sealY = 950;
  ctx.save();
  ctx.beginPath();
  ctx.arc(sealX, sealY, 54, 0, Math.PI * 2);
  ctx.fillStyle = '#fef3c7';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d97706';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sealX, sealY, 46, 0, Math.PI * 2);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = '800 11px Inter, sans-serif';
  ctx.fillStyle = '#b45309';
  ctx.textAlign = 'center';
  ctx.fillText('VERIFIED SPEED', sealX, sealY - 8);
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillText(`${cert.wpm} WPM`, sealX, sealY + 12);
  ctx.font = '600 9px Inter, sans-serif';
  ctx.fillText('OFFICIAL TYPEFAST', sealX, sealY + 26);
  ctx.restore();

  // 14. Left Info Section: Certificate ID & Date
  ctx.textAlign = 'left';
  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#475569';
  ctx.fillText(`Certificate ID: ${cert.id}`, 410, 935);
  ctx.font = '500 14px Inter, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`Issue Date: ${cert.date}`, 410, 965);

  // 15. Right Info Section: Founder / Developer Signature Line
  const sigX = width - 420;
  ctx.beginPath();
  ctx.moveTo(sigX - 160, 940);
  ctx.lineTo(sigX + 160, 940);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '700 17px Inter, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText('Founded & Developed by Mr. Faishal Naushad', sigX, 970);
  ctx.font = '500 13px Inter, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('TypeFast Platform Architect & Creator', sigX, 995);

  // 16. Footer Disclaimer & Direct URL Link
  ctx.textAlign = 'center';
  ctx.font = '500 13px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(
    'TypeFast — Type Faster. Type Smarter. • Verified at typefast.dev • © 2026 TypeFast',
    width / 2,
    height - 85
  );

  return canvas;
}

/**
 * Downloads the certificate as a high-resolution PNG.
 */
export function downloadCertificatePNG(cert: CertificateData): void {
  try {
    const canvas = drawCertificateCanvas(cert);
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `TypeFast-Certificate-${cert.id}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('Failed to download certificate PNG:', e);
  }
}

/**
 * Triggers clean browser print dialog with print-specific landscape layout.
 */
export function printCertificate(): void {
  window.print();
}

/**
 * Shares certificate information via Web Share API or copies to clipboard.
 */
export async function shareCertificate(cert: CertificateData): Promise<{ success: boolean; method: 'share' | 'clipboard' }> {
  const shareData = {
    title: `TypeFast Certificate — ${cert.name} (${cert.wpm} WPM)`,
    text: `I earned a TypeFast Typing Achievement Certificate with ${cert.wpm} WPM and ${cert.accuracy.toFixed(1)}% accuracy! Certificate ID: ${cert.id}`,
    url: window.location.href
  };

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'share' };
    } catch {
      // User cancelled or share failed, fallback to clipboard
    }
  }

  // Fallback to clipboard
  try {
    const copyText = `TypeFast Typing Speed Achievement Certificate\nAwarded to: ${cert.name}\nSpeed: ${cert.wpm} WPM (${cert.accuracy.toFixed(1)}% Accuracy)\nDuration: ${cert.duration}s | Difficulty: ${cert.difficulty}\nCertificate ID: ${cert.id}\nDate: ${cert.date}\nFounded & Developed by Mr. Faishal Naushad`;
    await navigator.clipboard.writeText(copyText);
    return { success: true, method: 'clipboard' };
  } catch {
    return { success: false, method: 'clipboard' };
  }
}
