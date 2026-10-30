/**
 * Generates high-resolution composite canvas artwork for newly generated chibi variants
 */

export interface SynthesizeOptions {
  baseImageUrl: string;
  secondaryImageUrl?: string;
  theme: string;
  element: string;
  companion: string;
  moodColor: string;
  isFusion?: boolean;
}

export async function synthesizeChibiVisual(options: SynthesizeOptions): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return options.baseImageUrl;

  const size = 1000;
  canvas.width = size;
  canvas.height = size;

  // Load Base Image
  const baseImg = await loadImage(options.baseImageUrl);
  let fusionImg: HTMLImageElement | null = null;
  if (options.secondaryImageUrl && options.isFusion) {
    try {
      fusionImg = await loadImage(options.secondaryImageUrl);
    } catch {
      // Ignored
    }
  }

  // 1. Dark cosmic canvas background
  const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 100, size / 2, size / 2, size / 2);
  bgGrad.addColorStop(0, '#1c2438');
  bgGrad.addColorStop(0.6, '#101524');
  bgGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // 2. Elemental aura backdrop glow
  ctx.save();
  const auraColor = options.moodColor || '#8b5cf6';
  ctx.shadowColor = auraColor;
  ctx.shadowBlur = 80;

  const haloGrad = ctx.createRadialGradient(size / 2, size / 2 - 20, 50, size / 2, size / 2 - 20, 360);
  haloGrad.addColorStop(0, `${auraColor}55`);
  haloGrad.addColorStop(0.5, `${auraColor}22`);
  haloGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2 - 20, 380, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Thematic Background Accents (Rune circles, Stars, Cyber grid)
  ctx.save();
  drawThemeBackgroundEffects(ctx, size, options.theme, options.element, auraColor);
  ctx.restore();

  // 4. Character Rendering
  if (fusionImg && options.isFusion) {
    // Fusion Mode: Side-by-side or dual chibi aura merge
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 30;
    // Base character on left
    ctx.drawImage(baseImg, 60, 160, 500, 500);
    // Fusion character on right
    ctx.drawImage(fusionImg, 440, 160, 500, 500);

    // Glowing fusion spark in center
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(500, 420, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    // Single Character Variant
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 20;

    // Draw main character centered
    const charW = 740;
    const charH = 740;
    const charX = (size - charW) / 2;
    const charY = (size - charH) / 2 + 10;
    ctx.drawImage(baseImg, charX, charY, charW, charH);
    ctx.restore();
  }

  // 5. Thematic Accessories & Overlay FX (Holo visor, Magic Crown, Angel Wings, Cat ears)
  ctx.save();
  drawThemeAccessories(ctx, size, options.theme, auraColor);
  ctx.restore();

  // 6. Draw Mascot Companion in bottom right
  ctx.save();
  drawCompanionMascot(ctx, size, options.companion, auraColor);
  ctx.restore();

  // 7. Elemental Particle Orbs floating
  ctx.save();
  drawFloatingParticles(ctx, size, options.element, auraColor);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = url;
  });
}

function drawThemeBackgroundEffects(
  ctx: CanvasRenderingContext2D,
  size: number,
  theme: string,
  element: string,
  color: string
) {
  const t = theme.toLowerCase();

  if (t.includes('cyber') || t.includes('hacker')) {
    // Neon digital grid & floating hex runes
    ctx.strokeStyle = `${color}40`;
    ctx.lineWidth = 1.5;
    for (let x = 100; x < size; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 100);
      ctx.lineTo(x, size - 100);
      ctx.stroke();
    }
    for (let y = 100; y < size; y += 80) {
      ctx.beginPath();
      ctx.moveTo(100, y);
      ctx.lineTo(size - 100, y);
      ctx.stroke();
    }
  } else if (t.includes('sorcerer') || t.includes('magic') || t.includes('fantasy')) {
    // Ancient magic circle
    ctx.strokeStyle = `${color}60`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 340, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 290, 0, Math.PI * 2);
    ctx.stroke();

    // Geometric inscribed square
    ctx.strokeRect(size / 2 - 200, size / 2 - 200, 400, 400);
  } else if (t.includes('space') || t.includes('astronaut')) {
    // Starry constellation dots
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const rx = 100 + Math.sin(i * 123) * 380 + 380;
      const ry = 100 + Math.cos(i * 321) * 380 + 380;
      const r = (i % 3) + 1.5;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Radiant anime starbursts
    ctx.strokeStyle = `${color}50`;
    ctx.lineWidth = 2;
    for (let a = 0; a < 12; a++) {
      const angle = (a * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(size / 2 + Math.cos(angle) * 310, size / 2 + Math.sin(angle) * 310);
      ctx.lineTo(size / 2 + Math.cos(angle) * 370, size / 2 + Math.sin(angle) * 370);
      ctx.stroke();
    }
  }
}

function drawThemeAccessories(
  ctx: CanvasRenderingContext2D,
  size: number,
  theme: string,
  color: string
) {
  const t = theme.toLowerCase();

  if (t.includes('cyber') || t.includes('hacker')) {
    // Holographic Cyber Visor over eye line
    ctx.save();
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 20;

    // Cyber visor polygon
    ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(size / 2 - 140, 310, 280, 44, 12);
    ctx.fill();
    ctx.stroke();

    // HUD Tech Line
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('TARGET: LOCKED · 99.9%', size / 2 - 110, 338);
    ctx.restore();
  } else if (t.includes('knight') || t.includes('royal')) {
    // Golden Tiara / Crown above head
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(size / 2 - 90, 200);
    ctx.lineTo(size / 2 - 50, 140);
    ctx.lineTo(size / 2, 175);
    ctx.lineTo(size / 2 + 50, 140);
    ctx.lineTo(size / 2 + 90, 200);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ruby gem
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(size / 2, 180, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (t.includes('maid') || t.includes('cafe')) {
    // Cute frilly maid headband
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(size / 2 - 130, 180, 260, 36, 18);
    ctx.fill();
    ctx.stroke();

    // Pink bow
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(size / 2, 198, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (t.includes('sorcerer') || t.includes('demon')) {
    // Crimson Demon Horns / Dark Halo
    ctx.save();
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 3;

    // Left horn
    ctx.beginPath();
    ctx.moveTo(size / 2 - 130, 220);
    ctx.quadraticCurveTo(size / 2 - 180, 170, size / 2 - 190, 120);
    ctx.quadraticCurveTo(size / 2 - 140, 140, size / 2 - 110, 210);
    ctx.fill();
    ctx.stroke();

    // Right horn
    ctx.beginPath();
    ctx.moveTo(size / 2 + 130, 220);
    ctx.quadraticCurveTo(size / 2 + 180, 170, size / 2 + 190, 120);
    ctx.quadraticCurveTo(size / 2 + 140, 140, size / 2 + 110, 210);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawCompanionMascot(
  ctx: CanvasRenderingContext2D,
  size: number,
  companion: string,
  color: string
) {
  // Floating companion in bottom-right corner
  const x = size - 220;
  const y = size - 260;

  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;

  // Companion aura bubble
  const bubGrad = ctx.createRadialGradient(x + 50, y + 50, 10, x + 50, y + 50, 75);
  bubGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  bubGrad.addColorStop(0.6, `${color}77`);
  bubGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = bubGrad;
  ctx.beginPath();
  ctx.arc(x + 50, y + 50, 80, 0, Math.PI * 2);
  ctx.fill();

  // Draw Cute Mascot Character
  const c = companion.toLowerCase();
  ctx.fillStyle = '#ffffff';

  if (c.includes('pochita') || c.includes('dog')) {
    // Orange chainsaw dog silhouette
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.roundRect(x + 15, y + 20, 75, 55, 22);
    ctx.fill();

    // Handle
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x + 40, y + 10, 18, Math.PI, 0);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x + 35, y + 42, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (c.includes('chimera') || c.includes('dragon')) {
    // Green winged plushie
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(x + 50, y + 50, 32, 0, Math.PI * 2);
    ctx.fill();

    // Yellow horn
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(x + 45, y + 20);
    ctx.lineTo(x + 50, y + 5);
    ctx.lineTo(x + 55, y + 20);
    ctx.fill();
  } else {
    // Glowing Spirit Mochi
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(x + 50, y + 45, 30, 0, Math.PI * 2);
    ctx.fill();

    // Cute blush
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(x + 36, y + 50, 5, 0, Math.PI * 2);
    ctx.arc(x + 64, y + 50, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(x + 42, y + 44, 4, 0, Math.PI * 2);
    ctx.arc(x + 58, y + 44, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Label tag
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 8;
  ctx.fillText(companion, x + 50, y + 115);

  ctx.restore();
}

function drawFloatingParticles(
  ctx: CanvasRenderingContext2D,
  size: number,
  element: string,
  color: string
) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.fillStyle = color;

  const particleCount = 18;
  for (let i = 0; i < particleCount; i++) {
    const px = (i * 97) % (size - 120) + 60;
    const py = (i * 139) % (size - 120) + 60;
    const pRadius = (i % 3) + 2;

    ctx.beginPath();
    ctx.arc(px, py, pRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
