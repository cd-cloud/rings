/**
 * Data quality audit script for rings catalog.
 * Run: node scripts/audit-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const brands = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/brands.json'), 'utf8'));
const rings = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/rings.json'), 'utf8'));
const pairs = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/pairs.json'), 'utf8'));

const brandIds = new Set(brands.map(b => b.id));
const ringIds = new Set(rings.map(r => r.id));

console.log('=== Rings Catalog Data Audit ===\n');

console.log('Counts:');
console.log('  Brands:', brands.length);
console.log('  Rings:', rings.length);
console.log('  Pairs:', pairs.length);

const imageStatusCounts = {};
rings.forEach(r => {
  const s = r.imageStatus || 'missing';
  imageStatusCounts[s] = (imageStatusCounts[s] || 0) + 1;
});
console.log('\nImage status:');
console.log(`  local (official/local image): ${imageStatusCounts.local || 0}`);
console.log(`  official-remote: ${imageStatusCounts['official-remote'] || 0}`);
console.log(`  generated-local (illustration): ${imageStatusCounts['generated-local'] || 0}`);
console.log(`  placeholder: ${imageStatusCounts.placeholder || 0}`);
console.log(`  missing: ${imageStatusCounts.missing || 0}`);
console.log('Note: generated-local and placeholder images are local SVG illustrations, not official product photos.');

const confidenceCounts = {};
rings.forEach(r => {
  const c = r.price?.confidence || 'unknown';
  confidenceCounts[c] = (confidenceCounts[c] || 0) + 1;
});
console.log('\nPrice confidence:');
Object.entries(confidenceCounts).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

const perBrand = {};
brands.forEach(b => {
  perBrand[b.id] = { brand: b, rings: 0, placeholder: 0, remote: 0, local: 0, generated: 0 };
});
rings.forEach(r => {
  const entry = perBrand[r.brandId];
  if (!entry) return;
  entry.rings++;
  if (r.imageStatus === 'placeholder') entry.placeholder++;
  if (r.imageStatus === 'official-remote') entry.remote++;
  if (r.imageStatus === 'local') entry.local++;
  if (r.imageStatus === 'generated-local') entry.generated++;
});

console.log('\nPer brand (sorted by ring count):');
Object.values(perBrand)
  .sort((a, b) => b.rings - a.rings)
  .forEach(({ brand, rings, placeholder, remote, local, generated }) => {
    console.log(`  ${brand.id}: rings=${rings} local=${local} remote=${remote} generated=${generated} placeholder=${placeholder}`);
  });

const under5 = Object.values(perBrand).filter(x => x.rings > 0 && x.rings < 5).length;
console.log('\nBrands with < 5 rings:', under5);

let missingSourceUrls = 0;
rings.forEach(r => {
  if (!r.sourceUrls || !r.sourceUrls.length) missingSourceUrls++;
});
console.log('Rings missing sourceUrls:', missingSourceUrls);

let badGenderFit = 0;
rings.forEach(r => {
  if (!Array.isArray(r.genderFit) || !r.genderFit.length) badGenderFit++;
});
console.log('Rings with bad genderFit:', badGenderFit);

let badPairRefs = 0;
pairs.forEach(p => {
  if (!ringIds.has(p.maleRingId)) badPairRefs++;
  if (!ringIds.has(p.femaleRingId)) badPairRefs++;
});
console.log('Bad pair refs:', badPairRefs);

console.log('\n=== End ===');
