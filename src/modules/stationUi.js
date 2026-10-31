import { getState } from './store.js';
import { playSound } from './sound.js';

export function setFeedback(root, message, type = 'info') {
  const feedback = root.querySelector('[data-feedback]');
  if (!feedback) return;
  feedback.className = `feedback feedback--${type}`;
  feedback.innerHTML = type === 'success'
    ? `<span aria-hidden="true">✓</span><p>${message}</p>`
    : type === 'error'
      ? `<span aria-hidden="true">!</span><p>${message}</p>`
      : `<span aria-hidden="true">i</span><p>${message}</p>`;
  feedback.setAttribute('role', type === 'error' ? 'alert' : 'status');
}

export function signal(root, type, message) {
  playSound(type, getState().sound);
  setFeedback(root, message, type);
}

export function completionMarkup(eyebrow, title, text) {
  return `
    <section class="station-complete" aria-live="polite">
      <div class="station-complete__orb"><span>✓</span></div>
      <p class="eyebrow">${eyebrow}</p>
      <h3>${title}</h3>
      <p>${text}</p>
      <button class="button button--primary" type="button" data-next-station>
        Следующая станция <span aria-hidden="true">→</span>
      </button>
    </section>
  `;
}

export function enableDragToTargets(root, selector, onDrop) {
  let draggedId = null;

  root.querySelectorAll(selector).forEach((item) => {
    item.addEventListener('dragstart', (event) => {
      draggedId = item.dataset.id;
      item.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggedId);
    });
    item.addEventListener('dragend', () => item.classList.remove('is-dragging'));
  });

  root.querySelectorAll('[data-drop-target]').forEach((target) => {
    target.addEventListener('dragover', (event) => {
      event.preventDefault();
      target.classList.add('is-drag-over');
    });
    target.addEventListener('dragleave', () => target.classList.remove('is-drag-over'));
    target.addEventListener('drop', (event) => {
      event.preventDefault();
      event.stopPropagation();
      target.classList.remove('is-drag-over');
      onDrop(event.dataTransfer.getData('text/plain') || draggedId, target.dataset.dropTarget, target);
    });
  });
}

