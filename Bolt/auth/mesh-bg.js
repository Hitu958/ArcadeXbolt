// ArcadeX Animated Mesh Background
// Lightweight canvas-based particle mesh with purple/cyan gradient
const MeshBG = {
    canvas: null,
    ctx: null,
    particles: [],
    animId: null,
    mouseX: 0,
    mouseY: 0,

    init(container) {
        if (!container) container = document.body;

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'mesh-bg-canvas';
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.6;';

        // Insert as first child so it's behind everything
        if (container.firstChild) {
            container.insertBefore(this.canvas, container.firstChild);
        } else {
            container.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Pause when tab not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(this.animId);
            } else {
                this.animate();
            }
        });
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createParticles() {
        const count = Math.min(45, Math.floor((window.innerWidth * window.innerHeight) / 25000));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                // Alternate between purple and cyan
                color: i % 3 === 0 ? 'rgba(139, 92, 246,' : (i % 3 === 1 ? 'rgba(34, 211, 238,' : 'rgba(168, 85, 247,')
            });
        }
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Update & draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + '0.6)';
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = p.color + opacity + ')';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }

            // Mouse interaction — subtle attraction
            const mdx = this.mouseX - p.x;
            const mdy = this.mouseY - p.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < 200) {
                p.vx += mdx * 0.00005;
                p.vy += mdy * 0.00005;
            }

            // Dampen velocity
            p.vx *= 0.999;
            p.vy *= 0.999;
        }

        this.animId = requestAnimationFrame(() => this.animate());
    }
};
