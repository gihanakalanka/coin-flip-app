/**
 * Web Audio API synthesizer for coin flip effects and streak celebrations.
 * Requires zero external audio files.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Sound of coin flipping into the air (whoosh + metallic vibration)
   */
  playFlipStart() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch bend upwards like a thumb-flick
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Audio might be blocked before user gesture
    }
  }

  /**
   * Sound of coin landing (bright metallic clink with resonant decay)
   */
  playLand() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Two resonant frequencies for metallic chime
      const freqs = [1820, 3640];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const initialGain = idx === 0 ? 0.22 : 0.09;
        gain.gain.setValueAtTime(initialGain, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.48);
      });
    } catch {
      // Silent catch
    }
  }

  /**
   * Harmonic celebration chime when user hits 3 in a row
   */
  playStreakChime() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Royal victory fanfare arpeggio (C6, E6, G6, C7, G7) with harmonized sub-octave
      const notes = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + i * 0.085;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq / 2, startTime);

        gain.gain.setValueAtTime(0.24, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        subOsc.start(startTime);
        osc.stop(startTime + 0.6);
        subOsc.stop(startTime + 0.6);
      });
    } catch {
      // Silent catch
    }
  }
}

export const sound = new SoundSynthesizer();
