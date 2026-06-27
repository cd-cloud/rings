/**
 * Sync data/*.json to data/*.js global variables.
 * Run: node scripts/build-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');

const files = [
  { json: 'brands.json', js: 'brands.js', varName: 'RINGS_BRANDS' },
  { json: 'rings.json', js: 'rings.js', varName: 'RINGS_RINGS' },
  { json: 'pairs.json', js: 'pairs.js', varName: 'RINGS_PAIRS' },
];

for (const { json, js, varName } of files) {
  const jsonPath = path.join(DATA_DIR, json);
  const jsPath = path.join(DATA_DIR, js);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const out = `/* Auto-generated from ${json}. Do not edit by hand. */\nwindow.${varName} = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(jsPath, out, 'utf8');
  console.log(`Wrote ${js} (${data.length} items)`);
}
