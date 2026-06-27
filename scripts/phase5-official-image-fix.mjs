import fs from 'node:fs';

const ringsPath = new URL('../data/rings.json', import.meta.url);
const rings = JSON.parse(fs.readFileSync(ringsPath, 'utf8'));

const officialImages = {
  'gucci-icon-icon-18k-male': 'https://res-cms.gucci.cn/bz-gucci-store-prod/prod/GUCCI/2024-04-24/%E6%88%92%E6%8C%87_797405JCF278062-pc_08ee23f1-835c-458f-bb3a-cafc52722ded.jpg',
  'gucci-icon-icon-18k-female': 'https://res-cms.gucci.cn/bz-gucci-store-prod/prod/GUCCI/2024-04-24/%E6%88%92%E6%8C%87_797405JCF278062-pc_08ee23f1-835c-458f-bb3a-cafc52722ded.jpg',
  'gucci-interlocking-g-interlocking-g-male': 'https://res-cms.gucci.cn/bz-gucci-store-prod/prod/GUCCI/2024-06-07/796859I46008005-pc_9223dd2e-dfa6-4b86-af05-40921be797ab.jpg',
  'gucci-interlocking-g-interlocking-g-female': 'https://res-cms.gucci.cn/bz-gucci-store-prod/prod/GUCCI/2024-06-07/796566I46008005-pc_cc89954b-2254-4998-b5ce-c6403ca1feec.jpg',
  'gucci-flora-flora-female': 'https://res-cms.gucci.cn/bz-gucci-store-prod/prod/GUCCI/2024-06-07/797593I98758623-%E5%A5%B3%E5%A3%AB-pc_f93833f8-ebad-4e69-855c-caf45bd1ce30.jpg',
  'chanel-camlia-camlia-female': 'https://www.chanel.cn/images/t_one/q_auto:good,f_auto,fl_lossy,dpr_1.1/w_480/bouton-de-camelia-ring-white-white-gold-diamond-packshot-default-j12201-9580585517086.jpg'
};

let downgraded = 0;
let upgraded = 0;

for (const ring of rings) {
  if (ring.imageStatus === 'official-remote' && !/^https?:\/\//.test(ring.image || '')) {
    ring.imageStatus = String(ring.image || '').includes('/placeholders/') ? 'placeholder' : 'generated-local';
    ring.dataQuality = ring.dataQuality || {};
    ring.dataQuality.imageVerified = false;
    ring.dataQuality.notes = Array.from(new Set([...(ring.dataQuality.notes || []), 'remote-image-not-yet-replaced']));
    downgraded += 1;
  }

  const official = officialImages[ring.id];
  if (official) {
    ring.image = official;
    ring.imageStatus = 'official-remote';
    ring.imageSourceUrl = ring.officialUrl || ring.sourceUrls?.[0] || official;
    ring.dataQuality = ring.dataQuality || {};
    ring.dataQuality.imageVerified = true;
    ring.dataQuality.notes = (ring.dataQuality.notes || []).filter(note => note !== 'remote-image-not-yet-replaced');
    upgraded += 1;
  }
}

fs.writeFileSync(ringsPath, JSON.stringify(rings, null, 2) + '\n');
console.log(JSON.stringify({ downgraded, upgraded }, null, 2));
