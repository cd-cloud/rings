# Phase 5 交接报告：官方图片深挖与真实性修正

## 1. 完成摘要

- 完成：
  - 复核 `official-remote` 定义：只有 `image` 字段本身为品牌官网或官方 CDN 远程图片 URL，才保留为 `official-remote`。
  - 将 40 条“图片仍为本地 SVG、仅有官网来源链接”的记录降级为 `generated-local` 或 `placeholder`。
  - 从 Gucci 中国官网商品列表与 Chanel 中国官网页面提取首批可稳定访问的官方图片 URL，替换 6 条结构示意图。
  - 新增 `scripts/phase5-official-image-fix.mjs`，可复跑本轮图片状态修正。
- 未完成：
  - 大多数奢侈品牌官网仍未能稳定暴露具体商品图片，或只暴露分类/大片图，暂未替换。
  - 未使用社交平台、二手平台、无授权电商图。
- 风险：
  - Gucci 官网图片 URL 来自官方 CDN，但页面未提供清晰 alt 文本；当前仅用于同品牌/同类目款式参考，后续仍建议用逐 SKU 商品页替换。
  - Chanel 当前只确认替换 1 条 Camélia 戒指官方图。

## 2. 数据统计

| 指标 | Phase 4 | Phase 5 |
| --- | ---: | ---: |
| 品牌数 | 28 | 28 |
| 单款数 | 243 | 243 |
| 推荐组合数 | 119 | 119 |
| local 真实/本地官方图 | 50 | 50 |
| official-remote 真官方远程图 | 40* | 6 |
| generated-local 结构示意 | 141 | 135 |
| placeholder 结构示意 | 12 | 52 |
| 结构示意合计 | 153 | 187 |

`*` Phase 4 的 40 条 `official-remote` 中，图片字段仍为本地 SVG；Phase 5 已按更严格标准纠正。

## 3. 本轮替换图片

| 品牌 | 数量 | 来源 |
| --- | ---: | --- |
| Gucci | 5 | `https://res-cms.gucci.cn/...` Gucci 中国官网官方 CDN |
| Chanel | 1 | `https://www.chanel.cn/images/...` Chanel 中国官网 |

## 4. 审计结果

```text
Brands: 28
Rings: 243
Pairs: 119

Image status:
  local (official/local image): 50
  official-remote: 6
  generated-local (illustration): 135
  placeholder: 52
  missing: 0

Rings missing sourceUrls: 0
Rings with bad genderFit: 0
Bad pair refs: 0
```

## 5. 后续建议

1. 优先逐 SKU 深挖 Gucci、Chanel、Swarovski、Pandora、Cartier、Tiffany 的商品页，而不是使用分类页图。
2. 对 `official-remote` 增加可选字段 `imageVerifiedAt` 和 `imageMatchConfidence`。
3. 未来若找不到真实官方图，继续保留“结构示意”比误标为官方图更安全。
