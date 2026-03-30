/**
 * catchSound.ts — Tier-based Pokémon catch sounds via Web Audio API.
 *
 * 5 power tiers, each with a distinct furious synthesized sound.
 * A DynamicsCompressor sits on the master bus so sounds can be loud
 * without distorting/clipping the output.
 *
 * White noise bursts (via AudioBufferSourceNode) power the heavy/legendary
 * impact hits — these create a real explosion/slam feel.
 */

export type SoundTier = 'legendary' | 'heavy' | 'nature' | 'tricky' | 'normal';

/** How long each tier's full animation lasts (ms) — used to time onDone. */
export const TIER_DURATION: Record<SoundTier, number> = {
  legendary: 3400,
  heavy:     2700,
  nature:    2800,
  tricky:    2500,
  normal:    2400,
};

const TYPE_TIER: Record<string, SoundTier> = {
  dragon:   'legendary',
  psychic:  'legendary',
  ghost:    'legendary',
  fire:     'heavy',
  fighting: 'heavy',
  electric: 'heavy',
  steel:    'heavy',
  water:    'nature',
  grass:    'nature',
  ice:      'nature',
  ground:   'nature',
  rock:     'nature',
  poison:   'tricky',
  bug:      'tricky',
  flying:   'tricky',
  fairy:    'tricky',
  normal:   'normal',
  dark:     'normal',
};

export function getTier(types: string[]): SoundTier {
  for (const t of types) {
    const tier = TYPE_TIER[t.toLowerCase()];
    if (tier) return tier;
  }
  return 'normal';
}

// ── Shared utilities ──────────────────────────────────────────────────────────

function masterBus(ctx: AudioContext): AudioNode {
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.knee.value      = 10;
  comp.ratio.value     = 8;
  comp.attack.value    = 0.001;
  comp.release.value   = 0.2;
  comp.connect(ctx.destination);
  return comp;
}

function osc(
  ctx: AudioContext,
  dest: AudioNode,
  type: OscillatorType,
  freqStart: number,
  freqEnd: number,
  freqEndTime: number,
  gainPeak: number,
  gainEndTime: number,
  startOffset = 0,
): void {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(dest);
  const now = ctx.currentTime + startOffset;
  o.type = type;
  o.frequency.setValueAtTime(freqStart, now);
  if (freqEnd !== freqStart) {
    o.frequency.exponentialRampToValueAtTime(freqEnd, now + freqEndTime);
  }
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gainPeak, now + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, now + gainEndTime);
  o.start(now);
  o.stop(now + gainEndTime + 0.02);
}

/** White noise burst — gives real slam/explosion attack */
function noise(
  ctx: AudioContext,
  dest: AudioNode,
  gainPeak: number,
  duration: number,
  startOffset = 0,
  lowpass = 8000,
): void {
  const samples = Math.ceil(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, samples, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < samples; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = lowpass;

  const g = ctx.createGain();
  const now = ctx.currentTime + startOffset;
  g.gain.setValueAtTime(gainPeak, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + duration);

  src.connect(filter); filter.connect(g); g.connect(dest);
  src.start(now);
  src.stop(now + duration + 0.01);
}

// ── Per-tier synthesizers ─────────────────────────────────────────────────────

/** LEGENDARY — deep sub-drone + noise burst + ethereal shimmer + high sparkle */
function playLegendary(ctx: AudioContext): void {
  const bus = masterBus(ctx);

  // Rumbling noise burst — dimensional crack
  noise(ctx, bus, 0.9, 0.35, 0,    500);   // low thud
  noise(ctx, bus, 0.4, 0.6,  0.05, 3000);  // mid rumble tail

  // Sub-bass drone
  osc(ctx, bus, 'sawtooth', 42, 36, 1.3, 0.7, 1.5);
  // Doubled sub (slight detune for width)
  osc(ctx, bus, 'sawtooth', 44, 38, 1.3, 0.5, 1.4);

  // Mid harmonic body
  osc(ctx, bus, 'sawtooth', 84, 72, 1.2, 0.45, 1.4, 0.05);

  // Ethereal rising shimmer
  osc(ctx, bus, 'sine', 880, 1760, 0.6, 0.35, 1.2, 0.1);
  osc(ctx, bus, 'sine', 890, 1780, 0.6, 0.25, 1.1, 0.12); // slight chorus

  // High sparkle sting
  osc(ctx, bus, 'sine', 3520, 2200, 0.4, 0.15, 0.7, 0.45);

  setTimeout(() => ctx.close(), 2200);
}

/** HEAVY — massive noise slam + deep thud + power surge + electric crack */
function playHeavy(ctx: AudioContext): void {
  const bus = masterBus(ctx);

  // Explosive noise slam — the "punch"
  noise(ctx, bus, 1.0, 0.18, 0,    1200); // impact crack
  noise(ctx, bus, 0.6, 0.45, 0.02, 400);  // low boom tail

  // Deep impact thud — massive freq drop
  osc(ctx, bus, 'sawtooth', 380, 45, 0.14, 0.75, 0.28);
  osc(ctx, bus, 'sawtooth', 360, 50, 0.14, 0.55, 0.26, 0.01); // doubled

  // Power surge — rising square
  osc(ctx, bus, 'square', 160, 1800, 0.4, 0.5, 0.75, 0.12);
  osc(ctx, bus, 'square', 165, 1820, 0.4, 0.35, 0.7, 0.14);

  // Electric crack overlay
  osc(ctx, bus, 'square', 2600, 700, 0.18, 0.22, 0.22, 0.04);

  setTimeout(() => ctx.close(), 1200);
}

/** NATURE — strong flowing chord + filtered noise whoosh + harmonic swell */
function playNature(ctx: AudioContext): void {
  const bus = masterBus(ctx);

  // Nature whoosh — filtered noise (wind/water sweep)
  noise(ctx, bus, 0.55, 0.7, 0, 2000);

  // Root tone sweep
  osc(ctx, bus, 'sine', 330, 560, 0.32, 0.5, 0.85);
  // Fifth above (power chord)
  osc(ctx, bus, 'sine', 495, 840, 0.32, 0.38, 0.8, 0.05);

  // Harmonic shimmer
  osc(ctx, bus, 'sine', 660, 900, 0.25, 0.28, 0.78, 0.14);
  osc(ctx, bus, 'triangle', 1320, 1100, 0.15, 0.18, 0.65, 0.2);

  // Resonant tail
  osc(ctx, bus, 'sine', 220, 180, 0.3, 0.32, 0.9, 0.1);

  setTimeout(() => ctx.close(), 1200);
}

/** TRICKY — fast ascending arpeggio C–E–G–B–C + noise zap */
function playTricky(ctx: AudioContext): void {
  const bus = masterBus(ctx);

  // Zap burst
  noise(ctx, bus, 0.5, 0.08, 0, 6000);

  // Arpeggio — C5 E5 G5 B5 C6 (pentatonic feel, fast)
  const notes = [523.25, 659.25, 784.0, 987.77, 1046.5];
  notes.forEach((freq, i) => {
    osc(ctx, bus, 'sine', freq, freq * 1.05, 0.15, 0.35, 0.22, i * 0.085);
    // Harmony (a third up)
    osc(ctx, bus, 'triangle', freq * 1.26, freq * 1.3, 0.15, 0.18, 0.2, i * 0.085 + 0.01);
  });

  setTimeout(() => ctx.close(), 1000);
}

/** NORMAL — double punch ping with strong attack */
function playNormal(ctx: AudioContext): void {
  const bus = masterBus(ctx);

  // Quick impact noise
  noise(ctx, bus, 0.45, 0.1, 0, 3000);

  // First ping
  osc(ctx, bus, 'sine', 420, 700, 0.2, 0.42, 0.52);
  // Second ping (slight delay, higher)
  osc(ctx, bus, 'sine', 560, 840, 0.18, 0.35, 0.44, 0.12);
  // Sub thump
  osc(ctx, bus, 'sawtooth', 120, 60, 0.08, 0.38, 0.25);

  setTimeout(() => ctx.close(), 800);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function playCatchSound(tier: SoundTier): void {
  try {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    switch (tier) {
      case 'legendary': playLegendary(ctx); break;
      case 'heavy':     playHeavy(ctx);     break;
      case 'nature':    playNature(ctx);    break;
      case 'tricky':    playTricky(ctx);    break;
      default:          playNormal(ctx);
    }
  } catch {
    // AudioContext blocked or unavailable — fail silently
  }
}
