import fs from 'node:fs';

const ringsPath = new URL('../data/rings.json', import.meta.url);
const rings = JSON.parse(fs.readFileSync(ringsPath, 'utf8'));

const updates = {
  'swarovski-stilla-m': {
    image: 'https://asset.swarovski.com/images/$size_1200/t_swa103/b_rgb:ffffff,c_scale,dpr_1.0,f_auto,w_360/5649213_png/stilla-%E6%88%92%E6%8C%87--%E5%A5%97%E8%A3%85-%282%29%EF%BC%8C%E5%9C%86%E5%BD%A2%E5%88%87%E5%89%B2--%E7%99%BD%E8%89%B2--%E9%95%80%E9%93%91-swarovski-5649213.png',
    officialUrl: 'https://www.swarovski.com.cn/zh-CN/p-M5649215/Stilla-%E6%88%92%E6%8C%87-%E5%A5%97%E8%A3%85-2-%E5%9C%86%E5%BD%A2%E5%88%87%E5%89%B2-%E7%99%BD%E8%89%B2-%E9%95%80%E9%93%91/?variantID=5649213'
  },
  'swarovski-stilla-f': {
    image: 'https://asset.swarovski.com/images/$size_1200/t_swa103/b_rgb:ffffff,c_scale,dpr_1.0,f_auto,w_360/5723332_png/stilla-%E4%B8%AA%E6%80%A7%E6%88%92%E6%8C%87--%E5%9C%86%E5%BD%A2%E5%88%87%E5%89%B2--%E7%99%BD%E8%89%B2--%E9%87%91%E8%89%B2%E9%A5%B0%E9%9D%A2-swarovski-5723332.png',
    officialUrl: 'https://www.swarovski.com.cn/zh-CN/p-M5642635/Stilla-%E4%B8%AA%E6%80%A7%E6%88%92%E6%8C%87-%E5%9C%86%E5%BD%A2%E5%88%87%E5%89%B2-%E7%99%BD%E8%89%B2-%E9%87%91%E8%89%B2%E9%A5%B0%E9%9D%A2/?variantID=5723332'
  },
  'swarovski-matrix-matrix-female': {
    image: 'https://asset.swarovski.com/images/$size_1200/t_swa103/b_rgb:ffffff,c_scale,dpr_1.0,f_auto,w_360/5714334_png/matrix-%E6%88%92%E6%8C%87--%E9%95%BF%E6%96%B9%E5%BD%A2%E5%88%87%E5%89%B2--%E7%99%BD%E8%89%B2--%E9%93%B6%E8%89%B2%E6%B6%A6%E9%A5%B0-swarovski-5714334.png',
    officialUrl: 'https://www.swarovski.com.cn/zh-CN/p-M5648286/Matrix-%E6%88%92%E6%8C%87-%E9%95%BF%E6%96%B9%E5%BD%A2%E5%88%87%E5%89%B2-%E7%99%BD%E8%89%B2-%E9%93%B6%E8%89%B2%E6%B6%A6%E9%A5%B0/?variantID=5714334'
  },
  'swarovski-vittore-vittore-male': {
    image: 'https://asset.swarovski.com/images/$size_1200/t_swa103/b_rgb:ffffff,c_scale,dpr_1.0,f_auto,w_360/5705603_png/matrix-vittore-%E6%88%92%E6%8C%87--%E5%9C%86%E5%BD%A2%E5%88%87%E5%89%B2--%E7%99%BD%E8%89%B2--%E9%93%B6%E8%89%B2%E6%B6%A6%E9%A5%B0-swarovski-5705603.png',
    officialUrl: 'https://www.swarovski.com.cn/zh-CN/p-M5705602/Matrix-Vittore-%E6%88%92%E6%8C%87-%E5%9C%86%E5%BD%A2%E5%88%87%E5%89%B2-%E7%99%BD%E8%89%B2-%E9%93%B6%E8%89%B2%E6%B6%A6%E9%A5%B0/?variantID=5705603'
  },
  'swarovski-vittore-vittore-female': {
    image: 'https://asset.swarovski.com/images/$size_1200/t_swa103/b_rgb:ffffff,c_scale,dpr_1.0,f_auto,w_360/5753849_png/matrix-vittore-%E6%88%92%E6%8C%87--%E5%9C%86%E5%BD%A2%E5%88%87%E5%89%B2--%E7%99%BD%E8%89%B2--%E9%87%91%E8%89%B2%E9%A5%B0%E9%9D%A2-swarovski-5753849.png',
    officialUrl: 'https://www.swarovski.com.cn/zh-CN/p-M5705602/Matrix-Vittore-%E6%88%92%E6%8C%87-%E5%9C%86%E5%BD%A2%E5%88%87%E5%89%B2-%E7%99%BD%E8%89%B2-%E9%87%91%E8%89%B2%E9%A5%B0%E9%9D%A2/?variantID=5753849'
  },
  'swarovski-dextera-dextera-male': {
    image: 'https://asset.swarovski.com/images/$size_1200/t_swa103/b_rgb:ffffff,c_scale,dpr_1.0,f_auto,w_360/5695935_png/dextera-%E6%88%92%E6%8C%87--%E7%99%BD%E8%89%B2--%E9%95%80%E9%93%91-swarovski-5695935.png',
    officialUrl: 'https://www.swarovski.com.cn/zh-CN/p-M5668810/Dextera-%E6%88%92%E6%8C%87-%E7%99%BD%E8%89%B2-%E9%95%80%E9%93%91/?variantID=5695935'
  },
  'swarovski-dextera-dextera-female': {
    image: 'https://asset.swarovski.com/images/$size_1200/t_swa103/b_rgb:ffffff,c_scale,dpr_1.0,f_auto,w_360/5668814_png/dextera-%E6%88%92%E6%8C%87--%E7%99%BD%E8%89%B2--%E9%87%91%E8%89%B2%E9%A5%B0%E9%9D%A2-swarovski-5668814.png',
    officialUrl: 'https://www.swarovski.com.cn/zh-CN/p-M5668810/Dextera-%E6%88%92%E6%8C%87-%E7%99%BD%E8%89%B2-%E9%87%91%E8%89%B2%E9%A5%B0%E9%9D%A2/?variantID=5668814'
  }
};

let updated = 0;
for (const ring of rings) {
  const update = updates[ring.id];
  if (!update) continue;
  ring.image = update.image;
  ring.imageStatus = 'official-remote';
  ring.imageSourceUrl = update.officialUrl;
  ring.officialUrl = update.officialUrl;
  ring.sourceUrls = Array.from(new Set([...(ring.sourceUrls || []), update.officialUrl]));
  ring.dataQuality = ring.dataQuality || {};
  ring.dataQuality.imageVerified = true;
  ring.dataQuality.imageMatchConfidence = 'sku';
  ring.dataQuality.notes = (ring.dataQuality.notes || []).filter(note => !['remote-image-not-yet-replaced'].includes(note));
  updated += 1;
}

fs.writeFileSync(ringsPath, JSON.stringify(rings, null, 2) + '\n');
console.log(JSON.stringify({ updated }, null, 2));
