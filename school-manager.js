import { loadSchools, saveSchools } from './schools.js';
import { showAdminPanel } from './admin-panels.js';
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export function setupSchoolManager() {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'secondary'; button.textContent = 'Quản lý trường';
  button.setAttribute('aria-haspopup', 'dialog');
  document.getElementById('library-button').after(button);
  const dialog = document.createElement('dialog');
  dialog.className = 'school-manager';
  dialog.setAttribute('aria-labelledby', 'schools-title');
  dialog.id = 'school-manager-panel';
  button.setAttribute('aria-controls', dialog.id);
  button.setAttribute('aria-expanded', 'false');
  dialog.innerHTML = '<header><h2 id="schools-title">Quản lý trường</h2><button type="button" class="secondary" data-close aria-label="Đóng quản lý trường">×</button></header><form><label for="school-name">Tên trường</label><div class="school-form-row"><input id="school-name" required maxlength="150" placeholder="Nhập tên trường"/><button type="submit" class="secondary" data-save>Thêm trường</button><button type="button" class="secondary" data-cancel hidden>Hủy</button></div></form><p class="error" role="status"></p><div class="school-list"></div>';
  document.body.append(dialog);
  let names = [], editing = -1, busy = false;
  const input = dialog.querySelector('input');
  const error = dialog.querySelector('.error');
  function reset() { editing = -1; input.value = ''; dialog.querySelector('[data-save]').textContent = 'Thêm trường'; dialog.querySelector('[data-cancel]').hidden = true; }
  function render() {
    dialog.querySelector('.school-list').innerHTML = names.length ? names.map((name, index) => `<div class="school-row"><span>${escape(name)}</span><button type="button" class="secondary" data-edit="${index}">Sửa</button><button type="button" class="delete-plant" data-delete="${index}">Xóa</button></div>`).join('') : '<p class="empty">Chưa có trường nào. Thêm trường đầu tiên ở trên.</p>';
  }
  async function commit(next) {
    busy = true; dialog.querySelectorAll('button,input').forEach(el => el.disabled = true);
    try { await saveSchools(next); names = next; reset(); render(); error.textContent = 'Đã lưu danh sách trường.'; }
    catch (reason) { error.textContent = reason.message; }
    finally { busy = false; dialog.querySelectorAll('button,input').forEach(el => el.disabled = false); }
  }
  button.addEventListener('click', async () => {
    if (dialog.open) { dialog.close(); return; }
    reset(); error.textContent = ''; positionPanel(); showAdminPanel(dialog);
    button.setAttribute('aria-expanded', 'true');
    busy = true; dialog.querySelectorAll('button,input').forEach(el => el.disabled = true);
    const result = await loadSchools(); names = result.schools;
    render(); busy = false; dialog.querySelectorAll('button,input').forEach(el => el.disabled = false); input.focus();
  });
  function positionPanel() {
    const top = Math.max(12, Math.min(button.getBoundingClientRect().bottom + 10, window.innerHeight - 220));
    dialog.style.top = `${top}px`;
    dialog.style.maxHeight = `${window.innerHeight - top - 12}px`;
  }
  dialog.addEventListener('close', () => button.setAttribute('aria-expanded', 'false'));
  document.addEventListener('click', event => {
    if (dialog.open && !busy && !dialog.contains(event.target) && !button.contains(event.target)) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) { dialog.close(); button.focus(); }
  });
  window.addEventListener('resize', () => { if (dialog.open) positionPanel(); });
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault(); if (busy) return;
    const next = [...names], name = input.value.trim().replace(/\s+/g, ' ');
    if (editing < 0) next.push(name); else next[editing] = name;
    commit(next);
  });
  dialog.addEventListener('click', event => {
    if (busy) return;
    if (event.target.closest('[data-close]')) dialog.close();
    if (event.target.closest('[data-cancel]')) reset();
    const edit = event.target.closest('[data-edit]'), remove = event.target.closest('[data-delete]');
    if (edit) { editing = Number(edit.dataset.edit); input.value = names[editing]; dialog.querySelector('[data-save]').textContent = 'Lưu thay đổi'; dialog.querySelector('[data-cancel]').hidden = false; input.focus(); }
    if (remove) { const index = Number(remove.dataset.delete); if (confirm(`Xóa “${names[index]}” khỏi danh sách chọn trường?`)) commit(names.filter((_, i) => i !== index)); }
  });
}
