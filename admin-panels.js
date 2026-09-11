const panelSelector = '#plant-notification-panel, #library-dialog, #school-manager-panel';

function updateGardenVisibility() {
  const active = [...document.querySelectorAll(panelSelector)].some(panel => panel.open);
  document.querySelector('.plants-admin-panel')?.classList.toggle('hidden', active);
}

export function showAdminPanel(panel) {
  for (const other of document.querySelectorAll(panelSelector)) {
    if (other !== panel && other.open) other.close();
  }
  if (!panel.dataset.viewManaged) {
    panel.addEventListener('close', updateGardenVisibility);
    panel.dataset.viewManaged = 'true';
  }
  panel.show();
  updateGardenVisibility();
}
