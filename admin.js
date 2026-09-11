import { createWorkbook } from './excel.js';
import { seedDemoPlants } from './garden.js';
import { createPlantNotifications } from './plant-notifications.js';
import { setupSchoolManager } from './school-manager.js';
import { showAdminPanel } from './admin-panels.js';
setupSchoolManager();

const STORAGE_KEY = 'hatmam-gardens-v1';
const LIBRARY_KEY = 'thcv-library-v1';
const ADMIN_USERNAME = 'cvct';
const ADMIN_PASSWORD = 'thcv';
const flowers = ['Cúc họa mi','Hướng dương','Tulip','Oải hương','Hoa hồng','Hoa sao nhái','Mẫu đơn','Ly','Cẩm chướng','Thược dược','Lan hồ điệp','Lan vũ nữ','Cẩm tú cầu','Sen','Súng','Mai','Đào','Phượng vĩ','Bằng lăng','Muồng hoàng yến','Giấy','Mười giờ','Dạ yến thảo','Petunia','Trạng nguyên','Đồng tiền','Cúc vạn thọ','Cúc đồng tiền','Cúc tana','Cúc ngũ sắc','Cúc bất tử','Anh thảo','Thanh tú','Lưu ly','Forget-me-not','Păng-xê','Mắt nai','Hoa ban','Hồng môn','Thiên điểu','Dành dành','Ngọc lan','Nhài','Osaka đỏ','Đỗ quyên','Trinh nữ','Kèn thiên thần','Hoa loa kèn','Tử đằng','Kim ngân','Dạ lan hương'];
const rooms = { 'primary-1':'Lớp 1','primary-2':'Lớp 2','primary-3':'Lớp 3','primary-4':'Lớp 4','primary-5':'Lớp 5','middle-1':'Lớp 6','middle-2':'Lớp 7','middle-3':'Lớp 8','middle-4':'Lớp 9','high-1':'Lớp 10','high-2':'Lớp 11','high-3':'Lớp 12','college-1':'Cao đẳng','college-2':'Cao đẳng','university-1':'Đại học','university-2':'Đại học' };
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const table = document.getElementById('plants-table');
const empty = document.getElementById('empty-state');
let plants = [];
let books = [];
let refreshing = false;
const notifications = createPlantNotifications();
let activeFilters = { query: '', school: '', date: '' };
const PEOPLE_PER_PAGE = 5;
let plantsPage = 1;
const localDate = timestamp => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
function filteredPlants() {
  return plants.filter(plant => {
    const text = [flowerName(plant.flower), plant.grower?.name, plant.grower?.school, rooms[plant.roomId]].join(' ').toLocaleLowerCase('vi-VN');
    return text.includes(activeFilters.query) && (!activeFilters.school || plant.grower?.school === activeFilters.school) && (!activeFilters.date || localDate(plant.plantedAt) === activeFilters.date);
  });
}

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char]));
const flowerName = id => {
  const fixed = { daisy: 0, sunflower: 1, tulip: 2, lavender: 3, rose: 4, cosmos: 5 };
  return flowers[fixed[id] ?? (Number(String(id).replace('flower-', '')) - 1 + 6)] || 'Hoa';
};
function readPlants() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    data.version ||= 2;
    data.gardens ||= {};
    data.unlocked ||= [];
    seedDemoPlants(data);
    const serialized = JSON.stringify(data);
    if (localStorage.getItem(STORAGE_KEY) !== serialized) localStorage.setItem(STORAGE_KEY, serialized);
    return Object.entries(data.gardens || {}).flatMap(([roomId, plots]) => (Array.isArray(plots) ? plots : []).map((plant, index) => plant ? ({ ...plant, roomId, index }) : null).filter(Boolean)).sort((a, b) => (b.plantedAt || 0) - (a.plantedAt || 0));
  } catch {
    return [];
  }
}
async function loadRemotePlants() {
  const response = await fetch('/api/plants');
  if (!response.ok) throw new Error('Không thể tải dữ liệu Neon.');
  const payload = await response.json();
  return (payload.plants || []).map(plant => ({
    remote: true,
    roomId: plant.room_id,
    index: plant.plot_index,
    flower: plant.flower_id,
    stage: Number(plant.stage),
    plantedAt: new Date(plant.planted_at).getTime(),
    grower: { name: plant.grower_name, school: plant.grower_school, message: plant.grower_message },
  }));
}
async function render() {
  if (refreshing) return;
  refreshing = true;
  const refreshButton = document.getElementById('refresh-button');
  refreshButton.disabled = true;
  refreshButton.classList.add('is-refreshing');
  document.getElementById('refresh-label').textContent = 'Đang tải…';
  try {
  try { plants = [...await loadRemotePlants(), ...readPlants().filter(plant => plant.demoId)]; } catch { plants = readPlants(); }
  const schoolSelect = document.getElementById('filter-school');
  const selectedSchool = schoolSelect.value;
  const schoolOptions = [...new Set(plants.map(plant => plant.grower?.school).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
  if (selectedSchool && !schoolOptions.includes(selectedSchool)) schoolOptions.push(selectedSchool);
  schoolSelect.innerHTML = '<option value="">Tất cả trường</option>' + schoolOptions.map(school => `<option value="${escapeHtml(school)}">${escapeHtml(school)}</option>`).join('');
  schoolSelect.value = selectedSchool;
  const bloomed = plants.filter(plant => plant.stage === 5).length;
  const schools = new Set(plants.map(plant => plant.grower?.school).filter(Boolean)).size;
  document.getElementById('summary').innerHTML = [['🌱',plants.length,'Cây đã gieo'],['🌸',bloomed,'Hoa đã nở'],['🏫',new Set(plants.map(plant => plant.roomId)).size,'Khu vườn'],['📚',schools,'Trường tham gia']].map(item => `<div class="summary-card"><strong>${item[0]} ${item[1]}</strong><span>${item[2]}</span></div>`).join('');
  renderTable();
  notifications.update(plants.map(plant => ({ ...plant, flowerName: flowerName(plant.flower), roomName: rooms[plant.roomId] || plant.roomId })));
  renderBooks();
  } finally {
    refreshing = false;
    refreshButton.disabled = false;
    refreshButton.classList.remove('is-refreshing');
    document.getElementById('refresh-label').textContent = 'Làm mới';
  }
}
function readBooks() {
  try {
    const saved = JSON.parse(localStorage.getItem(LIBRARY_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(book => book && book.id && book.title && typeof book.content === 'string') : [];
  } catch {
    return [];
  }
}
async function renderBooks() {
  books = readBooks();
  try {
    const response = await fetch('/api/books');
    if (response.ok) books = (await response.json()).books || books;
  } catch {}
  const list = document.getElementById('books-list');
  list.innerHTML = books.length ? books.map(book => `<div class="book-row"><span>📖</span><strong>${escapeHtml(book.title)}</strong><small>${new Date(book.uploadedAt).toLocaleString('vi-VN')}</small><button type="button" data-delete-book="${escapeHtml(book.id)}">Xóa</button></div>`).join('') : '<p class="empty">Chưa có sách nào.</p>';
}
function renderTable() {
  const matches = filteredPlants();
  const pageCount = Math.max(1, Math.ceil(matches.length / PEOPLE_PER_PAGE));
  plantsPage = Math.min(plantsPage, pageCount);
  const filtered = matches.slice((plantsPage - 1) * PEOPLE_PER_PAGE, plantsPage * PEOPLE_PER_PAGE);
  document.getElementById('plants-page-info').textContent = `Trang ${plantsPage}/${pageCount} · ${matches.length} người`;
  document.getElementById('plants-previous').disabled = plantsPage === 1;
  document.getElementById('plants-next').disabled = plantsPage === pageCount;
  table.innerHTML = filtered.map(plant => `<tr><td>${escapeHtml(flowerName(plant.flower))}</td><td>${escapeHtml(plant.grower?.name || 'Bạn')}</td><td class="message-cell" title="${escapeHtml(plant.grower?.message || '')}">${escapeHtml(plant.grower?.message || 'Chưa có thông điệp')}</td><td>${escapeHtml(plant.grower?.school || 'Chưa cập nhật')}</td><td>${escapeHtml(rooms[plant.roomId] || plant.roomId)}</td><td><span class="status ${plant.stage === 5 ? 'bloomed' : ''}">${plant.stage === 5 ? 'Đã nở' : 'Đang lớn'}</span></td><td>${plant.plantedAt ? new Date(plant.plantedAt).toLocaleString('vi-VN') : '—'}</td><td><button type="button" class="delete-plant" data-delete-plant="${plants.indexOf(plant)}">Xóa</button></td></tr>`).join('');
  empty.classList.toggle('hidden', filtered.length > 0);
}
document.getElementById('login-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  if (data.get('username') === ADMIN_USERNAME && data.get('password') === ADMIN_PASSWORD) {
    sessionStorage.setItem('thcv-admin-auth', '1');
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    render();
  } else document.getElementById('login-error').textContent = 'Tên đăng nhập hoặc mật khẩu chưa đúng.';
});
document.getElementById('logout-button').addEventListener('click', () => { sessionStorage.removeItem('thcv-admin-auth'); location.reload(); });
document.getElementById('refresh-button').addEventListener('click', render);
const libraryDialog = document.getElementById('library-dialog');
const libraryButton = document.getElementById('library-button');
libraryButton.setAttribute('aria-expanded', 'false');
function positionLibrary() {
  const top = Math.max(12, Math.min(libraryButton.getBoundingClientRect().bottom + 10, window.innerHeight - 220));
  libraryDialog.style.top = `${top}px`;
  libraryDialog.style.maxHeight = `${window.innerHeight - top - 12}px`;
}
libraryButton.addEventListener('click', () => {
  if (libraryDialog.open) { libraryDialog.close(); return; }
  positionLibrary();
  showAdminPanel(libraryDialog);
  libraryButton.setAttribute('aria-expanded', 'true');
  renderBooks();
});
libraryDialog.addEventListener('close', () => libraryButton.setAttribute('aria-expanded', 'false'));
document.addEventListener('click', event => {
  if (libraryDialog.open && !libraryDialog.contains(event.target) && !libraryButton.contains(event.target)) libraryDialog.close();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && libraryDialog.open) { libraryDialog.close(); libraryButton.focus(); }
});
window.addEventListener('resize', () => { if (libraryDialog.open) positionLibrary(); });
document.getElementById('library-close').addEventListener('click', () => libraryDialog.close());
libraryDialog.addEventListener('click', event => {
  if (event.target !== libraryDialog) return;
  const rect = libraryDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) libraryDialog.close();
});
const refreshIfVisible = () => {
  if (!document.hidden && sessionStorage.getItem('thcv-admin-auth') === '1') render();
};
setInterval(refreshIfVisible, 15000);
document.addEventListener('visibilitychange', refreshIfVisible);
window.addEventListener('storage', event => { if (event.key === STORAGE_KEY) refreshIfVisible(); });
document.getElementById('plant-filters').addEventListener('submit', event => {
  event.preventDefault();
  plantsPage = 1;
  activeFilters = { query: document.getElementById('filter-input').value.trim().toLocaleLowerCase('vi-VN'), school: document.getElementById('filter-school').value, date: document.getElementById('filter-date').value };
  renderTable();
});
function changePlantsPage(direction) {
  plantsPage = Math.max(1, plantsPage + direction);
  renderTable();
  const panel = table.closest('.panel');
  panel.scrollTop = 0;
  table.closest('.table-wrap').scrollTop = 0;
}
document.getElementById('plants-previous').addEventListener('click', () => changePlantsPage(-1));
document.getElementById('plants-next').addEventListener('click', () => changePlantsPage(1));
document.getElementById('export-excel').addEventListener('click', () => {
  const rows = [['Hoa', 'Người gieo', 'Thông điệp', 'Trường', 'Lớp', 'Trạng thái', 'Thời gian'], ...filteredPlants().map(plant => [flowerName(plant.flower), plant.grower?.name || 'Bạn', plant.grower?.message || '', plant.grower?.school || '', rooms[plant.roomId] || plant.roomId, plant.stage === 5 ? 'Đã nở' : 'Đang lớn', plant.plantedAt ? new Date(plant.plantedAt).toLocaleString('vi-VN') : ''])];
  const url = URL.createObjectURL(createWorkbook(rows));
  const link = document.createElement('a');
  link.href = url;
  link.download = `nguoi-gieo-${activeFilters.date || localDate(Date.now())}.xlsx`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.getElementById('book-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const file = form.elements.file.files[0];
  const error = document.getElementById('book-error');
  if (!file) return;
  const submit = form.querySelector('[type="submit"]') || form.querySelector('button');
  submit.disabled = true;
  try {
    const isPresentation = /\.pptx?$/i.test(file.name);
    const isDocx = file.name.toLowerCase().endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    let content = '';
    let binary = false;
    if (isDocx) {
      error.textContent = 'Vui lòng chọn tệp văn bản như .txt, .md, .csv hoặc .json để mở sách không lỗi.';
      return;
    }
    if (isPresentation) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let raw = '';
      for (let offset = 0; offset < bytes.length; offset += 8192) raw += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
      content = btoa(raw);
    } else content = await file.text();
    binary = content.startsWith('PK') || content.includes('\u0000') || content.includes('\uFFFD');
    if (binary) {
      error.textContent = 'Tệp này không phải văn bản có thể đọc trực tiếp. Hãy chọn .txt, .md, .csv hoặc .json.';
      return;
    }
    const newBook = {
      title: String(form.elements.title.value).trim() || file.name,
      fileName: file.name,
      mimeType: isPresentation ? (file.name.toLowerCase().endsWith('.pptx') ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'application/vnd.ms-powerpoint') : file.type,
      binary,
      content,
      uploadedAt: Date.now(),
    };
    const response = await fetch('/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newBook) });
    if (!response.ok) { const payload = await response.json().catch(() => ({})); throw new Error(payload.error || 'Không thể lưu tệp trên máy chủ.'); }
    books = [((await response.json()).book), ...readBooks()];
    try { localStorage.setItem(LIBRARY_KEY, JSON.stringify(books)); } catch {}
    form.reset();
    error.textContent = '';
    renderBooks();
  } catch (reason) {
    error.textContent = reason.message || 'Không thể lưu tệp. Vui lòng thử lại.';
  } finally { submit.disabled = false; }
});
document.addEventListener('click', event => {
  const button = event.target.closest('[data-delete-book]');
  if (!button) return;
  fetch(`/api/books?id=${encodeURIComponent(button.dataset.deleteBook)}`, { method: 'DELETE' })
    .then(response => { if (!response.ok) throw new Error('Không thể xóa sách.'); })
    .then(() => { books = readBooks().filter(book => book.id !== button.dataset.deleteBook); localStorage.setItem(LIBRARY_KEY, JSON.stringify(books)); renderBooks(); })
    .catch(() => { document.getElementById('book-error').textContent = 'Không thể xóa sách khỏi Neon.'; });
});
if (sessionStorage.getItem('thcv-admin-auth') === '1') { loginView.classList.add('hidden'); dashboardView.classList.remove('hidden'); render(); }

table.addEventListener('click', async event => {
  const button = event.target.closest('[data-delete-plant]');
  if (!button) return;
  const plant = plants[Number(button.dataset.deletePlant)];
  if (!plant || !confirm(`Xóa người gieo “${plant.grower?.name || 'Bạn'}” cùng cây và thông điệp ở dòng này?`)) return;
  button.disabled = true;
  try {
    if (plant.remote) {
      const response = await fetch('/api/plants', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roomId: plant.roomId, index: plant.index }) });
      if (!response.ok) throw new Error('Không thể xóa dữ liệu trên máy chủ.');
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    data.version ||= 2;
    data.gardens ||= {};
    data.unlocked ||= [];
    seedDemoPlants(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (plant.demoId) data.deletedDemoIds = [...new Set([...(data.deletedDemoIds || []), plant.demoId])];
    const local = data.gardens?.[plant.roomId]?.[plant.index];
    if (local && (plant.demoId ? local.demoId === plant.demoId : !local.demoId)) data.gardens[plant.roomId][plant.index] = null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    await render();
  } catch (error) {
    alert(error.message || 'Không thể xóa người gieo. Vui lòng thử lại.');
    button.disabled = false;
  }
});
