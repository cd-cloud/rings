/*
 * rings-catalog-favorites-matching-mvp
 * Static MVP: loads data from window.RINGS_* globals, persists user state
 * to localStorage / IndexedDB through a single Storage facade.
 */

(function() {
  'use strict';

  // -------------------------------------------------------------------------
  // Storage facade: favorites/comments in localStorage, photos in IndexedDB
  // -------------------------------------------------------------------------
  const Storage = (function() {
    const LS = {
      maleFav: 'rings_male_fav_v1',
      femaleFav: 'rings_female_fav_v1',
      selectedMale: 'rings_selected_male_v1',
      selectedFemale: 'rings_selected_female_v1',
      comments: 'rings_comments_v1',
      userPairs: 'rings_user_pairs_v1'
    };

    function lsGet(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    }
    function lsSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
    function lsDel(key) { try { localStorage.removeItem(key); } catch {} }

    // IndexedDB for photos
    const DB_NAME = 'rings_catalog_db_v1';
    const STORE_NAME = 'photos';
    let dbPromise = null;

    function openDb() {
      if (dbPromise) return dbPromise;
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'ringId' });
          }
        };
      });
      return dbPromise;
    }

    async function getPhotoStore(mode) {
      const db = await openDb();
      return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
    }

    async function getPhotos(ringId) {
      try {
        const store = await getPhotoStore('readonly');
        return await new Promise((resolve, reject) => {
          const req = store.get(ringId);
          req.onsuccess = () => resolve(req.result?.items || []);
          req.onerror = () => reject(req.error);
        });
      } catch { return []; }
    }

    async function addPhoto(ringId, dataUrl) {
      try {
        const items = await getPhotos(ringId);
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        items.push({ id, dataUrl, date: new Date().toISOString() });
        // Keep last 8 photos per ring to avoid bloat
        while (items.length > 8) items.shift();
        const store = await getPhotoStore('readwrite');
        return await new Promise((resolve, reject) => {
          const req = store.put({ ringId, items });
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } catch (e) { console.error('IndexedDB photo save failed', e); }
    }

    async function removePhoto(ringId, photoId) {
      try {
        const items = (await getPhotos(ringId)).filter(p => p.id !== photoId);
        const store = await getPhotoStore('readwrite');
        if (items.length) store.put({ ringId, items });
        else store.delete(ringId);
      } catch (e) { console.error('IndexedDB photo remove failed', e); }
    }

    async function clearPhotos() {
      try {
        const store = await getPhotoStore('readwrite');
        await new Promise((resolve, reject) => {
          const req = store.clear();
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } catch (e) { console.error('IndexedDB photo clear failed', e); }
    }

    function getAll() {
      return {
        maleFavorites: lsGet(LS.maleFav, []),
        femaleFavorites: lsGet(LS.femaleFav, []),
        selectedMale: lsGet(LS.selectedMale, null),
        selectedFemale: lsGet(LS.selectedFemale, null),
        savedPairs: lsGet(LS.userPairs, []),
        comments: lsGet(LS.comments, {})
      };
    }

    function setAll(data, merge) {
      const existing = getAll();
      const next = merge ? {
        maleFavorites: [...new Set([...existing.maleFavorites, ...(data.maleFavorites || [])])],
        femaleFavorites: [...new Set([...existing.femaleFavorites, ...(data.femaleFavorites || [])])],
        savedPairs: [...(existing.savedPairs || []), ...(data.savedPairs || [])],
        comments: { ...existing.comments, ...(data.comments || {}) }
      } : {
        maleFavorites: data.maleFavorites || [],
        femaleFavorites: data.femaleFavorites || [],
        savedPairs: data.savedPairs || [],
        comments: data.comments || {}
      };
      lsSet(LS.maleFav, next.maleFavorites);
      lsSet(LS.femaleFav, next.femaleFavorites);
      lsSet(LS.userPairs, next.savedPairs);
      lsSet(LS.comments, next.comments);
      if (!merge) {
        lsDel(LS.selectedMale);
        lsDel(LS.selectedFemale);
      }
    }

    async function clearAll() {
      Object.values(LS).forEach(lsDel);
      await clearPhotos();
    }

    return {
      fav: {
        getMale: () => lsGet(LS.maleFav, []),
        setMale: ids => lsSet(LS.maleFav, ids),
        getFemale: () => lsGet(LS.femaleFav, []),
        setFemale: ids => lsSet(LS.femaleFav, ids),
        getSelectedMale: () => lsGet(LS.selectedMale, null),
        setSelectedMale: id => lsSet(LS.selectedMale, id),
        getSelectedFemale: () => lsGet(LS.selectedFemale, null),
        setSelectedFemale: id => lsSet(LS.selectedFemale, id),
      },
      comments: {
        getAll: () => lsGet(LS.comments, {}),
        setAll: obj => lsSet(LS.comments, obj),
        get: ringId => (lsGet(LS.comments, {})[ringId] || []),
        add: (ringId, text) => {
          const all = lsGet(LS.comments, {});
          if (!all[ringId]) all[ringId] = [];
          all[ringId].push({ text, date: new Date().toISOString() });
          lsSet(LS.comments, all);
        }
      },
      userPairs: {
        getAll: () => lsGet(LS.userPairs, []),
        setAll: arr => lsSet(LS.userPairs, arr),
        add: pair => {
          const all = lsGet(LS.userPairs, []);
          all.push(pair);
          lsSet(LS.userPairs, all);
        }
      },
      photos: { get: getPhotos, add: addPhoto, remove: removePhoto, clear: clearPhotos },
      getAll, setAll, clearAll
    };
  })();

  // -------------------------------------------------------------------------
  // Data helpers
  // -------------------------------------------------------------------------
  const brands = window.RINGS_BRANDS || [];
  const rings = window.RINGS_RINGS || [];
  const pairs = window.RINGS_PAIRS || [];

  const brandById = Object.fromEntries(brands.map(b => [b.id, b]));
  const ringById = Object.fromEntries(rings.map(r => [r.id, r]));

  function priceAmount(ring) {
    const p = ring.price;
    if (!p) return 0;
    if (typeof p === 'number') return p;
    if (p.amount != null) return p.amount;
    if (Array.isArray(p.amountRange)) return p.amountRange[1] || p.amountRange[0] || 0;
    return 0;
  }

  function pairTotal(pair) {
    const m = ringById[pair.maleRingId];
    const f = ringById[pair.femaleRingId];
    return (m ? priceAmount(m) : 0) + (f ? priceAmount(f) : 0);
  }

  function money(n) {
    return '¥' + Math.round(n).toLocaleString('zh-CN');
  }

  function genderLabel(fit) {
    const map = { male: '男戒', female: '女戒', unisex: '中性' };
    return (fit || []).map(g => map[g] || g).join(' / ');
  }

  function beijingNote(brandId) {
    const b = brandById[brandId];
    if (!b) return '';
    if (b.beijingStores) return '北京门店：' + b.beijingStores;
    if (b.beijingPurchaseNote) return b.beijingPurchaseNote;
    return '北京门店/专柜请以官网门店查询为准';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // -------------------------------------------------------------------------
  // Image compression
  // -------------------------------------------------------------------------
  function compressImage(file, maxWidth = 800, maxBytes = 200 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let w = img.width, h = img.height;
          if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          let q = 0.85;
          const tryEncode = () => {
            const dataUrl = canvas.toDataURL('image/jpeg', q);
            if (dataUrl.length > maxBytes && q > 0.25) { q -= 0.1; tryEncode(); }
            else resolve(dataUrl);
          };
          tryEncode();
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // -------------------------------------------------------------------------
  // Filter state
  // -------------------------------------------------------------------------
  const state = {
    tab: 'pairs', // pairs | singles | favorites
    filters: { search: '', budget: 'all', brand: 'all', material: 'all', style: 'all', gender: 'all' }
  };

  const materials = [...new Set(rings.flatMap(r => r.materials || []))].sort();
  const styles = [...new Set(rings.flatMap(r => r.styleTags || []))].sort();

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  function fallbackSvg(title, sub) {
    const color = '#c8cdd0';
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f7f2eb"/><stop offset="100%" stop-color="#e8dfd4"/></linearGradient><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#3f3126" flood-opacity="0.12"/></filter></defs><rect width="320" height="220" fill="url(#g)"/><ellipse cx="160" cy="110" rx="92" ry="92" fill="none" stroke="${color}" stroke-width="22" filter="url(#s)"/><text x="160" y="200" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="12" fill="#756d65">结构示意 · ${(title || '').replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text><text x="160" y="216" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="10" fill="#a79d93">${(sub || '').replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text></svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }

  window.RINGS_FALLBACK = function(img, title, sub) {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.src = fallbackSvg(title, sub);
    // Add placeholder badge if not present
    const card = img.closest('.card');
    if (card && !card.querySelector('.badge.placeholder')) {
      const badge = document.createElement('span');
      badge.className = 'badge placeholder';
      badge.textContent = '结构示意';
      const visual = card.querySelector('.visual');
      if (visual) visual.appendChild(badge);
    }
  };

  function imgHtml(src, alt, fallbackTitle, fallbackSub) {
    const ft = escapeHtml(fallbackTitle || alt || '');
    const fs = escapeHtml(fallbackSub || '');
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" onerror="window.RINGS_FALLBACK(this, '${ft}', '${fs}')">`;
  }

  function buildRingVisual(ring, brandName) {
    const placeholder = !ring.image || ring.imageStatus === 'placeholder';
    const alt = [brandName, ring.name].filter(Boolean).join(' ');
    return `
      <div class="visual single">
        ${placeholder ? '<span class="badge placeholder">结构示意</span>' : ''}
        ${imgHtml(ring.image, alt, ring.collection || ring.name, ring.brandId)}
      </div>`;
  }

  function buildPairVisual(pair) {
    const m = ringById[pair.maleRingId];
    const f = ringById[pair.femaleRingId];
    return `
      <div class="visual pair">
        <div class="person">
          ${m ? imgHtml(m.image, m.name, m.collection || m.name, m.brandId) : '<div class="placeholder">缺图</div>'}
          <div class="label"><b>男戒</b><span>${m ? m.name : ''}</span></div>
        </div>
        <div class="person">
          ${f ? imgHtml(f.image, f.name, f.collection || f.name, f.brandId) : '<div class="placeholder">缺图</div>'}
          <div class="label"><b>女戒</b><span>${f ? f.name : ''}</span></div>
        </div>
        <span class="badge">推荐组合</span>
      </div>`;
  }

  function buildRingCard(ring) {
    const brand = brandById[ring.brandId];
    const maleFav = Storage.fav.getMale();
    const femaleFav = Storage.fav.getFemale();
    const isMale = maleFav.includes(ring.id);
    const isFemale = femaleFav.includes(ring.id);
    const comments = Storage.comments.get(ring.id);
    return `
      <article class="card ring-card" data-id="${ring.id}">
        ${buildRingVisual(ring, brand ? brand.name : ring.brandId)}
        <div class="body">
          <div class="brand">${escapeHtml(brand ? brand.name : ring.brandId)}</div>
          <h2>${escapeHtml(ring.name)}</h2>
          <div class="meaning">${escapeHtml(ring.description || '')}</div>
          <div class="meta">
            <span>${genderLabel(ring.genderFit)}</span>
            <span>${escapeHtml((ring.materials || []).join(' · '))}</span>
            ${(ring.stones || []).length ? `<span>${escapeHtml(ring.stones.join(' · '))}</span>` : ''}
          </div>
          <div class="price">
            ${escapeHtml(ring.price?.display || '需询价')}
            <small>/ ${escapeHtml(ring.price?.source || '参考')}</small>
            <span class="checked">${escapeHtml(ring.price?.checkedAt || '')}</span>
          </div>
          <div class="tags">${(ring.styleTags || []).concat(ring.meaningTags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
          <div class="actions">
            <a class="primary" href="${escapeHtml(ring.officialUrl || '#')}" target="_blank" rel="noopener" aria-label="${escapeHtml(brand ? brand.name : ring.brandId)} 官网">官网</a>
            <button class="fav-male ${isMale ? 'active' : ''}" data-id="${ring.id}" aria-label="收藏 ${escapeHtml(ring.name)} 为男戒候选">${isMale ? '已' : ''}收藏为男戒候选</button>
            <button class="fav-female ${isFemale ? 'active' : ''}" data-id="${ring.id}" aria-label="收藏 ${escapeHtml(ring.name)} 为女戒候选">${isFemale ? '已' : ''}收藏为女戒候选</button>
          </div>
          <div class="store-note" style="margin-top:10px;font-size:11px;color:var(--muted);">${escapeHtml(ring.storeAvailabilityNote || beijingNote(ring.brandId))}</div>
          <button class="detail-toggle" aria-expanded="false" aria-label="查看或添加 ${escapeHtml(ring.name)} 的评论与照片">💬 评论/照片 (${comments.length})</button>
          <div class="detail-box">
            <h4>评论与试戴感受</h4>
            <div class="comments-list">${comments.map(c => `<div class="comment">${escapeHtml(c.text)}<time>${new Date(c.date).toLocaleDateString()}</time></div>`).join('') || '<div class="comment" style="color:#999;">暂无评论，按回车添加</div>'}</div>
            <input type="text" class="comment-input" placeholder="写下评论、试戴感受或价格备注，按回车保存" data-id="${ring.id}" aria-label="评论输入">
            <h4 style="margin-top:12px;">照片</h4>
            <div class="photos-list" data-id="${ring.id}"><span style="color:#999;font-size:11px;">加载中…</span></div>
            <label class="file-upload-label" aria-label="上传 ${escapeHtml(ring.name)} 的照片">
              <input type="file" accept="image/*" class="photo-input" data-id="${ring.id}">
              <span>选择照片上传</span>
            </label>
            <div class="photo-hint">图片会自动压缩后保存到浏览器本地（IndexedDB），每款最多保留 8 张。</div>
          </div>
        </div>
      </article>`;
  }

  function buildPairCard(pair) {
    const total = pairTotal(pair);
    return `
      <article class="card pair-card" data-id="${pair.id}">
        ${buildPairVisual(pair)}
        <div class="body">
          <div class="brand">推荐组合</div>
          <h2>${escapeHtml(pair.pairName)}</h2>
          <div class="meaning">${escapeHtml(pair.matchReason)}</div>
          <div class="price">${pair.budgetDisplay || money(total)} <small>/ 两枚参考</small></div>
          <div class="tags">${(pair.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
          <div class="actions">
            <button class="secondary view-pair" data-id="${pair.id}">查看款式详情</button>
          </div>
        </div>
      </article>`;
  }

  function applyFilters(list, type) {
    const q = state.filters.search.toLowerCase().trim();
    const max = state.filters.budget === 'all' ? Infinity : +state.filters.budget;
    const brand = state.filters.brand;
    const mat = state.filters.material;
    const sty = state.filters.style;
    const gender = state.filters.gender;

    return list.filter(item => {
      const isPair = type === 'pairs';
      const b = isPair ? null : brandById[item.brandId];
      const brandId = isPair ? null : item.brandId;
      const price = isPair ? pairTotal(item) : priceAmount(item);
      const text = isPair
        ? [item.pairName, item.matchReason, item.budgetDisplay].join(' ')
        : [item.name, item.collection, item.description, b?.name, b?.nameCn].join(' ');

      if (price > max) return false;
      if (q && !text.toLowerCase().includes(q)) return false;
      if (!isPair) {
        if (brand !== 'all' && brandId !== brand) return false;
        if (mat !== 'all' && !(item.materials || []).includes(mat)) return false;
        if (sty !== 'all' && !(item.styleTags || []).includes(sty)) return false;
        if (gender !== 'all' && !(item.genderFit || []).includes(gender)) return false;
      } else {
        if (brand !== 'all' && ringById[item.maleRingId]?.brandId !== brand && ringById[item.femaleRingId]?.brandId !== brand) return false;
        if (mat !== 'all') {
          const mats = new Set([...(ringById[item.maleRingId]?.materials || []), ...(ringById[item.femaleRingId]?.materials || [])]);
          if (!mats.has(mat)) return false;
        }
        if (sty !== 'all') {
          const tags = new Set([...(ringById[item.maleRingId]?.styleTags || []), ...(ringById[item.femaleRingId]?.styleTags || []), ...(item.tags || [])]);
          if (!tags.has(sty)) return false;
        }
      }
      return true;
    });
  }

  function renderCatalog() {
    const grid = document.getElementById('grid');
    const count = document.getElementById('count');
    let list = [];
    if (state.tab === 'pairs') {
      list = applyFilters(pairs, 'pairs');
      grid.innerHTML = list.length ? list.map(buildPairCard).join('') : '<div class="empty">没有符合条件的推荐组合，请放宽筛选条件。</div>';
    } else if (state.tab === 'singles') {
      list = applyFilters(rings, 'singles');
      grid.innerHTML = list.length ? list.map(buildRingCard).join('') : '<div class="empty">没有符合条件的款式，请放宽筛选条件。</div>';
    } else if (state.tab === 'favorites') {
      renderFavorites();
      return;
    }
    count.textContent = `${list.length} 条结果`;
    bindCardEvents();
    ensureImageFallbacks();
    loadPhotosAsync();
  }

  function renderTabs() {
    const tabs = document.getElementById('tabs');
    const maleCount = Storage.fav.getMale().length;
    const femaleCount = Storage.fav.getFemale().length;
    tabs.innerHTML = [
      { id: 'pairs', label: '推荐组合' },
      { id: 'singles', label: '款式目录' },
      { id: 'favorites', label: '收藏与匹配', count: maleCount + femaleCount }
    ].map(t => `<button class="tab ${state.tab === t.id ? 'active' : ''}" data-tab="${t.id}" aria-label="切换到${t.label}">${t.label}${t.count ? `<span class="count" aria-hidden="true">${t.count}</span>` : ''}</button>`).join('');
  }

  function renderRingDetail(ring) {
    const brand = brandById[ring.brandId];
    return `
      <div class="match-ring-detail">
        <div class="detail-brand">${escapeHtml(brand ? brand.name : ring.brandId)}</div>
        <div class="detail-name">${escapeHtml(ring.name)}</div>
        <div class="detail-meta">${escapeHtml((ring.materials || []).join(' · '))}</div>
        <div class="detail-price">${escapeHtml(ring.price?.display || '需询价')}</div>
        <a class="detail-link" href="${escapeHtml(ring.officialUrl || '#')}" target="_blank" rel="noopener">官网 →</a>
      </div>`;
  }

  function renderFavorites() {
    const grid = document.getElementById('grid');
    const count = document.getElementById('count');
    const maleIds = Storage.fav.getMale();
    const femaleIds = Storage.fav.getFemale();
    const selectedMale = Storage.fav.getSelectedMale();
    const selectedFemale = Storage.fav.getSelectedFemale();

    const maleRings = maleIds.map(id => ringById[id]).filter(Boolean);
    const femaleRings = femaleIds.map(id => ringById[id]).filter(Boolean);

    let html = '<div class="data-actions">';
    html += '<button id="exportData" class="secondary" aria-label="导出本地收藏、组合与评论">导出本地数据</button>';
    html += '<label class="file-label secondary" aria-label="导入本地数据"><input type="file" id="importData" accept="application/json" aria-label="选择本地数据 JSON 文件">导入本地数据</label>';
    html += '<button id="clearData" class="danger" aria-label="清空所有本地数据">清空本地数据</button>';
    html += '<span class="data-hint">导出不包含上传照片；照片仍保留在当前浏览器 IndexedDB 中。</span>';
    html += '</div>';

    html += '<div class="fav-panel">';
    html += renderFavList('male', maleRings, selectedMale, '男戒候选');
    html += renderFavList('female', femaleRings, selectedFemale, '女戒候选');
    html += '</div>';

    html += '<div class="match-result">';
    html += '<h3>生成临时组合</h3>';
    if (selectedMale && selectedFemale) {
      const m = ringById[selectedMale];
      const f = ringById[selectedFemale];
      const system = pairs.find(p => p.maleRingId === selectedMale && p.femaleRingId === selectedFemale);

      const mHasPrice = priceAmount(m) > 0;
      const fHasPrice = priceAmount(f) > 0;
      const total = mHasPrice && fHasPrice ? priceAmount(m) + priceAmount(f) : null;
      const overBudget = total && total > 100000;
      const budgetText = total ? `合计约 ${money(total)}` : '预算需人工确认（部分款式为询价/价格不明）';

      html += `
        <div class="match-combo detailed">
          <div class="match-side">${m ? imgHtml(m.image, m.name, m.collection || m.name, m.brandId) : ''}${renderRingDetail(m)}</div>
          <div class="match-plus">+</div>
          <div class="match-side">${f ? imgHtml(f.image, f.name, f.collection || f.name, f.brandId) : ''}${renderRingDetail(f)}</div>
        </div>
        <div class="match-budget ${overBudget ? 'over' : ''}">${budgetText}${overBudget ? ' · 超过 ¥100,000 预算' : ''}</div>
        ${system ? `
          <div class="match-system">
            <div class="system-reason"><b>系统推荐理由：</b>${escapeHtml(system.matchReason)}</div>
            <div class="tags">${(system.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
          </div>` : `
          <div class="match-system">
            <div class="system-reason">这是自定义组合，可填写备注后保存。</div>
          </div>`}
        <div class="match-reason"><input type="text" class="reason-input" id="matchReason" placeholder="写下你的组合理由或备注" value="${system ? escapeHtml(system.matchReason) : ''}"></div>
        <div class="match-actions"><button class="primary" id="saveCombo">保存这个组合</button><button id="clearCombo">清空选择</button></div>`;
    } else {
      html += '<div class="empty" style="padding:20px;">从上方两个列表中各选一枚戒指，即可生成临时组合。</div>';
    }
    html += '</div>';

    // Saved user pairs
    const saved = Storage.userPairs.getAll();
    if (saved.length) {
      html += '<div class="saved-pairs"><h3>已保存组合</h3>';
      html += saved.map((p, idx) => {
        const m = ringById[p.maleRingId];
        const f = ringById[p.femaleRingId];
        const total = (m && priceAmount(m)) + (f && priceAmount(f));
        return `<div class="saved-pair">
          <div class="saved-title">${escapeHtml(m?.name || '')} + ${escapeHtml(f?.name || '')}</div>
          <div class="saved-meta">${escapeHtml(p.reason || '')} · ${total ? money(total) : '预算需确认'}</div>
          <button class="remove-saved" data-idx="${idx}" title="删除">×</button>
        </div>`;
      }).join('');
      html += '</div>';
    }

    // System pairs that match selected rings
    if (selectedMale || selectedFemale) {
      const systemPairs = pairs.filter(p =>
        (!selectedMale || p.maleRingId === selectedMale) &&
        (!selectedFemale || p.femaleRingId === selectedFemale)
      );
      if (systemPairs.length) {
        html += '<div class="system-pairs"><h3>系统相关推荐</h3><div class="grid">' + systemPairs.map(buildPairCard).join('') + '</div></div>';
      }
    }

    grid.innerHTML = html;
    count.textContent = `男戒 ${maleRings.length} / 女戒 ${femaleRings.length}`;
    bindFavEvents();
    bindMatchEvents();
    bindDataActions();
    ensureImageFallbacks();
  }

  function renderFavList(gender, list, selectedId, title) {
    return `
      <div class="fav-list">
        <h3><span class="gender-${gender === 'male' ? 'm' : 'f'}">${title}</span></h3>
        ${list.length ? list.map(r => `
          <div class="fav-item ${selectedId === r.id ? 'selected' : ''}" data-gender="${gender}" data-id="${r.id}">
            ${imgHtml(r.image, r.name, r.collection || r.name, r.brandId)}
            <div class="info"><div class="name">${escapeHtml(r.name)}</div><div class="price">${escapeHtml(r.price?.display || '')}</div></div>
            <button class="remove" data-gender="${gender}" data-id="${r.id}" title="移除" aria-label="从${gender === 'male' ? '男戒' : '女戒'}候选中移除 ${escapeHtml(r.name)}">×</button>
          </div>
        `).join('') : '<div class="fav-empty">暂无收藏，去款式目录添加</div>'}
      </div>`;
  }

  // -------------------------------------------------------------------------
  // Event binding
  // -------------------------------------------------------------------------
  function bindFilters() {
    const ids = ['search', 'budget', 'brandFilter', 'materialFilter', 'styleFilter', 'genderFilter'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        const key = id.replace('Filter', '');
        state.filters[key] = el.value;
        updateUrl();
        renderCatalog();
      });
    });
  }

  function bindTabs() {
    document.getElementById('tabs').addEventListener('click', e => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      state.tab = tab.dataset.tab;
      updateUrl();
      renderTabs();
      renderCatalog();
      updateFilterVisibility();
    });
  }

  function updateFilterVisibility() {
    const genderFilter = document.getElementById('genderFilter');
    if (genderFilter) genderFilter.parentElement.style.display = state.tab === 'singles' ? 'block' : 'none';
  }

  function ensureImageFallbacks() {
    // Delayed scan for images that finish loading with 0 naturalWidth without firing error.
    // Only touch fully-loaded images; lazy/off-screen images are not complete yet and are ignored.
    setTimeout(() => {
      document.querySelectorAll('img').forEach(img => {
        if (!img.src || img.dataset.fallbackChecked) return;
        img.dataset.fallbackChecked = '1';
        if (img.complete && img.naturalWidth === 0) {
          const title = img.getAttribute('alt') || '';
          window.RINGS_FALLBACK(img, title, '');
        }
      });
    }, 1500);
  }

  function bindCardEvents() {
    document.querySelectorAll('.fav-male').forEach(btn => {
      btn.addEventListener('click', () => toggleFav('male', btn.dataset.id));
    });
    document.querySelectorAll('.fav-female').forEach(btn => {
      btn.addEventListener('click', () => toggleFav('female', btn.dataset.id));
    });
    document.querySelectorAll('.detail-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = btn.nextElementSibling;
        box.classList.toggle('open');
        const open = box.classList.contains('open');
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? '🔼 收起评论/照片' : `💬 评论/照片 (${Storage.comments.get(btn.nextElementSibling.querySelector('.comment-input').dataset.id).length})`;
      });
    });
    document.querySelectorAll('.comment-input').forEach(input => {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && input.value.trim()) {
          Storage.comments.add(input.dataset.id, input.value.trim());
          renderCatalog();
        }
      });
    });
    document.querySelectorAll('.photo-input').forEach(input => {
      input.addEventListener('change', async () => {
        const file = input.files[0]; if (!file) return;
        try {
          const dataUrl = await compressImage(file);
          await Storage.photos.add(input.dataset.id, dataUrl);
          renderCatalog();
        } catch (err) { alert('图片处理失败：' + err.message); }
      });
    });
    document.querySelectorAll('.view-pair').forEach(btn => {
      btn.addEventListener('click', () => {
        const pair = pairs.find(p => p.id === btn.dataset.id);
        if (!pair) return;
        // Show the two rings in singles tab
        state.tab = 'singles';
        state.filters.search = pair.pairName;
        document.getElementById('search').value = pair.pairName;
        updateUrl();
        renderTabs();
        renderCatalog();
        updateFilterVisibility();
      });
    });
  }

  function toggleFav(gender, id) {
    const key = gender === 'male' ? 'getMale' : 'getFemale';
    const setKey = gender === 'male' ? 'setMale' : 'setFemale';
    const list = Storage.fav[key]();
    const idx = list.indexOf(id);
    if (idx > -1) list.splice(idx, 1); else list.push(id);
    Storage.fav[setKey](list);
    renderTabs();
    renderCatalog();
  }

  function bindFavEvents() {
    document.querySelectorAll('.fav-item').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.closest('.remove')) return;
        const gender = item.dataset.gender;
        const id = item.dataset.id;
        if (gender === 'male') Storage.fav.setSelectedMale(id);
        else Storage.fav.setSelectedFemale(id);
        renderFavorites();
      });
    });
    document.querySelectorAll('.fav-item .remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const gender = btn.dataset.gender;
        const id = btn.dataset.id;
        const list = Storage.fav[gender === 'male' ? 'getMale' : 'getFemale']().filter(x => x !== id);
        Storage.fav[gender === 'male' ? 'setMale' : 'setFemale'](list);
        const selected = gender === 'male' ? Storage.fav.getSelectedMale() : Storage.fav.getSelectedFemale();
        if (selected === id) gender === 'male' ? Storage.fav.setSelectedMale(null) : Storage.fav.setSelectedFemale(null);
        renderTabs();
        renderFavorites();
      });
    });
  }

  function bindMatchEvents() {
    const save = document.getElementById('saveCombo');
    const clear = document.getElementById('clearCombo');
    if (save) save.addEventListener('click', () => {
      const reason = document.getElementById('matchReason').value.trim();
      const m = Storage.fav.getSelectedMale();
      const f = Storage.fav.getSelectedFemale();
      if (!m || !f) return;
      Storage.userPairs.add({ maleRingId: m, femaleRingId: f, reason, date: new Date().toISOString() });
      alert('组合已保存到本地');
      renderTabs();
    });
    if (clear) clear.addEventListener('click', () => {
      Storage.fav.setSelectedMale(null);
      Storage.fav.setSelectedFemale(null);
      renderFavorites();
    });
  }

  function bindDataActions() {
    const exportBtn = document.getElementById('exportData');
    const importInput = document.getElementById('importData');
    const clearBtn = document.getElementById('clearData');

    if (exportBtn) exportBtn.addEventListener('click', () => {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        ...Storage.getAll(),
        filters: { ...state.filters },
        tab: state.tab
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rings-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    if (importInput) importInput.addEventListener('change', async () => {
      const file = importInput.files[0];
      if (!file) return;
      const mode = confirm('点击“确定”执行合并导入（不会覆盖已有收藏和评论）；点击“取消”执行覆盖导入（会清空当前本地数据）。');
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data.version || !Array.isArray(data.maleFavorites) || !Array.isArray(data.femaleFavorites)) {
          throw new Error('文件格式不正确');
        }
        Storage.setAll(data, mode);
        alert(mode ? '合并导入成功' : '覆盖导入成功');
        renderTabs();
        renderCatalog();
      } catch (e) {
        alert('导入失败：' + e.message);
      }
      importInput.value = '';
    });

    if (clearBtn) clearBtn.addEventListener('click', async () => {
      if (!confirm('确定要清空所有本地数据吗？\n\n这将删除：收藏、已保存组合、评论、上传照片。\n此操作不可恢复。')) return;
      await Storage.clearAll();
      renderTabs();
      renderCatalog();
      alert('本地数据已清空');
    });

    document.querySelectorAll('.remove-saved').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = +btn.dataset.idx;
        const all = Storage.userPairs.getAll();
        all.splice(idx, 1);
        Storage.userPairs.setAll(all);
        renderFavorites();
      });
    });
  }

  async function loadPhotosAsync() {
    const lists = document.querySelectorAll('.photos-list');
    for (const list of lists) {
      const ringId = list.dataset.id;
      const photos = await Storage.photos.get(ringId);
      list.innerHTML = photos.length
        ? photos.map(p => `<img src="${escapeHtml(p.dataUrl)}" data-id="${p.id}" data-ring="${ringId}" title="${new Date(p.date).toLocaleDateString()}">`).join('')
        : '<span style="color:#999;font-size:11px;">暂无照片</span>';
    }
    document.querySelectorAll('.photos-list img').forEach(img => {
      img.addEventListener('click', () => openLightbox(img.src));
    });
  }

  function openLightbox(src) {
    const box = document.getElementById('lightbox');
    const img = box.querySelector('img');
    img.src = src;
    box.classList.add('open');
  }

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------
  function populateFilters() {
    const brandFilter = document.getElementById('brandFilter');
    brandFilter.innerHTML = '<option value="all">全部品牌</option>' + brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    const materialFilter = document.getElementById('materialFilter');
    materialFilter.innerHTML = '<option value="all">全部材质</option>' + materials.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');
    const styleFilter = document.getElementById('styleFilter');
    styleFilter.innerHTML = '<option value="all">全部风格</option>' + styles.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  }

  function applyStateToDom() {
    document.getElementById('search').value = state.filters.search;
    document.getElementById('budget').value = state.filters.budget;
    document.getElementById('brandFilter').value = state.filters.brand;
    document.getElementById('materialFilter').value = state.filters.material;
    document.getElementById('styleFilter').value = state.filters.style;
    document.getElementById('genderFilter').value = state.filters.gender;
  }

  function readUrlState() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('tab') && ['pairs', 'singles', 'favorites'].includes(params.get('tab'))) {
      state.tab = params.get('tab');
    }
    if (params.has('q')) state.filters.search = params.get('q');
    if (params.has('budget')) state.filters.budget = params.get('budget');
    if (params.has('brand')) state.filters.brand = params.get('brand');
    if (params.has('material')) state.filters.material = params.get('material');
    if (params.has('style')) state.filters.style = params.get('style');
    if (params.has('gender')) state.filters.gender = params.get('gender');
  }

  function updateUrl() {
    const params = new URLSearchParams();
    if (state.tab !== 'pairs') params.set('tab', state.tab);
    if (state.filters.search) params.set('q', state.filters.search);
    if (state.filters.budget !== 'all') params.set('budget', state.filters.budget);
    if (state.filters.brand !== 'all') params.set('brand', state.filters.brand);
    if (state.filters.material !== 'all') params.set('material', state.filters.material);
    if (state.filters.style !== 'all') params.set('style', state.filters.style);
    if (state.filters.gender !== 'all') params.set('gender', state.filters.gender);
    const qs = params.toString();
    const url = qs ? '?' + qs : window.location.pathname;
    try { window.history.replaceState({}, '', url); } catch {}
  }

  function init() {
    populateFilters();
    readUrlState();
    applyStateToDom();
    renderTabs();
    bindTabs();
    bindFilters();
    renderCatalog();

    document.getElementById('lightboxClose').addEventListener('click', () => {
      document.getElementById('lightbox').classList.remove('open');
    });
    updateFilterVisibility();
  }

  // Wait for DOM + data
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
