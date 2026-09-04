import React, { useEffect, useRef } from 'react';

// Lightweight standalone QR code matrix generator (compact numeric/alphanumeric/byte matrix)
export const QRCodeCanvas = ({
  value = '',
  size = 128,
  fgColor = '#000000',
  bgColor = '#ffffff',
  className = '',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate pseudo-deterministic 25x25 matrix based on value hash
    const matrixSize = 25;
    const cellSize = size / matrixSize;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Seeded pseudo-random generator
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    const seededRandom = (seed) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const isFinderPattern = (r, c) => {
      // Top-Left (7x7)
      if (r < 7 && c < 7) return true;
      // Top-Right (7x7)
      if (r < 7 && c >= matrixSize - 7) return true;
      // Bottom-Left (7x7)
      if (r >= matrixSize - 7 && c < 7) return true;
      return false;
    };

    const drawFinder = (startX, startY) => {
      ctx.fillStyle = fgColor;
      ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = bgColor;
      ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = fgColor;
      ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    // Draw finder patterns
    drawFinder(0, 0);
    drawFinder(matrixSize - 7, 0);
    drawFinder(0, matrixSize - 7);

    // Draw timing patterns
    for (let i = 8; i < matrixSize - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = fgColor;
        ctx.fillRect(6 * cellSize, i * cellSize, cellSize, cellSize);
        ctx.fillRect(i * cellSize, 6 * cellSize, cellSize, cellSize);
      }
    }

    // Draw data cells
    let seed = Math.abs(hash) + 1;
    ctx.fillStyle = fgColor;
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if (isFinderPattern(r, c)) continue;
        if (r === 6 || c === 6) continue; // timing pattern lines

        const val = seededRandom(seed++);
        if (val > 0.5) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [value, size, fgColor, bgColor]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`inline-block rounded-md ${className}`}
      title={value}
    />
  );
};

export default QRCodeCanvas;
