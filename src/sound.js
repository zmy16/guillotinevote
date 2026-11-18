const STORAGE_KEY = 'guillotinevote.muted';

export function isMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function setMuted(muted) {
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {
    return;
  }
}

let context = null;

function getContext() {
  if (typeof AudioContext === 'undefined') {
    return null;
  }
  if (!context) {
    context = new AudioContext();
  }
  return context;
}

function noiseBurst(durationMs) {
  const audio = getContext();
  if (!audio) {
    return;
  }
  const frames = Math.floor((audio.sampleRate * durationMs) / 1000);
  const buffer = audio.createBuffer(1, frames, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  const gain = audio.createGain();
  gain.gain.value = 0.25;
  source.connect(filter).connect(gain).connect(audio.destination);
  source.start();
}

function tone(frequency, startOffset, durationMs) {
  const audio = getContext();
  if (!audio) {
    return;
  }
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const start = audio.currentTime + startOffset;
  const end = start + durationMs / 1000;
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(end);
}

export function playSound(kind) {
  if (isMuted()) {
    return;
  }
  const audio = getContext();
  if (!audio) {
    return;
  }
  if (audio.state === 'suspended') {
    audio.resume();
  }
  if (kind === 'blade') {
    noiseBurst(250);
    tone(90, 0, 220);
  } else if (kind === 'pardon') {
    tone(660, 0, 320);
    tone(880, 0.16, 380);
  } else if (kind === 'winner') {
    tone(523, 0, 260);
    tone(659, 0.18, 260);
    tone(784, 0.36, 420);
  }
}
