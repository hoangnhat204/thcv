const KEY = 'thcv-plant-notifications-v1';
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const plantKey = plant => JSON.stringify([plant.demoId || '', plant.roomId, plant.index, plant.plantedAt]);

export function createPlantNotifications() {
  let saved = { known: [], read: [] };
  try { const value = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(value?.known) && Array.isArray(value?.read)) saved = value; } catch {}
  const known = new Set(saved.known), read = new Set(saved.read);
  let items = [];
  const button = document.getElementById('notification-button');
  button.querySelector('.bell-icon').innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>';
  const dialog = document.createElement('dialog');
  dialog.className = 'plant-notifications';
  dialog.setAttribute('aria-labelledby', 'notification-title');
  dialog.id = 'plant-notification-panel';
  button.setAttribute('aria-controls', dialog.id);
  button.setAttribute('aria-expanded', 'false');
  dialog.innerHTML = '<header><h2 id="notification-title">Thông báo cây mới</h2><button type="button" class="secondary" data-close aria-label="Đóng thông báo">×</button></header><div class="notification-toolbar"><span>Mới nhất</span><button type="button" class="secondary" data-read-all>Đọc tất cả</button></div><div class="notification-list"></div><section class="notification-detail" hidden></section>';
  document.body.append(dialog);
  const live = document.createElement('div');
  live.className = 'notification-live';
  live.setAttribute('role', 'status');
  document.body.append(live);
  function persist() { try { localStorage.setItem(KEY, JSON.stringify({ known: [...known].slice(-3000), read: [...read].slice(-3000) })); } catch {} }
  function render() {
    const unread = items.filter(item => !read.has(plantKey(item))).length;
    const badge = document.getElementById('notification-count');
    badge.hidden = !unread;
    badge.textContent = unread > 99 ? '99+' : String(unread);
    button.setAttribute('aria-label', `Thông báo cây mới, ${unread} chưa đọc`);
    dialog.querySelector('[data-read-all]').disabled = !unread;
    dialog.querySelector('.notification-list').innerHTML = items.length ? items.map((item, index) => `<button type="button" class="notification-item ${read.has(plantKey(item)) ? '' : 'unread'}" data-item="${index}"><span aria-hidden="true">🌱</span><span><strong>${escape(item.grower?.name || 'Bạn')} vừa trồng ${escape(item.flowerName)}</strong><small>${escape(item.grower?.school || 'Chưa cập nhật trường')}</small><small>${escape(new Date(item.plantedAt).toLocaleString('vi-VN'))}${read.has(plantKey(item)) ? '' : ' · Chưa đọc'}</small></span><span aria-hidden="true">›</span></button>`).join('') : '<p class="empty">Chưa có cây mới. Thông báo sẽ xuất hiện khi có người gieo cây.</p>';
  }
  function positionPanel() {
    const top = Math.min(button.getBoundingClientRect().bottom + 10, window.innerHeight - 180);
    dialog.style.top = `${Math.max(12, top)}px`;
    dialog.style.maxHeight = `${window.innerHeight - Math.max(12, top) - 12}px`;
  }
  button.addEventListener('click', () => {
    if (dialog.open) { dialog.close(); return; }
    render(); positionPanel(); dialog.show();
    button.setAttribute('aria-expanded', 'true');
  });
  dialog.addEventListener('close', () => { button.setAttribute('aria-expanded', 'false'); });
  document.addEventListener('click', event => {
    if (dialog.open && !dialog.contains(event.target) && !button.contains(event.target)) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) { dialog.close(); button.focus(); }
  });
  window.addEventListener('resize', () => { if (dialog.open) positionPanel(); });
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); }
    if (event.target.closest('[data-read-all]')) { items.forEach(item => read.add(plantKey(item))); persist(); render(); }
    const row = event.target.closest('[data-item]');
    if (!row) return;
    const item = items[Number(row.dataset.item)];
    read.add(plantKey(item)); persist(); render();
    const detail = dialog.querySelector('.notification-detail');
    detail.hidden = false;
    detail.innerHTML = `<h3>${escape(item.grower?.name || 'Bạn')}</h3><p>${escape(item.flowerName)} · ${escape(item.roomName)}</p><p>${escape(item.grower?.school || 'Chưa cập nhật trường')}</p><blockquote>${escape(item.grower?.message || 'Chưa có thông điệp')}</blockquote><small>${escape(new Date(item.plantedAt).toLocaleString('vi-VN'))} · ${item.stage === 5 ? 'Đã nở' : 'Đang lớn'}</small>`;
    detail.tabIndex = -1;
    detail.focus();
    detail.scrollIntoView({ block: 'nearest' });
  });
  return {
    update(plants) {
      items = plants.filter(plant => !plant.demoId).sort((a, b) => b.plantedAt - a.plantedAt);
      const added = items.filter(item => !known.has(plantKey(item)));
      items.forEach(item => known.add(plantKey(item)));
      persist(); render();
      if (added.length) {
        live.textContent = `Có ${added.length} cây mới trong khu vườn.`;
        button.classList.remove('has-new');
        void button.offsetWidth;
        button.classList.add('has-new');
      }
    },
  };
}
