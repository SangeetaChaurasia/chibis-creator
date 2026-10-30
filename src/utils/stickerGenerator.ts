import { ChibiCharacter } from '../types';

export async function downloadChibiSticker(
  character: ChibiCharacter,
  options?: {
    borderWidth?: number;
    showBadge?: boolean;
    showNameplate?: boolean;
  }
): Promise<void> {
  const borderWidth = options?.borderWidth ?? 12;
  const showBadge = options?.showBadge ?? true;
  const showNameplate = options?.showNameplate ?? true;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = 1000;
  canvas.width = size;
  canvas.height = size;

  // Load character image
  const img = new Image();
  img.crossOrigin = 'anonymous';

  return new Promise((resolve) => {
    img.onload = () => {
      // 1. Clear canvas transparent
      ctx.clearRect(0, 0, size, size);

      // 2. Center character coordinates
      const imgSize = 720;
      const x = (size - imgSize) / 2;
      const y = showNameplate ? (size - imgSize) / 2 - 40 : (size - imgSize) / 2;

      // 3. Draw outer die-cut sticker glow & white border
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 16;

      // Rounded container for sticker die-cut effect
      const radius = 48;
      const pad = borderWidth + 16;
      const cardX = x - pad;
      const cardY = y - pad;
      const cardW = imgSize + pad * 2;
      const cardH = imgSize + (showNameplate ? 130 : 0) + pad * 2;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      // 4. Inner border / card tint
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX + borderWidth, cardY + borderWidth, cardW - borderWidth * 2, cardH - borderWidth * 2, radius - 8);
      
      const grad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
      grad.addColorStop(0, '#131a2a');
      grad.addColorStop(1, '#0b0f19');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = character.rarity === '5-Star UR' ? '#fbbf24' : '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // 5. Clip and draw character artwork
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, imgSize, imgSize, 32);
      ctx.clip();
      ctx.drawImage(img, x, y, imgSize, imgSize);
      ctx.restore();

      // 6. Draw Rarity Badge Ribbon
      if (showBadge) {
        ctx.save();
        const badgeW = 210;
        const badgeH = 46;
        const badgeX = cardX + 32;
        const badgeY = cardY + 32;

        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 23);
        ctx.fillStyle = character.rarity === '5-Star UR' ? '#d97706' : '#7c3aed';
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 20px Outfit, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(character.rarity.toUpperCase(), badgeX + badgeW / 2, badgeY + badgeH / 2);
        ctx.restore();
      }

      // 7. Draw Nameplate & Series Tag
      if (showNameplate) {
        ctx.save();
        const nameY = y + imgSize + 36;

        ctx.font = 'bold 36px Outfit, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(character.name, size / 2, nameY);

        ctx.font = '20px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = '#4cd7f6';
        ctx.fillText(`${character.seriesName}  ·  ${character.japaneseName}`, size / 2, nameY + 34);

        // Watermark stamp
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText('CHIBIREALM OFFICIAL COLLECTIBLE STICKER', size / 2, nameY + 68);
        ctx.restore();
      }

      // 8. Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ChibiRealm_${character.id}_sticker.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    };

    img.onerror = () => {
      // Fallback if image fails to load
      resolve();
    };

    img.src = character.imageUrl;
  });
}
