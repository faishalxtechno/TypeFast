/**
 * Web Audio API Synthesizer for TypeFast v2.0
 * Zero-dependency, ultra-low latency, crisp tactile audio feedback with master volume control.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let currentMasterVolume = 0.5;

/**
 * Initializes or resumes the Web Audio context upon user gesture.
 */
export function initAudio(volume = currentMasterVolume): AudioContext | null {
  if (typeof window === 'undefined') return null;

  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {
        // Ignored if browser blocks resume prior to user gesture
      });
    }

    if (masterGain && audioCtx) {
      currentMasterVolume = volume;
      masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
    }
  } catch {
    // AudioContext not available in current environment
  }

  return audioCtx;
}

/**
 * Updates the global audio volume.
 * @param volume Value between 0.0 and 1.0
 */
export function setAudioVolume(volume: number): void {
  currentMasterVolume = Math.max(0, Math.min(1, volume));
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.setValueAtTime(currentMasterVolume, audioCtx.currentTime);
    } catch {
      // ignore
    }
  }
}

/**
 * Plays a subtle, tactile mechanical keyboard click or soft error thud.
 *
 * @param isError True for mistyped character, false for correct character
 * @param volumeScale Optional multiplier for this individual sound (defaults to 1.0)
 */
export function playKeyClickSound(isError = false, volumeScale = 1.0): void {
  try {
    const ctx = initAudio();
    const mg = masterGain;
    if (!ctx || ctx.state !== 'running' || !mg) return;

    const now = ctx.currentTime;
    const effectiveGain = Math.max(0, Math.min(1, volumeScale));

    if (isError) {
      // Soft, low-frequency subtle error thud (non-distracting, short)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.075);

      gain.gain.setValueAtTime(0.08 * effectiveGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc.connect(gain);
      gain.connect(mg);

      osc.start(now);
      osc.stop(now + 0.075);
    } else {
      // Crisp, tactile mechanical switch click (organic subtle pitch variation)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch jitter gives a realistic tactile feel across keystrokes
      const baseFreq = 540 + (Math.random() * 80 - 40);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

      gain.gain.setValueAtTime(0.05 * effectiveGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(mg);

      osc.start(now);
      osc.stop(now + 0.035);
    }
  } catch {
    // Gracefully handle unsupported audio environments
  }
}

/**
 * Plays an elegant, harmonious completion chime when the test ends.
 */
export function playCompletionSound(volumeScale = 1.0): void {
  try {
    const ctx = initAudio();
    const mg = masterGain;
    if (!ctx || ctx.state !== 'running' || !mg) return;

    const now = ctx.currentTime;
    const effectiveGain = Math.max(0, Math.min(1, volumeScale));
    // Harmonic notes: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
    const frequencies = [523.25, 659.25, 783.99, 1046.50];

    frequencies.forEach((freq, index) => {
      const noteTime = now + index * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(0.06 * effectiveGain, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(mg);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  } catch {
    // Gracefully handle unsupported audio
  }
}

/**
 * Plays a very subtle, soft UI button interaction click.
 */
export function playButtonClickSound(volumeScale = 0.6): void {
  try {
    const ctx = initAudio();
    const mg = masterGain;
    if (!ctx || ctx.state !== 'running' || !mg) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.025);

    gain.gain.setValueAtTime(0.03 * volumeScale, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(mg);

    osc.start(now);
    osc.stop(now + 0.025);
  } catch {
    // ignore
  }
}
