/**
 * Web Audio API based Synthesizer & Music Sequencer for Sokoban Mester.
 * Provides rich retro & modern sound effects and dynamic multi-track
 * procedural background music changing every 5 levels.
 */

export interface MusicTrackInfo {
  id: number;
  worldId: number;
  title: string;
  worldName: string;
  bpm: number;
  description: string;
}

export const MUSIC_TRACKS: MusicTrackInfo[] = [
  {
    id: 1,
    worldId: 1,
    title: 'Raktári Ritmus (Warehouse Groove)',
    worldName: '1-5. szint • Ipari Raktár',
    bpm: 112,
    description: 'Bájos, ritmikus jazzy chiptune dallam a bevezető raktári szintekhez.',
  },
  {
    id: 2,
    worldId: 2,
    title: 'Katakomba Misztérium (Ancient Crypt)',
    worldName: '6-10. szint • Ősi Katakomba',
    bpm: 90,
    description: 'Rejtélyes, visszhangzó kőterem és ősi rúnák mély ritmusa.',
  },
  {
    id: 3,
    worldId: 3,
    title: 'Cyber Neon Pulzus (Neon Matrix)',
    worldName: '11-15. szint • Cyberpunk Neon Rendszer',
    bpm: 124,
    description: 'Pörgős, 80-as évekbeli szintetizátor pulzus és sci-fi arpeggiók.',
  },
  {
    id: 4,
    worldId: 4,
    title: 'Kozmikus Sodródás (Cosmic Drift)',
    worldName: '16-20. szint • Orbitális Űrállomás',
    bpm: 82,
    description: 'Lágy lebegés a csillagok között, éteri szintetizátor akkordok.',
  },
  {
    id: 5,
    worldId: 5,
    title: 'Kristály Palota (Crystal Realm)',
    worldName: '21+ szint • Smaragd Barlangok',
    bpm: 104,
    description: 'Csillogó harangjáték és vidám logikai dallamok a mester pályákhoz.',
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  private isMuted: boolean = false;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.45;

  private currentTrackIndex: number = 0;
  private isMusicPlaying: boolean = false;
  private musicIntervalId: number | null = null;
  private musicStep: number = 0;

  private trackChangeListeners: ((track: MusicTrackInfo) => void)[] = [];

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();

      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.updateGains();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public ensureReady() {
    this.initContext();
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.updateGains();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    this.updateGains();
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    this.updateGains();
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  private updateGains() {
    if (!this.masterGain || !this.sfxGain || !this.musicGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    const masterTarget = this.isMuted ? 0 : 1;
    this.masterGain.gain.setValueAtTime(masterTarget, now);
    this.sfxGain.gain.setValueAtTime(this.sfxVolume, now);
    this.musicGain.gain.setValueAtTime(this.musicVolume, now);
  }

  public onTrackChange(callback: (track: MusicTrackInfo) => void) {
    this.trackChangeListeners.push(callback);
    return () => {
      this.trackChangeListeners = this.trackChangeListeners.filter((cb) => cb !== callback);
    };
  }

  private notifyTrackChange() {
    const track = MUSIC_TRACKS[this.currentTrackIndex];
    this.trackChangeListeners.forEach((cb) => cb(track));
  }

  // ==========================================
  // SOUND EFFECTS
  // ==========================================

  public playStep() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Subtle varying pitch step
    const pitch = 240 + Math.random() * 40;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.05);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  public playPush() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Deep wooden friction scrape
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  public playPlace() {
    // Sparkling chime chord when box hits target
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.03);

      gain.gain.setValueAtTime(0.18, t + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.03 + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.03);
      osc.stop(t + idx * 0.03 + 0.5);
    });
  }

  public playRemove() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.1);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.11);
  }

  public playUndo() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Reverse whoosh chirp
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(560, t + 0.12);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  public playRestart() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const freqs = [392, 329.63, 261.63]; // G4, E4, C4

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);

      gain.gain.setValueAtTime(0.15, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.22);
    });
  }

  public playBump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playWin() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Triumphant victory fanfare sequence
    const notes = [
      { f: 523.25, time: 0.00, dur: 0.12 }, // C5
      { f: 659.25, time: 0.12, dur: 0.12 }, // E5
      { f: 783.99, time: 0.24, dur: 0.14 }, // G5
      { f: 1046.5, time: 0.38, dur: 0.40 }, // C6
      { f: 1318.5, time: 0.50, dur: 0.50 }, // E6
    ];

    notes.forEach((n) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.time);

      gain.gain.setValueAtTime(0.24, t + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + n.time);
      osc.stop(t + n.time + n.dur);
    });
  }

  public playClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.03);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  public playStar() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1760, t + 0.15);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // ==========================================
  // PROCEDURAL MULTI-TRACK BGM SEQUENCER
  // Changing every 5 levels:
  // Level 1-5: Track 0 (Warehouse)
  // Level 6-10: Track 1 (Crypt)
  // Level 11-15: Track 2 (Neon Cyber)
  // Level 16-20: Track 3 (Cosmic)
  // Level 21+: Track 4 (Crystal)
  // ==========================================

  public setLevelTrack(levelId: number) {
    // 5 pályánként váltakozó zene, folyamatosan ismétlődve 1-től 150-ig
    const targetTrack = Math.floor((levelId - 1) / 5) % 5;
    if (this.currentTrackIndex !== targetTrack) {
      this.currentTrackIndex = targetTrack;
      this.notifyTrackChange();
      if (this.isMusicPlaying) {
        this.restartMusicSequencer();
      }
    }
  }

  public setManualTrack(trackIndex: number) {
    if (trackIndex >= 0 && trackIndex < MUSIC_TRACKS.length) {
      this.currentTrackIndex = trackIndex;
      this.notifyTrackChange();
      if (this.isMusicPlaying) {
        this.restartMusicSequencer();
      }
    }
  }

  public getCurrentTrack(): MusicTrackInfo {
    return MUSIC_TRACKS[this.currentTrackIndex];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public startMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.restartMusicSequencer();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId !== null) {
      window.clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  private restartMusicSequencer() {
    if (this.musicIntervalId !== null) {
      window.clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.musicStep = 0;

    const track = MUSIC_TRACKS[this.currentTrackIndex];
    // 16th note interval in milliseconds: (60 / BPM) / 4 * 1000
    const stepDurationMs = ((60 / track.bpm) / 4) * 1000;

    this.musicIntervalId = window.setInterval(() => {
      this.stepMusicTick();
    }, stepDurationMs);
  }

  private stepMusicTick() {
    if (!this.ctx || !this.musicGain || !this.isMusicPlaying || this.isMuted) {
      this.musicStep = (this.musicStep + 1) % 64;
      return;
    }

    const step = this.musicStep;
    const track = this.currentTrackIndex;

    try {
      switch (track) {
        case 0:
          this.playTrackWarehouse(step);
          break;
        case 1:
          this.playTrackCrypt(step);
          break;
        case 2:
          this.playTrackNeon(step);
          break;
        case 3:
          this.playTrackCosmic(step);
          break;
        case 4:
          this.playTrackCrystal(step);
          break;
        default:
          this.playTrackWarehouse(step);
          break;
      }
    } catch {
      // Audio step safety
    }

    this.musicStep = (this.musicStep + 1) % 64; // 4-bar loop (16 steps/bar)
  }

  // Helper to schedule synth tone
  private playNote(freq: number, dur: number, type: OscillatorType, gainVol: number, filterFreq?: number) {
    if (!this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    let destNode: AudioNode = g;
    if (filterFreq) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, t);
      osc.connect(filter);
      destNode = filter;
    } else {
      osc.connect(g);
    }

    g.gain.setValueAtTime(gainVol, t);
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur);

    if (filterFreq) {
      (destNode as BiquadFilterNode).connect(g);
    }
    g.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  // --- TRACK 1: WAREHOUSE GROOVE (Warm jazzy chiptune) ---
  private playTrackWarehouse(step: number) {
    // 64-step loop (4 bars)
    // Chords: Am7 (bar 1), Fmaj7 (bar 2), C (bar 3), G7 (bar 4)
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // Bassline (syncopated triangle bass)
    if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14) {
      const bassNotes = [110, 87.31, 130.81, 98]; // A2, F2, C3, G2
      this.playNote(bassNotes[bar], 0.22, 'triangle', 0.16, 380);
    }

    // Melodic Arpeggio (Warm sine / soft square)
    // Pentatonic runs
    const melodies = [
      [220, 261.63, 329.63, 392, 440, 392, 329.63, 261.63, 220, 261.63, 329.63, 392, 440, 523.25, 440, 392],
      [174.61, 220, 261.63, 329.63, 349.23, 329.63, 261.63, 220, 174.61, 261.63, 329.63, 349.23, 392, 440, 392, 349.23],
      [261.63, 329.63, 392, 523.25, 659.25, 523.25, 392, 329.63, 261.63, 392, 523.25, 659.25, 783.99, 659.25, 523.25, 392],
      [196, 246.94, 293.66, 392, 493.88, 392, 293.66, 246.94, 196, 293.66, 392, 493.88, 587.33, 493.88, 392, 293.66],
    ];

    if (stepInBar % 2 === 0) {
      const note = melodies[bar][stepInBar];
      this.playNote(note, 0.14, 'sine', 0.08);
    }

    // Soft percussion clicks
    if (stepInBar === 4 || stepInBar === 12) {
      // Soft snare tap
      this.playNote(180, 0.04, 'triangle', 0.04, 300);
    }
  }

  // --- TRACK 2: ANCIENT CRYPT (Mysterious dungeon atmospheric) ---
  private playTrackCrypt(step: number) {
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // Deep drone bass note held
    if (stepInBar === 0) {
      const droneNotes = [73.42, 65.41, 73.42, 82.41]; // D2, C2, D2, E2
      this.playNote(droneNotes[bar], 1.2, 'sine', 0.22, 220);
    }

    // Kalimba / Marimba eerie echoes
    const pattern = [
      [293.66, null, 440, null, 349.23, null, null, 587.33, null, 523.25, null, 440, null, 349.23, null, null],
      [261.63, null, 392, null, 329.63, null, null, 523.25, null, 440, null, 392, null, 329.63, null, null],
      [293.66, null, 440, null, 370, null, null, 659.25, null, 587.33, null, 440, null, 370, null, null],
      [329.63, null, 493.88, null, 392, null, null, 659.25, null, 587.33, null, 493.88, null, 392, null, 440],
    ];

    const note = pattern[bar][stepInBar];
    if (note !== null) {
      this.playNote(note, 0.35, 'triangle', 0.12, 1200);
    }

    // Water drip / resonant chime
    if (step === 14 || step === 38 || step === 54) {
      this.playNote(1174.66, 0.4, 'sine', 0.07);
    }
  }

  // --- TRACK 3: CYBER NEON PULZUS (Driving synthwave arps) ---
  private playTrackNeon(step: number) {
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // Fast 16th-note saw synth bass
    const bassRoot = [92.5, 73.42, 110, 82.41]; // F#2, D2, A2, E2
    const oct = stepInBar % 2 === 0 ? 1 : 2;
    this.playNote(bassRoot[bar] * oct, 0.11, 'sawtooth', 0.1, 750);

    // Neon lead chords on downbeats
    if (stepInBar === 0 || stepInBar === 8) {
      const chords = [
        [370, 440, 554.37], // F#m
        [293.66, 370, 440], // D
        [440, 554.37, 659.25], // A
        [329.63, 415.3, 493.88], // E
      ];
      chords[bar].forEach((f) => {
        this.playNote(f, 0.28, 'square', 0.04, 1400);
      });
    }

    // High sparkling 80s arpeggio on offbeats
    if (stepInBar === 4 || stepInBar === 7 || stepInBar === 12 || stepInBar === 15) {
      const leadArp = [740, 880, 1108.73, 1318.51];
      const chosen = leadArp[(step + bar) % leadArp.length];
      this.playNote(chosen, 0.12, 'sine', 0.08);
    }
  }

  // --- TRACK 4: KOZMIKUS SODRÓDÁS (Deep space ambient float) ---
  private playTrackCosmic(step: number) {
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // Deep celestial sub chords on bar starts
    if (stepInBar === 0) {
      const subNotes = [116.54, 98, 130.81, 116.54]; // Bb2, G2, C3, Bb2
      this.playNote(subNotes[bar], 2.2, 'sine', 0.22, 280);
      this.playNote(subNotes[bar] * 1.5, 1.8, 'sine', 0.12, 350);
    }

    // Starlight twinkling notes
    if (step % 4 === 2) {
      const stars = [587.33, 698.46, 880, 1046.5, 1174.66, 1396.91];
      const note = stars[(step * 3 + bar) % stars.length];
      this.playNote(note, 0.6, 'sine', 0.07);
    }
  }

  // --- TRACK 5: KRISTÁLY PALOTA (Bright crystal carillon) ---
  private playTrackCrystal(step: number) {
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // Bouncy bass
    if (stepInBar === 0 || stepInBar === 8) {
      const roots = [196, 164.81, 220, 146.83]; // G2, E2, A2, D2
      this.playNote(roots[bar], 0.28, 'triangle', 0.18, 500);
    }

    // Crystalline bell pattern
    if (stepInBar % 2 === 0) {
      const scale = [
        [783.99, 987.77, 1174.66, 1567.98], // G maj
        [659.25, 783.99, 987.77, 1318.51], // E min
        [880, 1108.73, 1318.51, 1760], // A maj
        [587.33, 739.99, 880, 1174.66], // D maj
      ];
      const noteIdx = (stepInBar / 2) % 4;
      const freq = scale[bar][noteIdx];
      this.playNote(freq, 0.22, 'sine', 0.1);
    }
  }
}

// Singleton audio engine instance
export const soundEngine = new SoundEngine();
