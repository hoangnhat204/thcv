const scene = document.getElementById('school-scene');
const building = document.getElementById('school-building');

// Keep all five floors in proportion when the available width or height changes.
new ResizeObserver(() => {
  const scale = Math.min((scene.clientWidth - 44) / 640, (scene.clientHeight - 64) / 335, 1.65);
  building.style.setProperty('--building-scale', Math.max(0.1, scale));
}).observe(scene);

const gardenView = document.getElementById('garden-view');
function addMobileControls() {
  const doors = [...building.querySelectorAll('[data-room]')];
  if (doors.length && !document.getElementById('mobile-room-picker')) {
    const picker = document.createElement('select');
    picker.id = 'mobile-room-picker';
    picker.className = 'mobile-room-picker';
    picker.setAttribute('aria-label', 'Chọn lớp để vào khu vườn');
    picker.add(new Option('Chọn lớp học', ''));
    for (const door of doors) picker.add(new Option(door.getAttribute('aria-label').replace('Mở cửa ', ''), door.dataset.room));
    picker.addEventListener('change', () => {
      doors.find(door => door.dataset.room === picker.value)?.click();
      picker.value = '';
    });
    document.querySelector('.school-card-top').append(picker);
  }
  const layout = gardenView.querySelector('.garden-layout');
  if (!layout || gardenView.querySelector('.mobile-garden-controls')) return;
  const controls = document.createElement('div');
  controls.className = 'mobile-garden-controls';
  controls.innerHTML = '<button type="button" data-mobile-supply aria-expanded="false" aria-controls="mobile-garden-supply">Thông tin & chọn hoa</button><span>Chọn hoa rồi chạm ô đất để gieo</span>';
  layout.before(controls);
  const supply = layout.querySelector('.garden-supply');
  supply.id = 'mobile-garden-supply';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'mobile-supply-close';
  close.dataset.mobileSupply = '';
  close.textContent = 'Xong · Về luống hoa';
  supply.prepend(close);
  gardenView.classList.remove('mobile-supply-open');
}
new MutationObserver(addMobileControls).observe(document.getElementById('main-content'), { childList: true, subtree: true });
addMobileControls();
function closeSupply() {
  gardenView.classList.remove('mobile-supply-open');
  const toggle = gardenView.querySelector('.mobile-garden-controls button');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.focus({ preventScroll: true });
}
document.addEventListener('click', event => {
  if (event.target.closest('[data-mobile-supply]')) {
    const open = gardenView.classList.toggle('mobile-supply-open');
    gardenView.querySelector('.mobile-garden-controls button')?.setAttribute('aria-expanded', String(open));
    if (open) gardenView.querySelector('.mobile-supply-close')?.focus({ preventScroll: true });
    else closeSupply();
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && gardenView.classList.contains('mobile-supply-open')) closeSupply();
});
