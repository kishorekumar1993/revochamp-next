'use client';

import { useEffect, useRef } from 'react';

interface BMIGaugeProps {
  bmi: number;
  color: string;
}

export default function BMIGauge({ bmi, color }: BMIGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 110;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size * 0.75;
    const radius = size * 0.3;

    ctx.clearRect(0, 0, size, size);

    // Background arc with gradient
    const gradient = ctx.createLinearGradient(0, 0, size, 0);
    gradient.addColorStop(0, '#e5e7eb');
    gradient.addColorStop(1, '#d1d5db');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Fill arc
    const minBMI = 15;
    const maxBMI = 40;
    const clampedBMI = Math.min(maxBMI, Math.max(minBMI, bmi));
    const progress = (clampedBMI - minBMI) / (maxBMI - minBMI);
    const endAngle = Math.PI + progress * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Indicator dot with glow
    const dotAngle = endAngle;
    const dotX = centerX + radius * Math.cos(dotAngle);
    const dotY = centerY + radius * Math.sin(dotAngle);
    
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3.5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

  }, [bmi, color]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}