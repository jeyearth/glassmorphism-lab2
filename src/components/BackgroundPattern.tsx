import React, { useRef, useEffect } from 'react';
import type { PatternType } from '../store/useGlassStore';

interface BackgroundPatternProps {
  pattern: PatternType;
  spatialFrequency: number;
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
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 描画ロジックを関数化
    const draw = () => {
      // コンテナ（親のdiv）の現在サイズを取得
      const { clientWidth, clientHeight } = container;

      // まだサイズが0なら描画しない（エラー防止）
      if (clientWidth === 0 || clientHeight === 0) return;

      // キャンバスの解像度をコンテナに合わせる
      // ※高解像度ディスプレイ(Retina)対応などは一旦省略していますが、
      // サイズが合っていないとぼやけたり消えたりする原因になります。
      canvas.width = clientWidth;
      canvas.height = clientHeight + spatialFrequency * 2; // スクロール余白分

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (pattern) {
        case 'stripe':
          drawStripePattern(ctx, canvas.width, canvas.height, spatialFrequency);
          break;
        case 'checkerboard':
          drawCheckerboardPattern(ctx, canvas.width, canvas.height, spatialFrequency);
          break;
        case 'sine':
          drawSinePattern(ctx, canvas.width, canvas.height, spatialFrequency);
          break;
      }
    };

    // 【重要】ResizeObserverでコンテナのサイズ変化を監視する
    // これにより、マウント直後にサイズが0でも、サイズが確定した瞬間にdraw()が走ります。
    const resizeObserver = new ResizeObserver(() => {
      draw();
    });

    resizeObserver.observe(container);

    // 初回実行
    draw();

    // クリーンアップ
    return () => {
      resizeObserver.disconnect();
    };
  }, [pattern, spatialFrequency]); // scrollOffsetは依存配列に入れない（Canvasの再生成を避けるためTransformで動かす）

  // --- 各描画関数 (変更なし) ---
  const drawStripePattern = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
    const stripeWidth = f;
    let isBlack = true;
    for (let y = 0; y < h; y += stripeWidth) {
      ctx.fillStyle = isBlack ? '#000000' : '#FFFFFF';
      ctx.fillRect(0, y, w, stripeWidth);
      isBlack = !isBlack;
    }
  };

  const drawCheckerboardPattern = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
    const squareSize = f;
    const cols = Math.ceil(w / squareSize);
    const rows = Math.ceil(h / squareSize);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? '#000000' : '#FFFFFF';
        ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
      }
    }
  };

  const drawSinePattern = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
    const waveHeight = f;
    const waves = Math.ceil(h / waveHeight);
    for (let i = 0; i < waves; i++) {
      const y = i * waveHeight;
      const g = ctx.createLinearGradient(0, y, 0, y + waveHeight);
      g.addColorStop(0, '#000000');
      g.addColorStop(0.5, '#FFFFFF');
      g.addColorStop(1, '#000000');
      ctx.fillStyle = g;
      ctx.fillRect(0, y, w, waveHeight);
    }
  };

  return (
    // 親要素 (Container)
    // h-full w-full で親(PhoneFrame)いっぱいに広げる
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        className="block" // 余白消し
        style={{
          // Canvas自体はCSSでサイズ指定せず、属性(width/height)で管理するが、
          // スクロール位置の調整だけCSS transformで行うとパフォーマンスが良い
          transform: `translateY(${-scrollOffset % (spatialFrequency * 2)}px)`,
        }}
      />
    </div>
  );
};

export default BackgroundPattern;