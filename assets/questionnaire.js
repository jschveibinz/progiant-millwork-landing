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
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  button.disabled = true;
  button.textContent = 'Sending project context…';
  error.hidden = true;

  try {
    const response = await fetch('https://formsubmit.co/ajax/info@71systems.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch {
    error.hidden = false;
    error.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } finally {
    window.clearTimeout(timeout);
    if (!form.hidden) {
      button.disabled = false;
      button.innerHTML = originalLabel;
    }
  }
});
