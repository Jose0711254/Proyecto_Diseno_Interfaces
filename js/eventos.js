const eventFilters = document.querySelector('#event-filters');
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

