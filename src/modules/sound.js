let audioContext;

function context() {
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
}

function tone(frequency, start, duration, type = 'sine', volume = 0.05) {
  const ctx = context();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

export function playSound(kind, enabled = true) {
  if (!enabled) return;
  try {
    const now = context().currentTime;
    if (kind === 'success') {
      tone(523, now, 0.18);
      tone(659, now + 0.12, 0.2);
      tone(784, now + 0.25, 0.3);
    } else if (kind === 'error') {
      tone(180, now, 0.18, 'triangle', 0.035);
      tone(145, now + 0.1, 0.22, 'triangle', 0.03);
    } else {
      tone(420, now, 0.08, 'sine', 0.025);
    }
  } catch {
    // Web Audio может быть запрещён настройками браузера — игра продолжит работать без звука.
  }
}

