const fxManager = {
    canvas: document.getElementById('fxCanvas'),
    ctx: document.getElementById('fxCanvas').getContext('2d'),
    particles: [],
    animations: [],
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.animate();
    },
    createCaptureParticles(x, y, color) {
        const count = 25;
        const pColor = color === 'w' ? '#ffffff' : '#444444';
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12,
                life: 1.0, decay: 0.02 + Math.random() * 0.02, color: pColor, size: 4 + Math.random() * 6
            });
        }
    },
    playCheckWave() { this.animations.push({ type: 'check', life: 1.0, decay: 0.015 }); },
    playMateKill() {
        this.animations.push({ type: 'mate', life: 1.0, decay: 0.008 });
        for(let i=0; i<80; i++) {
            this.particles.push({
                x: window.innerWidth / 2, y: window.innerHeight / 2,
                vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20,
                life: 1.5, decay: 0.01, color: '#ef4444', size: 3 + Math.random() * 10
            });
        }
    },
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.life -= p.decay;
            if (p.life <= 0) { this.particles.splice(i, 1); return; }
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.animations.forEach((a, i) => {
            a.life -= a.decay;
            if (a.life <= 0) { this.animations.splice(i, 1); return; }
            this.ctx.globalAlpha = a.life;
            if (a.type === 'check') {
                this.ctx.strokeStyle = '#838CE5'; this.ctx.lineWidth = 15;
                const offset = (1 - a.life) * this.canvas.width;
                this.ctx.beginPath(); this.ctx.moveTo(offset, 0); this.ctx.lineTo(offset, this.canvas.height); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.moveTo(this.canvas.width - offset, 0); this.ctx.lineTo(this.canvas.width - offset, this.canvas.height); this.ctx.stroke();
            }
            if (a.type === 'mate') {
                const slashWidth = this.canvas.width * (1.2 - a.life);
                this.ctx.fillStyle = '#ef4444'; this.ctx.save();
                this.ctx.translate(this.canvas.width/2, this.canvas.height/2); this.ctx.rotate(-0.2);
                this.ctx.fillRect(-slashWidth/2, -40, slashWidth, 80);
                this.ctx.fillStyle = 'white'; this.ctx.fillRect(-slashWidth/2, -5, slashWidth, 10);
                this.ctx.restore();
            }
        });
        this.ctx.globalAlpha = 1.0;
        requestAnimationFrame(() => this.animate());
    }
};
fxManager.init();