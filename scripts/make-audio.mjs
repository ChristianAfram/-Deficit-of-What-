// Synthesises the film's sound stems into public/audio/ as 48 kHz 16-bit WAV.
// Deterministic: the same script always writes the same bytes, so the stems are
// build products (gitignored) and never need to be committed.
//
// The script's sound rule: "A slow pulse and one sustained string line. The
// line moves one step at each status line and completes only in Part 5. A soft
// tick for each row of data." The cold open adds a low room tone and a single
// sustained low note.
//
//   node scripts/make-audio.mjs

import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 48000;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');

// The film is in D. The pedal and the pulse sit on D2. The string line starts
// on the fifth (A3) and has four steps left to fall before it reaches D3, one
// for each status line and the last one in Part 5.
const D2 = 73.416;
const STRING_LINE_HZ = {
  step0: 220.0, // A3: stated at the title, held through Part 0
  step1: 195.998, // G3: status line one
  step2: 174.614, // F3: status line two
  step3: 164.814, // E3: status line three
  step4: 146.832, // D3: completes in Part 5
};

// ---------------------------------------------------------------- utilities

const dbToGain = (db) => 10 ** (db / 20);

/** Small seeded generator so every run writes identical noise. */
const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const buffer = (seconds) => new Float64Array(Math.round(seconds * SR));

/** One-pole low-pass, in place. */
const lowpass = (x, cutoffHz) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoffHz) / SR);
  let y = 0;
  for (let i = 0; i < x.length; i++) {
    y += a * (x[i] - y);
    x[i] = y;
  }
  return x;
};

/** One-pole high-pass, in place. */
const highpass = (x, cutoffHz) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoffHz) / SR);
  let low = 0;
  for (let i = 0; i < x.length; i++) {
    low += a * (x[i] - low);
    x[i] -= low;
  }
  return x;
};

const rms = (x) => {
  let sum = 0;
  for (let i = 0; i < x.length; i++) sum += x[i] * x[i];
  return Math.sqrt(sum / x.length);
};

const peak = (x) => {
  let p = 0;
  for (let i = 0; i < x.length; i++) p = Math.max(p, Math.abs(x[i]));
  return p;
};

const scale = (x, gain) => {
  for (let i = 0; i < x.length; i++) x[i] *= gain;
  return x;
};

const toRms = (x, db) => scale(x, dbToGain(db) / (rms(x) || 1));
const toPeak = (x, db) => scale(x, dbToGain(db) / (peak(x) || 1));

/** Raised-cosine fade over the first and last stretch of a buffer. */
const fade = (x, inSeconds, outSeconds) => {
  const nIn = Math.round(inSeconds * SR);
  const nOut = Math.round(outSeconds * SR);
  for (let i = 0; i < nIn && i < x.length; i++) {
    x[i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / nIn);
  }
  for (let i = 0; i < nOut && i < x.length; i++) {
    x[x.length - 1 - i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / nOut);
  }
  return x;
};

/** Makes a buffer loop without a seam: its tail is folded over its head. */
const makeSeamless = (x, overlapSeconds) => {
  const n = Math.round(overlapSeconds * SR);
  const out = new Float64Array(x.length - n);
  for (let i = 0; i < out.length; i++) out[i] = x[i];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const gainHead = Math.sin((Math.PI / 2) * t);
    const gainTail = Math.cos((Math.PI / 2) * t);
    out[i] = x[i] * gainHead + x[out.length + i] * gainTail;
  }
  return out;
};

const writeWav = (name, left, right = left) => {
  const n = Math.min(left.length, right.length);
  const dither = mulberry32(0xd17e);
  const bytes = Buffer.alloc(44 + n * 4);
  bytes.write('RIFF', 0, 'ascii');
  bytes.writeUInt32LE(36 + n * 4, 4);
  bytes.write('WAVE', 8, 'ascii');
  bytes.write('fmt ', 12, 'ascii');
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20); // PCM
  bytes.writeUInt16LE(2, 22); // stereo
  bytes.writeUInt32LE(SR, 24);
  bytes.writeUInt32LE(SR * 4, 28);
  bytes.writeUInt16LE(4, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write('data', 36, 'ascii');
  bytes.writeUInt32LE(n * 4, 40);
  const quantise = (v) => {
    // Triangular dither keeps the very quiet room tone free of quantisation grit.
    const d = dither() - dither();
    return Math.max(-32768, Math.min(32767, Math.round(v * 32767 + d)));
  };
  for (let i = 0; i < n; i++) {
    bytes.writeInt16LE(quantise(left[i]), 44 + i * 4);
    bytes.writeInt16LE(quantise(right[i]), 46 + i * 4);
  }
  const file = join(OUT_DIR, name);
  writeFileSync(file, bytes);
  const seconds = (n / SR).toFixed(2);
  const level = (20 * Math.log10(peak(left) || 1e-9)).toFixed(1);
  console.log(`  ${name.padEnd(22)} ${seconds.padStart(6)} s   peak ${level} dBFS`);
};

// -------------------------------------------------------------------- stems

/**
 * Room tone: the sound of a quiet room and nothing else. Low-passed noise with
 * a trace of air above it, decorrelated between the channels, loopable.
 */
const roomTone = (seed) => {
  const seconds = 24;
  const overlap = 3;
  const rand = mulberry32(seed);
  const low = buffer(seconds + overlap);
  const air = buffer(seconds + overlap);
  for (let i = 0; i < low.length; i++) {
    low[i] = rand() * 2 - 1;
    air[i] = rand() * 2 - 1;
  }
  lowpass(lowpass(low, 140), 220);
  highpass(low, 28);
  highpass(lowpass(air, 1400), 320);
  toRms(low, 0);
  toRms(air, -19);
  const x = buffer(seconds + overlap);
  for (let i = 0; i < x.length; i++) x[i] = low[i] + air[i];
  return toRms(makeSeamless(x, overlap), -45);
};

/**
 * The soft tick for one row of data: a short, rounded knock. A damped sine
 * gives it pitch and a trace of filtered noise gives it a surface.
 */
const tick = ({pitchHz, level}) => {
  const rand = mulberry32(0x71c4);
  const x = buffer(0.32);
  const noise = buffer(0.32);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const attack = Math.min(1, t / 0.004);
    const body = Math.sin(2 * Math.PI * pitchHz * t) * Math.exp(-t / 0.028);
    const under = Math.sin(2 * Math.PI * (pitchHz / 3) * t) * Math.exp(-t / 0.06) * 0.5;
    noise[i] = (rand() * 2 - 1) * Math.exp(-t / 0.006);
    x[i] = attack * (body + under);
  }
  highpass(lowpass(noise, 3200), 700);
  for (let i = 0; i < x.length; i++) x[i] += noise[i] * 0.35;
  lowpass(x, 4200);
  return fade(toPeak(x, level), 0, 0.05);
};

/**
 * The single sustained low note under the last sentence of the cold open. It
 * is the pedal the pulse later lands on. Upper partials keep it audible on
 * small speakers that cannot reproduce 73 Hz.
 */
const lowNote = () => {
  const seconds = 14;
  const x = buffer(seconds);
  const partials = [
    [1, 1.0],
    [2, 0.42],
    [3, 0.2],
    [4, 0.07],
    [5, 0.03],
  ];
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    // A very slow, shallow swell so the note breathes without pulsing.
    const swell = 1 + 0.05 * Math.sin(2 * Math.PI * 0.11 * t);
    let v = 0;
    for (const [n, a] of partials) {
      // The upper partials arrive later than the fundamental, as on a bowed string.
      const bloom = Math.min(1, t / (1.2 + n * 0.5));
      v += a * bloom * Math.sin(2 * Math.PI * D2 * n * t + n * 0.7);
    }
    x[i] = v * swell;
  }
  return fade(toPeak(x, -17), 2.4, 2.5);
};

/** One beat of the slow pulse: a soft, round thump on the pedal note. */
const pulseHit = () => {
  const x = buffer(1.5);
  let phase = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const attack = Math.min(1, t / 0.012);
    // The pitch settles from slightly above, which is what makes it read as a beat.
    const hz = D2 * (1 + 0.35 * Math.exp(-t / 0.018));
    phase += (2 * Math.PI * hz) / SR;
    const body = Math.sin(phase) * Math.exp(-t / 0.36);
    const second = Math.sin(2 * phase) * Math.exp(-t / 0.2) * 0.3;
    x[i] = attack * (body + second);
  }
  return fade(toPeak(x, -15), 0, 0.2);
};

/**
 * One note of the string line: one leading voice with a small section behind
 * it. Each voice is a band-limited sawtooth darkened by rolling off its upper
 * partials. The leading voice holds the level steady. The section voices are
 * quieter, and each wanders by a few cents on its own slow path with its own
 * late, shallow vibrato, which gives body without the beating of fixed detune.
 */
const stringNote = (hz, seed) => {
  const seconds = 12;
  const rand = mulberry32(seed);
  const n = Math.round(seconds * SR);
  const maxPartial = Math.floor(3800 / hz);
  const left = buffer(seconds);
  const right = buffer(seconds);
  const voiceCount = 4;
  for (let v = 0; v < voiceCount; v++) {
    // The slow path of this voice's tuning: smoothed noise, about +/- 4 cents.
    const wander = new Float64Array(n);
    for (let i = 0; i < n; i++) wander[i] = rand() * 2 - 1;
    lowpass(lowpass(wander, 0.35), 0.35);
    toPeak(wander, 0);
    const lead = v === 0;
    const level = lead ? 1 : 0.18;
    const centsWide = lead ? 0.6 : 2.5 + rand() * 2.5;
    const vibratoHz = 4.4 + rand() * 1.2;
    const vibratoPhase = rand() * 2 * Math.PI;
    const vibratoStart = 1 + rand() * 1.5;
    const pan = lead ? 0.5 : (v - 0.5) / (voiceCount - 1);
    const gainLeft = level * Math.cos((Math.PI / 2) * pan);
    const gainRight = level * Math.sin((Math.PI / 2) * pan);
    let phase = rand() * 2 * Math.PI;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const vibratoDepth = 0.0022 * Math.min(1, Math.max(0, (t - vibratoStart) / 2.5));
      const cents = wander[i] * centsWide;
      const f =
        hz * 2 ** (cents / 1200) * (1 + vibratoDepth * Math.sin(2 * Math.PI * vibratoHz * t + vibratoPhase));
      phase += (2 * Math.PI * f) / SR;
      let sample = 0;
      for (let k = 1; k <= maxPartial; k++) {
        // 1/k is a sawtooth; the extra roll-off above 900 Hz takes the edge off.
        const rolloff = 1 / (1 + ((k * hz) / 900) ** 2);
        sample += (Math.sin(k * phase) / k) * rolloff;
      }
      left[i] += sample * gainLeft;
      right[i] += sample * gainRight;
    }
  }
  const gain = dbToGain(-19) / Math.max(peak(left), peak(right));
  return [fade(scale(left, gain), 2.2, 3), fade(scale(right, gain), 2.2, 3)];
};

// --------------------------------------------------------------------- main

mkdirSync(OUT_DIR, {recursive: true});
console.log(`Writing stems to ${OUT_DIR}`);

writeWav('room-tone.wav', roomTone(0x0e0f12), roomTone(0xe9e4d8));
// The knock of each tick sits a third of the way down from its pitch, so these
// two land on A4 and D4 and agree with the pedal.
writeWav('tick.wav', tick({pitchHz: 1320, level: -20}));
writeWav('tick-low.wav', tick({pitchHz: 881, level: -20}));
writeWav('low-note.wav', lowNote());
writeWav('pulse.wav', pulseHit());
// Only the notes a finished part uses are written. Add a step here when the
// part that needs it is built.
for (const step of ['step0']) {
  const hz = STRING_LINE_HZ[step];
  const [left, right] = stringNote(hz, 0x5712 + Math.round(hz));
  writeWav(`string-${step}.wav`, left, right);
}

console.log('Done.');
