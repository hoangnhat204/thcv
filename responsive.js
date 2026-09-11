const scene = document.getElementById('school-scene');
const building = document.getElementById('school-building');

// Keep all five floors in proportion when the available width or height changes.
new ResizeObserver(() => {
  const scale = Math.min((scene.clientWidth - 44) / 640, (scene.clientHeight - 64) / 335, 1.65);
  building.style.setProperty('--building-scale', Math.max(0.1, scale));
}).observe(scene);

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
}
new MutationObserver(addMobileControls).observe(document.getElementById('main-content'), { childList: true, subtree: true });
addMobileControls();
