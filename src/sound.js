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

const WHOOSH_MS = 300;

function createNoise(audio, durationMs, decays) {
  const frames = Math.floor((audio.sampleRate * durationMs) / 1000);
  const buffer = audio.createBuffer(1, frames, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (decays ? 1 - i / frames : 1);
  }
  const source = audio.createBufferSource();
  source.buffer = buffer;
  return source;
}

function noiseBurst(durationMs, filterType, frequency, level) {
  const audio = getContext();
  if (!audio) {
    return;
  }
  const source = createNoise(audio, durationMs, true);
  const filter = audio.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = frequency;
  const gain = audio.createGain();
  gain.gain.value = level;
  source.connect(filter).connect(gain).connect(audio.destination);
  source.start();
}

function whoosh() {
  const audio = getContext();
  if (!audio) {
    return;
  }
  const start = audio.currentTime;
  const end = start + WHOOSH_MS / 1000;
  const source = createNoise(audio, WHOOSH_MS, false);
  const filter = audio.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(500, start);
  filter.frequency.exponentialRampToValueAtTime(3200, end);
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.28, end - 0.02);
  gain.gain.linearRampToValueAtTime(0.0001, end);
  source.connect(filter).connect(gain).connect(audio.destination);
  source.start(start);
}

function tone(frequency, startOffset, durationMs, endFrequency = frequency, level = 0.18) {
  const audio = getContext();
  if (!audio) {
    return;
  }
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const start = audio.currentTime + startOffset;
  const end = start + durationMs / 1000;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, end);
  oscillator.type = 'sine';
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + 0.02);
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
  if (kind === 'fall') {
    whoosh();
  } else if (kind === 'blade') {
    noiseBurst(110, 'bandpass', 2400, 0.22);
    noiseBurst(170, 'lowpass', 900, 0.25);
    tone(150, 0, 230, 45, 0.4);
  } else if (kind === 'pardon') {
    tone(660, 0, 320);
    tone(880, 0.16, 380);
  } else if (kind === 'winner') {
    tone(523, 0, 260);
    tone(659, 0.18, 260);
    tone(784, 0.36, 420);
  }
}