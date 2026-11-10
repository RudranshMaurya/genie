// Web Audio API Synthesizer for magical fairytale sound effects
// Does not require external audio files to prevent broken links or CORS issues

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgGain: GainNode | null = null;
  private bgOsc1: OscillatorNode | null = null;
  private bgOsc2: OscillatorNode | null = null;
  private isBgPlaying: boolean = false;

  constructor() {
    const saved = localStorage.getItem('genie_sound_muted');
    // Sound is muted by default to ensure a clean, silent, elegant experience
    this.isMuted = saved !== null ? saved === 'true' : true;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('genie_sound_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopAmbientMusic();
    } else {
      this.playChime(950);
      this.startAmbientMusic();
    }
    return this.isMuted;
  }

  // Soft mystical chime / star sound
  public playChime(freq = 880) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {}
  }

  // Ethereal fairy bell hover chime
  public playButtonHover() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1174.66, now); // D6
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12); // A6

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {}
  }

  // Cinematic Portal Entrance / Make a wish ignition harp crescendo
  public playPortalTransition() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Warm bass bed
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(130.81, now); // C3
      subOsc.frequency.exponentialRampToValueAtTime(261.63, now + 1.5); // C4
      subGain.gain.setValueAtTime(0.02, now);
      subGain.gain.linearRampToValueAtTime(0.15, now + 0.6);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 2.2);

      // Ascending crystal fairy harp arpeggio (C major 9 / Lydian fairytale celestial chord)
      const harpNotes = [
        261.63, // C4
        329.63, // E4
        392.00, // G4
        493.88, // B4
        587.33, // D5
        659.25, // E5
        783.99, // G5
        987.77, // B5
        1046.50, // C6
        1318.51, // E6
      ];

      harpNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        const noteTime = now + idx * 0.08;
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, noteTime);

        noteGain.gain.setValueAtTime(0, noteTime);
        noteGain.gain.linearRampToValueAtTime(0.1, noteTime + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0008, noteTime + 1.4);

        noteOsc.connect(noteGain);
        noteGain.connect(this.ctx.destination);

        noteOsc.start(noteTime);
        noteOsc.stop(noteTime + 1.4);
      });
    } catch {}
  }

  // Lamp activation mystical hum & swirl
  public playLampAwaken() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Low warm drone
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(110, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 1.8);
      gain1.gain.setValueAtTime(0.02, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.8);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 2.5);

      // Magical harmonic arpeggio
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((n, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n, now + 0.3 + idx * 0.18);
        g.gain.setValueAtTime(0, now + 0.3 + idx * 0.18);
        g.gain.linearRampToValueAtTime(0.08, now + 0.35 + idx * 0.18);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.5 + idx * 0.18);

        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + 0.3 + idx * 0.18);
        osc.stop(now + 1.5 + idx * 0.18);
      });
    } catch {}
  }

  // Whimsical smoke poof sound
  public playSmokePoof() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.4);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  // Wish Captured magical swirl
  public playWishCaptured() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      melody.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0, now + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.7);
      });
    } catch {}
  }

  // Celebration fanfare for wish granted
  public playWishGranted() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [440, 554.37, 659.25, 880];
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.8);
      });

      setTimeout(() => {
        this.playWishCaptured();
      }, 300);
    } catch {}
  }

  // Gentle night ambient drone
  public startAmbientMusic() {
    if (this.isMuted || this.isBgPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.bgGain = this.ctx.createGain();
      this.bgGain.gain.setValueAtTime(0.001, now);
      this.bgGain.gain.linearRampToValueAtTime(0.025, now + 3);

      this.bgOsc1 = this.ctx.createOscillator();
      this.bgOsc1.type = 'sine';
      this.bgOsc1.frequency.setValueAtTime(146.83, now); // D3

      this.bgOsc2 = this.ctx.createOscillator();
      this.bgOsc2.type = 'triangle';
      this.bgOsc2.frequency.setValueAtTime(220, now); // A3

      this.bgOsc1.connect(this.bgGain);
      this.bgOsc2.connect(this.bgGain);
      this.bgGain.connect(this.ctx.destination);

      this.bgOsc1.start();
      this.bgOsc2.start();
      this.isBgPlaying = true;
    } catch {}
  }

  public stopAmbientMusic() {
    if (!this.isBgPlaying) return;
    try {
      if (this.bgGain && this.ctx) {
        this.bgGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
        setTimeout(() => {
          this.bgOsc1?.stop();
          this.bgOsc2?.stop();
          this.isBgPlaying = false;
        }, 1000);
      }
    } catch {
      this.isBgPlaying = false;
    }
  }
}

export const sound = new SoundEngine();
