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

  root.dataset.bsTheme = readTheme() ?? 'light';

  function initTheme() {
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
      }
    });

    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        applyTheme(readTheme() ?? root.dataset.bsTheme);
      }
    });
  }

  function initEventFilters() {
    const eventFilters = document.querySelector('#event-filters');
    if (!eventFilters) return;

    const eventSearch = document.querySelector('#event-search');
    const dayFilter = document.querySelector('#event-day');
    const hourFilter = document.querySelector('#event-hour');
    const typeFilter = document.querySelector('#event-type');
    const eventStatus = document.querySelector('#event-status');
    const eventAgenda = document.querySelector('#event-agenda');

    const agendaRows = new Map(
      Array.from(eventAgenda.querySelectorAll('[data-agenda-event]'), (row) => [row.dataset.agendaEvent, row])
    );

    function normalizeSearch(text) {
      return text.trim().toLocaleLowerCase('es').normalize('NFD').replace(/\p{M}/gu, '');
    }

    const events = Array.from(document.querySelectorAll('[data-event]'), (card) => {
      const [day, hour] = card.querySelector('time').dateTime.split('T');
      const title = card.querySelector('h3').textContent;
      const description = card.querySelector('[data-event-description]').textContent;
      return {
        card,
        row: agendaRows.get(card.dataset.event),
        day,
        hour,
        type: card.querySelector('[data-event-type]').textContent.trim(),
        text: normalizeSearch([title, description].join(' '))
      };
    });

    const dayFormat = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

    function addFilterOptions(select, values, format = (value) => value) {
      for (const value of [...new Set(values)].sort()) {
        select.add(new Option(format(value), value));
      }
    }

    addFilterOptions(dayFilter, events.map((event) => event.day), (day) => dayFormat.format(new Date(day)));
    addFilterOptions(hourFilter, events.map((event) => event.hour));
    addFilterOptions(typeFilter, events.map((event) => event.type));

    function filterEvents() {
      const query = normalizeSearch(eventSearch.value);
      let count = 0;

      for (const event of events) {
        const matches = event.text.includes(query)
          && (!dayFilter.value || event.day === dayFilter.value)
          && (!hourFilter.value || event.hour === hourFilter.value)
          && (!typeFilter.value || event.type === typeFilter.value);

        event.card.hidden = !matches;
        if (event.row) {
          event.row.hidden = !matches;
        }
        count += Number(matches);
      }

      eventAgenda.hidden = count === 0;
      eventStatus.textContent = count === 0
        ? 'No hay eventos que coincidan con los filtros.'
        : `${count} ${count === 1 ? 'evento encontrado' : 'eventos encontrados'}.`;
    }

    eventFilters.addEventListener('input', filterEvents);
    eventFilters.addEventListener('submit', (event) => {
      event.preventDefault();
      filterEvents();
    });
    document.querySelector('#event-filters-clear').addEventListener('click', () => {
      eventFilters.reset();
      filterEvents();
      eventSearch.focus();
    });

    eventFilters.hidden = false;
    filterEvents();
  }

  function initJoinForms() {
    const birthDate = document.querySelector('#s-fecha');
    if (!birthDate) return;

    const ageField = document.querySelector('#s-edad');

    function updateAge() {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      birthDate.max = [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('-');

      birthDate.setCustomValidity('');
      ageField.value = '';
      if (!birthDate.validity.valid) return;

      const [birthYear, birthMonth, birthDay] = birthDate.value.split('-').map(Number);
      const birthdayPassed = month > birthMonth || (month === birthMonth && day >= birthDay);
      const age = year - birthYear - Number(!birthdayPassed);
      if (age > 120) {
        birthDate.setCustomValidity(document.querySelector('#s-fecha-error').textContent);
        return;
      }
      ageField.value = age;
    }

    function updateValidity(field) {
      if (field === birthDate) {
        updateAge();
      } else {
        const whitespaceOnly = field.value.length > 0 && !field.value.trim();
        const message = whitespaceOnly ? document.getElementById(field.id + '-error').textContent : '';
        field.setCustomValidity(message);
      }
    }

    function showValidity(field) {
      const invalid = !field.validity.valid;
      field.classList.toggle('is-invalid', invalid);
      if (invalid) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', field.id + '-error');
      } else {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
      }
    }

    function reviewValue(field) {
      if (field instanceof HTMLSelectElement) return field.selectedOptions[0].textContent;
      if (field.type === 'date') return field.value.split('-').reverse().join('/');
      if (field.type === 'number') return String(field.valueAsNumber);
      return field.value.trim();
    }

    for (const form of document.querySelectorAll('.join-form')) {
      const fields = Array.from(form.querySelectorAll('[name]'));
      const requiredFields = fields.filter((field) => field.required);
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('.join-status');
      const review = form.querySelector('.join-review');
      const values = review.querySelector('dl');

      form.addEventListener('input', ({ target }) => {
        if (target.required) {
          updateValidity(target);
          if (target.hasAttribute('aria-invalid')) showValidity(target);
        }
        review.hidden = true;
        values.replaceChildren();
        status.textContent = '';
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        for (const field of requiredFields) {
          updateValidity(field);
          showValidity(field);
        }

        const firstInvalid = requiredFields.find((field) => !field.validity.valid);
        if (firstInvalid) {
          review.hidden = true;
          values.replaceChildren();
          status.textContent = 'Revisa los campos marcados.';
          firstInvalid.focus();
          return;
        }

        const summary = document.createDocumentFragment();
        for (const field of fields) {
          const term = document.createElement('dt');
          const description = document.createElement('dd');
          term.textContent = field.labels[0].textContent;
          description.textContent = reviewValue(field);
          summary.append(term, description);
        }
        values.replaceChildren(summary);
        review.hidden = false;
        status.textContent = 'Datos correctos. Puedes comprobarlos en el resumen.';
      });

      form.noValidate = true;
      button.disabled = false;
    }

    updateAge();
    window.addEventListener('pageshow', updateAge);

    function openForm(hash) {
      const section = document.getElementById(hash.slice(1));
      const details = section?.querySelector('.join-details');
      if (details) details.open = true;
    }

    for (const link of document.querySelectorAll('a[href="#socios"], a[href="#charlas"]')) {
      link.addEventListener('click', () => openForm(link.hash));
    }
    window.addEventListener('hashchange', () => openForm(location.hash));
    openForm(location.hash);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventFilters();
    initJoinForms();
  });
})();
