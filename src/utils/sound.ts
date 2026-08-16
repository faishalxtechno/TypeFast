/**
 * Web Audio API Synthesizer for TypeFast
 * Zero-dependency, ultra-low latency, crisp tactile audio feedback.
 */

let audioCtx: AudioContext | null = null;

/**
 * Initializes or resumes the Web Audio context upon user interaction.
 */
export function initAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Ignored if browser blocks resume prior to user gesture
    });
  }

  return audioCtx;
}

/**
 * Plays a subtle, tactile mechanical keyboard click or soft error thud.
 *
 * @param isError True for mistyped character, false for correct character
 */
export function playKeyClickSound(isError = false): void {
  try {
    const ctx = initAudio();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;

    if (isError) {
      // Soft, low-frequency subtle error thud (non-distracting, short)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } else {
      // Crisp, tactile mechanical switch click (organic subtle pitch variation)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch jitter gives a realistic tactile feel across keystrokes
      const baseFreq = 540 + (Math.random() * 80 - 40);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    }
  } catch {
    // Gracefully handle unsupported audio environments
  }
}

/**
 * Plays an elegant, low-volume harmonic completion chime when the test ends.
 */
export function playCompletionSound(): void {
  try {
    const ctx = initAudio();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    // Harmonic notes: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
    const frequencies = [523.25, 659.25, 783.99, 1046.50];

    frequencies.forEach((freq, index) => {
      const noteTime = now + index * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(0.04, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  } catch {
    // Gracefully handle unsupported audio
  }
}
