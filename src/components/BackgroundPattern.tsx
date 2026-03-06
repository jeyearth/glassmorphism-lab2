import React, { useRef, useEffect } from 'react';
import type { PatternType } from '../store/useGlassStore';

interface BackgroundPatternProps {
  pattern: PatternType;
  spatialFrequency: number; // cpd
  scrollOffset?: number;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  pattern,
  spatialFrequency,
  scrollOffset = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || spatialFrequency <= 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // CPD から 1周期あたりの論理ピクセル幅 (CSSピクセル) を計算
    const viewingDistanceMm = 600; // 視聴距離 60cm
    const radians = (0.5 * Math.PI) / 180;
    const physicalLengthMm = 2 * viewingDistanceMm * Math.tan(radians);
    const pixelsPerDegree = physicalLengthMm * (96 / 25.4); // 視角1度あたりのpx
    const logicalPixelsPerCycle = pixelsPerDegree / spatialFrequency; // 1周期のpx

    const draw = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;

      // 4K/Retina (高PPI) ディスプレイ対応
      // const dpr = window.devicePixelRatio || 1;
      const dpr = 1; // 現在はDPR非対応で固定

      console.log("DPR: " + dpr);

      // スクロール時の継ぎ目をなくすため、余白を確保（1周期分で十分）
      const logicalHeight = clientHeight + logicalPixelsPerCycle;

      // Canvasの「実際のピクセル数（内部解像度）」をDPR倍にする
      canvas.width = clientWidth * dpr;
      canvas.height = logicalHeight * dpr;

      // Canvasの「見た目のサイズ（CSSサイズ）」はコンテナに合わせる
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${logicalHeight}px`;

      // 描画スケールをDPR倍にすることで、以後の描画は論理ピクセル基準で書ける
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, clientWidth, logicalHeight);

      // パターン描画関数の呼び出し（論理ピクセル幅を渡す）
      switch (pattern) {
        case 'stripe':
          drawStripePattern(ctx, clientWidth, logicalHeight, logicalPixelsPerCycle);
          break;
        case 'checkerboard':
          drawCheckerboardPattern(ctx, clientWidth, logicalHeight, logicalPixelsPerCycle);
          break;
        case 'sine':
          drawSinePattern(ctx, clientWidth, logicalHeight, logicalPixelsPerCycle);
          break;
      }
    };

    const resizeObserver = new ResizeObserver(() => draw());
    resizeObserver.observe(container);
    draw();

    return () => resizeObserver.disconnect();
  }, [pattern, spatialFrequency]);

  const drawStripePattern = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
    const halfCycle = f / 2;
    const numStripes = Math.ceil(h / halfCycle);

    for (let i = 0; i < numStripes; i++) {
      const startY = i * halfCycle;
      const nextY = (i + 1) * halfCycle;
      const stripeHeight = nextY - startY;

      ctx.fillStyle = i % 2 === 0 ? '#000000' : '#FFFFFF';

      ctx.fillRect(0, startY, w, stripeHeight + 0.5);
      // +0.5 はCanvasのサブピクセルレンダリングによる隙間（アンチエイリアス漏れ）を防ぐハック
    }
  };

  const drawCheckerboardPattern = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
    const squareSize = f / 2; // 市松模様の1マスのサイズも、1周期の半分
    const cols = Math.ceil(w / squareSize);
    const rows = Math.ceil(h / squareSize);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? '#000000' : '#FFFFFF';
        ctx.fillRect(col * squareSize, row * squareSize, squareSize + 0.5, squareSize + 0.5);
        // +0.5 はCanvasのサブピクセルレンダリングによる隙間（アンチエイリアス漏れ）を防ぐハック
      }
    }
  };

  const drawSinePattern = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
    const waves = Math.ceil(h / f);
    for (let i = 0; i < waves; i++) {
      const y = i * f;
      const g = ctx.createLinearGradient(0, y, 0, y + f);
      g.addColorStop(0, '#000000');
      g.addColorStop(0.5, '#FFFFFF');
      g.addColorStop(1, '#000000');
      ctx.fillStyle = g;
      ctx.fillRect(0, y, w, f);
    }
  };

  const viewingDistanceMm = 600;
  const radians = (0.5 * Math.PI) / 180;
  const pixelsPerDegree = (2 * viewingDistanceMm * Math.tan(radians)) * (96 / 25.4);
  const cyclePx = spatialFrequency > 0 ? pixelsPerDegree / spatialFrequency : 1;

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          transform: `translateY(${-scrollOffset % cyclePx}px)`,
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default BackgroundPattern;