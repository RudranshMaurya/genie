import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  intensity?: 'calm' | 'cinematic' | 'magical';
  interactive?: boolean;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  intensity = 'cinematic',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse interactive target
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Determine particle count based on screen size and intensity
    const isMobile = width < 768;
    const count = isMobile
      ? intensity === 'magical' ? 45 : 25
      : intensity === 'magical' ? 95 : 60;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
      color: string;
      glow: number;
      type: 'firefly' | 'stardust' | 'gold-ember';
    }

    const magicColors = [
      'rgba(244, 63, 142, ', // pink/rose
      'rgba(236, 72, 153, ', // rose
      'rgba(192, 132, 252, ', // lavender
      'rgba(245, 196, 67, ', // gold
      'rgba(255, 230, 160, ', // pale gold
    ];

    const particles: Particle[] = Array.from({ length: count }, () => {
      const type = Math.random() > 0.4 ? 'stardust' : Math.random() > 0.4 ? 'sakura-petal' : 'gold-ember';
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === 'sakura-petal' ? Math.random() * 3.5 + 2 : Math.random() * 1.8 + 0.6,
        speedX: (Math.random() - 0.5) * (type === 'sakura-petal' ? 0.4 : 0.15),
        speedY: type === 'sakura-petal' ? Math.random() * 0.4 + 0.2 : (Math.random() - 0.5) * 0.2 - 0.05,
        opacity: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: magicColors[Math.floor(Math.random() * magicColors.length)],
        glow: type === 'sakura-petal' ? 8 : 5,
        type: type as any,
      };
    });

    // Shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }
    const shootingStars: ShootingStar[] = [];

    const spawnShootingStar = () => {
      if (Math.random() < 0.015 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 7 + 9,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          opacity: 1,
          active: true,
        });
      }
    };

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric vignette & midnight nebula gradients
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#0c1333');
      bgGrad.addColorStop(0.5, '#070a1c');
      bgGrad.addColorStop(1, '#03040a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle celestial moonlight warmth
      const moonGrad = ctx.createRadialGradient(
        width * 0.8,
        height * 0.15,
        0,
        width * 0.8,
        height * 0.15,
        width * 0.45
      );
      moonGrad.addColorStop(0, 'rgba(212, 175, 55, 0.06)');
      moonGrad.addColorStop(0.5, 'rgba(56, 82, 160, 0.03)');
      moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonGrad;
      ctx.fillRect(0, 0, width, height);

      // Render fireflies and stardust
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Subtle gentle mouse repulsion/drift
        if (interactive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.x += (dx / dist) * 0.8;
            p.y += (dy / dist) * 0.8;
          }
        }

        // Screen wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Firefly pulsation
        const dynamicAlpha = Math.sin(tick * p.pulseSpeed) * 0.35 + p.opacity;
        const alpha = Math.max(0.1, Math.min(1, dynamicAlpha));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.fill();
        ctx.restore();
      });

      // Spawn & render shooting stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        if (!star.active) continue;

        const endX = star.x - Math.cos(star.angle) * star.length;
        const endY = star.y - Math.sin(star.angle) * star.length;

        const starGrad = ctx.createLinearGradient(star.x, star.y, endX, endY);
        starGrad.addColorStop(0, `rgba(255, 245, 200, ${star.opacity})`);
        starGrad.addColorStop(0.4, `rgba(245, 196, 67, ${star.opacity * 0.6})`);
        starGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(245, 196, 67, 0.8)';
        ctx.stroke();
        ctx.restore();

        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.018;

        if (star.opacity <= 0 || star.x > width || star.y > height) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity: 0.95 }}
    />
  );
};
