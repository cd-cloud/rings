/**
 * Phase 4 governance fix: reclassify generated SVG illustrations.
 * - wedding-ring-assets/local/*.svg -> generated-local
 * - wedding-ring-assets/placeholders/*.svg -> placeholder
 * - real local images (png/jpg/webp) -> local
 * - official-remote stays unchanged
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');

const rings = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'rings.json'), 'utf8'));

function ringDataQuality(ring) {
  let score = 100;
  const notes = [];
  if (ring.imageStatus === 'placeholder') { score -= 25; notes.push('placeholder-image'); }
  else if (ring.imageStatus === 'generated-local') { score -= 15; notes.push('generated-illustration'); }
  else if (ring.imageStatus === 'official-remote') { score -= 5; notes.push('remote-image'); }
  else if (ring.imageStatus === 'missing') { score -= 40; notes.push('missing-image'); }

  const conf = ring.price?.confidence;
  if (!conf || conf === 'unknown') { score -= 15; notes.push('unknown-price-confidence'); }
  else if (conf === 'inquiry') { score -= 15; notes.push('price-inquiry'); }
  else if (conf === 'by-weight') { score -= 8; notes.push('price-by-weight'); }
  else if (conf === 'estimate') { score -= 5; notes.push('price-estimate'); }
  else if (conf === 'official-range') { score -= 2; }

  const hasAmount = ring.price && (ring.price.amount != null || (Array.isArray(ring.price.amountRange) && ring.price.amountRange.length));
  if (!hasAmount) { score -= 10; notes.push('missing-amount'); }

  if (!ring.sourceUrls || !ring.sourceUrls.length) { score -= 10; notes.push('missing-source-urls'); }
  if (!ring.imageSourceUrl) { score -= 3; notes.push('missing-image-source'); }
  if (!ring.officialUrl) { score -= 5; notes.push('missing-official-url'); }

  return { score: Math.max(0, Math.min(100, Math.round(score))), status: 'ok', notes };
}

let changed = 0;
for (const ring of rings) {
  const img = ring.image || '';
  const isSvg = img.endsWith('.svg');
  const isLocalDir = img.includes('/local/');
  const isPlaceholderDir = img.includes('/placeholders/');

  let next = ring.imageStatus;
  if (ring.imageStatus === 'local' && isSvg) {
    if (isLocalDir) next = 'generated-local';
    else if (isPlaceholderDir) next = 'placeholder';
  }

  if (next !== ring.imageStatus) {
    ring.imageStatus = next;
    changed++;
  }
  ring.dataQuality = ringDataQuality(ring);
}

fs.writeFileSync(path.join(DATA_DIR, 'rings.json'), JSON.stringify(rings, null, 2), 'utf8');
console.log(`Reclassified ${changed} rings.`);
