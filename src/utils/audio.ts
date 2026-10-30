/**
 * Web Audio API synthesizer for anime chibi sound bites and expressions
 */

class ChibiAudioManager {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play charming anime chibi chime / sound effects
  playChibiChime(characterId: string) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, now);
      masterGain.connect(this.ctx.destination);

      // Pitch sequences based on character archetype
      let pitches: number[] = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (sparkly)

      if (characterId === 'anya-forger') {
        // High playful bounce
        pitches = [587.33, 739.99, 880.0, 1174.66, 1318.51];
      } else if (characterId === 'gojo-satoru') {
        // Cool spatial power chord
        pitches = [261.63, 392.0, 523.25, 1046.5];
      } else if (characterId === 'frieren') {
        // Ethereal mystical elf chime
        pitches = [440.0, 554.37, 659.25, 880.0, 1108.73];
      } else if (characterId === 'bocchi-gotoh') {
        // Minor anxious electric chord
        pitches = [349.23, 415.3, 523.25, 622.25];
      } else if (characterId === 'denji-pochita') {
        // Gritty energetic sawtooth chord
        pitches = [329.63, 392.0, 493.88, 659.25];
      } else if (characterId === 'ai-hoshino') {
        // Idol pop fanfare
        pitches = [659.25, 830.61, 987.77, 1318.51, 1661.22];
      } else if (characterId === 'monkey-d-luffy') {
        // Bouncy adventure fanfare
        pitches = [392.0, 523.25, 659.25, 783.99, 1046.5];
      }

      pitches.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        // Waveform
        if (characterId === 'denji-pochita') {
          osc.type = 'sawtooth';
        } else if (characterId === 'bocchi-gotoh') {
          osc.type = 'triangle';
        } else {
          osc.type = 'sine';
        }

        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        noteGain.gain.setValueAtTime(0, now + idx * 0.07);
        noteGain.gain.linearRampToValueAtTime(0.25, now + idx * 0.07 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.36);
      });
    } catch {
      // Audio fallback gracefully handled
    }
  }

  // Speak catchphrase in Japanese or expressive anime voice using SpeechSynthesis
  speakDialogue(text: string, characterId?: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Cute anime vocal traits
      if (characterId === 'anya-forger' || characterId === 'ai-hoshino') {
        utterance.pitch = 1.6;
        utterance.rate = 1.15;
      } else if (characterId === 'frieren') {
        utterance.pitch = 1.1;
        utterance.rate = 0.95;
      } else if (characterId === 'gojo-satoru') {
        utterance.pitch = 1.0;
        utterance.rate = 1.05;
      } else if (characterId === 'bocchi-gotoh') {
        utterance.pitch = 1.3;
        utterance.rate = 0.9;
      } else if (characterId === 'nezuko-kamado') {
        utterance.pitch = 1.5;
        utterance.rate = 1.1;
      } else {
        utterance.pitch = 1.2;
        utterance.rate = 1.05;
      }

      // Try selecting Japanese voice if available
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find((v) => v.lang.startsWith('ja') || v.lang.includes('JP'));
      if (jaVoice) {
        utterance.voice = jaVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech fallback gracefully handled
    }
  }

  // Play heart pop sound
  playHeartPop() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignored
    }
  }

  // Play Gacha Summon Fanfare
  playGachaSummon() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.46);
      });
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new ChibiAudioManager();
