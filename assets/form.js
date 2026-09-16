const form = document.querySelector('#lead-form');
const content = document.querySelector('#form-content');
const success = document.querySelector('#form-success');
const error = document.querySelector('#form-error');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  button.firstChild.textContent = 'Sending… ';
  error.hidden = true;

  try {
    const response = await fetch('https://formsubmit.co/ajax/info@71systems.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    content.hidden = true;
    success.hidden = false;
  } catch {
    error.hidden = false;
    button.disabled = false;
    button.firstChild.textContent = 'Request a project-profit review ';
  }
});
