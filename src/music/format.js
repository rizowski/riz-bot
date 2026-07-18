const pad = (n) => String(n).padStart(2, '0');

export function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function progressBar(elapsedSeconds, totalSeconds, size = 18) {
  if (!totalSeconds || totalSeconds <= 0) {
    return '▬'.repeat(size);
  }

  const ratio = Math.min(1, Math.max(0, elapsedSeconds / totalSeconds));
  const knob = Math.min(size - 1, Math.floor(ratio * size));

  return `${'▬'.repeat(knob)}🔘${'▬'.repeat(size - 1 - knob)}`;
}
