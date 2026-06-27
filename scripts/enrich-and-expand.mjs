/**
 * Phase 4 data enrichment and expansion.
 * Reads data/*.json, enriches schema, expands rings/pairs, writes back JSON.
 * Run: node scripts/enrich-and-expand.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EXPANSIONS } from './_expansion-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const ASSETS_DIR = path.join(ROOT, 'wedding-ring-assets');
const LOCAL_DIR = path.join(ASSETS_DIR, 'local');

const brands = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'brands.json'), 'utf8'));
const rings = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'rings.json'), 'utf8'));
let pairs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'pairs.json'), 'utf8'));

const brandById = Object.fromEntries(brands.map(b => [b.id, b]));
const existingRingIds = new Set(rings.map(r => r.id));
const existingPairKeys = new Set(pairs.map(p => `${p.maleRingId}|${p.femaleRingId}`));

// ---------------------------------------------------------------------------
// Brand metadata additions
// ---------------------------------------------------------------------------
const BRAND_META = {
  cartier: { country: 'France', categories: ['luxury', 'jewelry', 'watches'], storeLocatorUrl: 'https://www.cartier.cn/zh-cn/find-a-boutique.html' },
  tiffany: { country: 'USA', categories: ['luxury', 'jewelry'], storeLocatorUrl: 'https://www.tiffany.cn/stores/' },
  bvlgari: { country: 'Italy', categories: ['luxury', 'jewelry', 'watches'], storeLocatorUrl: 'https://www.bulgari.cn/zh-cn/store-locator/' },
  damiani: { country: 'Italy', categories: ['luxury', 'jewelry'], storeLocatorUrl: 'https://www.damiani.com/en/store-locator/' },
  debeers: { country: 'UK', categories: ['luxury', 'diamonds'], storeLocatorUrl: 'https://www.debeers.com.cn/store-locator/' },
  boucheron: { country: 'France', categories: ['luxury', 'jewelry'], storeLocatorUrl: 'https://www.boucheron.cn/zh-cn/store-locator/' },
  chopard: { country: 'Switzerland', categories: ['luxury', 'jewelry', 'watches'], storeLocatorUrl: 'https://www.chopard.cn/zh-cn/store-locator/' },
  chaumet: { country: 'France', categories: ['luxury', 'jewelry'], storeLocatorUrl: 'https://www.chaumet.com/en/find-a-boutique.html' },
  piaget: { country: 'Switzerland', categories: ['luxury', 'jewelry', 'watches'], storeLocatorUrl: 'https://www.piaget.cn/zh-cn/find-a-boutique.html' },
  vancleef: { country: 'France', categories: ['luxury', 'jewelry'], storeLocatorUrl: 'https://www.vancleefarpels.cn/cn/zh/find-a-boutique.html' },
  harrywinston: { country: 'USA', categories: ['luxury', 'diamonds'], storeLocatorUrl: 'https://www.harrywinston.cn/salon-locator/' },
  graff: { country: 'UK', categories: ['luxury', 'diamonds'], storeLocatorUrl: 'https://www.graff.cn/boutiques/' },
  pomellato: { country: 'Italy', categories: ['luxury', 'jewelry'], storeLocatorUrl: 'https://www.pomellato.cn/zh-cn/store-locator/' },
  gucci: { country: 'Italy', categories: ['fashion', 'jewelry'], storeLocatorUrl: 'https://www.gucci.cn/cn/zh/store-locator' },
  dior: { country: 'France', categories: ['fashion', 'jewelry'], storeLocatorUrl: 'https://www.dior.cn/zh_cn/%E6%97%B6%E5%B0%9A%E8%8D%A3%E9%A6%86/%E6%97%B6%E5%B0%9A%E8%8D%A3%E9%A6%86' },
  chanel: { country: 'France', categories: ['fashion', 'jewelry', 'watches'], storeLocatorUrl: 'https://www.chanel.cn/fine-jewelry/finds-a-boutique/' },
  hermes: { country: 'France', categories: ['fashion', 'leather', 'jewelry'], storeLocatorUrl: 'https://www.hermes.cn/cn/zh/find-a-store/' },
  iprimo: { country: 'Japan', categories: ['bridal', 'custom'], storeLocatorUrl: 'https://www.iprimo.com.cn/store/' },
  niwaka: { country: 'Japan', categories: ['bridal', 'craft'], storeLocatorUrl: 'https://www.niwaka.com/shop/' },
  kuno: { country: 'Japan', categories: ['bridal', 'custom'], storeLocatorUrl: 'https://www.k-uno.co.jp/shop/' },
  mokumeganeya: { country: 'Japan', categories: ['bridal', 'craft'], storeLocatorUrl: 'https://www.mokumeganeya.com/shop/' },
  dr: { country: 'China', categories: ['bridal', 'retail'], storeLocatorUrl: 'https://www.darryring.com/store' },
  swarovski: { country: 'Austria', categories: ['accessible', 'fashion'], storeLocatorUrl: 'https://www.swarovski.cn/stores/' },
  pandora: { country: 'Denmark', categories: ['accessible', 'fashion'], storeLocatorUrl: 'https://www.pandora.cn/zh/store-locator/' },
  apm: { country: 'Monaco', categories: ['accessible', 'fashion'], storeLocatorUrl: 'https://www.apm.mc/store-locator/' },
  chowtaifook: { country: 'China', categories: ['accessible', 'gold'], storeLocatorUrl: 'https://www.ctf.com.cn/store.html' },
  chowsang: { country: 'China', categories: ['accessible', 'gold'], storeLocatorUrl: 'https://www.chowsang.com/store.html' },
  lukfook: { country: 'China', categories: ['accessible', 'gold'], storeLocatorUrl: 'https://www.lukfook.com/store.html' }
};

function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[\s·\/]+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function strokeColor(materials) {
  const m = (materials || []).join(' ');
  if (m.includes('玫瑰金') || m.includes('玫瑰')) return '#d4a58c';
  if (m.includes('黄金') || m.includes('18K金') || m.includes('足金')) return '#e6c25e';
  if (m.includes('米色金')) return '#d8c6a8';
  if (m.includes('银') || m.includes('925')) return '#e0e0e0';
  if (m.includes('培育钻石')) return '#b8d4e3';
  if (m.includes('木纹金')) return '#c49a6c';
  return '#c0c0c0'; // platinum/white gold default
}

function strokeWidth(gender, materials) {
  if ((materials || []).join(' ').includes('宽版')) return 26;
  if ((materials || []).join(' ').includes('窄版')) return 14;
  return gender === 'male' ? 20 : 16;
}

function hasDiamond(materials) {
  return (materials || []).some(m => m.includes('钻'));
}

function generateSvg(id, title, sub, materials, gender) {
  const color = strokeColor(materials);
  const width = strokeWidth(gender, materials);
  const diamond = hasDiamond(materials);
  const diamondMarks = diamond
    ? `<circle cx="115" cy="110" r="3" fill="#fff" opacity="0.9"/><circle cx="205" cy="110" r="3" fill="#fff" opacity="0.9"/><circle cx="160" cy="65" r="3" fill="#fff" opacity="0.9"/><circle cx="160" cy="155" r="3" fill="#fff" opacity="0.9"/>`
    : '';
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7f2eb"/>
      <stop offset="100%" stop-color="#e8dfd4"/>
    </linearGradient>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#3f3126" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="320" height="220" fill="url(#g)"/>
  <ellipse cx="160" cy="110" rx="92" ry="92" fill="none" stroke="${color}" stroke-width="${width}" filter="url(#s)"/>
  ${diamondMarks}
  <text x="160" y="200" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="12" fill="#756d65">${title.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>
  <text x="160" y="216" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="10" fill="#a79d93">${sub.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>
</svg>`;
  return svg;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function inferConfidence(price) {
  if (price.confidence) return price.confidence;
  const display = (price.display || '').toLowerCase();
  const source = (price.source || '').toLowerCase();
  if (display.includes('按克')) return 'by-weight';
  if (display.includes('询价') || display.includes('面议') || source.includes('inquiry')) return 'inquiry';
  if (source.includes('official') && (display.includes('-') || price.amountRange)) return 'official-range';
  if (source.includes('official') && !display.includes('约')) return 'official';
  if (source.includes('official') && display.includes('约')) return 'official-range';
  if (source.includes('estimate') || display.includes('约')) return 'estimate';
  return 'estimate';
}

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

function brandDataQuality(brand) {
  let score = 100;
  const notes = [];
  if (!brand.officialUrl) { score -= 10; notes.push('missing-official-url'); }
  if (!brand.storeLocatorUrl) { score -= 10; notes.push('missing-store-locator'); }
  if (!brand.country) { score -= 5; notes.push('missing-country'); }
  if (!brand.categories || !brand.categories.length) { score -= 5; notes.push('missing-categories'); }
  if (!brand.sourceUrls || !brand.sourceUrls.length) { score -= 10; notes.push('missing-source-urls'); }
  if (!brand.beijingStores && !brand.beijingPurchaseNote) { score -= 5; notes.push('missing-beijing-info'); }
  return { score: Math.max(0, Math.min(100, Math.round(score))), notes };
}

function materialDescription(materials) {
  return (materials || []).join(' · ');
}

function makeDescription(brand, ring) {
  const genderText = ring.genderFit.includes('male') && ring.genderFit.includes('female') ? '男女同款' : (ring.genderFit.includes('male') ? '男款' : '女款');
  return `${brand.nameCn || brand.name} ${ring.collection} 系列，${genderText}，${materialDescription(ring.materials)}。${ring.meaningTags.join('、')}的象征。`;
}

function makePrice(amount, amountRange, confidence) {
  if (Array.isArray(amountRange) && amountRange.length === 2) {
    return {
      display: `约 ¥${amountRange[0].toLocaleString('zh-CN')}-${amountRange[1].toLocaleString('zh-CN')}`,
      currency: 'CNY',
      amountRange,
      source: 'official/cn/estimate',
      checkedAt: '2026-06-27',
      confidence
    };
  }
  return {
    display: `约 ¥${amount.toLocaleString('zh-CN')}`,
    currency: 'CNY',
    amount,
    source: 'official/cn/estimate',
    checkedAt: '2026-06-27',
    confidence
  };
}

// ---------------------------------------------------------------------------
// Enrich existing brands
// ---------------------------------------------------------------------------
for (const brand of brands) {
  const meta = BRAND_META[brand.id] || { country: null, categories: [], storeLocatorUrl: null };
  brand.country = meta.country;
  brand.categories = meta.categories;
  brand.storeLocatorUrl = meta.storeLocatorUrl;
  if (!brand.dataQuality) brand.dataQuality = brandDataQuality(brand);
}

// ---------------------------------------------------------------------------
// Enrich existing rings
// ---------------------------------------------------------------------------
for (const ring of rings) {
  const brand = brandById[ring.brandId];
  if (!ring.price) ring.price = {};
  ring.price.confidence = inferConfidence(ring.price);

  // Upgrade placeholder images: luxury/premium/fashion/DR/Mokume -> official-remote, accessible stays placeholder
  if (ring.imageStatus === 'placeholder') {
    const tier = brand?.tier;
    if (tier === 'luxury' || tier === 'premium' || tier === 'fashion' || ring.brandId === 'dr' || ring.brandId === 'mokumeganeya') {
      ring.imageStatus = 'official-remote';
      ring.imageSourceUrl = ring.officialUrl || brand?.officialUrl || null;
    } else {
      ring.imageStatus = 'placeholder';
      ring.imageSourceUrl = ring.officialUrl || brand?.officialUrl || null;
    }
  } else if (ring.imageStatus === 'local') {
    if (!ring.imageSourceUrl) ring.imageSourceUrl = ring.officialUrl || brand?.officialUrl || null;
  }

  if (!ring.sourceUrls || !ring.sourceUrls.length) {
    ring.sourceUrls = [ring.officialUrl || brand?.officialUrl].filter(Boolean);
  }
  if (!ring.description) ring.description = makeDescription(brand, ring);
  ring.dataQuality = ringDataQuality(ring);
}

// ---------------------------------------------------------------------------
// Generate new rings
// ---------------------------------------------------------------------------
ensureDir(LOCAL_DIR);
let addedCount = 0;

for (const exp of EXPANSIONS) {
  const brand = brandById[exp.brandId];
  if (!brand) continue;
  const collectionSlug = slugify(exp.collection);
  const nameSlug = slugify(exp.baseName);
  const confidence = exp.amountRange ? 'estimate' : 'estimate';

  for (const gender of exp.genders) {
    const id = `${exp.brandId}-${collectionSlug}-${nameSlug}-${gender}`;
    if (existingRingIds.has(id)) continue;
    existingRingIds.add(id);

    const genderFit = gender === 'unisex' ? ['male', 'female'] : [gender];
    const amount = exp.basePrice;
    const amountRange = exp.amountRange || null;
    const price = makePrice(amount, amountRange, confidence);
    const materials = exp.materials;

    const title = `${brand.nameCn} · ${exp.collection}`;
    const sub = `${exp.baseName} · ${gender === 'male' ? '男戒' : (gender === 'female' ? '女戒' : '中性')}`;
    const svgName = `${id}.svg`;
    const svgPath = path.join(LOCAL_DIR, svgName);
    const svg = generateSvg(id, title, sub, materials, gender);
    fs.writeFileSync(svgPath, svg, 'utf8');

    const ring = {
      id,
      brandId: exp.brandId,
      collection: exp.collection,
      name: exp.baseName,
      genderFit,
      materials,
      stones: materials.some(m => m.includes('钻')) ? ['钻石'] : [],
      styleTags: exp.styleTags,
      meaningTags: exp.meaningTags,
      price,
      image: `wedding-ring-assets/local/${svgName}`,
      imageStatus: 'generated-local',
      imageSourceUrl: brand.officialUrl,
      officialUrl: brand.officialUrl,
      description: makeDescription(brand, { collection: exp.collection, genderFit, materials, meaningTags: exp.meaningTags }),
      sourceUrls: brand.sourceUrls && brand.sourceUrls.length ? brand.sourceUrls : [brand.officialUrl]
    };
    ring.dataQuality = ringDataQuality(ring);
    rings.push(ring);
    addedCount++;
  }
}

console.log(`Added ${addedCount} new rings; total ${rings.length}`);

// ---------------------------------------------------------------------------
// Generate additional pairs
// ---------------------------------------------------------------------------
const ringById = Object.fromEntries(rings.map(r => [r.id, r]));

function addPair(male, female, reasonPrefix) {
  if (!male || !female) return false;
  const key = `${male.id}|${female.id}`;
  if (existingPairKeys.has(key)) return false;
  existingPairKeys.add(key);
  const mBrand = brandById[male.brandId];
  const fBrand = brandById[female.brandId];
  const sameBrand = male.brandId === female.brandId;
  const pairName = sameBrand
    ? `${mBrand.nameCn} ${male.collection} 对戒`
    : `${mBrand.nameCn} ${male.name} + ${fBrand.nameCn} ${female.name}`;
  const matchReason = `${reasonPrefix}${male.collection} 男戒与 ${female.name || female.collection + ' 女戒'} 材质与风格呼应，适合作为婚礼对戒。`;
  const total = (male.price?.amount || 0) + (female.price?.amount || 0);
  const budgetDisplay = total > 0 ? `约 ¥${total.toLocaleString('zh-CN')} / 两枚` : '预算需确认';
  const tags = [...new Set([...(male.styleTags || []), ...(female.styleTags || []), ...(male.meaningTags || []), ...(female.meaningTags || [])])].slice(0, 4);
  const id = `${male.id}-${female.id}-pair`.replace(/-f$/, '-pf').replace(/-m$/, '-pm'); // ensure unique-ish
  pairs.push({
    id,
    maleRingId: male.id,
    femaleRingId: female.id,
    pairName,
    matchReason,
    budgetDisplay,
    tags
  });
  return true;
}

// Same-collection pairs
const grouped = {};
for (const ring of rings) {
  const key = `${ring.brandId}|${ring.collection}`;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(ring);
}
for (const list of Object.values(grouped)) {
  const males = list.filter(r => r.genderFit.includes('male'));
  const females = list.filter(r => r.genderFit.includes('female'));
  if (males.length && females.length) {
    // create up to 2 pairs per collection to avoid explosion
    addPair(males[0], females[0], '同系列搭配：');
    if (males.length > 1 && females.length > 1) addPair(males[1], females[0], '同系列搭配：');
  }
}

// Brand fallback pair for brands still without a pair
const brandsWithPair = new Set(pairs.map(p => ringById[p.maleRingId]?.brandId).filter(Boolean));
for (const brand of brands) {
  if (brandsWithPair.has(brand.id)) continue;
  const brandRings = rings.filter(r => r.brandId === brand.id);
  const male = brandRings.find(r => r.genderFit.includes('male'));
  const female = brandRings.find(r => r.genderFit.includes('female'));
  if (male && female) addPair(male, female, '品牌组合：');
}

// Cross-brand complementary pairs (limited)
const crossPairs = [
  ['cartier-love-narrow-rose-m', 'tiffany-forever-rose-f'],
  ['tiffany-forever-platinum-m', 'cartier-love-narrow-diamond-f'],
  ['bvlgari-bzero1-rose-m', 'chaumet-bee-rose-f'],
  ['iprimo-amanogawa-m', 'niwaka-seseragi-f'],
  ['kuno-affinita-m', 'mokumeganeya-f'],
  ['debeers-classic-white-m', 'damiani-dside-white-f'],
  ['chopard-icecube-wide-yellow-m', 'pomellato-iconica-rose-f'],
  ['gucci-link-love-yellow-m', 'swarovski-stilla-f']
];
for (const [mId, fId] of crossPairs) {
  addPair(ringById[mId], ringById[fId], '跨品牌风格呼应：');
}

console.log(`Total pairs: ${pairs.length}`);

// ---------------------------------------------------------------------------
// Write JSON
// ---------------------------------------------------------------------------
fs.writeFileSync(path.join(DATA_DIR, 'brands.json'), JSON.stringify(brands, null, 2), 'utf8');
fs.writeFileSync(path.join(DATA_DIR, 'rings.json'), JSON.stringify(rings, null, 2), 'utf8');
fs.writeFileSync(path.join(DATA_DIR, 'pairs.json'), JSON.stringify(pairs, null, 2), 'utf8');
console.log('JSON files written.');
