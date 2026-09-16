const panel = document.querySelector('#questionnaire-panel');
const frame = panel.querySelector('iframe');
const triggers = document.querySelectorAll('.questionnaire-trigger');
const closeButton = panel.querySelector('.questionnaire-close');
const contactForm = document.querySelector('#contact-form');
const contactSuccess = document.querySelector('#contact-success');
const contactError = document.querySelector('#contact-error');

function openQuestionnaire(event) {
  event.preventDefault();
  if (!frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.src);
  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

triggers.forEach((trigger) => trigger.addEventListener('click', openQuestionnaire));

closeButton.addEventListener('click', () => {
  panel.hidden = true;
  document.querySelector('#claim').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
  if (event.data?.type !== 'progiant-questionnaire-height') return;
  frame.style.height = `${Math.max(900, Number(event.data.height) || 0)}px`;
});

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const button = contactForm.querySelector('button[type="submit"]');
  const originalLabel = button.innerHTML;
  button.disabled = true;
  button.textContent = 'Sending…';
  contactError.hidden = true;

  try {
    const response = await fetch('https://formsubmit.co/ajax/luke.progiant@71systems.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm),
    });
    if (!response.ok) throw new Error('Submission failed');
    contactForm.reset();
    contactForm.hidden = true;
    contactSuccess.hidden = false;
  } catch {
    contactError.hidden = false;
    button.disabled = false;
    button.innerHTML = originalLabel;
  }
});
