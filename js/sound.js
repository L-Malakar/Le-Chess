const soundEngine = {
    ctx: null, 
    enabled: true,
    init() { 
        if (this.ctx) return; 
        this.ctx = new (window.AudioContext || window.webkitAudioContext)(); 
    },
    play(type) {
        if (!this.ctx || !document.getElementById('set-sound').checked) return;
        const osc = this.ctx.createOscillator(); 
        const gain = this.ctx.createGain();
        osc.connect(gain); 
        gain.connect(this.ctx.destination); 
        const now = this.ctx.currentTime;
        
        switch(type) {
            case 'click': 
                osc.type = 'sine'; 
                osc.frequency.setValueAtTime(800, now); 
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1); 
                gain.gain.setValueAtTime(0.1, now); 
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); 
                osc.start(); osc.stop(now + 0.1); 
                break;
            case 'move': 
                osc.type = 'triangle'; 
                osc.frequency.setValueAtTime(150, now); 
                gain.gain.setValueAtTime(0.2, now); 
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); 
                osc.start(); osc.stop(now + 0.1); 
                break;
            case 'capture': 
                osc.type = 'square'; 
                osc.frequency.setValueAtTime(400, now); 
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.15); 
                gain.gain.setValueAtTime(0.1, now); 
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15); 
                osc.start(); osc.stop(now + 0.15); 
                break;
            case 'check': 
                osc.type = 'sine'; 
                osc.frequency.setValueAtTime(440, now); 
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.3); 
                gain.gain.setValueAtTime(0.2, now); 
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5); 
                osc.start(); osc.stop(now + 0.5); 
                break;
            case 'mate': this.playLongAlert(false); break;
            case 'win': this.playLongAlert(true); break;
        }
    },
    playLongAlert(isWin) {
        const notes = isWin ? [261.63, 329.63, 392.00, 523.25] : [200, 150, 100, 50];
        notes.forEach((freq, i) => {
            const o = this.ctx.createOscillator(); 
            const g = this.ctx.createGain();
            o.type = isWin ? 'sine' : 'sawtooth'; 
            o.frequency.setValueAtTime(freq, this.ctx.currentTime + (i * 0.15));
            o.connect(g); g.connect(this.ctx.destination);
            g.gain.setValueAtTime(0.1, this.ctx.currentTime + (i * 0.15));
            g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (i * 0.15) + 0.4);
            o.start(this.ctx.currentTime + (i * 0.15)); 
            o.stop(this.ctx.currentTime + (i * 0.15) + 0.4);
        });
    }
};