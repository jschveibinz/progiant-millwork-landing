const form = document.querySelector('#questionnaire-form');
const success = document.querySelector('#questionnaire-success');
const error = document.querySelector('#questionnaire-error');

if (new URLSearchParams(window.location.search).has('embedded')) {
  document.body.classList.add('embedded-questionnaire');
  const reportHeight = () => window.parent.postMessage({
    type: 'progiant-questionnaire-height',
    height: document.documentElement.scrollHeight,
  }, window.location.origin);
  window.addEventListener('load', reportHeight);
  new ResizeObserver(reportHeight).observe(document.body);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const button = form.querySelector('button[type="submit"]');
  const originalLabel = button.innerHTML;
  button.disabled = true;
  button.textContent = 'Sending project context…';
  error.hidden = true;

  try {
    await fetch('https://formsubmit.co/info@71systems.com', {
      method: 'POST',
      body: new FormData(form),
      mode: 'no-cors',
    });
    form.reset();
    success.hidden = false;
    button.textContent = 'Project context sent ✓';
  } catch {
    error.hidden = false;
    button.disabled = false;
    button.innerHTML = originalLabel;
  }
});
