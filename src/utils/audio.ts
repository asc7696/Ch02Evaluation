// Synthesized audio helper utilizing Web Audio API for secure offline sound cues
class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      // Coin pickup feel: two short ascending pure tones
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.08); // E5
      
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.35);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playFailure() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      // Error buzzer feel: short low square/sawtooth wave
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.linearRampToValueAtTime(80, t + 0.25);
      
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.28);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.28);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playStageComplete() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      // Fast arpeggio for victory!
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + index * 0.1);
        gain.gain.setValueAtTime(0.12, t + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + index * 0.1 + 0.4);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + index * 0.1);
        osc.stop(t + index * 0.1 + 0.4);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
}

export const sounds = new SoundEngine();
