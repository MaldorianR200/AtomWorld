export function launchConfetti(container = document.body) {
  const colors = ['#6ee7c4', '#55b8ff', '#ffcf5a', '#ff7c70', '#c7a6ff'];
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  layer.setAttribute('aria-hidden', 'true');

  for (let index = 0; index < 52; index += 1) {
    const piece = document.createElement('i');
    piece.style.setProperty('--x', `${Math.random() * 100}vw`);
    piece.style.setProperty('--delay', `${Math.random() * 0.6}s`);
    piece.style.setProperty('--duration', `${1.8 + Math.random() * 1.8}s`);
    piece.style.setProperty('--rotation', `${Math.random() * 720 - 360}deg`);
    piece.style.background = colors[index % colors.length];
    layer.append(piece);
  }

  container.append(layer);
  window.setTimeout(() => layer.remove(), 4200);
}

export function flash(element, className) {
  element.classList.remove(className);
  requestAnimationFrame(() => element.classList.add(className));
  window.setTimeout(() => element.classList.remove(className), 650);
}
