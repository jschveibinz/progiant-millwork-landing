const form = document.querySelector('#questionnaire-form');
const success = document.querySelector('#questionnaire-success');
const error = document.querySelector('#questionnaire-error');
const params = new URLSearchParams(window.location.search);

if (params.has('embedded')) {
  document.body.classList.add('embedded-questionnaire');
  const reportHeight = () => window.parent.postMessage({
    type: 'progiant-questionnaire-height',
    height: document.documentElement.scrollHeight,
  }, window.location.origin);
  window.addEventListener('load', reportHeight);
  new ResizeObserver(reportHeight).observe(document.body);
}

if (params.has('sent')) {
  form.querySelectorAll('fieldset, .submit-panel').forEach((element) => {
    element.hidden = true;
  });
  error.hidden = true;
  success.hidden = false;
}

form.addEventListener('submit', () => {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Sending project context…';
  error.hidden = true;
});
