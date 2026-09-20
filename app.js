(() => {
  const root = document.documentElement;
  const requested = new URLSearchParams(location.search).get('lang');
  if (['ru', 'en'].includes(requested) && requested !== root.lang) {
    location.replace((requested === 'en' ? 'en.html' : 'index.html') + location.hash);
    return;
  }
  const key = 'packtuning-color-scheme-mode';
  const modes = ['day', 'night', 'auto', 'system'];
  let mode = 'auto';
  try { const saved = localStorage.getItem(key); if (modes.includes(saved)) mode = saved; } catch {}
  const system = matchMedia('(prefers-color-scheme: dark)');
  function apply() {
    const hour = new Date().getHours();
    const theme = mode === 'system' ? (system.matches ? 'night' : 'day') : mode === 'auto' ? (hour >= 6 && hour < 18 ? 'day' : 'night') : mode;
    root.dataset.theme = theme;
    root.style.colorScheme = theme === 'night' ? 'dark' : 'light';
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  }
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode;
    try { localStorage.setItem(key, mode); } catch {}
    apply();
  }));
  system.addEventListener('change', apply);
  setInterval(apply, 60000);
  apply();
  const dialog = document.querySelector('dialog');
  document.querySelector('.screenshot').addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
})();
