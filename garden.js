const FLOWERS = [
  { id: 'daisy', name: 'Cúc họa mi', note: 'Một chút bình yên', color: '#f7f3de', center: '#ddba64', bg: '#f3f0dd' },
  { id: 'sunflower', name: 'Hướng dương', note: 'Luôn hướng về nắng', color: '#e5b448', center: '#84654c', bg: '#f7efd7' },
  { id: 'tulip', name: 'Tulip', note: 'Dịu dàng khoe sắc', color: '#d88f82', center: '#d88f82', bg: '#f5e7e0' },
  { id: 'lavender', name: 'Oải hương', note: 'Hương thơm nhẹ nhàng', color: '#a495bb', center: '#a495bb', bg: '#eeebf2' },
  { id: 'rose', name: 'Hoa hồng', note: 'Gửi một lời yêu thương', color: '#c67d85', center: '#a65c68', bg: '#f3e5e7' },
  { id: 'cosmos', name: 'Hoa sao nhái', note: 'Nét vui tươi bé nhỏ', color: '#d6a08f', center: '#e5bc64', bg: '#f4eae2' },
];
const EXTRA_FLOWER_COLORS = ['#e69a9a', '#e5b66d', '#d8c46f', '#9bb889', '#8eb7c8', '#aa98c0', '#d78fae', '#efad7d'];
const EXTRA_FLOWER_NAMES = ['Mẫu đơn', 'Ly', 'Cẩm chướng', 'Thược dược', 'Lan hồ điệp', 'Lan vũ nữ', 'Cẩm tú cầu', 'Sen', 'Súng', 'Mai', 'Đào', 'Phượng vĩ', 'Bằng lăng', 'Muồng hoàng yến', 'Giấy', 'Mười giờ', 'Dạ yến thảo', 'Petunia', 'Trạng nguyên', 'Đồng tiền', 'Cúc vạn thọ', 'Cúc đồng tiền', 'Cúc tana', 'Cúc ngũ sắc', 'Cúc bất tử', 'Anh thảo', 'Thanh tú', 'Lưu ly', 'Forget-me-not', 'Păng-xê', 'Mắt nai', 'Hoa ban', 'Hồng môn', 'Thiên điểu', 'Dành dành', 'Ngọc lan', 'Nhài', 'Osaka đỏ', 'Đỗ quyên', 'Trinh nữ', 'Kèn thiên thần', 'Hoa loa kèn', 'Tử đằng', 'Kim ngân', 'Dạ lan hương'];
for (let index = 7; index <= 50; index += 1) {
  const color = EXTRA_FLOWER_COLORS[(index - 7) % EXTRA_FLOWER_COLORS.length];
  FLOWERS.push({ id: `flower-${index}`, name: EXTRA_FLOWER_NAMES[index - 7], note: `Vẻ đẹp của ${EXTRA_FLOWER_NAMES[index - 7].toLowerCase()}`, color, center: '#d7ae62', bg: '#f1eee3' });
}
const SCHOOLS = ['Trường THPT Nguyễn Việt Hồng', 'Trường THPT Hưng Phú', 'Trường THPT Thới Long', 'Trường THPT Lưu Hữu Phước', 'Trường THPT Bùi Hữu Nghĩa', 'Trường THPT Đông Sơn 1 – Thanh Hóa', 'Trường Tiểu học Hưng Lợi 2', 'Trường Cao đẳng Cần Thơ', 'Trường Cao đẳng Y tế Cần Thơ', 'Trường Cao đẳng Nghề Cần Thơ', 'Trường Cao đẳng Kinh tế – Kỹ thuật Cần Thơ', 'Trường Cao đẳng Văn hóa Nghệ thuật Cần Thơ', 'Trường Đại học Kỹ thuật – Công nghệ Cần Thơ', 'Trường Đại học Tây Đô', 'Đại học Cần Thơ', 'Trường Công nghệ Thông tin và Truyền thông – Đại học Cần Thơ', 'Trường Nông nghiệp – Đại học Cần Thơ', 'Trường Bách khoa – Đại học Cần Thơ'];
const UNSAFE_MESSAGE_TERMS = ['địt', 'đụ', 'đéo', 'lồn', 'cặc', 'sex', 'porn', 'rape', 'ấu dâm', 'ấu dam', 'hiếp dâm', 'giết', 'tự sát', 'chết đi', 'phân biệt chủng tộc', 'kỳ thị', 'ki thi', 'bạo lực', 'fuck', 'shit'];
const STORAGE_KEY = 'hatmam-gardens-v1';
const PLOTS_PER_BED = 12;
const flowerById = id => FLOWERS.find(flower => flower.id === id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const normalizeText = value => String(value).toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const messageWordCount = value => String(value).trim() ? String(value).trim().split(/\s+/u).length : 0;
const findUnsafeTerm = value => UNSAFE_MESSAGE_TERMS.find(term => normalizeText(value).includes(normalizeText(term)));

function bloomArt(flower) {
  if (flower.id === 'tulip') return `<path d="M34 34c2 17 8 23 16 23s15-7 16-23l-10 7-6-15-7 15Z" fill="${flower.color}"/><path d="M43 41c0 9 3 14 7 16 5-7 7-11 6-16" fill="none" stroke="#be776d" stroke-width="1.3"/>`;
  if (flower.id === 'lavender') return `<path d="M50 64V25m-11 39-6-26m25 26 9-31" stroke="#69856a" stroke-width="2" fill="none"/>${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${47 - i % 2}" cy="${29 + i * 6}" rx="4" ry="5" transform="rotate(-28 47 ${29 + i * 6})" fill="${i % 2 ? '#9184ac' : '#b2a2c7'}"/><ellipse cx="53" cy="${32 + i * 6}" rx="4" ry="5" transform="rotate(28 53 ${32 + i * 6})" fill="#a495bb"/>`).join('')}<path d="m34 42 4 13m28-18-5 15" stroke="#b2a2c7" stroke-width="7" stroke-linecap="round"/>`;
  if (flower.id === 'rose') return `<path d="m50 63-11-11 13 3 10-5-5 12" fill="#698567"/><path d="M34 43c-9-12 7-22 15-14 11-11 25 0 19 10 10 12-5 24-14 18-13 9-28-4-20-14Z" fill="${flower.color}"/><path d="M42 32c10-5 20 0 20 9 3 8-6 16-15 13-9-1-13-12-5-17 8-6 18 5 11 11-4 3-10-1-7-5" fill="none" stroke="#ac6674" stroke-width="2" stroke-linecap="round"/>`;
  const petals = flower.id === 'sunflower' ? 14 : flower.id === 'cosmos' ? 8 : 10;
  const petalLength = flower.id === 'sunflower' ? 13 : 11;
  return `${Array.from({ length: petals }, (_, i) => `<ellipse cx="50" cy="29" rx="${flower.id === 'cosmos' ? 7 : 4.5}" ry="${petalLength}" transform="rotate(${i * 360 / petals} 50 44)" fill="${flower.color}" stroke="${flower.id === 'daisy' ? '#e6dfc4' : flower.color}" stroke-width=".7"/>`).join('')}<circle cx="50" cy="44" r="${flower.id === 'sunflower' ? 10 : 7}" fill="${flower.center}"/>${flower.id === 'sunflower' ? '<path d="M46 41h1m5 0h1m-7 5h1m5 0h1" stroke="#b69a64" stroke-width="2" stroke-linecap="round"/>' : '<circle cx="48" cy="42" r="1.5" fill="#f4d886"/>'}`;
}

function flowerArt(id, stage = 5, soil = false) {
  const flower = flowerById(id) || FLOWERS[0];
  const seed = '<ellipse cx="50" cy="86" rx="7" ry="4" fill="#9f805e" transform="rotate(-18 50 86)"/>';
  const stem = `<path d="M50 96c-2-16 3-31 0-45" stroke="#6b8464" stroke-width="2.6" stroke-linecap="round"/><path d="M49 81c-14-1-21-9-20-17 13 0 20 7 20 17Z" fill="#91a77b"/><path d="M51 73c0-12 10-20 22-18-1 12-10 19-22 18Z" fill="#789469"/><path d="m35 69 14 12m2-8 16-12" stroke="#607f59" stroke-width="1.1"/>`;
  const sprout = '<path d="M50 96V77" stroke="#698166" stroke-width="2.5" stroke-linecap="round"/><path d="M50 82c-13 0-20-7-18-16 11 0 19 4 18 16Z" fill="#91a97a"/><path d="M50 77c-1-11 8-17 18-15 1 10-7 15-18 15Z" fill="#708e67"/>';
  const bud = `<ellipse cx="50" cy="39" rx="8" ry="11" fill="${flower.color}"/><path d="M43 40c4 3 10 3 14 0" stroke="${flower.center}" stroke-width="1.2"/>`;
  const growth = stage === 0 ? seed : stage === 1 ? sprout : stage < 4 ? stem : stage === 4 ? `${stem}${bud}` : `${stem}${bloomArt(flower)}`;
  return `<svg class="garden-flower-art" viewBox="0 0 100 112" fill="none" aria-hidden="true">${soil ? '<ellipse cx="50" cy="96" rx="40" ry="12" fill="#c7af89"/><ellipse cx="50" cy="93" rx="40" ry="11" fill="#b59b76"/><path d="m22 94 5-1m40 3 6 1m-34-7 4 1m18-1 3 1" stroke="#947e60" stroke-width="1.7" stroke-linecap="round"/>' : ''}${growth}</svg>`;
}

function emptyPlotArt() {
  return '<svg class="garden-flower-art" viewBox="0 0 100 112" fill="none" aria-hidden="true"><ellipse cx="50" cy="96" rx="40" ry="12" fill="#c7af89"/><ellipse cx="50" cy="93" rx="40" ry="11" fill="#b59b76"/><path d="m22 94 5-1m40 3 6 1m-34-7 4 1m18-1 3 1" stroke="#947e60" stroke-width="1.7" stroke-linecap="round"/><path d="m13 98-2-5m76 4 3-5" stroke="#a3b08c" stroke-width="1.6" stroke-linecap="round"/><path d="M45 74h10m-5-5v10" stroke="#91a080" stroke-width="1.5" stroke-linecap="round"/></svg>';
}

export function createGarden({ container, onChange = () => {}, onBack = () => {}, notify = () => {}, icons }) {
  const icon = (name, size = 20) => icons ? icons(name, size) : '';
  let state = { version: 2, gardens: Object.create(null), unlocked: [], beds: Object.create(null), profile: { name: '', school: '', message: '' } };
  let savingAvailable = true;
  let room = null;
  let selectedFlower = 'daisy';
  let tool = 'plant';
  let view = 'garden';
  let currentBed = 0;
  const growthTimers = new Map();

  function scheduleGrowth(roomId, index) {
    const key = `${roomId}:${index}`;
    clearTimeout(growthTimers.get(key));
    const plant = state.gardens[roomId]?.[index];
    if (!plant || plant.stage >= 5 || !plant.plantedAt) return;
    const elapsed = Date.now() - plant.plantedAt;
    const nextStage = Math.min(5, Math.floor(elapsed / 3000));
    if (plant.stage !== nextStage) {
      plant.stage = nextStage;
      if (nextStage === 5 && !state.unlocked.includes(plant.flower)) state.unlocked.push(plant.flower);
      save();
      if (room?.id === roomId) render();
    }
    const remaining = Math.max(100, (nextStage + 1) * 3000 - elapsed);
    growthTimers.set(key, setTimeout(() => scheduleGrowth(roomId, index), remaining));
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && (saved.version === 1 || saved.version === 2) && saved.gardens && typeof saved.gardens === 'object' && !Array.isArray(saved.gardens)) {
        Object.entries(saved.gardens).forEach(([id, plots]) => {
          if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id) || !Array.isArray(plots)) return;
          const length = Math.max(PLOTS_PER_BED, Math.ceil(plots.length / PLOTS_PER_BED) * PLOTS_PER_BED);
          state.gardens[id] = Array.from({ length }, (_, index) => {
            const plant = plots[index];
            return plant && flowerById(plant.flower) && Number.isInteger(plant.stage) && plant.stage >= 0 && plant.stage <= 5 ? { ...plant, stage: Math.min(5, plant.stage), plantedAt: plant.plantedAt || Date.now() } : null;
          });
          state.profile = { ...state.profile, ...(saved.profile || {}) };
          const lastBed = saved.beds?.[id];
          state.beds[id] = Number.isInteger(lastBed) && lastBed >= 0 && lastBed < length / PLOTS_PER_BED ? lastBed : 0;
        });
        state.unlocked = [...new Set((Array.isArray(saved.unlocked) ? saved.unlocked : []).filter(id => flowerById(id)))];
        Object.values(state.gardens).flat().forEach(plant => {
          if (plant?.stage === 5 && !state.unlocked.includes(plant.flower)) state.unlocked.push(plant.flower);
        });
      }
    }
  } catch {
    savingAvailable = false;
    notify('Chưa đọc được vườn đã lưu. Bạn vẫn có thể trồng hoa trong phiên này.');
  }
  state.profile = { name: '', school: '', message: '' };

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      savingAvailable = true;
    } catch {
      if (savingAvailable) notify('Trình duyệt chưa cho phép lưu. Khu vườn sẽ được giữ trong phiên này.');
      savingAvailable = false;
    }
    onChange();
  }

  function getStats() {
    const plants = Object.values(state.gardens).flat().filter(Boolean);
    return { planted: plants.length, bloomed: plants.filter(plant => plant.stage === 5).length, gardens: Object.keys(state.gardens).length, unlocked: state.unlocked.length };
  }

  function plotLabel(plant, index) {
    const prefix = `Ô đất ${index + 1}`;
    if (!plant) return `${prefix}, còn trống. ${tool === 'plant' ? `Trồng ${flowerById(selectedFlower).name}` : 'Chọn gieo hạt để trồng hoa'}`;
    const action = tool === 'remove' ? 'Nhổ cây' : tool === 'water' ? plant.stage === 5 ? 'Hoa đã nở' : 'Tưới để cây lớn' : 'Chọn gieo hạt để trồng hoa';
    return `${prefix}, ${flowerById(plant.flower).name}, ${['hạt giống', 'mầm', 'cây con', 'cây lớn', 'búp hoa', 'đã nở'][plant.stage]}. ${action}`;
  }

  function renderGarden() {
    if (!room) return;
    const plots = state.gardens[room.id];
    const planted = plots.filter(Boolean).length;
    const bloomed = plots.filter(plant => plant?.stage === 5).length;
    const offset = currentBed * PLOTS_PER_BED;
    const visiblePlots = plots.slice(offset, offset + PLOTS_PER_BED);
    const bedCount = plots.length / PLOTS_PER_BED;
    const isLastBed = currentBed === bedCount - 1;
    const guidance = tool === 'plant' ? 'Chạm vào ô đất trống để gieo hạt.' : tool === 'water' ? 'Cây đang tự lớn qua 6 giai đoạn trong 15 giây.' : 'Chạm vào cây muốn nhổ để dành chỗ cho một hạt mầm mới.';
    container.innerHTML = `
      <header class="garden-header">
        <div><button class="garden-back" data-action="back">${icon('arrow-left', 16)} Trở về ngôi trường</button><p class="garden-eyebrow">KHÔNG GIỚI HẠN KHÔNG GIAN XANH</p><h1>Khu vườn của <em>${escapeHtml(room.name)}</em></h1><p class="garden-intro">Luôn có chỗ cho một hạt mầm mới. Thêm luống bất cứ khi nào bạn muốn.<br />Điền thông tin → Chọn hoa → Chạm vào ô đất để gieo → Chờ hoa nở → Bấm vào hoa để xem thông tin.</p></div>
        <div class="garden-room-badge">${icon('school', 22)}<span><strong>${escapeHtml(room.name)}</strong><small>${room.floor === 0 ? 'Tầng trệt' : `Tầng ${escapeHtml(room.floor)}`} · ${escapeHtml(room.level)}</small></span></div>
      </header>
      <div class="garden-layout">
        <aside class="garden-supply"><div class="garden-supply-title"><span>${icon('sprout', 19)} Túi hạt giống</span></div><p class="garden-supply-intro">Hôm nay, bạn muốn trồng gì?</p>
          <form class="garden-profile" data-profile-form><label>Họ tên / nickname<input name="name" required maxlength="60" value="${escapeHtml(state.profile.name)}" placeholder="Bạn muốn được gọi là..." /></label><label>Tên trường<select name="school" required><option value="">Chọn trường</option>${SCHOOLS.map(school => `<option ${state.profile.school === school ? 'selected' : ''}>${school}</option>`).join('')}<option ${state.profile.school.startsWith('Khác:') ? 'selected' : ''}>Khác</option></select></label><input class="garden-other-school ${state.profile.school.startsWith('Khác:') ? '' : 'is-hidden'}" name="otherSchool" maxlength="100" value="${escapeHtml(state.profile.school.startsWith('Khác:') ? state.profile.school.slice(6) : '')}" placeholder="Viết tên trường của bạn" ${state.profile.school.startsWith('Khác:') ? 'required' : ''} /><label>Thông điệp <small>(tối đa 100 chữ)</small><textarea name="message" required maxlength="1000" placeholder="Gửi một điều tử tế...">${escapeHtml(state.profile.message)}</textarea></label></form>
          <div class="garden-flower-options">${FLOWERS.map(flower => `<button class="garden-flower-option ${selectedFlower === flower.id && tool === 'plant' ? 'is-selected' : ''}" data-flower="${flower.id}" aria-pressed="${selectedFlower === flower.id && tool === 'plant'}" style="--flower-bg:${flower.bg}"><span class="garden-seed-art">${flowerArt(flower.id, 5)}</span><span>${flower.name}</span>${selectedFlower === flower.id && tool === 'plant' ? `<i>${icon('check', 10)}</i>` : ''}</button>`).join('')}</div>
        </aside>
        <section class="garden-board" aria-label="Luống hoa của ${escapeHtml(room.name)}"><div class="garden-board-top"><span>${icon('leaf', 17)} Góc xanh của bạn · Chạm vào ô đất trống để gieo hạt.</span><span class="garden-unlimited">${icon('infinity', 19)} Không giới hạn luống</span></div>
          <nav class="garden-bed-navigation" aria-label="Di chuyển giữa các luống cây"><button class="garden-bed-button" data-bed-action="previous" ${currentBed === 0 ? 'disabled' : ''} aria-label="Về luống ${Math.max(1, currentBed)}">${icon('arrow-left', 16)}<span>Luống trước</span></button><div class="garden-bed-position" role="status" aria-live="polite"><strong>Luống ${currentBed + 1}</strong><small>${visiblePlots.filter(Boolean).length}/${PLOTS_PER_BED} ô đã trồng · ${bedCount} luống trong vườn</small></div><button class="garden-bed-button ${isLastBed ? 'garden-bed-add' : ''}" data-bed-action="next" aria-label="${isLastBed ? 'Thêm' : 'Đến'} luống ${currentBed + 2}"><span>${isLastBed ? 'Thêm luống' : 'Luống sau'}</span>${icon(isLastBed ? 'plus' : 'arrow-right', 16)}</button></nav>
          <div class="garden-landscape"><div class="garden-fence" aria-hidden="true"></div><div class="garden-board-label"><span>LUỐNG ${currentBed + 1}</span><strong>${escapeHtml(room.name)}</strong></div><span class="garden-butterfly" aria-hidden="true"><svg width="31" height="25" viewBox="0 0 31 25"><path d="M15 13C-4-9-4 24 13 17 0 28 23 30 16 16 34 25 37-8 16 13Z" fill="#d5b88b"/><path d="m14 10 3 11" stroke="#897854" stroke-width="1.3"/></svg></span>
            <div class="garden-plots garden-tool-${tool}">${visiblePlots.map((plant, index) => `<button class="garden-plot ${plant ? 'has-plant' : 'is-empty'} ${plant?.stage === 5 ? 'is-bloomed' : ''}" data-plot="${offset + index}" aria-label="${escapeHtml(plotLabel(plant, offset + index))}">${plant ? flowerArt(plant.flower, plant.stage, true) : emptyPlotArt()}<span class="garden-plot-caption">${plant ? escapeHtml(plant.grower?.name || state.profile.name || 'Bạn') : 'Gieo hạt'}</span>${plant ? `<span class="garden-growth-dots" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map(stage => `<i class="${plant.stage >= stage ? 'is-grown' : ''}"></i>`).join('')}</span>` : '<span class="garden-growth-dots" aria-hidden="true"></span>'}</button>`).join('')}</div>
            <div class="garden-meadow" aria-hidden="true"><svg viewBox="0 0 660 30" preserveAspectRatio="none"><path d="M0 26Q90 6 175 21T330 15T490 22T660 10V30H0Z" fill="#dce5cd"/><path d="m20 28-5-10m5 10 3-13m612 13 5-13m-5 13-4-8M110 28l-3-8m3 8 3-12m431 12 4-10" stroke="#a7b98c" stroke-width="2" stroke-linecap="round"/></svg></div>
          </div>
          <div class="garden-board-bottom"><span>${icon('sprout', 15)} ${planted} cây trong toàn bộ vườn</span><span>${icon('flower', 15)} ${bloomed} bông hoa đã nở</span></div>
        </section>
      </div>
      `;
  }

  function renderCollection() {
    const stats = getStats();
    container.innerHTML = `<header class="collection-header"><button class="garden-back" data-action="back">${icon('arrow-left', 16)} Trở về ngôi trường</button><p class="garden-eyebrow">NHỮNG NIỀM VUI ĐÃ NỞ HOA</p><h1>Bộ sưu tập <em>của bạn</em></h1><p>Mỗi loài hoa là một dấu nhỏ của sự chăm chút.</p></header><div class="collection-progress"><span>${icon('flower', 22)}<strong>${stats.unlocked}</strong></span><div class="collection-progress-track"><i style="width:${stats.unlocked / 50 * 100}%"></i></div><small>${stats.unlocked === 50 ? 'Một khu vườn đủ đầy sắc màu!' : 'Trồng để khám phá thêm những sắc hoa.'}</small></div>${stats.unlocked === 0 ? `<div class="collection-empty">${icon('sprout', 25)}<div><strong>Bông hoa đầu tiên đang chờ bạn.</strong><p>Ghé một lớp học, điền thông tin và gieo hạt để mở khóa loài hoa đầu tiên.</p></div><button data-action="back">Đến ngôi trường ${icon('arrow-right', 15)}</button></div>` : ''}<div class="collection-grid">${FLOWERS.map((flower, index) => { const unlocked = state.unlocked.includes(flower.id); const count = Object.values(state.gardens).flat().filter(plant => plant?.flower === flower.id && plant.stage === 5).length; return `<article class="collection-card ${unlocked ? 'is-unlocked' : 'is-locked'}"><div class="collection-art" style="--flower-bg:${flower.bg}"><span class="collection-number">${String(index + 1).padStart(2, '0')}</span>${flowerArt(flower.id)}<span class="collection-card-status">${icon(unlocked ? 'check' : 'sprout', 13)} ${unlocked ? 'Đã khám phá' : 'Chờ nở hoa'}</span></div><div class="collection-card-copy"><h2>${flower.name}</h2><p>${flower.note}</p><small>${unlocked ? `${count} bông đang nở trong vườn` : 'Gieo hạt để mở khóa'}</small></div></article>`; }).join('')}</div><p class="collection-footnote">${icon('heart', 15)} Hoa đã khám phá sẽ luôn ở lại trong bộ sưu tập của bạn.</p>`;
  }

  function render() { view === 'collection' ? renderCollection() : renderGarden(); }

  function showPlantInfo(plant, plantRoom = room) {
    const grower = plant.grower || state.profile;
    const plantedAt = new Date(plant.plantedAt);
    const time = plantedAt.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
    const old = document.querySelector('.garden-plant-info');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', `<div class="garden-plant-info" role="dialog" aria-modal="true"><div class="garden-plant-info-card"><span class="garden-info-flower flower-one">✿</span><span class="garden-info-flower flower-two">✿</span><span class="garden-info-flower flower-three">✿</span><button class="garden-plant-info-close" type="button" aria-label="Đóng">×</button><p class="garden-info-project">DỰ ÁN: TRƯỜNG HỌC CẦU VỒNG<br><em>CẦU VỒNG CẦN THƠ</em></p><p class="garden-plant-message">${escapeHtml(grower.message || 'Một thông điệp tử tế')}</p><div class="garden-plant-details"><div>Tên / nickname: ${escapeHtml(grower.name || 'Chưa cập nhật')}</div><div>Trường: ${escapeHtml(grower.school || 'Chưa cập nhật')}</div><div>Lớp: ${escapeHtml(plantRoom?.name || 'Chưa cập nhật')}</div><div>Hoa đã gieo: ${escapeHtml(flowerById(plant.flower).name)}</div><div>Thời gian gieo: ${escapeHtml(time)}</div></div><div class="garden-info-meadow">✿　❀　✿　❁　✿　❀　✿</div></div></div>`);
    const modal = document.querySelector('.garden-plant-info');
    modal?.addEventListener('click', event => {
      if (event.target.closest('.garden-plant-info-close') || event.target === modal) modal.remove();
    });
  }

  container.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !container.contains(button)) return;
    if (button.dataset.action === 'back') { onBack(); return; }
    let focusSelector;
    if (button.dataset.bedAction && room) {
      const direction = button.dataset.bedAction;
      if (direction !== 'previous' && direction !== 'next') return;
      if (direction === 'previous' && currentBed === 0) return;
      const nextBed = currentBed + (direction === 'next' ? 1 : -1);
      const plots = state.gardens[room.id];
      if (nextBed * PLOTS_PER_BED >= plots.length) {
        plots.push(...Array(PLOTS_PER_BED).fill(null));
        notify(`Đã mở luống ${nextBed + 1}. Cùng gieo thêm những mầm xanh nhé!`);
      }
      currentBed = nextBed;
      state.beds[room.id] = currentBed;
      save();
      focusSelector = `[data-bed-action="${currentBed === 0 ? 'next' : direction}"]`;
    } else if (button.dataset.flower) {
      selectedFlower = button.dataset.flower;
      tool = 'plant';
      focusSelector = `[data-flower="${selectedFlower}"]`;
    } else if (button.dataset.tool) {
      tool = button.dataset.tool;
      focusSelector = `[data-tool="${tool}"]`;
    } else if (button.dataset.plot !== undefined && room) {
      const index = Number(button.dataset.plot);
      if (!Number.isInteger(index) || index < currentBed * PLOTS_PER_BED || index >= (currentBed + 1) * PLOTS_PER_BED) return;
      const plant = state.gardens[room.id][index];
      focusSelector = `[data-plot="${index}"]`;
      if (plant?.stage === 5) {
        showPlantInfo(plant);
        return;
      }
      if (tool === 'plant') {
        const profileForm = container.querySelector('[data-profile-form]');
        if (!profileForm || !profileForm.reportValidity()) { notify('Hãy điền tên, trường và thông điệp trước khi gieo hạt nhé.'); return; }
        const message = state.profile.message.trim();
        const unsafeTerm = findUnsafeTerm(message);
        if (messageWordCount(message) > 100) { notify('Thông điệp chỉ được tối đa 100 chữ.'); return; }
        if (unsafeTerm) { notify('Thông điệp có nội dung không phù hợp. Bạn hãy viết lại trước khi gieo hạt nhé.'); return; }
        if (plant) { notify('Ô này đã có cây. Chọn bình tưới để chăm chút cho cây nhé.'); return; }
        state.gardens[room.id][index] = { flower: selectedFlower, stage: 0, plantedAt: Date.now(), grower: { ...state.profile } };
        scheduleGrowth(room.id, index);
        notify(`Đã gieo ${flowerById(selectedFlower).name.toLowerCase()}. Sau 15 giây hoa sẽ nở!`);
        const plots = state.gardens[room.id];
        if ((currentBed + 1) * PLOTS_PER_BED === plots.length && plots.slice(currentBed * PLOTS_PER_BED).every(Boolean)) {
          plots.push(...Array(PLOTS_PER_BED).fill(null));
          notify('Luống này đã đầy! Đã thêm luống mới, bấm “Luống sau” để trồng tiếp nhé.');
        }
      } else if (tool === 'water') {
        if (!plant) { notify('Ô đất còn trống. Gieo một hạt mầm trước nhé.'); return; }
        notify(plant.stage === 5 ? 'Bông hoa đã nở rộ rồi. Cảm ơn bạn đã chăm sóc!' : 'Cây đang tự lớn lên, hãy chờ thêm một chút nhé.');
      } else {
        if (!plant) { notify('Ô đất này đã sẵn sàng cho một hạt mầm mới.'); return; }
        state.gardens[room.id][index] = null;
        notify('Ô đất đã sẵn sàng. Bạn có thể gieo một hạt mầm mới.');
      }
      save();
    } else return;
    render();
    if (event.detail === 0 && focusSelector) container.querySelector(focusSelector)?.focus({ preventScroll: true });
  });

  container.addEventListener('submit', event => {
    const form = event.target.closest('[data-profile-form]');
    if (!form) return;
    event.preventDefault();
    const data = new FormData(form);
    const school = String(data.get('school') || '');
    const otherSchool = String(data.get('otherSchool') || '').trim();
    state.profile = { name: String(data.get('name') || '').trim(), school: school === 'Khác' ? `Khác: ${otherSchool}` : school, message: String(data.get('message') || '').trim() };
    save();
    notify('Đã lưu thông tin người gieo hạt.');
  });

  container.addEventListener('input', event => {
    if (!event.target.closest('[data-profile-form]')) return;
    const form = event.target.closest('[data-profile-form]');
    const data = new FormData(form);
    const school = String(data.get('school') || '');
    const otherSchool = String(data.get('otherSchool') || '').trim();
    state.profile = { name: String(data.get('name') || '').trim(), school: school === 'Khác' ? `Khác: ${otherSchool}` : school, message: String(data.get('message') || '').trim() };
  });

  container.addEventListener('click', event => {
    if (event.target.closest('.garden-plant-info-close') || event.target.classList.contains('garden-plant-info')) {
      event.target.closest('.garden-plant-info')?.remove();
    }
  });

  container.addEventListener('change', event => {
    const select = event.target.closest('select[name="school"]');
    if (!select) return;
    const otherSchool = container.querySelector('[name="otherSchool"]');
    if (!otherSchool) return;
    const isOther = select.value === 'Khác';
    otherSchool.classList.toggle('is-hidden', !isOther);
    otherSchool.required = isOther;
    if (isOther) otherSchool.focus();
  });

  return {
    open(nextRoom) {
      room = nextRoom;
      if (!state.gardens[room.id]) { state.gardens[room.id] = Array(PLOTS_PER_BED).fill(null); save(); }
      state.gardens[room.id].forEach((plant, index) => scheduleGrowth(room.id, index));
      currentBed = state.beds[room.id] || 0;
      view = 'garden';
      tool = 'plant';
      renderGarden();
    },
    showCollection() { view = 'collection'; renderCollection(); },
    getBloomedPlants() {
      return Object.entries(state.gardens).flatMap(([roomId, plots]) => plots.map((plant, index) => plant?.stage === 5 ? { ...plant, flowerName: flowerById(plant.flower).name, roomId, index } : null).filter(Boolean));
    },
    getRecentPlants() {
      return Object.entries(state.gardens).flatMap(([roomId, plots]) => plots.map((plant, index) => plant ? { ...plant, flowerName: flowerById(plant.flower).name, flowerColor: flowerById(plant.flower).color, roomId, index } : null).filter(Boolean)).sort((a, b) => (b.plantedAt || 0) - (a.plantedAt || 0));
    },
    showPlantInfo,
    getStats,
  };
}
