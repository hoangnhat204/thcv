import { DEFAULT_SCHOOLS } from './school-defaults.js';
const KEY = 'thcv-schools-v1';
let schools;
let remote = false;
if (typeof window !== 'undefined') window.addEventListener('storage', event => { if (event.key === KEY) schools = undefined; });
export function validateSchools(values) {
  if (!Array.isArray(values) || values.length > 1000) throw new Error('Danh sách trường không hợp lệ.');
  const names = values.map(name => {
    if (typeof name !== 'string') throw new Error('Tên trường không hợp lệ.');
    const value = name.trim().replace(/\s+/g, ' ');
    if (!value || value.length > 150) throw new Error('Tên trường phải có từ 1 đến 150 ký tự.');
    return value;
  });
  if (new Set(names.map(name => name.toLocaleLowerCase('vi-VN'))).size !== names.length) throw new Error('Tên trường đã tồn tại.');
  return names;
}
export function getSchools() {
  if (!schools) {
    try { schools = validateSchools(JSON.parse(localStorage.getItem(KEY))); } catch { schools = [...DEFAULT_SCHOOLS]; }
  }
  return [...schools];
}
export async function loadSchools() {
  getSchools();
  try {
    const response = await fetch('/api/schools');
    if (!response.ok) throw new Error();
    schools = validateSchools((await response.json()).schools);
    remote = true;
    try { localStorage.setItem(KEY, JSON.stringify(schools)); } catch {}
  } catch { remote = false; }
  return { schools: getSchools(), remote };
}
export async function saveSchools(values) {
  const next = validateSchools(values);
  if (remote) {
    const response = await fetch('/api/schools', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ schools: next }) });
    if (!response.ok) throw new Error('Không thể lưu danh sách trường trên máy chủ. Vui lòng thử lại.');
  }
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { if (!remote) throw new Error('Không thể lưu danh sách trên trình duyệt này.'); }
  schools = next;
}
