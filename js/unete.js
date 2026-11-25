(() => {
  const birthDate = document.querySelector('#s-fecha');
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
})();
