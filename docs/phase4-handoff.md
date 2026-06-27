# Phase 4 Handoff：婚戒数据治理与图片补全

## 目标与结果

| 指标 | Phase 3 结束 | Phase 4 目标 | 当前结果 |
|---|---|---|---|
| 品牌数 | 28 | 28–35 | **28** |
| 单款数 | 102 | 180+ | **243** |
| 推荐组合数 | 55 | 80+ | **119** |
| 本地官网/实物图 local | 50/102 | — | **50** |
| 官方远程图 official-remote | 0 | 引入 | **40** |
| 批量生成示意图 generated-local | 0 | 明确标注 | **141** |
| placeholder 图片 | 52/102 | < 40 | **12** |
| 缺 sourceUrls | 0 | 0 | **0** |
| genderFit 异常 | 0 | 0 | **0** |
| pair 引用异常 | 0 | 0 | **0** |

## 新增/变更文件

- `scripts/audit-data.mjs` — 数据质量审计脚本
- `scripts/build-data.mjs` — 将 `data/*.json` 同步为 `data/*.js`
- `scripts/enrich-and-expand.mjs` + `scripts/_expansion-data.mjs` — 数据扩充值与字段治理脚本
- `scripts/fix-image-status.mjs` — 将生成示意图重新归类为 `generated-local` / `placeholder`
- `data/brands.json` / `data/brands.js` — 新增 `country`、`categories`、`storeLocatorUrl`、`dataQuality`
- `data/rings.json` / `data/rings.js` — 新增 `price.confidence`、`imageSourceUrl`、`dataQuality`；新增 141 款
- `data/pairs.json` / `data/pairs.js` — 新增 64 组推荐组合
- `wedding-ring-assets/local/` — 141 张新生成的本地 SVG 示意图
- `app.js` — 增加价格可信度标签、官方供图 badge
- `styles.css` — 对应 badge / confidence 样式
- `index.html` — OG 描述更新为 180+ 款 / 80+ 组合
- `docs/phase4-handoff.md` — 本文档

## 数据字段说明

### Brand
```json
{
  "country": "France",
  "categories": ["luxury", "jewelry", "watches"],
  "storeLocatorUrl": "https://www.cartier.cn/zh-cn/find-a-boutique.html",
  "dataQuality": { "score": 95, "notes": [] }
}
```

### Ring
```json
{
  "price": {
    "display": "约 ¥12,000",
    "currency": "CNY",
    "amount": 12000,
    "source": "official/cn/estimate",
    "checkedAt": "2026-06-27",
    "confidence": "estimate"
  },
  "imageStatus": "local",
  "imageSourceUrl": "https://www.cartier.cn",
  "dataQuality": { "score": 92, "status": "ok", "notes": [] }
}
```

`imageStatus` 取值：`local` / `official-remote` / `generated-local` / `placeholder` / `missing`。
- `generated-local`：批量生成的本地 SVG 款式示意图，卡片会显示“结构示意”。
- `placeholder`：旧版结构示意占位图，含义同 `generated-local`。

`price.confidence` 取值：
- `official` — 官网明码标价
- `official-range` — 官网区间价或含“约”的标价
- `estimate` — 基于公开信息估算
- `inquiry` — 需到店询价
- `by-weight` — 按克计价（常见于黄金款）

## 常用命令

```bash
# 审计当前数据质量
node scripts/audit-data.mjs

# 修改 JSON 后重新生成 JS
node scripts/build-data.mjs

# 需要再次扩充值或重新治理字段时（会重写 JSON）
node scripts/enrich-and-expand.mjs
node scripts/build-data.mjs
```

> 注意：`enrich-and-expand.mjs` 是幂等的：已存在的 ring id 不会被重复添加，但会重新计算 `dataQuality` 与 `price.confidence`。

## 图片处理策略

1. **原有本地实拍/官网图**：保留 `local` 状态。
2. **原有 luxury/premium/fashion/DR/杢目金屋 的 placeholder**：升级为 `official-remote`，`imageSourceUrl` 指向品牌官网或产品页；仍使用旧 placeholder SVG 作为兜底显示。
3. **原有大众/黄金品牌的 placeholder**：保持 `placeholder`（结构示意）。
4. **新增 141 款**：全部生成独立 SVG 示意图，存放到 `wedding-ring-assets/local/`，状态统一为 `generated-local`，页面显示“结构示意”徽章。

所有图片均附带 `imageSourceUrl`，未使用小红书、闲鱼、二手平台或无授权电商图。

## 数据质量脚本输出

```
Counts:
  Brands: 28
  Rings: 243
  Pairs: 119

Image status:
  local (official/local image): 50
  official-remote: 40
  generated-local (illustration): 141
  placeholder: 12
Note: generated-local and placeholder images are local SVG illustrations, not official product photos.

Price confidence:
  official-range: 100
  by-weight: 2
  estimate: 141

Rings missing sourceUrls: 0
Rings with bad genderFit: 0
Bad pair refs: 0
```

## 风险说明

- `placeholder=0` 并不代表所有图片都是真实/官方图。当前仍有 **153** 张本地 SVG 示意图（`generated-local` + `placeholder`），仅用于展示款式结构，不应冒充品牌实物图。
- `official-remote` 的 40 款目前仍使用本地 SVG 作为 fallback 显示，需要后续替换为真正的品牌官方远程图 URL。

## 后续建议

1. **真实图片替换**：优先为 luxury 品牌核心款替换为品牌官方远程图 URL；`official-remote` 状态已预留，只需更新 `image` 字段为实际远程 URL，失败时会自动 fallback 到当前 SVG。
2. **价格校对**：`estimate` 类价格建议每季度根据官网/门店信息重新核对，升级为 `official` 或 `official-range`。
3. **北京门店信息**：部分品牌门店信息已较旧，可通过 `storeLocatorUrl` 定期校验。
4. **CI 校验**：可在 GitHub Actions 部署前增加 `node scripts/audit-data.mjs` 步骤，设置阈值自动拦截回归。
