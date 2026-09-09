import { createGarden } from './garden.js';

const paths = {
  infinity: '<path d="M12 12C9 6 2 6 2 12s7 6 10 0 10-6 10 0-7 6-10 0Z"/>',
  rainbow: '<path d="M2 18a10 10 0 0 1 20 0" stroke="#d38e8c"/><path d="M4 18a8 8 0 0 1 16 0" stroke="#dfa976"/><path d="M6 18a6 6 0 0 1 12 0" stroke="#dec269"/><path d="M8 18a4 4 0 0 1 8 0" stroke="#8da67e"/><path d="M10 18a2 2 0 0 1 4 0" stroke="#84a6bd"/><path d="M12 17v1" stroke="#aa92b6"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  school: '<path d="M3 10h18v11H3zM9 10V5l3-3 3 3v5M1 10l4-4h4m6 0h4l4 4M10 21v-6h4v6M6 13v2m12-2v2M6 18v1m12-1v1"/><circle cx="12" cy="7" r=".7"/>',
  sprout: '<path d="M12 22v-9M12 16C3 17 2 10 3 6c7-1 10 3 9 10ZM12 12C11 5 16 2 22 3c1 6-3 10-10 9ZM7 11l5 5m5-9-5 5"/>',
  flower: '<path d="M12 22v-8m0 5c0-4 4-5 7-4-1 3-3 5-7 4M8.8 4.3c-1-4.4 7.4-4.4 6.4 0 4.2-1.3 6.8 5.4 2.5 7 3 3.1-2.2 7.5-5.7 3.4-3.5 4.1-8.7-.3-5.7-3.4-4.3-1.6-1.7-8.3 2.5-7Z"/><circle cx="12" cy="9" r="2.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  leaf: '<path d="M20 3c-8-1-17 3-16 10s12 9 15 1c1-3 1-7 1-11ZM3 22 15 10M9 16v-5m0 5h5"/>',
  'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  'arrow-left': '<path d="M20 12H4m6-6-6 6 6 6"/>',
  'arrow-up-right': '<path d="M6 18 18 6M6 6h12v12"/>',
  'chevron-right': '<path d="m9 5 7 7-7 7"/>',
  'chevron-down': '<path d="m5 9 7 7 7-7"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  door: '<path d="M4 22V3h14v19M8 22V1l13 3v18ZM15 12h1M2 22h21"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9a2.6 2.6 0 0 1 5.2 0c0 2-2.6 2-2.6 4m0 3h.01"/>',
  x: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  droplet: '<path d="M12 2S4 11 4 15a8 8 0 0 0 16 0c0-4-8-13-8-13ZM8 15a4 4 0 0 0 4 4"/>',
  shovel: '<path d="m14 5 5 5M16 3l5 5-3 3-5-5zM14 10l-5 5m2-3 3 3-2 4c-2 3-7 3-9 2-1-2-1-7 2-9l3-2z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book: '<path d="M12 21V5M3 3c3-1 6 0 9 2 3-2 6-3 9-2v15c-3-1-6 0-9 2-3-2-6-3-9-2ZM6 7l3 1M6 11l3 1m6-4 3-1m-3 5 3-1"/>',
  sparkles: '<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6ZM20 2v4m-2-2h4M3 19v3m-1.5-1.5h3"/>',
  cap: '<path d="m2 8 10-5 10 5-10 5zM6 10v6c4 3 8 3 12 0v-6m4-2v8"/>',
  building: '<path d="M4 21V5h16v16M2 21h20M8 8h2m4 0h2M8 12h2m4 0h2m-6 9v-5h4v5M8 5V2h8v3"/>',
  pencil: '<path d="m15 4 5 5M3 21l6-1L21 8a2 2 0 0 0 0-3l-2-2a2 2 0 0 0-3 0L4 15zM4 15l5 5"/>',
  hand: '<path d="M8 13V5a2 2 0 0 1 4 0v6-2a2 2 0 0 1 4 0v3-1a2 2 0 0 1 4 0v6c0 4-2 6-6 6h-1c-3 0-4-1-6-4l-3-4c-2-3 1-5 3-2l1 1"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
};
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function icon(name, size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sprout}</svg>`;
}

document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });

const floors = [
  { id: 'university', floor: 4, name: 'Đại học', label: 'Tầng 4', icon: 'cap', color: '#9e96ad', bg: '#efedf2', classes: ['Đại học'], short: ['ĐẠI HỌC'] },
  { id: 'college', floor: 3, name: 'Cao đẳng', label: 'Tầng 3', icon: 'building', color: '#8c9ba8', bg: '#eaf0f2', classes: ['Cao đẳng'], short: ['CAO ĐẲNG'] },
  { id: 'high', floor: 2, name: 'Trung học phổ thông', label: 'Tầng 2', icon: 'book', color: '#aa9980', bg: '#f3eee1', classes: ['Lớp 10', 'Lớp 11', 'Lớp 12'], short: ['LỚP 10', 'LỚP 11', 'LỚP 12'] },
  { id: 'middle', floor: 1, name: 'Trung học cơ sở', label: 'Tầng 1', icon: 'pencil', color: '#ba9883', bg: '#f4eae1', classes: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'], short: ['LỚP 6', 'LỚP 7', 'LỚP 8', 'LỚP 9'] },
  { id: 'primary', floor: 0, name: 'Tiểu học', label: 'Tầng trệt', icon: 'sprout', color: '#8ba371', bg: '#e7eddc', classes: ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'], short: ['LỚP 1', 'LỚP 2', 'LỚP 3', 'LỚP 4', 'LỚP 5'] },
];

const rooms = floors.flatMap(floor => floor.classes.map((name, index) => ({ id: `${floor.id}-${index + 1}`, name, level: floor.name, floor: floor.floor, floorId: floor.id })));
let selectedFloor = 'primary';
let activeView = 'school';
let transitioning = false;
let toastTimer;
let gardenSearch = { query: '', className: '', school: '', date: '' };
let hasSearched = false;

function notify(message) {
  const toast = document.getElementById('toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3400);
}

const garden = createGarden({
  container: document.getElementById('garden-view'),
  onChange: () => {
    updateStats();
    renderRecentSchoolPlants();
  },
  onBack: () => showView('school'),
  notify,
  icons: icon,
});
garden.loadRemote();

const LIBRARY_KEY = 'thcv-library-v1';
async function showLibrary() {
  let books = [];
  try {
    const saved = JSON.parse(localStorage.getItem(LIBRARY_KEY) || '[]');
    books = Array.isArray(saved) ? saved : [];
  } catch {
    notify('Thư viện chưa thể tải dữ liệu.');
    return;
  }
  const old = document.querySelector('.library-modal');
  if (old) old.remove();
  const renderLibrary = currentBooks => document.body.insertAdjacentHTML('beforeend', `<div class="library-modal" role="dialog" aria-modal="true"><div class="library-card"><span class="library-decor library-decor-left">🌿🌸🌼</span><span class="library-decor library-decor-right">🌺🍃🌻</span><button class="library-close" type="button" aria-label="Đóng">×</button><section class="library-shelf-view"><p class="garden-eyebrow">PHÒNG THƯ VIỆN</p><h2>Tủ sách</h2><div class="library-books">${currentBooks.length ? currentBooks.map((book, index) => `<button class="library-book" data-book-id="${escapeHtml(book.id)}"><span class="book-cover"><i></i></span><strong>${index + 1}</strong><small>${escapeHtml(book.title)}</small></button>`).join('') : '<p class="library-empty">Thư viện chưa có sách.</p>'}</div></section><article class="library-reader hidden" id="library-reader"><button class="library-back" type="button">← Về tủ sách</button><div class="paper-book"><div class="paper-page paper-page-left"><span class="page-number"></span><h3></h3><pre></pre></div><div class="paper-page paper-page-right"><span class="page-number"></span><pre></pre></div></div><div class="book-controls"><button type="button" data-page="prev" aria-label="Trang trước">←</button><span class="page-indicator"></span><button type="button" data-page="next" aria-label="Trang sau">→</button></div></article></div></div>`);
  try {
    const response = await fetch('/api/books');
    if (response.ok) {
      const payload = await response.json();
      books = Array.isArray(payload.books) ? payload.books : books;
    }
  } catch {
    // Local storage remains available when Neon is not configured.
  }
  renderLibrary(books);
  const modal = document.querySelector('.library-modal');
  const close = () => modal?.remove();
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.closest('.library-close')) close();
    const back = event.target.closest('.library-back');
    if (back) {
      modal.querySelector('.library-reader').classList.add('hidden');
      modal.querySelector('.library-shelf-view').classList.remove('hidden');
      return;
    }
    const bookButton = event.target.closest('[data-book-id]');
    if (bookButton) {
      const book = books.find(item => item.id === bookButton.dataset.bookId);
      if (!book) return;
      const reader = modal.querySelector('#library-reader');
      const pages = [];
      const isUnreadableBinary = book.binary || /[\u0000\uFFFD]/.test(String(book.content || '')) || String(book.content || '').startsWith('PK');
      const text = isUnreadableBinary
        ? `Tệp Word "${book.fileName || book.title}" đã được lưu nguyên vẹn.\n\nBạn có thể mở tệp bằng Microsoft Word hoặc tải tệp xuống để đọc.`
        : String(book.content || '');
      for (let index = 0; index < text.length || index === 0; index += 1050) pages.push(text.slice(index, index + 1050));
      reader.dataset.page = '0';
      reader.dataset.pages = JSON.stringify(pages);
      reader.querySelector('h3').textContent = book.title;
      renderLibraryPage(reader, pages, 0);
      modal.querySelector('.library-shelf-view').classList.add('hidden');
      reader.classList.remove('hidden');
      return;
    }
    const pageButton = event.target.closest('[data-page]');
    if (pageButton) {
      const reader = modal.querySelector('#library-reader');
      const pages = JSON.parse(reader.dataset.pages || '[]');
      const current = Number(reader.dataset.page || 0);
      const next = Math.max(0, Math.min(pages.length - 1, current + (pageButton.dataset.page === 'next' ? 1 : -1)));
      if (next !== current) {
        reader.dataset.page = String(next);
        renderLibraryPage(reader, pages, next);
      }
    }
  });
}

function showAdministration() {
  const old = document.querySelector('.contact-modal');
  if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', `<div class="contact-modal" role="dialog" aria-modal="true"><div class="contact-card"><button class="library-close contact-close" type="button" aria-label="Đóng">×</button><span class="contact-decor">🌼🌿🌸</span><p class="garden-eyebrow">PHÒNG HÀNH CHÍNH</p><h2>Thông tin liên lạc và tư vấn</h2><section class="contact-section"><h3>Địa chỉ</h3><a href="https://maps.google.com/?q=306%2FN12%20khu%20d%C3%A2n%20c%C6%B0%20H%C3%A0ng%20B%C3%A0ng%2C%20Ph%C6%B0%E1%BB%9Dng%20T%C3%A2n%20An%2C%20TP%20C%E1%BA%A7n%20Th%C6%A1" target="_blank" rel="noopener noreferrer">⌖ <span>306/N12 khu dân cư Hàng Bàng, Phường Tân An, TP Cần Thơ</span></a></section><section class="contact-section"><h3>Liên kết</h3><a href="https://cauvongcantho.com" target="_blank" rel="noopener noreferrer">↗ <span>cauvongcantho.com</span></a></section><section class="contact-section"><h3>Thông tin liên hệ</h3><a href="https://www.tiktok.com/@cauvongcantho" target="_blank" rel="noopener noreferrer">♪ <span>cauvongcantho</span></a><a href="tel:0949207737">☎ <span>094 920 77 37</span></a><a href="mailto:cauvongcantho@gmail.com">✉ <span>cauvongcantho@gmail.com</span></a><a href="https://www.facebook.com/cauvongcantho" target="_blank" rel="noopener noreferrer">◉ <span>Cầu Vồng Cần Thơ</span></a></section></div></div>`);
  const modal = document.querySelector('.contact-modal');
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.closest('.contact-close')) modal.remove();
  });
}

function showPrincipal() {
  const old = document.querySelector('.principal-modal');
  if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', `<div class="principal-modal" role="dialog" aria-modal="true" aria-labelledby="principal-title"><div class="principal-card"><button class="library-close principal-close" type="button" aria-label="Đóng">×</button><span class="contact-decor">🌿📚🌼</span><div class="principal-teacher" aria-hidden="true"><span class="teacher-sparkle">✦</span><div class="teacher-head">👨‍🏫</div><div class="teacher-body"><span></span></div></div><div class="principal-message"><p class="garden-eyebrow">LỜI NHẮN TỪ THẦY HIỆU TRƯỞNG</p><h2 id="principal-title"></h2><p>Hãy chăm chỉ học tập, tôn trọng sự khác biệt và luôn lắng nghe nhau.</p><p>Mỗi lời nói tử tế góp phần giảm thiểu sự phân biệt đối xử, để môi trường học đường trở nên an toàn, bình đẳng và khoan dung.</p><strong>Thầy tin các em sẽ cùng nhau làm được!</strong></div></div></div>`);
  const modal = document.querySelector('.principal-modal');
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.closest('.principal-close')) modal.remove();
  });
}

function showMultiPurposeRoom() {
  const planted = garden.getStats().planted;
  if (planted >= 1000) {
    notify('Phòng đa năng đã mở cửa đón học sinh, sinh viên.');
    return;
  }
  const old = document.querySelector('.construction-modal');
  if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', `<div class="construction-modal" role="dialog" aria-modal="true" aria-labelledby="construction-title"><div class="construction-card"><button class="library-close construction-close" type="button" aria-label="Đóng">×</button><span class="contact-decor">🏗️🌱</span><div class="construction-icon">🏫</div><p class="garden-eyebrow">PHÒNG ĐA NĂNG</p><h2 id="construction-title">Phòng đang xây dựng</h2><p>Khi số lượng học sinh, sinh viên của trường đạt <strong>1.000 người</strong>, tương đương với <strong>1.000 hoa đã trồng</strong>, phòng đa năng sẽ mở cửa.</p><div class="construction-progress"><span style="width:${Math.min(100, planted / 10)}%"></span></div><small>Hiện đã có ${planted.toLocaleString('vi-VN')} / 1.000 hoa được trồng.</small></div></div>`);
  const modal = document.querySelector('.construction-modal');
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.closest('.construction-close')) modal.remove();
  });
}

function renderLibraryPage(reader, pages, page) {
  const midpoint = Math.ceil(pages.length / 2);
  const left = pages[page] || '';
  const right = pages[page + 1] || '';
  reader.querySelector('.paper-page-left h3').textContent = page === 0 ? reader.querySelector('h3').textContent : '';
  reader.querySelector('.paper-page-left pre').textContent = left;
  reader.querySelector('.paper-page-right pre').textContent = right;
  reader.querySelector('.paper-page-left .page-number').textContent = page * 2 + 1;
  reader.querySelector('.paper-page-right .page-number').textContent = right ? page * 2 + 2 : '';
  reader.querySelector('.page-indicator').textContent = `Trang ${page + 1} / ${Math.max(1, midpoint)}`;
  reader.querySelector('[data-page="prev"]').disabled = page === 0;
  reader.querySelector('[data-page="next"]').disabled = page >= pages.length - 1;
  reader.querySelector('.paper-book').classList.remove('is-turning');
  void reader.querySelector('.paper-book').offsetWidth;
  reader.querySelector('.paper-book').classList.add('is-turning');
}

function renderSchool() {
  document.getElementById('flower-search-view')?.classList.remove('hidden');
  document.getElementById('school-building').innerHTML = `
    <div class="roof-weather-vane"></div><div class="roof-chimney"></div>
    <div class="building-roof"><span class="roof-sign">${icon('rainbow')}<span class="roof-sign-copy"><strong>TRƯỜNG HỌC CẦU VỒNG</strong><small>ĐA DẠNG LÀ BÌNH THƯỜNG, SINH RA ĐỂ YÊU THƯƠNG.<br />AN TOÀN - BÌNH ĐẲNG VÀ KHOAN DUNG.</small></span></span></div>
    <div class="school-floors">${floors.map(floor => `
      <div class="school-floor ${floor.id === selectedFloor ? 'is-selected' : ''}" data-floor="${floor.id}" role="group" aria-label="${floor.label} — ${floor.name}">
        ${floor.classes.map((name, index) => `
          <div class="classroom">
            <span class="room-name" aria-hidden="true">${floor.short[index]}</span>
            <span class="class-window" aria-hidden="true"><i></i>${floor.floor === 3 || (floor.floor === 1 && index % 2 === 0) ? '<span class="flower-box"></span>' : ''}</span>
            <button class="class-door" data-room="${floor.id}-${index + 1}" data-tooltip="Vườn ${name.toLowerCase()}" aria-label="Mở cửa ${name} — ${floor.name}">
              <span class="door-glow"></span><span class="door-leaf"><span class="door-knob"></span></span>
            </button>
            ${floor.floor !== 0 ? `<span class="class-window" aria-hidden="true"><i></i>${floor.floor === 3 || (floor.floor === 1 && index % 2 === 0) ? '<span class="flower-box"></span>' : ''}</span>` : ''}
          </div>
        `).join('')}
        ${floor.id === 'university' ? `<button type="button" class="special-room special-room-library special-room-left" data-special-room="Thư viện"><span class="special-room-name">THƯ VIỆN</span><span class="special-window"></span><span class="special-door"><i></i><b></b></span><span class="special-window"></span></button><button type="button" class="special-room special-room-admin special-room-right" data-special-room="Phòng hành chính"><span class="special-room-name">HÀNH CHÍNH</span><span class="special-window"></span><span class="special-door"><i></i><b></b></span><span class="special-window"></span></button>` : ''}
        ${floor.id === 'college' ? `<button type="button" class="special-room special-room-multi special-room-left" data-special-room="Phòng đa năng"><span class="special-room-name">ĐA NĂNG</span><span class="special-window"></span><span class="special-door"><i></i><b></b></span><span class="special-window"></span></button><button type="button" class="special-room special-room-principal special-room-right" data-special-room="Phòng hiệu trưởng"><span class="special-room-name">HIỆU TRƯỞNG</span><span class="special-window"></span><span class="special-door"><i></i><b></b></span><span class="special-window"></span></button>` : ''}
      </div>
    `).join('')}</div><div class="school-foundation"></div>`;

  renderQuickAccess();
  renderRecentSchoolPlants();
  renderFlowerSearch();
}

function renderRecentSchoolPlants() {
  const container = document.getElementById('school-garden-plants');
  if (!container) return;
  const plants = garden.getRecentPlants().slice(0, 10);
  container.innerHTML = plants.map((plant, index) => `<button class="school-garden-plant plant-${index % 10}" data-school-plant="${index}" title="${escapeHtml(plant.flowerName)}" aria-label="Xem hoa ${escapeHtml(plant.flowerName)}" style="--flower-color:${escapeHtml(plant.flowerColor)}">${icon('flower', 23)}</button>`).join('');
}

function renderQuickAccess() {
  const floor = floors.find(f => f.id === selectedFloor);
  document.getElementById('room-quick-access').innerHTML = `<span class="quick-room-label">MỞ CỬA LỚP</span><div>${floor.classes.map((name, index) => `<button data-quick-room="${floor.id}-${index + 1}" aria-label="Mở cửa ${name}">${icon('door', 13)}${name}</button>`).join('')}</div>`;
}

function selectFloor(id) {
  selectedFloor = id;
  document.querySelectorAll('[data-floor]').forEach(el => el.classList.toggle('is-selected', el.dataset.floor === id));
  document.querySelectorAll('[data-select-floor]').forEach(el => {
    const selected = el.dataset.selectFloor === id;
    el.classList.toggle('selected', selected);
    el.setAttribute('aria-pressed', String(selected));
    el.querySelector('.floor-option-arrow').innerHTML = icon(selected ? 'check' : 'chevron-right');
  });
  const floor = floors.find(f => f.id === id);
  document.querySelector('.scene-hint').innerHTML = `${icon('hand', 13)}Chọn một cánh cửa ${floor.name.toLowerCase()}<span class="hint-sparkle">✧</span>`;
  renderQuickAccess();
}

function setNavigation(view) {
  document.querySelectorAll('.main-nav [data-nav]').forEach(el => {
    const selected = el.dataset.nav === view;
    el.classList.toggle('active', selected);
    if (selected) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
  });
}

function focusHeading(container) {
  const heading = container.querySelector('h1, h2');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

function showView(view, { focus = true } = {}) {
  if (transitioning) return;
  activeView = view;
  document.getElementById('school-view').classList.toggle('hidden', view !== 'school');
  document.getElementById('my-gardens-view').classList.toggle('hidden', view !== 'gardens');
  document.getElementById('flower-search-view').classList.toggle('hidden', view !== 'school');
  document.getElementById('garden-view').classList.toggle('hidden', view !== 'collection' && view !== 'garden');
  setNavigation(view === 'garden' ? 'gardens' : view);
  const labels = { school: 'Ngôi trường của chúng mình', gardens: 'Khu vườn của tụi mình nà', collection: 'Bộ sưu tập hoa', garden: 'Khu vườn của tụi mình nà' };
  document.getElementById('breadcrumb-current').textContent = labels[view];
  document.title = `${labels[view]} — Trường học Cầu Vồng`;
  if (view === 'gardens') renderMyGardens();
  if (view === 'collection') garden.showCollection();
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (focus) focusHeading(document.getElementById(view === 'school' ? 'school-view' : view === 'gardens' ? 'my-gardens-view' : 'garden-view'));
}

async function enterRoom(roomId, door) {
  if (transitioning) return;
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;
  transitioning = true;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (door) {
    selectFloor(room.floorId);
    door.classList.add('is-opening');
    door.setAttribute('aria-busy', 'true');
    await new Promise(resolve => setTimeout(resolve, reduced ? 0 : 620));
  }
  const transition = document.getElementById('door-transition');
  transition.classList.add('active');
  await new Promise(resolve => setTimeout(resolve, reduced ? 0 : 480));
  try {
    garden.open(room);
    transitioning = false;
    showView('garden');
    document.getElementById('breadcrumb-current').textContent = `Khu vườn · ${room.name}`;
    document.title = `Khu vườn ${room.name} — Trường học Cầu Vồng`;
    updateStats();
  } catch (error) {
    console.error('Không thể mở khu vườn:', error);
    notify('Chưa thể mở khu vườn. Bạn thử lại nhé.');
  } finally {
    transitioning = false;
    transition.classList.remove('active');
    if (door) {
      door.classList.remove('is-opening');
      door.removeAttribute('aria-busy');
    }
  }
}

function updateStats() {
  // Defer so initialization callbacks also run after createGarden returns.
  queueMicrotask(() => {
    const stats = garden.getStats();
    const count = document.getElementById('nav-garden-count');
    if (count) count.textContent = stats.gardens || 0;
  });
}

function renderMyGardens() {
  const stats = garden.getStats();
  const statsData = [
    { icon: 'sprout', value: stats.planted || 0, label: 'cây đã gieo trồng' },
    { icon: 'flower', value: stats.bloomed || 0, label: 'bông hoa đang nở' },
    { icon: 'school', value: stats.gardens || 0, label: 'khu vườn đã ghé' },
  ];
  document.getElementById('my-gardens-view').innerHTML = `
    <div class="my-gardens-header"><div class="eyebrow">MỘT CHÚT XANH CỦA RIÊNG BẠN</div><h1 id="my-gardens-title">Khu vườn của tụi mình nà</h1><p>${stats.planted ? 'Những hạt mầm bạn gieo đang lớn lên từng ngày. Cùng ghé thăm và chăm hoa nhé.' : '16 cánh cửa, 16 khoảng xanh. Chọn một lớp học để gieo hạt mầm đầu tiên nhé.'}</p></div>
    <div class="garden-summary-row">${statsData.map(stat => `<div class="garden-summary-stat"><span>${icon(stat.icon, 25)}</span><span><strong>${stat.value}</strong><small>${stat.label}</small></span></div>`).join('')}</div>
    <h2 class="gardens-section-heading">Những khoảng xanh trong trường</h2>
    <div class="room-gardens-grid">${[...rooms].reverse().sort((a, b) => a.floor - b.floor || rooms.indexOf(a) - rooms.indexOf(b)).map(room => {
      const floor = floors.find(f => f.id === room.floorId);
      return `<button class="room-garden-card" data-open-garden="${room.id}" aria-label="Mở khu vườn ${room.name}" style="--room-bg:${floor.bg};--room-color:${floor.color}"><div class="room-card-art">${icon('sprout', 52)}<span>${floor.label}</span></div><div class="room-card-copy"><div><h2>Vườn ${room.name.toLowerCase()}</h2><p>${room.level} · Ghé thăm khu vườn</p></div>${icon('arrow-right')}</div></button>`;
    }).join('')}</div>`;
}

function renderFlowerSearch() {
  const view = document.getElementById('flower-search-view');
  if (!view) return;
  const plants = garden.getBloomedPlants().map(item => ({ ...item, room: rooms.find(room => room.id === item.roomId) }));
  const schools = [...new Set(plants.map(item => item.grower?.school).filter(Boolean))];
  const normalize = value => String(value || '').toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const localDate = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const query = normalize(gardenSearch.query);
  const results = plants.filter(item => {
    const searchable = [item.flowerName, item.grower?.name, item.grower?.school, item.room?.name].map(normalize).join(' ');
    return (!query || searchable.includes(query))
      && (!gardenSearch.className || item.room?.name === gardenSearch.className)
      && (!gardenSearch.school || item.grower?.school === gardenSearch.school)
      && (!gardenSearch.date || localDate(item.plantedAt) === gardenSearch.date);
  });
  const resultHtml = !hasSearched ? '' : results.length ? results.map(item => `<button class="garden-search-result" data-search-plant="${plants.indexOf(item)}"><span class="garden-search-flower">${icon('flower', 34)}</span><span><strong>${escapeHtml(item.flowerName)}</strong><small>${escapeHtml(item.grower?.name || 'Bạn')}</small></span></button>`).join('') : '<p class="garden-search-empty">Chưa tìm thấy đóa hoa phù hợp.</p>';
  view.innerHTML = `<section class="garden-search-panel"><div class="garden-search-heading"><div><span class="eyebrow">KHÁM PHÁ NHỮNG ĐÓA HOA</span><h2>Tìm kiếm</h2></div><span>${icon('flower', 25)}</span></div><form class="garden-search-form" data-garden-search><input name="query" value="${escapeHtml(gardenSearch.query)}" placeholder="Tìm theo tên hoặc trường" /><select name="className"><option value="">Lọc theo lớp</option>${rooms.map(room => `<option ${gardenSearch.className === room.name ? 'selected' : ''}>${room.name}</option>`).join('')}</select><select name="school"><option value="">Lọc theo trường</option>${schools.map(school => `<option ${gardenSearch.school === school ? 'selected' : ''}>${escapeHtml(school)}</option>`).join('')}</select><input type="date" name="date" value="${gardenSearch.date}" aria-label="Lọc theo ngày" /><button type="submit">Tìm kiếm</button></form><div class="garden-search-results">${resultHtml}</div></section>`;
}

document.addEventListener('click', event => {
  const home = event.target.closest('[data-home]');
  if (home) {
    event.preventDefault();
    showView('school');
    return;
  }
  const searchPlant = event.target.closest('[data-search-plant]');
  if (searchPlant) {
    const plant = garden.getBloomedPlants()[Number(searchPlant.dataset.searchPlant)];
    if (plant) plant.room = rooms.find(room => room.id === plant.roomId);
    if (plant) garden.showPlantInfo(plant, plant.room);
    return;
  }
  const schoolPlant = event.target.closest('[data-school-plant]');
  if (schoolPlant) {
    const plant = garden.getRecentPlants()[Number(schoolPlant.dataset.schoolPlant)];
    if (plant) {
      plant.room = rooms.find(item => item.id === plant.roomId);
      garden.showPlantInfo(plant, plant.room);
    }
    return;
  }
  const specialRoom = event.target.closest('[data-special-room]');
  if (specialRoom) {
    specialRoom.classList.remove('is-opening');
    void specialRoom.offsetWidth;
    specialRoom.classList.add('is-opening');
    setTimeout(() => specialRoom.classList.remove('is-opening'), 850);
    if (specialRoom.dataset.specialRoom === 'Thư viện') {
      setTimeout(showLibrary, 850);
    } else if (specialRoom.dataset.specialRoom === 'Phòng hành chính') {
      setTimeout(showAdministration, 850);
    } else if (specialRoom.dataset.specialRoom === 'Phòng hiệu trưởng') {
      setTimeout(showPrincipal, 850);
    } else if (specialRoom.dataset.specialRoom === 'Phòng đa năng') {
      setTimeout(showMultiPurposeRoom, 850);
    } else notify(`${specialRoom.dataset.specialRoom} đang mở cửa đón bạn.`);
    return;
  }
  const nav = event.target.closest('[data-nav]');
  if (nav) showView(nav.dataset.nav);
  const floor = event.target.closest('[data-select-floor]');
  if (floor && !transitioning) selectFloor(floor.dataset.selectFloor);
  const door = event.target.closest('[data-room]');
  if (door) enterRoom(door.dataset.room, door);
  const quickRoom = event.target.closest('[data-quick-room]');
  if (quickRoom) enterRoom(quickRoom.dataset.quickRoom, document.querySelector(`[data-room="${quickRoom.dataset.quickRoom}"]`));
  const gardenCard = event.target.closest('[data-open-garden]');
  if (gardenCard) enterRoom(gardenCard.dataset.openGarden);
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'help') document.getElementById('help-dialog').showModal();
  if (action === 'close-help') document.getElementById('help-dialog').close();
});

document.addEventListener('submit', event => {
  const form = event.target.closest('[data-garden-search]');
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const nextSearch = {
    query: String(data.get('query') || '').trim(),
    className: String(data.get('className') || ''),
    school: String(data.get('school') || ''),
    date: String(data.get('date') || ''),
  };
  if (!nextSearch.query && !nextSearch.className && !nextSearch.school && !nextSearch.date) {
    notify('Hãy nhập hoặc chọn ít nhất một tiêu chí để tìm kiếm.');
    return;
  }
  gardenSearch = nextSearch;
  hasSearched = true;
  renderMyGardens();
  renderFlowerSearch();
});

document.getElementById('help-dialog').addEventListener('click', event => {
  const dialog = event.currentTarget;
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

renderSchool();
updateStats();
