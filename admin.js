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

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char]));
const flowerName = id => {
  const fixed = { daisy: 0, sunflower: 1, tulip: 2, lavender: 3, rose: 4, cosmos: 5 };
  return flowers[fixed[id] ?? (Number(String(id).replace('flower-', '')) - 1 + 6)] || 'Hoa';
};
function readPlants() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return Object.entries(data.gardens || {}).flatMap(([roomId, plots]) => (Array.isArray(plots) ? plots : []).filter(Boolean).map(plant => ({ ...plant, roomId }))).sort((a, b) => (b.plantedAt || 0) - (a.plantedAt || 0));
  } catch {
    return [];
  }
}
function render() {
  plants = readPlants();
  const bloomed = plants.filter(plant => plant.stage === 5).length;
  const schools = new Set(plants.map(plant => plant.grower?.school).filter(Boolean)).size;
  document.getElementById('summary').innerHTML = [['🌱',plants.length,'Cây đã gieo'],['🌸',bloomed,'Hoa đã nở'],['🏫',new Set(plants.map(plant => plant.roomId)).size,'Khu vườn'],['📚',schools,'Trường tham gia']].map(item => `<div class="summary-card"><strong>${item[0]} ${item[1]}</strong><span>${item[2]}</span></div>`).join('');
  renderTable();
  renderBooks();
}
function readBooks() {
  try {
    const saved = JSON.parse(localStorage.getItem(LIBRARY_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(book => book && book.id && book.title && typeof book.content === 'string') : [];
  } catch {
    return [];
  }
}
function renderBooks() {
  books = readBooks();
  const list = document.getElementById('books-list');
  list.innerHTML = books.length ? books.map(book => `<div class="book-row"><span>📖</span><strong>${escapeHtml(book.title)}</strong><small>${new Date(book.uploadedAt).toLocaleString('vi-VN')}</small><button type="button" data-delete-book="${escapeHtml(book.id)}">Xóa</button></div>`).join('') : '<p class="empty">Chưa có sách nào.</p>';
}
function renderTable() {
  const query = document.getElementById('filter-input').value.trim().toLocaleLowerCase('vi-VN');
  const searchable = plant => [flowerName(plant.flower), plant.grower?.name, plant.grower?.school, rooms[plant.roomId]].join(' ').toLocaleLowerCase('vi-VN');
  const filtered = plants.filter(plant => searchable(plant).includes(query));
  table.innerHTML = filtered.map(plant => `<tr><td>${escapeHtml(flowerName(plant.flower))}</td><td>${escapeHtml(plant.grower?.name || 'Bạn')}</td><td class="message-cell" title="${escapeHtml(plant.grower?.message || '')}">${escapeHtml(plant.grower?.message || 'Chưa có thông điệp')}</td><td>${escapeHtml(plant.grower?.school || 'Chưa cập nhật')}</td><td>${escapeHtml(rooms[plant.roomId] || plant.roomId)}</td><td><span class="status ${plant.stage === 5 ? 'bloomed' : ''}">${plant.stage === 5 ? 'Đã nở' : 'Đang lớn'}</span></td><td>${plant.plantedAt ? new Date(plant.plantedAt).toLocaleString('vi-VN') : '—'}</td></tr>`).join('');
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
document.getElementById('filter-input').addEventListener('input', renderTable);
document.getElementById('book-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const file = form.elements.file.files[0];
  const error = document.getElementById('book-error');
  if (!file) return;
  try {
    const isDocx = file.name.toLowerCase().endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    let content = '';
    let binary = false;
    if (isDocx) {
      error.textContent = 'Vui lòng chọn tệp văn bản như .txt, .md, .csv hoặc .json để mở sách không lỗi.';
      return;
    }
    content = await file.text();
    binary = content.startsWith('PK') || content.includes('\u0000') || content.includes('\uFFFD');
    if (binary) {
      error.textContent = 'Tệp này không phải văn bản có thể đọc trực tiếp. Hãy chọn .txt, .md, .csv hoặc .json.';
      return;
    }
    books = [...readBooks(), {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: String(form.elements.title.value).trim() || file.name,
      fileName: file.name,
      mimeType: file.type,
      binary,
      content,
      uploadedAt: Date.now(),
    }];
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(books));
    form.reset();
    error.textContent = '';
    renderBooks();
  } catch {
    error.textContent = 'Không thể lưu tệp. Bộ nhớ trình duyệt có thể đã đầy.';
  }
});
document.addEventListener('click', event => {
  const button = event.target.closest('[data-delete-book]');
  if (!button) return;
  books = readBooks().filter(book => book.id !== button.dataset.deleteBook);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(books));
  renderBooks();
});
if (sessionStorage.getItem('thcv-admin-auth') === '1') { loginView.classList.add('hidden'); dashboardView.classList.remove('hidden'); render(); }
