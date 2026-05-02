'use client';
import { useEffect, useRef } from 'react';

const AnimatedBackground = ({ intensity = 'normal' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 180 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor() { this.reset(true); }

      reset(random = false) {
        this.x = random ? Math.random() * canvas.width : Math.random() * canvas.width;
        this.y = random ? Math.random() * canvas.height : Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.6;
        this.vy = (Math.random() - 0.5) * 1.6;
        this.radius = Math.random() * 3 + 1.5;
        this.opacity = Math.random() * 0.5 + 0.6; // brighter: 0.6–1.1
        this.color = this.getRandomColor();
        this.pulseSpeed = Math.random() * 0.03 + 0.012;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.isStar = Math.random() < 0.3;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.025;
      }

      getRandomColor() {
        const colors = [
          [120, 130, 255],  // bright indigo
          [160, 100, 255],  // purple
          [200, 90, 255],   // violet
          [240, 80, 245],   // fuchsia
          [80, 200, 210],   // teal
          [100, 180, 255],  // blue
          [255, 160, 80],   // warm amber
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        if (mouse.x && mouse.y) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 0.8;
            this.vy += Math.sin(angle) * force * 0.8;
          }
        }
        this.x += this.vx; this.y += this.vy;
        this.vx *= 0.98; this.vy *= 0.98;
        this.rotation += this.rotationSpeed;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        this.pulsePhase += this.pulseSpeed;
      }

      drawStar(cx, cy, spikes, outerR, innerR) {
        let rot = -Math.PI / 2;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
        for (let i = 0; i < spikes; i++) {
          rot += step;
          ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
          rot += step;
          ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
        }
        ctx.closePath();
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.4 + 0.6;
        const r = this.radius * pulse;
        const a = Math.min(this.opacity * pulse, 1.0);
        const [R, G, B] = this.color;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Bright outer glow
        ctx.shadowBlur = 28;
        ctx.shadowColor = `rgba(${R},${G},${B},0.95)`;

        if (this.isStar) {
          this.drawStar(0, 0, 4, r * 2.2, r * 0.7);
          ctx.fillStyle = `rgba(${R},${G},${B},${a})`;
          ctx.fill();
          // inner bright core
          this.drawStar(0, 0, 4, r * 1.0, r * 0.3);
          ctx.fillStyle = `rgba(255,255,255,${a * 0.85})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${R},${G},${B},${a})`;
          ctx.fill();
          // bright white core dot
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`;
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.restore();
      }
    }

    const count = intensity === 'high' ? 180 : 130;
    const particleCount = Math.min(count, Math.floor((canvas.width * canvas.height) / 8500));
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const drawConnections = () => {
      const maxDist = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const a = (1 - dist / maxDist) * 0.65; // brighter lines
            const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            grad.addColorStop(0, `rgba(120,130,255,${a})`);
            grad.addColorStop(0.5, `rgba(180,90,255,${a})`);
            grad.addColorStop(1, `rgba(220,80,240,${a})`);
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 1 }}
    />
  );
};

export default AnimatedBackground;
