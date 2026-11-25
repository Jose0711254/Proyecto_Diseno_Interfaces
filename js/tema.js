(() => {
  const root = document.documentElement;
  const storageKey = 'nodo-norte-theme';

  function readTheme() {
    try {
      const theme = localStorage.getItem(storageKey);
      return theme === 'dark' || theme === 'light' ? theme : null;
    } catch {
      return null;
    }
  }

  // Aplica la preferencia antes de cargar los estilos para evitar un cambio visible de tema.
  root.dataset.bsTheme = readTheme() ?? 'light';

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('#theme-toggle');

    function applyTheme(theme) {
      root.dataset.bsTheme = theme;
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    applyTheme(root.dataset.bsTheme);
    toggle.hidden = false;

    toggle.addEventListener('click', () => {
      const theme = root.dataset.bsTheme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      try {
        localStorage.setItem(storageKey, theme);
      } catch {
        // El botón sigue funcionando en esta página si el navegador bloquea el almacenamiento.
      }
    });

    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        applyTheme(readTheme() ?? root.dataset.bsTheme);
      }
    });
  });
})();
