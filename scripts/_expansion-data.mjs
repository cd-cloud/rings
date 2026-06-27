/**
 * Expansion ring templates for Phase 4.
 * Each entry becomes one or more ring objects (male/female/unisex) depending on genders.
 */
export const EXPANSIONS = [
  // Cartier
  { brandId: 'cartier', collection: '1895', baseName: '1895 素圈', basePrice: 12000, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['经典', '素圈'], meaningTags: ['永恒', '承诺'] },
  { brandId: 'cartier', collection: '1895', baseName: '1895 窄版镶钻', basePrice: 28000, materials: ['铂金', '钻石'], genders: ['female'], styleTags: ['经典', '镶钻'], meaningTags: ['璀璨', '承诺'] },
  { brandId: 'cartier', collection: 'C de Cartier', baseName: 'C de Cartier 玫瑰金', basePrice: 10500, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['简约', 'LOGO'], meaningTags: ['经典', '承诺'] },
  { brandId: 'cartier', collection: 'C de Cartier', baseName: 'C de Cartier 白金', basePrice: 11000, materials: ['18K白金'], genders: ['male', 'female'], styleTags: ['简约', 'LOGO'], meaningTags: ['经典', '承诺'] },
  { brandId: 'cartier', collection: 'LOVE', baseName: 'LOVE 宽版镶钻 玫瑰金', basePrice: 32000, materials: ['18K玫瑰金', '钻石'], genders: ['female'], styleTags: ['经典', '螺丝图案', '镶钻'], meaningTags: ['永恒', '璀璨'] },
  { brandId: 'cartier', collection: 'LOVE', baseName: 'LOVE 窄版满钻 玫瑰金', basePrice: 68000, materials: ['18K玫瑰金', '钻石'], genders: ['female'], styleTags: ['经典', '螺丝图案', '满钻'], meaningTags: ['奢华', '永恒'] },
  { brandId: 'cartier', collection: 'Trinity', baseName: 'Trinity 三色金', basePrice: 13500, materials: ['18K黄金', '18K白金', '18K玫瑰金'], genders: ['male', 'female'], styleTags: ['经典', '三环'], meaningTags: ['情感', '承诺'] },

  // Tiffany
  { brandId: 'tiffany', collection: 'Forever', baseName: 'Forever 宽版 铂金', basePrice: 15500, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['经典', '素圈'], meaningTags: ['永恒', '承诺'] },
  { brandId: 'tiffany', collection: 'Forever', baseName: 'Forever 窄版半圈钻 铂金', basePrice: 35000, materials: ['铂金', '钻石'], genders: ['female'], styleTags: ['经典', '半圈钻'], meaningTags: ['璀璨', '永恒'] },
  { brandId: 'tiffany', collection: 'Lock', baseName: 'Lock 玫瑰金', basePrice: 18000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['现代', '锁扣'], meaningTags: ['守护', '承诺'] },
  { brandId: 'tiffany', collection: 'T True', baseName: 'T True 玫瑰金', basePrice: 14000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['现代', 'T字'], meaningTags: ['真实', '承诺'] },
  { brandId: 'tiffany', collection: 'Setting', baseName: 'Setting 六爪钻戒 铂金', basePrice: 80000, materials: ['铂金', '钻石'], genders: ['female'], styleTags: ['经典', '订婚'], meaningTags: ['永恒', '璀璨'] },

  // BVLGARI
  { brandId: 'bvlgari', collection: 'Dedicata a Venezia', baseName: 'Dedicata a Venezia 铂金', basePrice: 15000, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['浪漫', '古典'], meaningTags: ['永恒', '承诺'] },
  { brandId: 'bvlgari', collection: 'Serpenti Viper', baseName: 'Serpenti Viper 玫瑰金', basePrice: 22000, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['摩登', '蛇鳞'], meaningTags: ['智慧', '魅力'] },
  { brandId: 'bvlgari', collection: 'Serpenti Viper', baseName: 'Serpenti Viper 白金', basePrice: 20000, materials: ['18K白金'], genders: ['male'], styleTags: ['摩登', '蛇鳞'], meaningTags: ['智慧', '力量'] },
  { brandId: 'bvlgari', collection: 'Infinito', baseName: 'Infinito 玫瑰金', basePrice: 13000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['简约', '无限'], meaningTags: ['永恒', '承诺'] },
  { brandId: 'bvlgari', collection: 'B.zero1', baseName: 'B.zero1 白金', basePrice: 11500, materials: ['18K白金'], genders: ['male', 'female'], styleTags: ['经典', '螺旋'], meaningTags: ['突破', '永恒'] },

  // Damiani
  { brandId: 'damiani', collection: 'Belle Époque', baseName: 'Belle Époque 玫瑰金', basePrice: 18000, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['复古', '优雅'], meaningTags: ['浪漫', '璀璨'] },
  { brandId: 'damiani', collection: 'Margherita', baseName: 'Margherita 白金', basePrice: 16000, materials: ['18K白金'], genders: ['female'], styleTags: ['自然', '花朵'], meaningTags: ['幸福', '优雅'] },
  { brandId: 'damiani', collection: 'D.Side', baseName: 'D.Side 玫瑰金', basePrice: 14000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['经典', '几何'], meaningTags: ['永恒', '守护'] },
  { brandId: 'damiani', collection: 'Minou', baseName: 'Minou 白金', basePrice: 13000, materials: ['18K白金'], genders: ['male', 'female'], styleTags: ['简约', '优雅'], meaningTags: ['承诺', '经典'] },

  // De Beers
  { brandId: 'debeers', collection: 'Classic', baseName: 'Classic 铂金', basePrice: 15000, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['经典', '素圈'], meaningTags: ['永恒', '纯净'] },
  { brandId: 'debeers', collection: 'Classic', baseName: 'Classic 窄版镶钻 白金', basePrice: 26000, materials: ['18K白金', '钻石'], genders: ['female'], styleTags: ['经典', '镶钻'], meaningTags: ['璀璨', '永恒'] },
  { brandId: 'debeers', collection: 'DB Classic', baseName: 'DB Classic 单钻 铂金', basePrice: 45000, materials: ['铂金', '钻石'], genders: ['female'], styleTags: ['经典', '单钻'], meaningTags: ['永恒', '璀璨'] },

  // Boucheron
  { brandId: 'boucheron', collection: 'Quatre', baseName: 'Quatre Classique 玫瑰金', basePrice: 21000, materials: ['18K玫瑰金', '陶瓷'], genders: ['female'], styleTags: ['摩登', '四环'], meaningTags: ['力量', '优雅'] },
  { brandId: 'boucheron', collection: 'Quatre', baseName: 'Quatre Black 白金', basePrice: 19000, materials: ['18K白金', '陶瓷'], genders: ['male'], styleTags: ['摩登', '四环'], meaningTags: ['力量', '个性'] },
  { brandId: 'boucheron', collection: 'Epure', baseName: 'Epure 玫瑰金', basePrice: 14000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['简约', '建筑'], meaningTags: ['永恒', '守护'] },

  // Chopard
  { brandId: 'chopard', collection: 'Ice Cube', baseName: 'Ice Cube 白金', basePrice: 15000, materials: ['18K白金'], genders: ['male', 'female'], styleTags: ['摩登', '冰块'], meaningTags: ['现代', '永恒'] },
  { brandId: 'chopard', collection: 'Ice Cube', baseName: 'Ice Cube 单钻 白金', basePrice: 18000, materials: ['18K白金', '钻石'], genders: ['female'], styleTags: ['摩登', '单钻'], meaningTags: ['璀璨', '现代'] },
  { brandId: 'chopard', collection: 'Chopardissimo', baseName: 'Chopardissimo 玫瑰金', basePrice: 13000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['经典', '签名'], meaningTags: ['优雅', '承诺'] },
  { brandId: 'chopard', collection: 'Classic', baseName: 'Classic 铂金', basePrice: 12000, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['经典', '素圈'], meaningTags: ['永恒', '承诺'] },

  // Chaumet
  { brandId: 'chaumet', collection: 'Liens', baseName: 'Liens 玫瑰金', basePrice: 15200, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['经典', '连结'], meaningTags: ['缘分', '承诺'] },
  { brandId: 'chaumet', collection: 'Bee My Love', baseName: 'Bee My Love 白金', basePrice: 15800, materials: ['18K白金'], genders: ['male', 'female'], styleTags: ['自然', '蜂巢'], meaningTags: ['甜蜜', '永恒'] },
  { brandId: 'chaumet', collection: 'Bee My Love', baseName: 'Bee My Love 间隔镶钻 玫瑰金', basePrice: 22000, materials: ['18K玫瑰金', '钻石'], genders: ['female'], styleTags: ['自然', '蜂巢', '镶钻'], meaningTags: ['璀璨', '甜蜜'] },
  { brandId: 'chaumet', collection: 'Joséphine', baseName: 'Joséphine 加冕·爱 铂金', basePrice: 55000, materials: ['铂金', '钻石'], genders: ['female'], styleTags: ['华丽', '皇冠'], meaningTags: ['高贵', '璀璨'] },
  { brandId: 'chaumet', collection: 'Plume', baseName: 'Plume 铂金', basePrice: 14500, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['轻盈', '羽毛'], meaningTags: ['守护', '承诺'] },

  // Piaget
  { brandId: 'piaget', collection: 'Possession', baseName: 'Possession 单钻 玫瑰金', basePrice: 23000, materials: ['18K玫瑰金', '钻石'], genders: ['female'], styleTags: ['灵动', '旋转'], meaningTags: ['幸运', '璀璨'] },
  { brandId: 'piaget', collection: 'Possession', baseName: 'Possession 旋转 白金', basePrice: 21000, materials: ['18K白金'], genders: ['male'], styleTags: ['灵动', '旋转'], meaningTags: ['幸运', '力量'] },
  { brandId: 'piaget', collection: 'Piaget Polo', baseName: 'Piaget Polo 玫瑰金', basePrice: 18000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['运动', '优雅'], meaningTags: ['经典', '承诺'] },
  { brandId: 'piaget', collection: 'Possession', baseName: 'Possession 窄版 玫瑰金', basePrice: 18500, materials: ['18K玫瑰金'], genders: ['male'], styleTags: ['灵动', '旋转'], meaningTags: ['幸运', '优雅'] },

  // Van Cleef
  { brandId: 'vancleef', collection: 'Perlée', baseName: 'Perlée 单钻 玫瑰金', basePrice: 24000, materials: ['18K玫瑰金', '钻石'], genders: ['female'], styleTags: ['优雅', '金珠'], meaningTags: ['璀璨', '温柔'] },
  { brandId: 'vancleef', collection: 'Perlée', baseName: 'Perlée 签名 黄金', basePrice: 18500, materials: ['18K黄金'], genders: ['male'], styleTags: ['优雅', '签名'], meaningTags: ['经典', '永恒'] },
  { brandId: 'vancleef', collection: 'Estelle', baseName: 'Estelle 铂金', basePrice: 17000, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['经典', '素圈'], meaningTags: ['永恒', '承诺'] },
  { brandId: 'vancleef', collection: 'Perlée', baseName: 'Perlée 钻石 白金', basePrice: 42000, materials: ['18K白金', '钻石'], genders: ['female'], styleTags: ['华丽', '金珠'], meaningTags: ['璀璨', '优雅'] },

  // Harry Winston
  { brandId: 'harrywinston', collection: 'Classic', baseName: 'Classic Winston 铂金', basePrice: 36000, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['经典', '素圈'], meaningTags: ['永恒', '尊贵'] },
  { brandId: 'harrywinston', collection: 'Tryst', baseName: 'Tryst 单钻 铂金', basePrice: 68000, materials: ['铂金', '钻石'], genders: ['female'], styleTags: ['优雅', '单钻'], meaningTags: ['璀璨', '承诺'] },
  { brandId: 'harrywinston', collection: 'Traffic', baseName: 'Traffic 钻石 白金', basePrice: 95000, materials: ['18K白金', '钻石'], genders: ['female'], styleTags: ['摩登', '满钻'], meaningTags: ['奢华', '璀璨'] },
  { brandId: 'harrywinston', collection: 'Milgrain', baseName: 'Milgrain 铂金', basePrice: 32000, materials: ['铂金'], genders: ['male'], styleTags: ['复古', '珠边'], meaningTags: ['经典', '尊贵'] },

  // Graff
  { brandId: 'graff', collection: 'Spiral', baseName: 'Spiral 玫瑰金', basePrice: 30000, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['优雅', '螺旋'], meaningTags: ['永恒', '璀璨'] },
  { brandId: 'graff', collection: 'Laurence Graff Signature', baseName: 'Laurence Graff Signature 钻石 白金', basePrice: 65000, materials: ['18K白金', '钻石'], genders: ['female'], styleTags: ['经典', '刻面'], meaningTags: ['璀璨', '尊贵'] },
  { brandId: 'graff', collection: 'Laurence Graff Signature', baseName: 'Laurence Graff Signature 玫瑰金', basePrice: 28000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['经典', '刻面'], meaningTags: ['永恒', '力量'] },
  { brandId: 'graff', collection: 'Spiral', baseName: 'Spiral 白金', basePrice: 28000, materials: ['18K白金'], genders: ['male'], styleTags: ['优雅', '螺旋'], meaningTags: ['永恒', '力量'] },

  // Pomellato
  { brandId: 'pomellato', collection: 'Iconica', baseName: 'Iconica 钻石 玫瑰金', basePrice: 25000, materials: ['18K玫瑰金', '钻石'], genders: ['female'], styleTags: ['摩登', '金球'], meaningTags: ['璀璨', '自信'] },
  { brandId: 'pomellato', collection: 'Nudo', baseName: 'Nudo 玫瑰金', basePrice: 16000, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['糖果', '色彩'], meaningTags: ['独特', '甜蜜'] },
  { brandId: 'pomellato', collection: 'Nudo', baseName: 'Nudo 白金', basePrice: 15000, materials: ['18K白金'], genders: ['male'], styleTags: ['糖果', '色彩'], meaningTags: ['独特', '优雅'] },
  { brandId: 'pomellato', collection: 'Iconica', baseName: 'Iconica Slim 玫瑰金', basePrice: 14000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['摩登', '细圈'], meaningTags: ['简约', '自信'] },

  // Gucci
  { brandId: 'gucci', collection: 'Icon', baseName: 'Icon 18K金', basePrice: 9500, materials: ['18K黄金'], genders: ['male', 'female'], styleTags: ['经典', '双G'], meaningTags: ['时尚', '承诺'] },
  { brandId: 'gucci', collection: 'Interlocking G', baseName: 'Interlocking G 银', basePrice: 3500, materials: ['925银'], genders: ['male', 'female'], styleTags: ['街头', '双G'], meaningTags: ['时尚', '个性'] },
  { brandId: 'gucci', collection: 'Flora', baseName: 'Flora 玫瑰金', basePrice: 12000, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['自然', '花卉'], meaningTags: ['浪漫', '优雅'] },

  // Dior
  { brandId: 'dior', collection: 'Gem Dior', baseName: 'Gem Dior 玫瑰金', basePrice: 14000, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['现代', '几何'], meaningTags: ['独特', '承诺'] },
  { brandId: 'dior', collection: 'Oui', baseName: 'Oui 玫瑰金', basePrice: 18000, materials: ['18K玫瑰金', '钻石'], genders: ['female'], styleTags: ['浪漫', '密语'], meaningTags: ['承诺', '璀璨'] },
  { brandId: 'dior', collection: 'Bois de Rose', baseName: 'Bois de Rose 玫瑰金', basePrice: 16000, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['自然', '玫瑰'], meaningTags: ['浪漫', '优雅'] },

  // Chanel
  { brandId: 'chanel', collection: 'Coco Crush', baseName: 'Coco Crush 米金', basePrice: 18000, materials: ['18K米色金'], genders: ['female'], styleTags: ['摩登', '菱格纹'], meaningTags: ['优雅', '个性'] },
  { brandId: 'chanel', collection: 'Coco Crush', baseName: 'Coco Crush 窄版 米金', basePrice: 16500, materials: ['18K米色金'], genders: ['male'], styleTags: ['摩登', '菱格纹'], meaningTags: ['优雅', '力量'] },
  { brandId: 'chanel', collection: 'Ultra', baseName: 'Ultra 陶瓷 白金', basePrice: 22000, materials: ['精密陶瓷', '18K白金'], genders: ['female'], styleTags: ['黑白', '现代'], meaningTags: ['纯粹', '个性'] },
  { brandId: 'chanel', collection: 'Camélia', baseName: 'Camélia 玫瑰金', basePrice: 25000, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['优雅', '山茶花'], meaningTags: ['浪漫', '精致'] },

  // Hermès
  { brandId: 'hermes', collection: "Chaîne d'ancre", baseName: "Chaîne d'ancre 银", basePrice: 7500, materials: ['925银'], genders: ['male', 'female'], styleTags: ['经典', '锚链'], meaningTags: ['自由', '优雅'] },
  { brandId: 'hermes', collection: 'Galop', baseName: 'Galop 玫瑰金', basePrice: 19000, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['马术', '优雅'], meaningTags: ['灵动', '力量'] },
  { brandId: 'hermes', collection: "Chaîne d'ancre", baseName: "Chaîne d'ancre 玫瑰金", basePrice: 16000, materials: ['18K玫瑰金'], genders: ['male'], styleTags: ['经典', '锚链'], meaningTags: ['自由', '力量'] },

  // I-PRIMO
  { brandId: 'iprimo', collection: 'Aries', baseName: 'Aries 铂金', basePrice: 8200, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['日式', '星座'], meaningTags: ['勇敢', '守护'] },
  { brandId: 'iprimo', collection: 'Spica', baseName: 'Spica 铂金', basePrice: 8800, materials: ['铂金'], genders: ['female'], styleTags: ['日式', '麦穗'], meaningTags: ['丰收', '幸福'] },
  { brandId: 'iprimo', collection: 'Hercules', baseName: 'Hercules 玫瑰金', basePrice: 9000, materials: ['18K玫瑰金'], genders: ['male'], styleTags: ['日式', '力量'], meaningTags: ['守护', '力量'] },

  // NIWAKA
  { brandId: 'niwaka', collection: 'Hana', baseName: 'Hana 铂金', basePrice: 13000, materials: ['铂金'], genders: ['female'], styleTags: ['和风', '花朵'], meaningTags: ['纯洁', '幸福'] },
  { brandId: 'niwaka', collection: 'Asahi', baseName: 'Asahi 黄金', basePrice: 14000, materials: ['18K黄金'], genders: ['male'], styleTags: ['和风', '光芒'], meaningTags: ['希望', '温暖'] },
  { brandId: 'niwaka', collection: 'Kagerou', baseName: 'Kagerou 铂金', basePrice: 12000, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['和风', '涟漪'], meaningTags: ['温柔', '永恒'] },
  { brandId: 'niwaka', collection: 'Hoshi', baseName: 'Hoshi 玫瑰金', basePrice: 13500, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['和风', '星光'], meaningTags: ['闪耀', '浪漫'] },

  // K.UNO
  { brandId: 'kuno', collection: 'Stella', baseName: 'Stella 铂金', basePrice: 13500, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['定制', '星星'], meaningTags: ['闪耀', '守护'] },
  { brandId: 'kuno', collection: 'Lumiere', baseName: 'Lumiere 玫瑰金', basePrice: 15000, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['定制', '光芒'], meaningTags: ['温暖', '幸福'] },
  { brandId: 'kuno', collection: 'Mille', baseName: 'Mille 白金', basePrice: 13000, materials: ['18K白金'], genders: ['male'], styleTags: ['定制', '麦穗'], meaningTags: ['丰收', '守护'] },

  // Mokumeganeya
  { brandId: 'mokumeganeya', collection: 'Saisen', baseName: 'Saisen 木纹金', basePrice: 26000, materials: ['木纹金'], genders: ['male', 'female'], styleTags: ['传统', '木纹'], meaningTags: ['独一无二', '承诺'] },
  { brandId: 'mokumeganeya', collection: 'Kasane', baseName: 'Kasane 木纹金', basePrice: 28000, materials: ['木纹金'], genders: ['male', 'female'], styleTags: ['传统', '层叠'], meaningTags: ['融合', '永恒'] },
  { brandId: 'mokumeganeya', collection: 'Hikari', baseName: 'Hikari 木纹金', basePrice: 30000, materials: ['木纹金'], genders: ['female'], styleTags: ['传统', '光泽'], meaningTags: ['光芒', '珍贵'] },

  // DR
  { brandId: 'dr', collection: 'My Heart', baseName: 'My Heart 心形钻戒 白金', basePrice: 25000, materials: ['18K白金', '钻石'], genders: ['female'], styleTags: ['浪漫', '心形'], meaningTags: ['真心', '承诺'] },
  { brandId: 'dr', collection: 'Snow', baseName: 'Snow 六爪钻戒 白金', basePrice: 22000, materials: ['18K白金', '钻石'], genders: ['female'], styleTags: ['经典', '雪花'], meaningTags: ['纯洁', '永恒'] },
  { brandId: 'dr', collection: 'FOREVER', baseName: 'FOREVER 玫瑰金', basePrice: 8500, materials: ['18K玫瑰金'], genders: ['male', 'female'], styleTags: ['经典', '永恒'], meaningTags: ['承诺', '一生一次'] },

  // Swarovski
  { brandId: 'swarovski', collection: 'Matrix', baseName: 'Matrix 培育钻石 白金', basePrice: 4500, materials: ['925银', '培育钻石'], genders: ['female'], styleTags: ['闪耀', '现代'], meaningTags: ['璀璨', '可及'] },
  { brandId: 'swarovski', collection: 'Vittore', baseName: 'Vittore 培育钻石 白金', basePrice: 3500, materials: ['925银', '培育钻石'], genders: ['male', 'female'], styleTags: ['经典', '排钻'], meaningTags: ['优雅', '可及'] },
  { brandId: 'swarovski', collection: 'Dextera', baseName: 'Dextera 银', basePrice: 1800, materials: ['925银'], genders: ['male', 'female'], styleTags: ['前卫', '链条'], meaningTags: ['力量', '个性'] },

  // Pandora
  { brandId: 'pandora', collection: 'Timeless', baseName: 'Timeless 银', basePrice: 1300, materials: ['925银'], genders: ['male', 'female'], styleTags: ['经典', '闪耀'], meaningTags: ['永恒', '陪伴'] },
  { brandId: 'pandora', collection: 'Sparkling Halo', baseName: 'Sparkling Halo 银', basePrice: 1500, materials: ['925银', '立方氧化锆'], genders: ['female'], styleTags: ['闪耀', '光环'], meaningTags: ['璀璨', '浪漫'] },
  { brandId: 'pandora', collection: 'Bridal', baseName: 'Bridal 玫瑰金', basePrice: 2000, materials: ['925银镀玫瑰金'], genders: ['male', 'female'], styleTags: ['婚礼', '浪漫'], meaningTags: ['承诺', '甜蜜'] },
  { brandId: 'pandora', collection: 'Classic', baseName: 'Classic 银', basePrice: 1000, materials: ['925银'], genders: ['male', 'female'], styleTags: ['简约', '日常'], meaningTags: ['陪伴', '简单'] },

  // APM
  { brandId: 'apm', collection: 'Morse Code', baseName: 'Morse Code 银', basePrice: 1900, materials: ['925银'], genders: ['male', 'female'], styleTags: ['密语', '个性'], meaningTags: ['秘密', '连接'] },
  { brandId: 'apm', collection: 'Bonheur', baseName: 'Bonheur 银', basePrice: 1700, materials: ['925银'], genders: ['female'], styleTags: ['优雅', '闪耀'], meaningTags: ['幸福', '祝福'] },
  { brandId: 'apm', collection: 'Monaco', baseName: 'Monaco 玫瑰金', basePrice: 2200, materials: ['925银镀玫瑰金'], genders: ['male', 'female'], styleTags: ['经典', '星芒'], meaningTags: ['闪耀', '优雅'] },

  // Chow Tai Fook
  { brandId: 'chowtaifook', collection: 'T Mark', baseName: 'T Mark 铂金', basePrice: 9000, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['科技', '溯源'], meaningTags: ['透明', '承诺'] },
  { brandId: 'chowtaifook', collection: 'So In Love', baseName: 'So In Love 玫瑰金', basePrice: 6500, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['甜美', '爱心'], meaningTags: ['甜蜜', '浪漫'] },
  { brandId: 'chowtaifook', collection: '传承', baseName: '传承 黄金', basePrice: 6000, materials: ['足金'], genders: ['male', 'female'], styleTags: ['古法', '传承'], meaningTags: ['传承', '祝福'], amountRange: [4500, 8500] },
  { brandId: 'chowtaifook', collection: '1961', baseName: '1961 铂金', basePrice: 7000, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['现代', '简约'], meaningTags: ['永恒', '承诺'] },

  // Chow Sang
  { brandId: 'chowsang', collection: 'V&A', baseName: 'V&A 铂金', basePrice: 8500, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['复古', '皇家'], meaningTags: ['经典', '守护'] },
  { brandId: 'chowsang', collection: 'Fairy', baseName: 'Fairy 玫瑰金', basePrice: 6800, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['梦幻', '轻盈'], meaningTags: ['浪漫', '灵动'] },
  { brandId: 'chowsang', collection: 'Promessa', baseName: 'Promessa 18K金', basePrice: 7000, materials: ['18K金'], genders: ['male', 'female'], styleTags: ['定制', '同心'], meaningTags: ['承诺', '专属'] },

  // Luk Fook
  { brandId: 'lukfook', collection: 'Goldstyle', baseName: 'Goldstyle 黄金', basePrice: 5500, materials: ['足金'], genders: ['female'], styleTags: ['时尚', '足金'], meaningTags: ['闪耀', '祝福'], amountRange: [4500, 6500] },
  { brandId: 'lukfook', collection: 'Dear Q', baseName: 'Dear Q 玫瑰金', basePrice: 4800, materials: ['18K玫瑰金'], genders: ['female'], styleTags: ['少女', '甜美'], meaningTags: ['宠爱', '青春'] },
  { brandId: 'lukfook', collection: 'Hexicon', baseName: 'Hexicon 铂金', basePrice: 7500, materials: ['铂金'], genders: ['male', 'female'], styleTags: ['摩登', '六边形'], meaningTags: ['独特', '守护'] }
];
